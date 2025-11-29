# **⚖️ LegalMate (Frontend)**

**LegalMate** is a comprehensive, AI-powered legal assistance platform designed to democratize access to legal information. It features intelligent legal chatbots, automated document generation tools, and an AI-curated legal blog system.

This repository contains the **Frontend** application, built with modern web technologies including **React 19**, **Vite**, and **Tailwind CSS**, designed to interact with a robust Python microservices backend.

## **🌟 Key Features**

* **🤖 AI Legal Assistant:** Interactive chatbot capable of answering complex legal queries using RAG (Retrieval-Augmented Generation) and Web Search.  
* **📄 Automated Document Generation:** Tools to generate legal documents (Wills, Rental Agreements) instantly.  
* **🔍 Doc Analyzer:** Intelligent tool to upload, review, and summarize complex legal documents, automatically highlighting key clauses and potential risks.  
* **📚 AI Legal Research:** A dedicated research engine capable of citing case law, statutes, and legal precedents relevant to specific queries.  
* **📂 Case Management System:** A streamlined dashboard for lawyers and clients to organize case files, track status updates, and manage legal schedules efficiently.  
* **📰 AI-Powered Blogs:** A dynamic blog section with infinite scrolling, auto-fetched legal news, and AI-generated content.  
* **⚡ Modern UI/UX:** Responsive design with smooth animations using **Framer Motion** and **Tailwind CSS**.

## **🛠️ Tech Stack**

### **Frontend (This Repo)**

* **Framework:** [React 19](https://react.dev/)  
* **Build Tool:** [Vite](https://vitejs.dev/)  
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & Classnames  
* **Animations:** [Framer Motion](https://www.framer.com/motion/) & Lottie React  
* **Routing:** [React Router v7](https://reactrouter.com/)  
* **State & Data:** Axios, React Hook Form  
* **UI Components:** Lucide React (Icons), React Hot Toast (Notifications), React Markdown

### **Backend (Microservices)**

* **Core:** Python, FastAPI, Uvicorn  
* **AI & ML:** LangChain, Google Gemini (Generative AI), ChromaDB (Vector Store)  
* **Data Processing:** Pandas, NumPy  
* **Architecture:** Split into Blog, Chatbot, and DocGen microservices.

## **🚀 Getting Started**

Follow these steps to set up the frontend locally and connect it to your backend services.

### **1\. Prerequisites**

* **Node.js** (v18 or higher recommended)  
* **npm** (comes with Node) or **yarn**

### **2\. Installation**

1. **Clone the repository:**  
   git clone https://github.com/electron000/LegalMate.git  (https://github.com/electron000/LegalMate.git)  
   cd LegalMate

2. **Install dependencies:**  
   npm install

### **3\. Configuration (Connecting to Backend)**

Create a .env file in the root directory of the project. You need to define the endpoints for the Python microservices running locally.

**Create a file named .env and paste the following:**

\# \==========================================  
\# 🔌 MICROSERVICES CONNECTION CONFIG  
\# \==========================================

\# 1\. Blog Service (Running on Port 8000\)  
VITE\_BLOG\_API\_URL=\[http://127.0.0.1:8000\](http://127.0.0.1:8000)

\# 2\. Chatbot Service (Running on Port 8001\)  
VITE\_CHATBOT\_API\_URL=\[http://127.0.0.1:8001\](http://127.0.0.1:8001)

\# 3\. Document Generation Service (Running on Port 8002\)  
VITE\_DOCGEN\_API\_URL=\[http://127.0.0.1:8002\](http://127.0.0.1:8002)

\# 4\. Authentication Service (Optional/Future)  
\# VITE\_AUTH\_API\_BASE=http://localhost:5000

\# Optional: Feature Flags  
VITE\_ENABLE\_DEBUG=true

**Note:** Ensure your Python backend services are running on these specific ports as detailed in the backend documentation.

### **4\. Running the App**

Start the development server:

npm run dev

The application will launch at http://localhost:5173 (or the port shown in your terminal).

-----------------------------------------

LegalMate AI RAG Docs: 

BNS.pdf: Bharatiya Nyaya Sanhita (Replaces the Indian Penal Code/IPC).

BNSS.pdf: Bharatiya Nagarik Suraksha Sanhita (Replaces the Code of Criminal Procedure/CrPC).

BSA.pdf: Bharatiya Sakshya Adhiniyam (Replaces the Indian Evidence Act).

CCP.pdf: Code of Civil Procedure, 1908.

CPA.pdf: Consumer Protection Act, 2019.

HMA.pdf: Hindu Marriage Act, 1955.

HSA.pdf: Hindu Succession Act, 1956.

ICA.pdf: Indian Contract Act, 1872.

ITA.pdf: Information Technology Act, 2000 (or possibly Income Tax Act, but IT Act is more likely for general legal bots).

LA.pdf: Limitation Act, 1963 (Could also be Land Acquisition, but Limitation is a core procedural law).

MVA.pdf: Motor Vehicles Act, 1988.

NIA.pdf: Negotiable Instruments Act, 1881 (Deals with cheques, promissory notes).

PWDVA.pdf: Protection of Women from Domestic Violence Act, 2005.

RTI.pdf: Right to Information Act, 2005.

SMA.pdf: Special Marriage Act, 1954.

TCI.pdf: The Constitution of India.
