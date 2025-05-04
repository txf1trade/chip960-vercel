import fetch from "node-fetch";
import admin from "firebase-admin";

let app;

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL
  });
}

const db = admin.database();

export default async function handler(req, res) {
  try {
    const response = await fetch("https://market-data-api.futures-ai.com/chip960_tradeinfo");
    const data = await response.json();

    await db.ref("chip960").set(data);

    res.status(200).json({ message: "Firebase 寫入成功", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
