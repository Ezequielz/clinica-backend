import { createServer } from 'http';
import express from 'express'
import { AppRoutes } from './routes/AppRouter';



function main() {

    const app = express();

    const server = createServer(app);

    app.use('/api', AppRoutes);

    server.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

(async () => {
    main()
})()
