from flask import Flask, render_template
import json
from pathlib import Path

app = Flask(__name__)

def load_site_data():
    data_path = Path(__file__).parent / "data" / "site.json"
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.route("/")
def index():
    data = load_site_data()
    return render_template("index.html", data=data)

@app.route("/healthz")
def healthz():
    return "ok", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
