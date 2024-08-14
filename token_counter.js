import { get_encoding } from "tiktoken";
import dotenv from "dotenv";

// .env 파일에서 환경 변수 가져오기
dotenv.config();

const encoder = get_encoding("cl100k_base");

const text = "Example Text. 예시 텍스트입니다.";
console.log("Text:", text);

const encodedText = encoder.encode(text);

console.log("number of tokens:", encodedText.length);
console.log("characters:", text.length);
encoder.free();
