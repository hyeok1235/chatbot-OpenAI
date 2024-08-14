import OpenAI from "openai";
import dotenv from "dotenv";

// .env 파일에서 환경 변수 가져오기
dotenv.config();

// OpenAI 클라이언트 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "1에서 30까지 홀수인 숫자를 알려줘" },
    ],
    model: process.env.OPENAI_API_MODEL,
  });

  console.log(completion.choices[0]);
}

main();
