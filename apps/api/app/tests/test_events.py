from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine

from app.main import app
from app.repositories.events import get_session


def get_test_db():
    # in memory database setup
    url = "sqlite:///:memory:"
    # setup database connection and return it
    db = create_engine(url, connect_args={"check_same_thread": False})
    connection = db.connect()
    SQLModel.metadata.create_all(connection)
    return connection


connection = get_test_db()

test_session = Session(bind=connection)


def get_test_session():
    yield test_session


app.dependency_overrides[get_session] = get_test_session
client = TestClient(app)


def test_create_event():
    response = client.post(
        "/events",
        json={
            "name": "Test Event",
            "description": "Test Description",
            "start_time": "2023-01-01T00:00:00",
            "end_time": "2023-01-01T01:00:00",
            "max_capacity": 10,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "id" in data["data"]
    assert data["data"]["name"] == "Test Event"


def test_wrong_event():
    response = client.post(
        "/events",
        json={
            "name": "Wrong Event",
            "description": "Wrong Description",
            "start_time": "2023-01-01T00:00:00",
            "end_time": "2023-01-01T01:00:00",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == False
    assert "max_capacity" in data["message"]


def test_max_capacity_reached():
    response = client.post(
        "/events",
        json={
            "name": "Test Event",
            "description": "Test Description",
            "start_time": "2023-01-01T00:00:00",
            "end_time": "2023-01-01T01:00:00",
            "max_capacity": 0,
        },
    )
    assert response.status_code == 200
    register_attendee = client.post(
        f"/events/{response.json()['data']['id']}/register",
        json={
            "name": "Test Attendee",
            "email": "test@example.com",
        },
    )
    assert register_attendee.status_code == 200
    data = register_attendee.json()
    assert data["success"] == False
    assert data["message"] == "Sorry, Looks like the event is full"


def test_attendee_already_registered():
    response = client.post(
        "/events",
        json={
            "name": "Test Event",
            "description": "Test Description",
            "start_time": "2023-01-01T00:00:00",
            "end_time": "2023-01-01T01:00:00",
            "max_capacity": 2,
        },
    )
    assert response.status_code == 200
    register_attendee = client.post(
        f"/events/{response.json()['data']['id']}/register",
        json={
            "name": "Test Attendee",
            "email": "test@example.com",
        },
    )
    assert register_attendee.status_code == 200
    data = register_attendee.json()
    assert data["success"] == True

    register_attendee = client.post(
        f"/events/{response.json()['data']['id']}/register",
        json={
            "name": "Test Attendee",
            "email": "test@example.com",
        },
    )
    assert register_attendee.status_code == 200
    data = register_attendee.json()
    assert data["success"] == False
    assert data["message"] == "Attendee already registered"
