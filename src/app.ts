import { createServer } from 'http';
import express from 'express'
import cors from 'cors'
import { AppRoutes } from './presentation/AppRouter';
import { envs } from './config/envs';

// import { swaggerAdapter } from './config/swagger.adapter';
// import { optionsDocs } from './presentation/docs/options.docs';



function main() {

    const app = express();

    // swaggerAdapter.setup(app, optionsDocs,
    //     [
    //         './src/presentation/*.ts',
    //     ]
    // );

    app.use(cors())
    app.use(express.json()); // raw
    app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

    const server = createServer(app);

    app.use('/api', AppRoutes);

    server.listen(envs.PORT, () => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Server is running on port http://localhost:${envs.PORT}`);

        } else {

            console.log(`Server is running on port ${envs.PORT}`);
        }


    });
}

(async () => {
    main()
})()
