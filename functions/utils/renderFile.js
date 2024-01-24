import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import { getStorage, ref, uploadBytes } from "@firebase/storage";
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

    const blob = new Blob([html], { type: "text/html" });

    // upload file
    const storage = getStorage();
    const storageRef = ref(storage, "index.html");
    // 'file' comes from the Blob or File API
    await uploadBytes(storageRef, blob);

    return true;
  } catch (err) {
    error(err);
    return false;
  }
}

export default renderFile;
