# 🔍 Crime Analytics India

> An end-to-end AI-powered crime analytics platform built on real NCRB government data with ML forecasting, K-Means clustering, and an AI chatbot.

##  Live Demo

**[crime-analytics-1.onrender.com](https://crime-analytics-1.onrender.com)**

---

##  Features

- **🗺️ Interactive India Map** — D3.js choropleth map with click-to-filter, hover tooltips, state rankings and glow effects
- **🤖 AI Chatbot** — RAG-based chatbot powered by Groq + Llama 3 that answers natural language questions about crime data
- **📈 ML Forecasting** — Facebook Prophet model predicts crime trends for 2011–2013 with confidence intervals
- **🧠 K-Means Clustering** — scikit-learn groups 35 Indian states into 4 crime pattern clusters
- **📊 Policy Recommendations** — AI-generated actionable policy recommendations per state using Groq
- **📄 PDF Report Generator** — Download a multi-page analytical report with charts and AI insights
- **🎨 Animated UI** — Glassmorphism design with Framer Motion animations and dark navy theme
- **📊 Power BI Dashboard** — 3-page professional analytics report connected to the same dataset

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, D3.js, Recharts, Framer Motion |
| Backend | Node.js, Express.js, Mongoose |
| ML Service | Python, Flask, Prophet, scikit-learn |
| Database | MongoDB Atlas |
| AI | Groq API (Llama 3.3 70B) |
| Analytics | Power BI Desktop |
| Deployment | Render (3 services) |

---

## 🏗️ Architecture

```
React Frontend (Render Static)
        ↓
Node.js API (Render Web Service)     Python ML Service (Render Web Service)
        ↓                                      ↓
        └──────────── MongoDB Atlas ───────────┘
```

---

## 📁 Project Structure

```
crime-analytics/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChoroplethMap.jsx      # D3.js India map
│   │   │   ├── CrimeBarChart.jsx      # Top states bar chart
│   │   │   ├── CrimeDonutChart.jsx    # Crime distribution
│   │   │   ├── TrendLineChart.jsx     # ML forecast chart
│   │   │   ├── StateClusters.jsx      # K-Means clusters
│   │   │   ├── ChatBot.jsx            # AI chatbot widget
│   │   │   ├── PolicyModal.jsx        # Policy recommendations
│   │   │   ├── ReportGenerator.jsx    # PDF download
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/Dashboard.jsx
│   │   └── services/api.js
│
├── backend/           # Node.js + Express API
│   ├── controllers/
│   │   ├── crimeController.js
│   │   └── chatController.js
│   ├── models/Crime.js
│   ├── routes/crimeRoutes.js
│   └── server.js
│
├── ml-service/        # Python Flask + ML
│   ├── app.py         # Flask server
│   ├── forecast.py    # Prophet forecasting
│   ├── cluster.py     # K-Means clustering
│   └── requirements.txt
│
└── dataset/           # Data pipeline scripts
    ├── clean_and_merge.py
    └── import_to_mongo.py
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/theashverse/crime-analytics-india.git
cd crime-analytics-india/crime-analytics
```

### 2. Backend
```bash
cd backend
npm install
# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/crime_db" > .env
echo "GROQ_API_KEY=your_groq_key" >> .env
echo "PORT=5000" >> .env
npm run dev
```

### 3. ML Service
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 📊 Data Source

**National Crime Records Bureau (NCRB)** — Government of India

- Years covered: 2001–2010
- States: 35 Indian states and UTs
- Crime categories: Murder, Rape, Auto Theft, Kidnapping, Property Stolen, Crime Against Women
- Records: 13,066 cleaned documents in MongoDB

---

## 🧠 ML Models

### Facebook Prophet (Forecasting)
- Trains on 10 years of historical crime data per state
- Predicts 3 years ahead (2011–2013)
- Returns confidence intervals (upper/lower bounds)
- Visualized as dashed orange line on trend chart

### K-Means Clustering (scikit-learn)
- Features: 7 crime categories per state
- Normalized using MinMaxScaler
- 4 clusters: High Crime, Medium-High, Medium-Low, Low Crime
- Clusters ranked by total crime volume

---

## 🤖 AI Features

### Crime Chatbot (RAG Pattern)
1. Extracts state/year/crime type from user question
2. Queries MongoDB for relevant data
3. Injects data as context into Groq/Llama 3 prompt
4. Returns natural language answer

### Policy Recommendation Generator
1. Fetches full crime breakdown for selected state
2. Compares to national average
3. Sends to Groq with analyst system prompt
4. Returns 4 prioritized policy recommendations as JSON

---

## 📈 Power BI Dashboard

A separate 3-page Power BI report built on the same dataset:

- **Page 1** — Overview (KPI cards, bar chart, donut, line trend)
- **Page 2** — State Analysis (drill-down filters, table)
- **Page 3** — Crime Trends (multi-line chart, stacked bar)

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Render Static | [crime-analytics-1.onrender.com](https://crime-analytics-1.onrender.com) |
| Backend API | Render Web Service | https://crime-analytics.onrender.com |
| ML Service | Render Web Service | https://python-part-teic.onrender.com |
| Database | MongoDB Atlas | M0 Free Tier |

---

## 👨‍💻 Author

Built as a full-stack resume project demonstrating:
- Data Engineering (Python pandas pipeline)
- Backend Development (Node.js REST API)
- Frontend Development (React + D3.js)
- Machine Learning (Prophet, K-Means)
- AI Engineering (RAG pattern, LLM integration)
- Cloud Deployment (Render + MongoDB Atlas)

---

## 📝 License

MIT License — feel free to use this project as inspiration for your own!
