FROM python:3.10-slim-buster

WORKDIR /app


RUN echo "deb http://deb.debian.org/debian buster main\ndeb http://deb.debian.org/debian buster-updates main\ndeb http://security.debian.org/debian-security buster/updates main" > /etc/apt/sources.list


RUN apt-get update --fix-missing

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

EXPOSE 8000
