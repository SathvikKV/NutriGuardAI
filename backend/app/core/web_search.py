# app/core/web_search.py

from duckduckgo_search import DDGS

def search_web(query: str) -> dict:
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=3))
            summary = "\n".join([f"{res['title']} - {res['href']}" for res in results])
            return {
                "summary": f"Information not found in trusted sources. Here are some web results:\n{summary}"
            }
    except Exception as e:
        return {
            "summary": f"Web search failed: {str(e)}"
        }
