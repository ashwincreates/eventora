from dotenv import load_dotenv
import os
from sqlmodel import SQLModel, create_engine

_ = load_dotenv()
DB_URL = os.getenv("DB_URL")
if not DB_URL:
    raise ValueError("DB_URL environment variable is not set")

connect_arg = {"check_same_thread": False}
engine = create_engine(DB_URL)


def create_tables():
    SQLModel.metadata.create_all(engine)


def close():
    engine.dispose()
