from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

# Load story data
with open("story_data.json", encoding="utf-8") as f:
    story_data = json.load(f)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/story", methods=["POST"])
def story():
    data = request.json
    user_name = data.get("name", "Зочин")
    
    def replace_placeholders(text):
        return text.replace("{name}", user_name)

    def build_story_data(data):
        new_data = {}
        for key, value in data.items():
            if isinstance(value, dict):
                new_data[key] = build_story_data(value)
            elif isinstance(value, str):
                new_data[key] = replace_placeholders(value)
            else:
                new_data[key] = value
        return new_data

    personalized_story = build_story_data(story_data)
    return jsonify(personalized_story)


@app.route('/proposal', methods=['POST'])
def proposal():
    data = request.get_json()
    print("Received Proposal Data:", data)
    message = data.get('message')
    scene = data.get('scene')

    if message and scene:
        print(f"Proposal Message: {message} | Scene: {scene}")

    return jsonify({"status": "success", "message": "Proposal recorded."}), 200




if __name__ == "__main__":
    app.run(debug=True)
