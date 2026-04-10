# RespiraCare AI: Intelligence-Driven Respiratory Diagnostic Matrix 🫁🛡️

RespiraCare is a production-ready, full-stack telemedicine and clinical diagnostic platform bridging the gap between Real-Time IoT telemetrics and Deep Learning visual acoustics. 

Powered by **FastAPI**, **React**, and **Google Gemini**, it autonomously tracks patient oxygen flows globally, diagnoses diseases from raw multi-modal inputs, and securely streams secure WebRTC telemedicine calls—all protected by enterprise-grade cryptographic JWT authentication.

## ✨ Core Features
1. **Multi-Modal Deep Learning Diagnostics**
    * Uses a hybridized `ResNet18` PyTorch architecture to simultaneously evaluate structural **X-Ray Imaging** and acoustic **Cough Spectrograms**.
2. **Generative AI Medical Co-Pilot (Gemini 2.5)**
    * **Doctor Panel AI Reports:** Aggregates a patient's entire SpO2 array and X-Ray logs to autonomously synthesize a structured Clinical Assessment Markdown Report via the Gemini LLM.
    * **RespiraBot (Patient Dashboard):** Embedded floating AI context assistant for patients to directly query their live vitals and receive empathetic health pointers. 
3. **Real-Time IoT Telemetry Simulation**
    * Dynamic SpO2, Heart Rate, and Respiratory bounds flowing natively into live Recharts. Automated early warning triggers generated using algorithmic severity grading.
4. **P2P Telemedicine (WebRTC Streams)**
    * Native Socket.IO signaling server allowing direct remote video consultations between Patients and Admins over encrypted networks.
5. **Zero-Trust App Security**
    * Fully protected `/api` endpoints wrapped in `passlib` and `Bcrypt` tokenization (JWT Bearer Strategy).
    * Custom RBAC routing ensuring Admin actions block unauthorized Patient IDs smoothly.

## 🚀 Docker Deployment
The architecture utilizes zero-dependency microservices for immediate scaling via PostgreSQL.

```bash
# Clone the Repository
git clone https://github.com/your-username/RespiraCare.git
cd RespiraCare

# Initialize the stack
docker-compose up --build -d
```
> The architecture will instantly spin up NGINX (Frontend) on `port 80`, FastAPI on `port 8000`, and a robust PostgreSQL persistent volume on `port 5432`.

## ⚙️ Local Development
If you prefer developing locally using native environments:

**Backend Setup:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Create an .env file for LLMs
echo "GEMINI_API_KEY=your_google_key" > .env

uvicorn main:app --reload --port 8000
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

## 🏗 Stack Architecture
- **Frontend Engine**: React Vite, Tailwind CSS, Recharts, Lucide Icons
- **Signaling Layer**: Node-Socket.io, Python-Socket.io
- **Core API Layer**: Python FastAPI, SQLAlchemy, Bcrypt, PyJose
- **Inference Models**: PyTorch/TorchAudio, Google GenAI SDK
- **DB Interface**: Local SQLite3 Native / Remote Production Postgres
