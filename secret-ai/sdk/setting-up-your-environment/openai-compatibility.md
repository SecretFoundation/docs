# OpenAI Compatibility

### Ollama API Compatibility

The Secret AI SDK provides full compatibility with OpenAI's API through Ollama endpoints:

#### Supported Endpoints

| Endpoint               | Support Status    | Description                           |
| ---------------------- | ----------------- | ------------------------------------- |
| `/v1/chat/completions` | ✅ Fully supported | Chat completion with streaming        |
| `/v1/completions`      | ✅ Supported       | Text completion via OpenAI-style API  |
| `/v1/models`           | ✅ Supported       | List and detail endpoints             |
| `/v1/embeddings`       | ⚠️ Available      | API compatibility in progress         |
| Tool/function calling  | ✅ Supported       | Available for select models via tools |
| `/v1/responses`        | ❌ Not supported   | Returns 404                           |
