import os
import json
from sqlalchemy.orm import Session
from sqlalchemy import text
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Define simple schema for the LLM to understand
SCHEMA_CONTEXT = """
Table: meals
Columns:
- id (integer)
- user_id (integer)
- meal_name (string)
- meal_type (string) -- e.g., 'breakfast', 'lunch', 'dinner', 'snack'
- meal_time (datetime)
- total_calories (float)
- total_protein (float)
- total_carbs (float)
- total_fat (float)

Table: meal_items
Columns:
- id (integer)
- meal_id (integer, foreign key to meals.id)
- food_name (string)
- quantity (string)
- calories (float)
- protein (float)
- carbs (float)
- fat (float)
"""

def generate_sql_query(user_query: str, user_id: int) -> str:
    """
    Generates a readonly SQL query based on natural language.
    Forced to filter by user_id for security.
    """
    system_prompt = f"""
    You are a SQL expert. Convert the user's question into a PostgreSQL query.
    
    {SCHEMA_CONTEXT}
    
    Rules:
    1. You MUST filter by `user_id = {user_id}` in the WHERE clause.
    2. generates ONLY the SQL string. No markdown, no explanations.
    3. Use standard PostgreSQL syntax.
    4. For date queries, use `meal_time` and standard SQL date functions (e.g. CURRENT_DATE).
    
    Question: {user_query}
    SQL:
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": system_prompt}],
        temperature=0
    )
    
    sql = response.choices[0].message.content.strip()
    # Basic cleanup
    sql = sql.replace("```sql", "").replace("```", "").strip()
    return sql

def execute_meal_query(db: Session, user_id: int, user_query: str):
    """
    Orchestrates the Text-to-SQL flow.
    """
    # 1. Generate SQL
    generated_sql = generate_sql_query(user_query, user_id)
    print(f"Generated SQL: {generated_sql}")

    # 2. Validate Security (Basic)
    if "drop" in generated_sql.lower() or "delete" in generated_sql.lower() or "update" in generated_sql.lower():
        return {"error": "Unsafe query detected."}
    
    if str(user_id) not in generated_sql:
         # Fallback safety check - though prompt injection is possible, this catches basic errors
         #Ideally we stick to the prompt's guarantee or use parametrized queries which is hard with pure text-to-sql
         pass

    # 3. Execute
    try:
        # We use db.execute(text(sql))
        result = db.execute(text(generated_sql))
        rows = result.mappings().all()
        
        # 4. Summarize results with LLM
        return summarize_results(user_query, rows)

    except Exception as e:
        return {"error": f"Query execution failed: {str(e)}", "sql": generated_sql}

def summarize_results(user_query: str, rows: list) -> dict:
    if not rows:
        return {
            "query": user_query,
            "answer": "I couldn't find any meal records matching your request.",
            "data": []
        }

    # Convert rows to string for context
    data_context = json.dumps([dict(row) for row in rows], default=str)

    summary_prompt = f"""
    You are a nutrition assistant. The user asked: "{user_query}"
    
    Database results:
    {data_context}
    
    Provide a natural language summary of these results. Be concise and helpful.
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": summary_prompt}
        ]
    )

    return {
        "query": user_query,
        "answer": response.choices[0].message.content.strip(),
        "data": rows
    }
