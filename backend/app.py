from flask import Flask, jsonify,request
from flask_cors import CORS
import os
from datetime import datetime
import sqlite3
import json
# create and config the app
app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'dev'
app.config['DATABASE']= os.path.join(os.getcwd(),'backend.sqlite')


try:
    os.makedirs(os.path.dirname(app.config['DATABASE']), exist_ok=True)
except OSError:
    pass


#json setup
ROADMAP = {
    "Security engineer": {
        "Description":"Securtiy engineer design, build and maintain secure systems and IT infastructure to protect and organization from cyber threats",
        "roadmap":[
            {
                "stage":"high school",
                "actions":[
                    "Apply to https://mdcwap.mdc.edu/admission/menuI.aspx?type=N by july 1st to get admitted for fall",
                    "On your application choose an Associate of Science in Cybersecurity",
                    "Ensure you have taken your SAT and ACT examinations.Submit your score to MDC",
                    "Complete your residency and find out more information at https://www.mdc.edu/admissions-info/tuition/default.aspx",
                    "Send in your transcipts",
                    "Apply for fafas at https://studentaid.gov/h/apply-for-aid/fafsa"
                ]
            },
            {
                "stage":"path",
                "actions":[
                    "Pursue an Associates in Cybersecurity",
                    "Maintain a gpa above 2.5",
                    "Pursue a BAS in CYbersecurity"
                    
                ]
            },
            {
                "stage":"events/clubs",
                "actions":[
                    "Join organizations related to cybersecurity or technology.visit : https://sharknet.mdc.edu/organizations",
                    "Attend events such as SharkBytes which takes place in the fall semester.visit: https://sharknet.mdc.edu/events"
                ]
            },
            {
                "stage":"internships",
                "actions":[
                    "Create a Linked-In profile.",
                    "Create your resume,prepare for interviews,attend workshops and network at https://www.mdc.edu/mdcworks/career-resources/default.aspx",
                    "Join MDC career platform with handshake to apply for internships and learn about requirements at https://mdc.joinhandshake.com/login",
                    "Create a vmock account to upload,update,create a resume, recieving constructive feedback to improve your resume at https://www.vmock.com/mdc",
                    "Create a github account and learn version control. Upload everything you do related to cyberscurity.https://github.com/",
                    "Create a personal website with github and deploy it. https://github.com/topics/personal-website"
                ]
            },
            {
                "stage":"career",
                "actions":[
                    "Security Management Specialist",
                    "Information Security Analyst",
                    "Computer and Information Systems Manager",
                    "Security System Administrators",
                    "Vulnerability Analyst",
                    "Cyber Security Incident Response Specialist",
                    "Cyber Threat Intelligence Analyst"
                    
                ]
            }
        ]
    }
}
@app.route('/')
def home():
    return jsonify({"Welcome":"Hello! Welcome to plan your future(PYF)."})
@app.route('/api/roadmap')
def get_roadmap():
    career = request.args.get('career', '').strip().lower()
    roadmap = next((v for k, v in ROADMAP.items() if k.lower() == career), None)
    if roadmap:
        return jsonify(roadmap)
    else:
        return jsonify({"error": f"No roadmap found for '{career}'"}), 404


def init_db():
    conn = sqlite3.connect(app.config['DATABASE'])
    c = conn.cursor()

    # Read schema.sql and execute it
    with open('schema.sql', 'r') as f:
        schema_sql = f.read()
    c.executescript(schema_sql)
    conn.commit()
    conn.close()

@app.route('/api/save', methods=['POST'])
def save_roadmap_route():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    career_name = data.get('career_name')
    roadmap_data = data.get('roadmap_data')

    if not career_name or not roadmap_data:
        return jsonify({"error": "career_name and roadmap_data are required"}), 400

    try:
        conn = sqlite3.connect(app.config['DATABASE'])
        c = conn.cursor()
        c.execute(
            "INSERT INTO roadmaps (career_name, roadmap_data, created_at) VALUES (?, ?, ?)",
            (career_name, json.dumps(roadmap_data), datetime.now())
        )
        conn.commit()
    finally:
        conn.close()

    return jsonify({"message": f"Roadmap for '{career_name}' saved successfully!"})


init_db()
from auth import auth_bp
app.register_blueprint(auth_bp)

if __name__ == '__main__':
    app.run(debug=True)