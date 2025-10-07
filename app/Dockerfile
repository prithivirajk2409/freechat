FROM maven:3.8.5-openjdk-17 AS build

WORKDIR /

COPY . .

WORKDIR /app

RUN mvn clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim

COPY --from=build /app/target/app-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=8080
EXPOSE $PORT

ENTRYPOINT ["java", "-jar", "app.jar"]

