export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "URL Service API",
    version: "1.0.0",
    description: "API documentation for the URL shortener service"
  },
  servers: [
    {
      url: process.env.BASE_URL || "http://localhost:4001"
    }
  ],
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "Service is healthy"
          }
        }
      }
    },
    "/urls": {
      post: {
        summary: "Create a short URL",
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  originalUrl: {
                    type: "string",
                    format: "uri"
                  }
                },
                required: ["originalUrl"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Short URL created"
          },
          "400": {
            description: "Invalid URL"
          },
          "401": {
            description: "Unauthorized"
          }
        }
      }
    },
    "/urls/my": {
      get: {
        summary: "Get URLs created by the authenticated user",
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          "200": {
            description: "List of URLs"
          },
          "401": {
            description: "Unauthorized"
          }
        }
      }
    },
    "/urls/{shortCode}": {
      get: {
        summary: "Redirect to the original URL",
        parameters: [
          {
            name: "shortCode",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "302": {
            description: "Redirect to original URL"
          },
          "404": {
            description: "URL not found"
          }
        }
      }
    },
    "/urls/{id}": {
      delete: {
        summary: "Delete a URL",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "URL deleted"
          },
          "401": {
            description: "Unauthorized"
          }
        }
      },
      put: {
        summary: "Update a URL",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  originalUrl: {
                    type: "string",
                    format: "uri"
                  }
                },
                required: ["originalUrl"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "URL updated"
          },
          "401": {
            description: "Unauthorized"
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
}

