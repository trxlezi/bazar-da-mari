import sqlite3
import json

def fetch_data():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    data = {}

    tables = ["superiores", "inferiores", "ongs"]

    for table in tables:
        cursor.execute(f"SELECT * FROM {table}")
        rows = cursor.fetchall()
        data[table] = [dict(row) for row in rows]  

    conn.close()
    return data

def export_to_js():
    data = fetch_data()
    
    js_content = f"const databaseData = {json.dumps(data, indent=4)};\n\nexport default databaseData;"

    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

    print("Arquivo data.js gerado com sucesso!")

if __name__ == "__main__":
    export_to_js()
