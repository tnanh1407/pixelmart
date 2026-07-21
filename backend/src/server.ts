import "dotenv/config";
import env from "./config/env.ts";
import app from "./app.ts";
import connectDatabase from "./config/database.ts";
import chalk from "chalk";

connectDatabase().then(() => {
  app.listen(5000, () => {
    console.log(
      chalk.green(
        `Server running on port ${5000} [${env.NODE_ENV}]`
      )
    );
  });
});
