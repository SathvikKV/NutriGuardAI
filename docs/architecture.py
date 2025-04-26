import os
from diagrams import Diagram, Cluster, Edge, Node
from diagrams.custom import Custom
from diagrams.onprem.client import Users

# Set icon folder
class CustomIcon(Node):
    _provider = "custom"
    _icon_dir = os.path.join(os.path.dirname(__file__), "icons")

# Component Icons
class FastAPI(CustomIcon): _icon = "fastapi.png"
class NextJS(CustomIcon): _icon = "nextjs.png"
class OpenAI(CustomIcon): _icon = "openai.png"
class Pinecone(CustomIcon): _icon = "pinecone.png"
class AzureOCR(CustomIcon): _icon = "azureocr.png"
class PostgreSQL(CustomIcon): _icon = "postgresql.png"
class LabelImage(CustomIcon): _icon = "label.png"
class FDAData(CustomIcon): _icon = "fda.png"
class AWS(CustomIcon): _icon = "aws.png"
class Docker(CustomIcon): _icon = "docker.png"

with Diagram(
    "NutriGuard AI Architecture",
    filename="nutriguard_ai_architecture_finalized",
    outformat="png",
    show=True,
    direction="LR",
    graph_attr={"fontsize": "20", "fontname": "Arial"}
):

    # External input/data sources
    user = Users("User")
    label_img = LabelImage("Label\nImage Upload")
    fda_data = FDAData("FDA / SCOGS\nDatabase")

    # Final Docker icon position - inside container at top left
    with Cluster("Docker Container (on EC2)", graph_attr={"margin": "40", "fontsize": "20"}):
        docker_icon = Docker("Docker")  # Now inside container

        with Cluster("FastAPI Backend", graph_attr={"margin": "30", "fontsize": "20"}):
            backend = FastAPI("FastAPI")
            azure = AzureOCR("Azure OCR")
            pinecone_nutrition = Pinecone("Pinecone\n(Nutrition Index)")
            pinecone_meal = Pinecone("Pinecone\n(Meal Tracker Index)")
            postgres = PostgreSQL("PostgreSQL\n(AWS RDS)")
            openai = OpenAI("OpenAI API")  # Now below PostgreSQL

            # Flow: Inputs & DBs
            label_img >> Edge(label="OCR Request", fontsize="18") >> azure
            azure >> Edge(label="Parsed Ingredients", fontsize="18") >> backend
            fda_data >> Edge(label="Ingredient Metadata", fontsize="18") >> pinecone_nutrition

            # Backend Logic
            backend >> Edge(label="Nutrition RAG", fontsize="18") >> pinecone_nutrition
            backend >> Edge(label="Meal Retrieval", fontsize="18") >> pinecone_meal
            backend >> Edge(label="Store Meals", fontsize="18") >> postgres
            backend >> Edge(label="Summarization & Chat", fontsize="18") >> openai  # NEW

        with Cluster("Next.js Frontend", graph_attr={"margin": "30", "fontsize": "20"}):
            frontend = NextJS("Next.js App")

        # Frontend logic
        frontend >> Edge(label="User Logs Meal", fontsize="18") >> pinecone_meal
        backend >> Edge(label="Send Dashboard / QA", fontsize="18") >> frontend

    # EC2 and user flow
    aws = AWS("AWS EC2")
    frontend >> Edge(label="Hosted on", fontsize="18") >> aws
    aws >> Edge(label="Serves UI", fontsize="18") >> user
