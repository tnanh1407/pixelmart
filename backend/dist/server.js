import "dotenv/config";
import env from "./config/env.js";
import app from "./app.js";
import connectDatabase from "./config/database.js";
import chalk from "chalk";
connectDatabase().then(() => {
    app.listen(5000, () => {
        console.log(chalk.green(`Server running on port ${5000} [${env.NODE_ENV}]`));
    });
});
