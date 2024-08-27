# Chatbot Implementation Using LangChain and OpenAI

This repository contains a chatbot implementation leveraging the LangChain framework and OpenAI's GPT models. The chatbot is designed to utilize Retrieval-Augmented Generation (RAG) techniques by searching through related files in a references folder based on the context provided.

## Features

- **Context-Aware Responses**: The chatbot takes multiple tokens as context, enabling RAG-like techniques to provide more relevant and accurate responses.
- **Document Loader**: Efficiently loads documents from the `references` folder to be used in the RAG process.
- **Text Splitting**: Splits the loaded text into manageable chunks to facilitate effective context searching and response generation.
- **Powered by LangChain**: Utilizes the LangChain framework for seamless integration with OpenAI's GPT models.
