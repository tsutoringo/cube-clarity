import os
import json
import threading
import subprocess
from flask import Flask, make_response ,Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

current_status = 0

def load_cube_state():
    try:
        with open("latest_cube_state.json", "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"error": "Cube state not available"}
    
def process_call():
    global current_status
    current_status = 1
    command = ["python","main.py"]
    proc = subprocess.Popen(command)
    proc.communicate()
    if proc.poll() != None:
        current_status = 2
    return current_status

# ルーティング
@app.route("/detectface")
def detect_face():
    global current_status
    if current_status == 0:
        call_thread = threading.Thread(target=process_call)
        call_thread.start()
        return Response(None,content_type='text/plane',status = 200)
    if current_status == 1:
        return Response(None,status = 423)
    return Response(None,content_type='text/plane',status = 200)
  
@app.route("/getface")
def get_face():
    global current_status
    while(1):
        if current_status == 0:
            return Response(None,status = 404)
        elif current_status == 1:
            return Response(None,status = 425)
        elif current_status == 2:
            break
    current_status == 0
    cube_state = load_cube_state()
    response = make_response(json.dumps(cube_state, ensure_ascii=False, indent=6))
    response.headers['Content-Type'] = 'application/json'
    return response

if __name__ == "__main__":
    app.run(port=8000, debug=True)