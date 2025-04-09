from flask import Flask, request, jsonify
from firebase_admin_init import db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/bins', methods=['GET'])
def get_bins():
    ref = db.reference('bins')
    return jsonify(ref.get())

@app.route('/bins', methods=['POST'])
def add_bin():
    data = request.json  # expects direct bin object, not wrapped in "bins"
    ref = db.reference('/bins')
    new_bin = ref.push(data)
    print("✅ Bin added with key:", new_bin.key)
    return jsonify({"message": "Bin added", "id": new_bin.key}), 201


@app.route('/bins/<bin_id>', methods=['PUT'])
def update_bin(bin_id):
    data = request.json
    ref = db.reference(f'/bins/{bin_id}')
    ref.update(data)
    return jsonify({"message": "Bin updated"}), 200


@app.route('/bins/<bin_id>', methods=['DELETE'])
def delete_bin(bin_id):
    ref = db.reference(f'/bins/{bin_id}')
    ref.delete()
    return jsonify({"message": "Bin deleted"}), 200
from flask import send_from_directory

@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/app.js')
def app_js():
    return send_from_directory('../frontend', 'app.js')

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
