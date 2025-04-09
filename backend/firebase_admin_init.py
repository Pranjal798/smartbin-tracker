import os
import json
import firebase_admin
from firebase_admin import credentials, db

# Load the Firebase credentials from environment variable
cred_dict = json.loads(os.environ["FIREBASE_CREDENTIALS_JSON"])
cred = credentials.Certificate(cred_dict)

firebase_admin.initialize_app(cred, {
    "databaseURL": "https://smartbin-tracker-default-rtdb.europe-west1.firebasedatabase.app/"
})
