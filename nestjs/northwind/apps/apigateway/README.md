## Required Packages
```bash
npm install @nestjs/axios @nestjs/config @nestjs/throttler opossum

```

## Add logging middleware to the monorepo
this middleware intercept all requests hitting the microservices, and log them.
```bash
nest g middleware logger --project apigateway
```