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


if __name__ == "__main__":
    app.run(debug=True)
