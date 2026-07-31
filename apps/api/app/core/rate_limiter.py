from time import monotonic
from fastapi import HTTPException, Request

LOGIN_ATTEMPTS: dict[str, list[float]] = {}

def rate_limit_login(
    request: Request,
    max_attempts: int = 5,
    window_seconds: int = 60,
) -> None:
    client_ip = request.client.host if request.client else "unknown"
    now = monotonic()

    attempts = LOGIN_ATTEMPTS.get(client_ip, [])

    recent_attempts = [
        attempt_time
        for attempt_time in attempts
        if now - attempt_time < window_seconds
    ]

    if len(recent_attempts) >= max_attempts:
        raise HTTPException(
            status_code=429,
            detail="Terlalu banyak percobaan login. Coba lagi nanti.",
        )

    recent_attempts.append(now)
    LOGIN_ATTEMPTS[client_ip] = recent_attempts
