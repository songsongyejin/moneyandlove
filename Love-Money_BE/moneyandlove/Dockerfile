FROM amazoncorretto:17

ARG PROFILE
ARG KAKAO_CLIENT
ARG KAKAO_SECRET

COPY Love-Money_BE/moneyandlove/build/libs/moneyandlove-api-0.0.1-SNAPSHOT.jar app.jar

ENV PROFILE=${PROFILE}
ENV KAKAO_CLIENT=${KAKAO_CLIENT}
ENV KAKAO_SECRET=${KAKAO_SCERET}

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=${PROFILE}", "/app.jar"]