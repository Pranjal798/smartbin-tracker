import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://smartbin-tracker-default-rtdb.europe-west1.firebasedatabase.app/"
})
