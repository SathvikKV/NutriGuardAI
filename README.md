# 🥗 NutriGuard AI

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![GPT-4](https://img.shields.io/badge/GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

**NutriGuard AI** is an end-to-end nutrition and ingredient assistant platform that simplifies label reading, ingredient analysis, meal logging, and nutrition insights using OCR, RAG (Retrieval-Augmented Generation), modern LLMs, and full-stack engineering.

![NutriGuard AI Screenshot](https://via.placeholder.com/800x400.png?text=NutriGuard+AI+Dashboard)

## 🌟 Live Demo

- **Frontend Application**: [http://3.95.239.139:3000/](http://3.95.239.139:3000/)
- **Backend API Documentation**: [http://34.201.119.237:8001/docs](http://34.201.119.237:8001/docs)

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Frontend Structure](#-frontend-structure)
- [Screenshots](#-screenshots)
- [Challenges and Solutions](#-challenges-and-solutions)
- [Limitations and Future Work](#-limitations-and-future-work)
- [Contributing](#-contributing)
- [License](#-license)

## 📋 Overview

NutriGuard AI is a fully containerized application that helps users understand food ingredients, analyze nutrition labels, track meals, and get personalized nutrition insights. The platform combines several cutting-edge technologies:

- **OCR Technology**: Extract nutrition information from food labels
- **RAG (Retrieval-Augmented Generation)**: Provide accurate ingredient information using FDA databases
- **Large Language Models**: Generate user-friendly summaries and insights
- **Cloud-Native Architecture**: Deployed on AWS with Docker containers

The system aims to address common nutrition challenges by making complex food information accessible and actionable for everyday users.

## 🚀 Key Features

### 1. OCR Label Reading & Nutrition Summary

- Upload food label images
- Extract structured nutrition data using Azure Form Recognizer
- Generate user-friendly summaries with OpenAI's LLM
- Highlight potential nutrition concerns and insights

### 2. Ingredient Analysis (RAG + FDA Databases)

- Search and analyze specific ingredients
- Access information from FDA datasets (Color Additives, Banned Substances, Food Additives)
- Get detailed health profiles for ingredients
- Understand potential risks and common uses

### 3. Meal Tracking Journal

- Log meals with user-friendly interface
- Automatic macro estimation for incomplete entries
- View meal history and edit previous entries
- Generate weekly nutrition summaries and stats

### 4. AI Nutritionist Chat

- Ask natural language questions about your diet
- RAG-powered answers using your personal meal history
- Contextual understanding of your nutritional patterns
- Get personalized nutrition advice

## 🏗️ System Architecture

NutriGuard AI implements a modern microservices architecture:

![Architecture Diagram](https://via.placeholder.com/800x500.png?text=NutriGuard+AI+Architecture)

### High-Level Components

- **Frontend**: Next.js application with v0 UI components
- **Backend**: FastAPI RESTful service
- **Databases**: PostgreSQL for structured data, Pinecone for vector embeddings
- **AI Services**: Azure Form Recognizer for OCR, OpenAI LLMs for natural language processing
- **Infrastructure**: AWS EC2 for compute, AWS RDS for database, Docker for containerization

### Data Flow

1. **OCR Label Processing**:
   - User uploads label image → Azure OCR extracts text → Backend parses structured data → OpenAI enhances with insights → Frontend displays summary

2. **Ingredient Analysis**:
   - User queries ingredient → Backend searches Pinecone vector DB → Retrieves FDA data matches → OpenAI generates summary → Frontend displays analysis

3. **Meal Tracking**:
   - User inputs meal details → Backend stores in PostgreSQL → Data is embedded and stored in Pinecone → Frontend displays meal history and statistics

4. **AI Nutritionist**:
   - User asks nutrition question → Backend searches Pinecone meal index → Retrieves relevant meal history → OpenAI generates personalized answer → Frontend displays conversation

## 💻 Technology Stack

### Backend
- **FastAPI**: High-performance API framework
- **PostgreSQL**: Relational database (AWS RDS)
- **Pinecone**: Vector database for embeddings
- **Azure Form Recognizer**: OCR service
- **OpenAI API**: LLM integration
- **JWT Authentication**: Secure user management
- **Docker**: Containerization
- **AWS EC2**: Compute infrastructure

### Frontend
- **Next.js**: React framework with SSR
- **v0 by Vercel**: UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client

### DevOps
- **Docker**: Container orchestration
- **AWS EC2**: Virtual server hosting
- **AWS RDS**: Managed database service

## Installation

### Prerequisites
- Docker and Docker Compose
- Node.js (v18+)
- Python 3.9+
- PostgreSQL
- AWS Account
- Azure Form Recognizer subscription
- OpenAI API key
- Pinecone account

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/nutriguard-ai.git
cd nutriguard-ai/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Run the development server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend/nutriguard-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run the development server
npm run dev
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Check container status
docker-compose ps
```

## API Documentation

NutriGuard AI's backend provides RESTful APIs organized into these categories:

| Category | Endpoints | Purpose |
|----------|-----------|---------|
| OCR | `/api/v1/ocr/label`<br>`/api/v1/ocr/summary` | Extract label text and generate nutrition summary |
| RAG Ask | `/api/v1/ask` | Ask free-form nutrition/ingredient questions |
| Ingredient Analysis | `/api/v1/analyze` | Analyze specific ingredients against FDA database |
| User Management | `/api/v1/user/register`<br>`/api/v1/user/login` | Register and authenticate users |
| Meals | `/api/v1/meals/`<br>`/api/v1/meals/user/{user_id}`<br>`/api/v1/meals/{meal_id}`<br>`/meals/generate-macros` | CRUD for meals and auto-generate meal macros |
| Meal RAG | `/api/v1/meals/ingest/{user_id}`<br>`/api/v1/meals/query/{user_id}` | Ingest and RAG-query meals |
| Meal Stats/Summary | `/api/v1/meals/stats/{user_id}`<br>`/api/v1/meals/summary/{user_id}` | View weekly meal statistics |

For detailed API documentation, visit our Swagger UI: [http://34.201.119.237:8001/docs](http://34.201.119.237:8001/docs)

## 🔍 Frontend Structure

```
frontend/nutriguard-ai/
├── .next/
├── app/
│   ├── chat/
│   ├── globals.css
│   ├── ingredients/
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── login/
│   ├── meals/
│   ├── page.tsx
│   ├── register/
│   ├── summary/
│   └── upload/
├── components/
├── components.json
├── hooks/
├── lib/
├── next-env.d.ts
├── next.config.mjs
├── node_modules/
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public/
├── services/
├── styles/
├── tailwind.config.ts
├── tsconfig.json
└── utils/
```

## 📸 Screenshots

### Login Screen
![Login Screen](https://via.placeholder.com/400x250.png?text=Login+Screen)

### OCR Upload
![OCR Upload](https://via.placeholder.com/400x250.png?text=OCR+Upload)

### Ingredient Analysis
![Ingredient Analysis](https://via.placeholder.com/400x250.png?text=Ingredient+Analysis)

### Meal Journal
![Meal Journal](https://via.placeholder.com/400x250.png?text=Meal+Journal)

### AI Nutritionist Chat
![AI Chat](https://via.placeholder.com/400x250.png?text=AI+Chat)

### Nutrition Summary
![Nutrition Summary](https://via.placeholder.com/400x250.png?text=Nutrition+Summary)

## Challenges and Solutions

### Technical Challenges

1. **OCR Accuracy**
   - **Challenge**: Nutrition labels vary widely in format and quality
   - **Solution**: Custom post-processing logic and validation, potential for user corrections

2. **RAG Implementation**
   - **Challenge**: Effectively chunking and embedding FDA data
   - **Solution**: Optimized chunking strategy and embedding parameters

3. **Performance Optimization**
   - **Challenge**: Real-time responses for AI-powered features
   - **Solution**: Caching mechanisms, optimized query patterns

4. **Data Integration**
   - **Challenge**: Combining structured and unstructured data sources
   - **Solution**: Unified data model with flexible schema

## Limitations and Future Work

### Current Limitations

1. **OCR Capabilities**
   - Limited to clearly printed labels in standard formats
   - May struggle with handwritten or non-standard labels

2. **Language Support**
   - Currently optimized for English-language nutrition labels
   - Limited international ingredient database coverage

3. **Nutritional Accuracy**
   - Auto-generated macros are estimates and may lack precision
   - Reliance on FDA data which may not be comprehensive for all ingredients

### Future Enhancements

1. **Technical Improvements**
   - Implement multi-language support
   - Enhance OCR capabilities for varied label formats
   - Develop offline processing capabilities
   - Optimize mobile experience

2. **Feature Expansions**
   - Recipe analyzer and meal planner
   - Dietary preference customization
   - Social sharing capabilities
   - Integration with wearable devices
   - Export/import functionality for meal data

3. **AI Enhancements**
   - Fine-tuned models for nutrition domain
   - More sophisticated RAG strategies
   - Expanded knowledge base with international ingredient databases

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed

---

Developed with Sathvik Vadavatha

[GitHub Repository](https://github.com/yourusername/nutriguard-ai) | [Live Demo](http://3.95.239.139:3000/) | [API Docs](http://34.201.119.237:8001/docs)
