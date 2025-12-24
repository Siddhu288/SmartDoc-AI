# ---- Base image ----
FROM python:3.10-slim

# ---- Environment settings ----
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# ---- Working directory ----
WORKDIR /app

# ---- System dependencies (for PDF, chromadb, etc.) ----
RUN apt-get update && apt-get install -y \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# ---- Install Python dependencies ----
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# ---- Copy application code ----
COPY . .

# ---- Expose port ----
EXPOSE 8000

# ---- Start FastAPI ----
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
