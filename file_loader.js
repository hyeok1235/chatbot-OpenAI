import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const loader = new DirectoryLoader("./references", {
  ".json": (path) => new JSONLoader(path, "/texts"),
  ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
  ".txt": (path) => new TextLoader(path),
  ".csv": (path) => new CSVLoader(path),
});

const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
});

for (const doc of docs) {
  const output = await splitter.splitDocuments([doc]);
  console.log(output);
}
