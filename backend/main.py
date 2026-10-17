"""FastAPI application for the Vidhata AI backend foundation."""

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

from config import FRONTEND_ORIGIN

app = FastAPI(
    title="Vidhata AI API",
    description="Backend API for the Vidhata AI developer workspace.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
    allow_credentials=False,
)


class IssueRequest(BaseModel):
    """Validated description submitted through the frontend issue form."""

    # Trim outside whitespace before applying the length limits. This also
    # prevents a description made only of whitespace from being accepted.
    model_config = ConfigDict(str_strip_whitespace=True)

    description: str = Field(min_length=1, max_length=2000)


class IssueResponse(BaseModel):
    """Safe acknowledgement that an issue description was received."""

    status: str
    message: str


@app.get("/health")
def health_check() -> dict[str, str]:
    """Return a simple status response to confirm the API is available."""
    return {"status": "ok"}


@app.post(
    "/issues",
    response_model=IssueResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def accept_issue(issue: IssueRequest) -> IssueResponse:
    """Validate and acknowledge an issue without processing or executing it."""
    return IssueResponse(
        status="accepted",
        message="Issue description accepted for future processing.",
    )
