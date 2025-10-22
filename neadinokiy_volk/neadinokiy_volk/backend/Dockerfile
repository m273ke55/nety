FROM python:3.15-rc-slim-trixie

RUN apt-get update && \
    apt-get install -y gcc libpq-dev && \
    
    apt-get install -y --only-upgrade imagemagick libmagickcore-6.q16-dev libmagickcore-6.q16-6 libmagickwand-6.q16-6 || true && \
 
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--log-level", "debug"]
