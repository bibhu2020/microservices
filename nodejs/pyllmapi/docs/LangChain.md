# Overview
LangChain is a framework for developing applications powered by large language models (LLMs). It has 3 major components.

- LangChain: Is the Core Component.

- LangSmith: A developer platform that lets you debug, test, evaluate, and monitor LLM applications.

- LangGraph: Build robust and stateful multi-actor applications with LLMs by modeling steps as edges and nodes in a graph. Integrates smoothly with LangChain, but can be used without it.

- LangServe: Deploy LangChain chains as REST APIs.

## LangChain
It has the following open-source libraries:

- langchain-core: Base abstractions and LangChain Expression Language (LCEL).

- langchain-community: Third party integrations. Partner packages (e.g. langchain-openai, langchain-anthropic, etc.): Some integrations have been further split into their own lightweight packages that only depend on langchain-core.

- langchain: Chains, agents, and retrieval strategies that make up an application's cognitive architecture.

### Chain
Chain is a series of Runnable that are executed one after another with the output from the previous runnable.

#### ChatPromptTemplate
It has the following methods to formulate a prompt:
- from_template: Create a prompt with a template that includes dynamic placeholders. (parameterized to change input value)
- from_messages: Create a prompt from multiple BaseMessage objects. (you can send HumanMessage, AIMessage, SystemMessage)
- from_text: Create a static prompt with no placeholders. (no parameterization)

