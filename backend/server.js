import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import app from './app.js';

// Connect to the DB first, then start listening. Fail fast if the DB is unreachable.
const startServer = async () => {
    await connectDB();
    app.listen(env.PORT, () => {
        console.log(`Server is running on port ${env.PORT}`);
    });
};

startServer();
