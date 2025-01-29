import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc, { Options, SwaggerDefinition } from 'swagger-jsdoc';
import { envs } from './envs';


const setup = (app: Express, swaggerDefinition: SwaggerDefinition, apis: string[]) => {
    const options: Options = {
        definition: swaggerDefinition,
        apis,
    };

    const swaggerSpec = swaggerJSDoc(options);

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    if (process.env.NODE_ENV !== 'production') 
    console.log(`Swagger docs available at http://localhost:${envs.PORT}/api-docs`);
}


export const swaggerAdapter = {
    setup,
};
