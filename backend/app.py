from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"Welcome":"Hello! Welcome to plan your future(PYF)."})

if __name__ == '__main__':
    app.run(debug=True)