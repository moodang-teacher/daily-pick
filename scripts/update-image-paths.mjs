import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase 환경변수가 없습니다. `node --env-file=.env.local scripts/update-image-paths.mjs`로 실행하세요."
  );
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const problemsPath = path.join(__dirname, "..", "data", "problems.json");
const problems = JSON.parse(await readFile(problemsPath, "utf-8"));

for (const problem of problems) {
  await updateDoc(doc(db, "problems", String(problem.id)), {
    imagePath: problem.imagePath,
  });
  console.log(`updated imagePath for problem ${problem.id}: ${problem.imagePath}`);
}

console.log(`\n완료: ${problems.length}개 문제의 imagePath만 업데이트했습니다 (isUsed는 그대로).`);
process.exit(0);
