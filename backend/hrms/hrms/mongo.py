from pymongo import MongoClient

MONGO_URI = "mongodb+srv://hrmsadmin:Hrms12345@cluster0.zw2j1tk.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client["hrms_db"]

employees_collection = db["employees"]
attendance_collection = db["attendance"]
