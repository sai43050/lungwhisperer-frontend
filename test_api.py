import requests
import os
import json

BASE_URL = "http://localhost:8000/api"

print("--- Testing API Backend ---")

# 1. Test Mock Login
print("\n1. Testing Mock Login...")
res = requests.post(f"{BASE_URL}/auth/mock-login?username=ApiTester")
print(f"Status: {res.status_code}")
if res.status_code != 200:
    print(f"Login Failed: {res.text}")
    exit(1)
user = res.json()
print(f"Login Response: {user}")
user_id = user['user_id']

# 2. Test Predict Upload
print("\n2. Testing Predict Upload...")
# Image generated via shell

token = user['access_token']
headers = {"Authorization": f"Bearer {token}"}

with open("test_image.png", "rb") as f:
    files = {"file": ("test_image.png", f, "image/png")}
    data = {"user_id": user_id}
    res2 = requests.post(f"{BASE_URL}/predict", files=files, data=data, headers=headers)
    
print(f"Status: {res2.status_code}")
if res2.status_code != 200:
    print(f"Predict Failed: {res2.text}")
    exit(1)
prediction_result = res2.json()
print(f"Predict Response: {json.dumps(prediction_result, indent=2)}")

# 3. Test History
print("\n3. Testing History...")
res3 = requests.get(f"{BASE_URL}/history?user_id={user_id}", headers=headers)
print(f"Status: {res3.status_code}")
if res3.status_code != 200:
    print(f"History Failed: {res3.text}")
    exit(1)
history_result = res3.json()
print(f"History Type: {type(history_result)}")
if len(history_result) > 0:
    print(f"First element type: {type(history_result[0])}")
    print(f"First element: {history_result[0]}")
for h in history_result:
    print(f"  - Record #{h['id']} | Prediction: {h['prediction']} | Confidence: {h['confidence']}")

print("\n--- Testing Frontend is Reachable ---")
try:
    res4 = requests.get("http://localhost:5173/")
    print(f"Status frontend: {res4.status_code}")
except Exception as e:
    print(f"Frontend error: {e}")

