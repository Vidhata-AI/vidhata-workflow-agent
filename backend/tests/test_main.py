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
