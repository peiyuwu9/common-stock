import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import { error } from "firebase-functions/logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function renderFile(data) {
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "../template/index.ejs"),
      { data },
      { async: true }
    );

    await fs.writeFile(
      path.join(__dirname, "../view/index.html"),
      html,
      (err) => err
    );

    return true;
  } catch (err) {
    error(err);
    return false;
  }
}

export default renderFile;
