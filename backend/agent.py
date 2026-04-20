import os
import json
from dotenv import load_dotenv
load_dotenv()

# Try importing the new Google GenAI library
try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None

# It automatically loads GEMINI_API_KEY if present
API_KEY = os.getenv("GEMINI_API_KEY", "")

def get_client():
    if not API_KEY or not genai:
        return None
    try:
        return genai.Client(api_key=API_KEY)
    except Exception as e:
        print(f"Gemini client initialization failed: {e}")
        return None

def generate_medical_report(patient_name, vitals_history, scan_history):
    """
    Synthesizes the raw vital JSON and prediction strings into a medical narrative.
    """
    client = get_client()

    vitals_summary = f"Recent Vitals: {len(vitals_history)} records found.\n"
    if vitals_history:
        latest = vitals_history[-1]
        vitals_summary += f"Latest -> SpO2: {latest.spo2}%, Heart Rate: {latest.heart_rate}bpm, Resp Rate: {latest.respiratory_rate}bpm.\n"
    
    scan_summary = f"Scans/Analytics: {len(scan_history)} records found.\n"
    for scan in scan_history[:5]: # Take last 5
        scan_summary += f"- Modality Output: {scan.prediction} (Confidence: {scan.confidence}%)\n"

    prompt = f"""
    You are an expert AI Medical Assistant analyzing data for patient: {patient_name}.
    We use machine learning to predict lung diseases (x-rays and cough audio) and IoT sensors for respiratory vitals.
    
    Here is the recent raw telemetry:
    ---
    {vitals_summary}
    {scan_summary}
    ---
    
    Write a structured, concise 3-paragraph Clinical Assessment Report in Markdown format.
    Include sections for: 1. Current Diagnostic Status, 2. Vital Sign Analysis, 3. Recommended Actions.
    Make it sound professional, but append a disclaimer that this is AI-generated and not substitute for doctor advice.
    """

    if not client:
        return _mock_report(patient_name)

    try:
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        print(f"Gemini Inference Error: {e}")
        return _mock_report(patient_name)

def chat_with_patient(patient_name, latest_vitals, user_message):
    """
    Context-aware chatbot for the patient dashboard.
    """
    client = get_client()
    
    vtext = "No recent vitals."
    if latest_vitals:
        vtext = f"Live Vitals - SpO2: {latest_vitals.spo2}%, HR: {latest_vitals.heart_rate}bpm, RR: {latest_vitals.respiratory_rate}bpm."
        
    prompt = f"""
    You are RespiraBot, a helpful digital health companion for {patient_name}.
    You have secure access to their live telemetry: {vtext}.
    
    A patient just asked you the following question: "{user_message}"
    
    Respond in 2-3 short sentences. Be empathetic and directly answer their question utilizing their live vitals if relevant. Never definitively diagnose them. 
    """

    if not client:
        return _mock_chat(user_message, latest_vitals)

    try:
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        print(f"Gemini Inference Error: {e}")
        return _mock_chat(user_message, latest_vitals)


def _mock_report(patient_name):
    return f"""
### 1. Current Diagnostic Status
Patient **{patient_name}** shows multiple logged predictive modalities. While specific inference models detected anomalies related to viral pneumonia vectors, the localized aggregation suggests the patient is recovering. *(Mock Generated)*

### 2. Vital Sign Analysis
SpO2 remains largely stable, though erratic respiratory rates were logged during nighttime cycles. Heart rate fluctuates between normal clinical thresholds.

### 3. Recommended Actions
- Prescribe rest and elevate posture.
- Monitor cough severity over the next 48 hours.
- Repeat acoustic model sampling on Day 3.

> **Disclaimer**: This is an AI-generated mock summary. No real API key was provided.
"""

def _mock_chat(user_message, latest_vitals):
    spo2 = latest_vitals.spo2 if latest_vitals else "unknown"
    return f"I am operating in mock mode (No Gemini API Key). However, looking at your SpO2 of {spo2}%, I advise you to stay hydrated!"
