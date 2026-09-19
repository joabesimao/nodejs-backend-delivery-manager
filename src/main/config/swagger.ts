import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Delivery Manager API",
      version: "1.1.0",
      description:
        "REST API for delivery management (clients, orders, products, deliverymen, accounts).",
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        accessToken: {
          type: "apiKey",
          in: "header",
          name: "x-access-token",
        },
      },
    },
    security: [{ accessToken: [] }],
  },
  apis: [path.join(process.cwd(), "src/main/routes/**/*.ts")],
};

export const swaggerSpec = swaggerJsdoc(options);
