"""API tests for issue-description validation and acknowledgement."""

from fastapi.testclient import TestClient

from config import FRONTEND_ORIGIN
from main import app

client = TestClient(app)


def test_accepts_valid_issue_description() -> None:
    """Valid issue text receives an acknowledgement without processing."""
    response = client.post(
        "/issues",
        json={"description": "Login fails after entering valid credentials."},
    )

    assert response.status_code == 202
    assert response.json() == {
        "status": "accepted",
        "message": "Issue description accepted for future processing.",
    }


def test_rejects_empty_or_whitespace_description() -> None:
    """An empty description, including whitespace, is invalid input."""
    for description in ("", "   \n\t"):
        response = client.post("/issues", json={"description": description})

        assert response.status_code == 422


def test_rejects_oversized_description() -> None:
    """Descriptions longer than the documented limit are rejected."""
    response = client.post("/issues", json={"description": "a" * 2001})

    assert response.status_code == 422


def test_cors_allows_only_configured_frontend_origin() -> None:
    """The real frontend preflight allows POST and its JSON content type."""
    allowed_response = client.options(
        "/issues",
        headers={
            "Origin": FRONTEND_ORIGIN,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    disallowed_response = client.options(
        "/issues",
        headers={
            "Origin": "http://localhost:3001",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert allowed_response.status_code == 200
    assert allowed_response.headers["access-control-allow-origin"] == (
        FRONTEND_ORIGIN
    )
    assert "POST" in allowed_response.headers["access-control-allow-methods"]
    assert "content-type" in allowed_response.headers[
        "access-control-allow-headers"
    ].lower()
    assert disallowed_response.status_code == 400


def test_rejects_missing_or_non_string_description() -> None:
    """Missing or non-string descriptions are invalid."""
    missing_response = client.post("/issues", json={})
    non_string_response = client.post(
        "/issues",
        json={"description": 123},
    )

    assert missing_response.status_code == 422
    assert non_string_response.status_code == 422

    missing_errors = missing_response.json()["detail"]
    non_string_errors = non_string_response.json()["detail"]

    assert any(
        error["loc"][-1] == "description"
        for error in missing_errors
    )
    assert any(
        error["loc"][-1] == "description"
        for error in non_string_errors
    )



def test_accepts_description_at_maximum_length() -> None:
    """A description containing exactly 2000 characters is accepted."""
    response = client.post(
        "/issues",
        json={"description": "a" * 2000},
    )

    assert response.status_code == 202
    assert response.json()["status"] == "accepted"

def test_health_endpoint_returns_ok() -> None:
    """Health endpoint confirms that the backend is available."""
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_trims_whitespace_from_description() -> None:
    """Leading and trailing whitespace are trimmed before validation."""
    response = client.post(
        "/issues",
        json={"description": "   Login fails after sign-in.   "},
    )

    assert response.status_code == 202
    assert response.json()["status"] == "accepted"