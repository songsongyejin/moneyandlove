FROM openjdk:17-slim

ARG PROFILE

COPY build/libs/webRTC-0.0.1-SNAPSHOT.jar app.jar

ENV PROFILE=${PROFILE}

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=${PROFILE}", "/app.jar"]