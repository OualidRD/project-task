# Build stage
FROM maven:3.9.9-amazoncorretto-24 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:resolve

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

# Runtime stage
FROM amazoncorretto:24

WORKDIR /app

# Copy jar from builder
COPY --from=builder /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD java -cp app.jar org.springframework.boot.loader.launch.PropertiesLauncher health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
