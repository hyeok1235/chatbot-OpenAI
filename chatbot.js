import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { formatDocumentsAsString } from "langchain/util/document";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import dotenv from "dotenv";

dotenv.config();

// chatModel 설정
const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_API_MODEL,
});

// Document Loader : json, jsonl, txt, csv 파일을 읽어옴
const loader = new DirectoryLoader("./references", {
  ".json": (path) => new JSONLoader(path, "/texts"),
  ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
  ".txt": (path) => new TextLoader(path),
  ".csv": (path) => new CSVLoader(path),
});

const files = await loader.load();

// Text splitter : 문서를 chunkSize와 chunkOverlap에 따라 나눔
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
});

const docs = await splitter.splitDocuments(files);

// Vector Store & Retriever : 문서를 벡터로 변환하여 저장하고, 검색
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
const vectorStoreRetriever = vectorStore.asRetriever();

const SYSTEM_TEMPLATE = `주어진 정보를 참고해서 질문에 대답하세요. 답을 정확하게 모른다면 "모르겠어요"라고 대답하세요.
----------
{context}`;
const messages = [
  SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
  HumanMessagePromptTemplate.fromTemplate("{question}"),
];
const prompt = ChatPromptTemplate.fromMessages(messages);

const chain = RunnableSequence.from([
  {
    context: vectorStoreRetriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  chatModel,
  new StringOutputParser(),
]);

const answer = await chain.invoke("스마트 워치 프로 5000에 대한 정보를 알려줘");

console.log({ answer });

/*
{
  answer: '스마트 워치 프로 5000에 대한 정보는 다음과 같습니다:\n' +
    '\n' +
    '1. 제품 이름: 스마트 워치 프로 5000\n' +
    '2. 출시일: 2024년 6월 15일\n' +
    '3. 제조사: 스마트기어\n' +
    '4. 가격: 350,000원\n' +
    '5. 주요 기능:\n' +
    '   - 심박수 모니터링\n' +
    '   - GPS 내장\n' +
    '   - 1.5인치 AMOLED 디스플레이\n' +
    '   - 7일 배터리 수명\n' +
    '   - 방수 기능'
}
*/
