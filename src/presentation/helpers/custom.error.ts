

export const CustomError = {
    create: (statusCode: number, message: string) => {
      const error = new Error(message) as Error & { statusCode: number };
      error.statusCode = statusCode;
      return error
    },
  
    badRequest: (message: string) => CustomError.create(400, message),
    unauthorized: (message: string) => CustomError.create(401, message),
    forbidden: (message: string) => CustomError.create(403, message),
    notFound: (message: string) => CustomError.create(404, message),
    internalServer: (message: string) => CustomError.create(500, message),
  };
  