FROM python:2.7

COPY eventhub /app/

WORKDIR /app/

CMD ["python2", "bin/oeh_demo.py"]