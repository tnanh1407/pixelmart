import "dotenv/config";
import env from "./config/env.ts";
import app from "./app.ts";
import connectDatabase from "./config/database.ts";
import chalk from "chalk";
import {PORT} from "~/constants/roles.ts";

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(
      chalk.green(
        `Server running on port ${PORT} [${env.NODE_ENV}]`
      )
    );
  });
});
