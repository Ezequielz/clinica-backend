import { createServer } from 'http';
import express from 'express'
import cors from 'cors'
import { AppRoutes } from './presentation/AppRouter';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { envs } from './config/envs';

function main() {

    const app = express();

    const swaggerOptions = {
        swaggerDefinition: {
            info: {
                title: 'API - Clinica',
                version: '1.0.0',
                description: 'Documentación de la clinica',
                contact: {
                    name: "Ezequiel Zapata",
                    email: "zapata.ed1989@gmail.com",
                },
            },
            basePath: '/api',

        },
        apis: [
            './src/presentation/auth/*.ts',
            './src/presentation/users/*.ts',
        ]
    };

    const swaggerDocs = swaggerJsdoc(swaggerOptions)

    // Ruta para acceder a la documentación de la API
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use(cors())
    app.use( express.json() ); // raw
    app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded

    const server = createServer(app);

    app.use('/api', AppRoutes);

    server.listen(envs.PORT, () => {
        console.log('Server is running on port http://localhost:3000');
        console.log('Swagger docs available at http://localhost:3000/api-docs');
    });
}

(async () => {
    main()
})()
