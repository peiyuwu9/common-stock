import fs from "fs";
import path from "path";
import fastify from "fastify";
import { fileURLToPath } from "url";
import { CronJob } from "cron";
import createLogger from "./utils/logger.js";
import generateIndex from "./controller/generateIndex.js";

createLogger();

const server = fastify();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.register(import("@fastify/static"), {
  root: path.join(__dirname, "view"),
});

server.get("/", (req, reply) => {
  reply.sendFile("index.html");
});

server.get("/log", (req, reply) => {
  reply.sendFile("application.log");
});

server.listen({ port: 3000 }, async (err, address) => {
  if (err) {
    global.logger.error(err);
    process.exit(1);
  }
  global.logger.info(`Server listening at ${address}`);

  const job = new CronJob(
    "* * 9 * * *",
    generateIndex,
    null,
    true,
    "America/New_York"
  );
});
