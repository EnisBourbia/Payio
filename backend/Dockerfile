FROM python:3
ENV PYTHONUNBUFFERED 1
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r /app/requirements.txt
COPY . /app/
EXPOSE 8000