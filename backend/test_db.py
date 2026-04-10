import sqlite3

def check_db():
    conn = sqlite3.connect('lung_disease.db')
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM users LIMIT 1")
        print("Users Table:", [description[0] for description in cursor.description])
        
        cursor.execute("SELECT * FROM vitals_history LIMIT 1")
        print("Vitals History Table:", [description[0] for description in cursor.description])

        cursor.execute("SELECT * FROM alerts LIMIT 1")
        print("Alerts Table:", [description[0] for description in cursor.description])
        
        print("Success: All tables look good.")
    except Exception as e:
        print("Error:", e)

check_db()
