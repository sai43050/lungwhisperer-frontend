import os
from twilio.rest import Client

TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '+1234567890')
DOCTOR_ON_CALL = os.getenv('DOCTOR_ON_CALL_PHONE', '+0987654321')

def dispatch_emergency(patient_name, vitals_msg):
    """
    Sends an SMS alert to the on-call doctor. Falls back to console print if no API key is supplied.
    """
    body_text = f"🔴 MEDICAL ALERT: Patient {patient_name} has hit critical vitals. Detail: {vitals_msg}. Please login to Admin Panel."
    
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        print(f"\n[{'='*40}]\n[MOCK DISPATCH] -> SMS Sent to {DOCTOR_ON_CALL}\n{body_text}\n[{'='*40}]\n")
        return False
    
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=body_text,
            from_=TWILIO_PHONE_NUMBER,
            to=DOCTOR_ON_CALL
        )
        print(f"[TWILIO DISPATCH] Sent SMS successfully. SID: {message.sid}")
        return True
    except Exception as e:
        print(f"Twilio Dispatch Exception: {e}")
        return False
