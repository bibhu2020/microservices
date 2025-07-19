import os
from flask import Flask, render_template
from common.db_fic import Db

app = Flask(__name__)

def get_date():
    server = os.environ.get('DB_SERVER', 'x6eps4xrq2xudenlfv6naeo3i4-u4qwpx23hhuuhfetcga4e5gu4a.msit-datawarehouse.fabric.microsoft.com')
    database = os.environ.get('DB_NAME', 'OneCloudAi-Analytic-DW')

    db = Db(
        server=server,
        database=database,
        driver='{ODBC Driver 18 for SQL Server}'
    )
    db.open_connection()

    query = """
        SELECT GETDATE()
    """

    rows = db.execute_query(query)
    if rows is None:    
        data = []
    else:   
        data = [row[0] for row in rows]
    db.close_connection()
    return data

# Define the route to display the DB response on a webpage
@app.route('/')
def home():
    data = get_date()
    if not data: 
        return render_template('index.html', data=["No data found. Error in connecting database."])   
    return render_template('index.html', data=data)

# Start the Flask web application
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))