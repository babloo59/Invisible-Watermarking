from pymongo import MongoClient
from datetime import datetime, timezone

client = MongoClient("mongodb+srv://babloo16bk08:DqqNGR2B2.2pdAy@cluster0.ntn3x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["watermark_db"]
collection = db["images"]

def save_image_entry(filename, watermarked_filename, recovered_filename, metrics):
    collection.insert_one({
        "original": filename,
        "watermarked": watermarked_filename,
        "recovered": recovered_filename,
        "metrics": metrics,
        "timestamp": datetime.now(timezone.utc)
    })

def get_all_images():
    return list(collection.find({}, {"_id": 0}))
