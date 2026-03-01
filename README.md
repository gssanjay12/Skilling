# Skilling: Peer-to-Peer Skill Exchange Platform

Skilling is a production-ready MVP web application that enables users to exchange skills through intelligent matchmaking.

## Architecture
- **Backend**: FastAPI with Python 3, SQLAlchemy ORM, JWT Authentication.
- **Frontend**: React (Vite) with Tailwind CSS, React Router, Axios, Context API.
- **Database**: SQLite (Designed to be scaled to PostgreSQL).
- **Styling**: Minimal SaaS-style design (Indigo primary color, modern typography).

## Features
- **Secure Authentication**: JWT-based session management with bcrypt hashing.
- **Profile Management**: Detail your biography, availability, and skills you want to learn or teach.
- **Smart Matchmaking Algorithm**: Calculates compatibility scores based on direct matches, mutual skill swaps, and overlapping skill combinations.
- **User Directory**: Search peers by skill and filter by proficiency level.
- **Personalized Dashboard**: Real-time trending skills, new users list, and your top matches.

## Getting Started

### 1. Backend Setup
1. Open a terminal and navigate to the `backend/` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux (if applicable):
   # source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Seed the database with dummy data and initialize the schema:
   ```bash
   python seed.py
   ```
5. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The API and Swagger docs will be available at http://localhost:8000/docs*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend/` directory.
2. Install dependencies (Node.js required):
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at http://localhost:5173*

## Demo Accounts
The seeded database comes with mock users for testing the matching algorithms:
- **Email**: `alice@college.edu` | **Password**: `password`
- **Email**: `bob@college.edu` | **Password**: `password`
- **Email**: `charlie@college.edu` | **Password**: `password`

## Directory Structure
- `/backend/app/api`: FastAPI routes (users, matches, dashboard, skills, auth)
- `/backend/app/services`: Core matchmaking logic `matching.py`
- `/frontend/src/pages`: React UI components per page
- `/frontend/src/context`: JWT Authentication state manager wrapper
