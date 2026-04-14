from backend.app.core.config import settings

print(settings.database_url)
print(settings.secret_token)
print(settings.algorithm)
print(settings.access_token_expire_minute)

a = "Rizky@dev.com"
print(a.strip().lower())