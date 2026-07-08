import "dotenv/config";
import env from "./config/env.ts";
import app from "./app.ts";
import connectDatabase from "./config/database.ts";

connectDatabase().then(() => {
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
});
