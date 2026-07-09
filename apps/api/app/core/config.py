from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    api_host: str = "127.0.0.1"
    api_port: int = 8000
    web_origin: str = "http://localhost:3000"
    database_url: str = "sqlite:///./control_tower.db"
    demo_mode: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
