export const userDoc = {
  tags: [
    {
      name: "Users",
      description: "Operaciones relacionadas con usuarios",
    },
  ],
  paths: {
    "/users": {
      get: {
        tags: ["Users"],
        description: "Obtiene la lista de usuarios",
        responses: {
          404: {
            description: "Error al obtener lista de usuarios",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    msg: { type: "string", example: "No se encontraron usuarios" },
                  },
                },
              },
            },
          },
          200: {
            description: "Lista de usuarios",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    users: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          nombre: { type: "string", example: "Juan" },
                          apellido: { type: "string", example: "Pérez" },
                          email: { type: "string", example: "juan.perez@example.com" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        description: "Obtiene un usuario por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID del usuario",
            schema: {
              type: "string",
              example: "705a2c49-e401-4f8c-8861-caaab4c6c44b",
            },
          },
        ],
        responses: {
          404: {
            description: "Usuario no encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    msg: { type: "string", example: "Usuario no encontrado" },
                  },
                },
              },
            },
          },
          200: {
            description: "Detalles del usuario",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    user: {
                      type: "object",
                      properties: {
                        nombre: { type: "string", example: "Juan" },
                        apellido: { type: "string", example: "Pérez" },
                        email: { type: "string", example: "juan.perez@example.com" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Users"],
        description: "Actualiza un usuario por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID del usuario",
            schema: {
              type: "string",
              example: "1",
            },
          },
        ],
        responses: {
          404: {
            description: "Usuario no encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    msg: { type: "string", example: "Usuario no encontrado" },
                  },
                },
              },
            },
          },
          200: {
            description: "Usuario actualizado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    user: {
                      type: "object",
                      properties: {
                        nombre: { type: "string", example: "Juan" },
                        apellido: { type: "string", example: "Pérez" },
                        email: { type: "string", example: "juan.perez@example.com" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Users"],
        description: "Elimina un usuario por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID del usuario",
            schema: {
              type: "string",
              example: "1",
            },
          },
        ],
        responses: {
          404: {
            description: "Usuario no encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    msg: { type: "string", example: "Usuario no encontrado" },
                  },
                },
              },
            },
          },
          200: {
            description: "Usuario eliminado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    msg: { type: "string", example: "Usuario eliminado exitosamente" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
