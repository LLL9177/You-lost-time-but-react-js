from flask import Flask, request, g, current_app
import sqlite3, os, click, json, datetime
from dotenv import load_dotenv
from flask_cors import CORS
from markupsafe import escape
load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["DATABASE"] = os.path.join("..", "..", "flaskr", "instance", "database.sqlite")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(
            current_app.config["DATABASE"],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()    

def init_db():
    db = get_db()
    with app.open_resource("schema.sql") as f:
        db.executescript(f.read().decode("utf-8"))

def convert_time_to_string(total_minutes):
    # quick single-unit cases
    if total_minutes < 60:
        return f"{total_minutes}m"
    if total_minutes == 60:
        return "1h"

    # compute breakdown
    minutes = total_minutes % 60
    hours_total = total_minutes // 60

    if hours_total < 24:
        # only hours (+ minutes if any)
        hours = hours_total
        parts = []
        if hours: parts.append(f"{hours}h")
        if minutes: parts.append(f"{minutes}m")
        return " ".join(parts)

    # days/weeks path
    days_total = hours_total // 24
    hours = hours_total % 24

    if days_total < 7:
        # days + maybe hours (omit hours if 0)
        parts = []
        if days_total: parts.append(f"{days_total}D")
        if hours: parts.append(f"{hours}h")
        # optionally include minutes if you want sub-hour detail:
        if minutes: parts.append(f"{minutes}m")
        return " ".join(parts)

    # weeks and leftover days/hours/minutes
    weeks = days_total // 7
    days = days_total % 7
    parts = []
    if weeks: parts.append(f"{weeks}W")
    if days: parts.append(f"{days}D")
    if hours: parts.append(f"{hours}h")
    if minutes: parts.append(f"{minutes}m")
    return " ".join(parts)



@app.route('/get/user_data', methods=["POST"])
def get_user_data():
    db=get_db()
    username = escape(request.get_json().get("username"))
    user = db.execute("SELECT * FROM user WHERE username=?", (username,)).fetchone()
    error = None

    if user is None:
        error = "User not found in the databse."

    if error is not None:
        return {
            "error": error
        }

    print(
        {"user": {
            "id": user["id"],
            "username": user["username"],
            "password": user["password"],
            "time_value": user["time_value"],
            "creation_date": user["current_date"].strftime("%Y-%m-%d")
    }})

    return {
        "user": {
            "id": user["id"],
            "username": user["username"],
            "password": user["password"],
            "time_value": user["time_value"],
            "creation_date": user["current_date"].strftime("%Y-%m-%d")
        },
    }

@app.route("/get/day_data", methods=["POST"])
def get_day_data():
    username = request.get_json().get("username")
    error = None

    if username:
        db = get_db()
        data = db.execute("SELECT * FROM days WHERE username = ?", (username,)).fetchone()["day_data"]
        data = json.loads(data)

        for obj in data.values():
            for time in obj.values():
                time = convert_time_to_string(time)
    else:
        error = "Something went wrong. Sorry, but you won't get your losses book."
    
    if error is not None:
        return error
    
    print(data)
    
    return data

@app.route("/auth/register", methods=["POST"])
def register():
    username = escape(request.get_json().get("username"))
    password = escape(request.get_json().get("password"))
    db = get_db()
    db_date = db.execute("SELECT * FROM user WHERE username = ?", (username,)).fetchone()
    error = None
    message = None

    if db_date:
        db_date = db_date["current_date"]
    
    user = db.execute("SELECT * FROM user WHERE username = ?", (username,)).fetchone()
    if user:
        if user["password"] != password:
            error = "Incorrect username or password." # I know incorrect is password, but it's just better to write that.
            return {"error": error}
    
    try:
        if db_date is None: 
            db.execute(
                "INSERT INTO user (username, password, time_value, current_date) VALUES (?, ?, ?, ?)", 
                (username, password, 0, datetime.date.today())
            )

            day_data_json = json.dumps({})
            db.execute(
                "INSERT INTO days (username, day_data) VALUES (?, ?)",
                (username, day_data_json)
            )
            message = "Created an account at: "+ datetime.date.today().strftime("%d-%m-%Y")

            db.commit()
    except Exception as e:
        error = "Something is up with the database. Try again later, it's not your fault. Fixing..."
        print("DB error creating user: " + str(e))

    if error is not None:
        return {"error": error}
    
    return {
        "username": username,
        "message": message
    }

@app.route("/post/time", methods=["POST"])
def post_time():
    username = escape(request.get_json().get("username"))
    d_time = int(request.get_json().get("time_value"))
    db = get_db()
    error = None

    user = db.execute("SELECT * FROM user WHERE username = ?", (username,)).fetchone()
    print(user["time_value"])
    day_data = db.execute("SELECT * FROM days WHERE username = ?", (username,)).fetchone()

    if user is None:
        error = "User not found in the database"
    else:
        time = d_time + user["time_value"]
        now = datetime.datetime.now().strftime("%H:%M")
        today = datetime.datetime.today().strftime("%d:%m:%Y")
        day_data = json.loads(day_data["day_data"])

        if today not in day_data:
            day_data[today] = {}

        if day_data != {} and now in day_data[today]:
            print("it's working correctly.")
            day_data_value = day_data[today][now] + d_time
        else:
            day_data_value = d_time
            
        day_data[today][now] = day_data_value
        day_data = json.dumps(day_data)

        try:
            db.execute(
                "UPDATE user SET time_value = ? WHERE username = ?", (time, username)
            )

            db.execute(
                "UPDATE days SET day_data = ? WHERE username = ?", (day_data, username)
            )

            db.commit()
        except Exception as e:
            print("DB error inserting time: " + str(e))
            error = "Something went wrong with the database. Not your fault probably. Fixing..."
    
    if error is not None:
        return {"error": error}

    return {"status": "success"}



@click.command("init-db")
def init_db_command():
    """Initialize the database using schema.sql"""
    init_db()
    click.echo("Initialized the database.")


if __name__ == "__main__":
    app.run()