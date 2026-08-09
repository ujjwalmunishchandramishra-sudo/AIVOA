# AIVOA – AI-Powered Complaint Analysis & Quality Management System

AIVOA is an **AI-powered complaint analysis and Quality Management System (QMS)** designed to help organizations process, analyze, and track product complaints efficiently.

The system uses an AI-driven workflow to extract important information from customer complaints, structure the data, and maintain a centralized **QMS Complaint Ledger** for monitoring and traceability.

---

## 🚀 Key Features

### 🤖 AI-Powered Complaint Analysis

* Automatically analyzes customer complaint descriptions.
* Extracts relevant complaint information.
* Converts unstructured complaint text into structured data.
* Generates standardized complaint analysis results.

### 📋 Complaint Management

* Submit complaints through the web interface.
* View analyzed complaint information.
* Maintain complaint records in a centralized ledger.
* Track complaint-related information for quality management.

### 🏭 Quality Management System (QMS)

* Centralized QMS complaint ledger.
* Structured storage of complaint records.
* Easy access to previously analyzed complaints.
* Helps improve traceability and quality monitoring.

### 📄 PDF Complaint Processing

* Supports processing complaint information from PDF documents.
* Extracts text from uploaded PDF files.
* Sends extracted information through the AI analysis workflow.

### 🌐 Frontend & Backend Architecture

The application follows a simple client-server architecture:

**Frontend → FastAPI Backend → AI Analysis Workflow → QMS Ledger**

---

## 🛠️ Technology Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Python
* FastAPI
* Pydantic
* Uvicorn

### AI / Processing

* AI-powered complaint analysis workflow
* Structured data extraction
* Graph-based processing

### Data Management

* JSON-based QMS ledger
* PDF text extraction

### Development Tools

* Visual Studio Code
* Git
* GitHub
* GitHub Desktop

---

## 📁 Project Structure

```text
AIVOA/
│
├── backend/
│   ├── main.py
│   ├── ai/
│   │   └── graph.py
│   ├── data/
│   │   └── qms_ledger.json
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md
```

> **Note:** Sensitive files such as `.env` should not be committed to the public repository.

---

## ⚙️ How It Works

### 1. Submit a Complaint

The user enters a customer complaint through the frontend application.

### 2. Send Data to Backend

The frontend sends the complaint to the FastAPI backend through an API request.

### 3. AI Analysis

The backend passes the complaint to the AI analysis workflow.

The workflow identifies and structures important information such as:

* Product name
* Batch number
* Originating site
* Impacted materials
* Defect summary
* Complaint details

### 4. Store the Result

The analyzed complaint is stored in the QMS ledger.

### 5. View QMS Records

Users can access the QMS section to view previously processed complaint records.

---

## 🔌 API

The backend is built using **FastAPI**.

### Main Endpoints

| Method | Endpoint             | Purpose                                    |
| ------ | -------------------- | ------------------------------------------ |
| GET    | `/`                  | Check whether the API is running           |
| GET    | `/docs`              | Open interactive Swagger API documentation |
| POST   | `/analyze-complaint` | Analyze a customer complaint               |
| GET    | `/qms`               | Retrieve QMS complaint records             |

> Endpoint names may vary depending on the final backend implementation.

---

## ▶️ Running the Project Locally

### Prerequisites

Make sure the following are installed:

* Python 3.10+
* VS Code
* Git

---

### Step 1 – Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AIVOA
```

---

### Step 2 – Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

---

### Step 3 – Install Dependencies

```bash
pip install -r backend/requirements.txt
```

---

### Step 4 – Configure Environment Variables

Create a `.env` file inside the backend directory and add the required API credentials.

Example:

```env
API_KEY=your_api_key_here
```

**Never upload your real API key to GitHub.**

The `.env` file should be included in `.gitignore`.

---

### Step 5 – Start the Backend

Navigate to the backend directory:

```bash
cd backend
```

Run FastAPI:

```bash
uvicorn main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

---

### Step 6 – Open API Documentation

FastAPI provides interactive documentation at:

```text
http://127.0.0.1:8000/docs
```

From Swagger UI, you can test the available API endpoints.

---

### Step 7 – Run the Frontend

Open the frontend application using your preferred local development method.

The frontend communicates with the FastAPI backend through HTTP requests.

---

## 🧪 Example Complaint

Example input:

```text
A customer reported that Paracetamol 500 mg tablets from batch
PCM2407 have damaged packaging and several tablets were found
broken inside the blister pack.
```

The system analyzes the complaint and extracts structured information that can be used for quality management and further investigation.

---

## 📊 QMS Ledger

The QMS ledger provides a centralized record of analyzed complaints.

A typical record may contain:

```json
{
  "product_name": "Paracetamol 500 mg",
  "batch_number": "PCM2407",
  "originating_site": "Not provided",
  "impacted_materials": "Tablets and packaging",
  "defect_summary": "Damaged packaging and broken tablets"
}
```

This structured approach makes complaint information easier to review, track, and manage.

---

## 🔐 Security

Sensitive credentials are kept outside the source code.

The project uses:

```text
.env
```

for environment-specific secrets.

The `.env` file should **never be committed to a public GitHub repository**.

Recommended `.gitignore` entry:

```gitignore
.env
venv/
__pycache__/
*.pyc
```

If an API key has accidentally been uploaded to GitHub, revoke or regenerate it immediately.

---

## 🎯 Project Objectives

AIVOA was developed to demonstrate how AI can be integrated into a quality-management workflow to:

* Reduce manual complaint processing.
* Structure unorganized complaint information.
* Improve complaint traceability.
* Provide centralized QMS records.
* Automate repetitive analysis tasks.
* Create a foundation for AI-assisted quality operations.

---

## 🔮 Future Enhancements

Potential future improvements include:

* User authentication and role-based access.
* Database integration using PostgreSQL or MySQL.
* Advanced complaint classification.
* Complaint severity scoring.
* Automated root-cause analysis.
* CAPA recommendation generation.
* Email notifications.
* Advanced analytics dashboard.
* Export QMS records to Excel/PDF.
* Cloud deployment.
* AI-powered quality trend detection.

---

## 📸 Application

The application provides an interactive interface for submitting complaints, analyzing them using AI, and viewing QMS records.

Screenshots of the working application can be added here:

```text
screenshots/
├── complaint-analysis.png
├── qms-ledger.png
└── api-docs.png
```

---

## 👨‍💻 Developer

**Ujjwal Mishra**

BE Computer Engineering
VIVA Institute of Technology

### Skills Demonstrated

* Python
* FastAPI
* JavaScript
* HTML/CSS
* REST APIs
* AI Integration
* Git & GitHub
* Data Processing
* Software Development

---

## 📌 Project Status

**Status: Completed ✅**

The current version supports complaint submission, AI-powered complaint analysis, and QMS record management.

---

## 📄 License

This project was developed for educational and project demonstration purposes.

