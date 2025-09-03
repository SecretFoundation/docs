# Concurrency Support

#### Concurrency Support

Ollama is designed to handle **multiple requests concurrently**, allowing you to serve several clients or processes at once. By default, the Ollama server runs as a long-lived process and accepts parallel HTTP requests over its OpenAI-compatible API endpoints (e.g., `/v1/chat/completions`).

Key concurrency features:

* Each request spawns its own model evaluation stream
* Server manages batching and queuing under the hood for fair scheduling
* Safe to send simultaneous requests from different threads, processes, or machines
* Built-in load balancing across multiple Ollama instances
