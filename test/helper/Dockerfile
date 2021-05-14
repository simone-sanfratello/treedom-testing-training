FROM postgres:11.11-alpine

ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=none
ENV POSTGRES_DB=tree

COPY /sql/init.sql /docker-entrypoint-initdb.d/
