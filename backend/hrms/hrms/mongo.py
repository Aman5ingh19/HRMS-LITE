import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://hrmsadmin:Hrms12345@cluster0.zw2j1tk.mongodb.net/?retryWrites=true&w=majority')

client = MongoClient(MONGO_URI)
db = client["hrms_db"]

employees_collection = db["employees"]
attendance_collection = db["attendance"]
