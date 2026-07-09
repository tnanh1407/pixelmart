import "dotenv/config";
import env from "./config/env.js";
import app from "./app.js";
import connectDatabase from "./config/database.js";
connectDatabase().then(() => {
    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
    });
});
