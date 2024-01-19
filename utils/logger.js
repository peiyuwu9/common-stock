import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const log4js = require("log4js");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createLogger() {
  log4js.configure({
    appenders: {
      app: {
        type: "file",
        filename: path.join(__dirname, "../view/application.log"),
      },
    },
    categories: { default: { appenders: ["app"], level: "info" } },
  });

  global.logger = log4js.getLogger();
}

export default createLogger;
