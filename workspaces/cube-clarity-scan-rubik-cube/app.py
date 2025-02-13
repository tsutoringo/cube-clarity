import os
import json
from flask import Flask, make_response

app = Flask(__name__)


def load_cube_state():
    try:
        with open("latest_cube_state.json", "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"error": "Cube state not available"}

@app.route("/detectface/")
def detect_face():
    cube_state = load_cube_state()

    response = make_response(json.dumps(cube_state, ensure_ascii=False, indent=6))
    response.headers['Content-Type'] = 'application/json'
    
    return response

if __name__ == "__main__":
    app.run(port=8000, debug=True)



