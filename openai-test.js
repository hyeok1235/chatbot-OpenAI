// Use langhcain/openai package to test OpenAI API
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_API_MODEL,
});

const response = await chatModel.invoke("what is Samsung?");
console.log(response);
