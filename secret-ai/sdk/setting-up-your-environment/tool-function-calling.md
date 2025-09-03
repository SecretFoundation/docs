# Tool/Function Calling

#### Function Calling

Ollama supports tool (function) calling via the `/v1/chat/completions` endpoint. For models like Llama 3.1 and Mistral Nemo, you can define tools in the request, and the model may return a `tool_calls` object with arguments to execute—just like OpenAI's function-calling.
