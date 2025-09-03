---
description: >-
  This page introduces Secret AI SDK, provides guidance and examples how to use
  Secret AI SDK.
---

# SECRET AI SDK

## Secret AI SDK

[![PyPI version](https://img.shields.io/pypi/v/secret-ai-sdk.svg)](https://pypi.org/project/secret-ai-sdk/) [![Python versions](https://img.shields.io/pypi/pyversions/secret-ai-sdk.svg)](https://pypi.org/project/secret-ai-sdk/) [![License](https://img.shields.io/github/license/scrtlabs/secret-ai-sdk.svg)](https://opensource.org/licenses/MIT)

The Secret AI SDK provides a comprehensive Python interface for accessing Secret Network's confidential AI models, including text generation, speech-to-text (STT), and text-to-speech (TTS) capabilities. Built with enterprise-grade reliability and privacy-preserving features.

### Overview

The Secret AI SDK is a Python library that enables secure, private access to Secret Network's confidential AI infrastructure. The SDK provides intuitive APIs for text-based language models, voice processing, and multimodal AI capabilities while ensuring all computations remain confidential through Secret's privacy-preserving technology.

### Core Features

#### AI Capabilities

* **Text Generation**: Access to Secret Confidential AI language models with streaming support
* **Voice Processing**: Unified STT and TTS functionality through the VoiceSecret class
* **Multimodal Support**: Handle text, audio, and voice interactions seamlessly
* **Ollama API Compatibility**: Full support for OpenAI-compatible endpoints

#### Enterprise-Grade Reliability

* **Enhanced Error Handling**: Comprehensive exception hierarchy with detailed error context
* **Automatic Retry Logic**: Configurable exponential backoff for network resilience
* **Timeout Management**: Customizable request and connection timeout controls
* **Response Validation**: Built-in validation for API response integrity
* **Concurrency Support**: Handle multiple concurrent requests efficiently

#### Developer Experience

* **Clean Pythonic Interface**: Intuitive APIs following Python best practices
* **Flexible Authentication**: API key-based authentication with environment variable support
* **Comprehensive Logging**: Detailed logging for debugging and monitoring
* **Context Manager Support**: Proper resource management with context managers

### Architecture

#### Core Components

The SDK consists of several key modules:

* **`secret.py`**: Main client for accessing Secret Network smart contracts
* **`secret_ai.py`**: Chat interface built on LangChain for text generation
* **`voice_secret.py`**: Unified voice processing (STT/TTS) interface
* **`_enhanced_client.py`**: Enhanced clients with retry logic and error handling
* **`_config.py`**: Configuration management and environment variables
* **`secret_ai_ex.py`**: Custom exception classes for comprehensive error handling
* **`_retry.py`**: Retry logic with exponential backoff

#### SDK Structure

```
secret_ai_sdk/
├── secret.py              # Main Secret Network client
├── secret_ai.py           # LangChain-based chat interface  
├── voice_secret.py        # Voice processing (STT/TTS)
├── _enhanced_client.py    # Enhanced clients with retry logic
├── _client.py             # Basic client implementations
├── _config.py             # Configuration and constants
├── _retry.py              # Retry logic and utilities
└── secret_ai_ex.py        # Custom exceptions
```



### Quick Start

#### Text Generation with ChatSecret

```python
from secret_ai_sdk.secret_ai import ChatSecret
from secret_ai_sdk.secret import Secret

# Initialize the Secret client
secret_client = Secret()

# Get available models from smart contracts
models = secret_client.get_models()
print(f"Available models: {models}")

# Get service URLs for your chosen model
urls = secret_client.get_urls(model=models[0])
print(f"Available URLs: {urls}")

# Create the AI client
secret_ai_llm = ChatSecret(
    base_url=urls[0],
    model=models[0],
    temperature=0.7
)

# Generate text
messages = [
    ("system", "You are a helpful assistant."),
    ("human", "Explain quantum computing in simple terms.")
]

response = secret_ai_llm.invoke(messages, stream=False)
print(response.content)
```

#### Voice Processing with VoiceSecret

```python
from secret_ai_sdk.voice_secret import VoiceSecret
from secret_ai_sdk.secret import Secret

# Get voice service URLs from smart contracts
secret_client = Secret()
models = secret_client.get_models()

# Check for required voice models
if 'stt-whisper' not in models:
    raise ValueError("STT Whisper model not available")
if 'tts-kokoro' not in models:
    raise ValueError("TTS Kokoro model not available")

# Get service URLs
stt_url = secret_client.get_urls(model='stt-whisper')
tts_url = secret_client.get_urls(model='tts-kokoro')

# Initialize VoiceSecret with service URLs
voice_client = VoiceSecret(
    stt_url=stt_url,
    tts_url=tts_url
)

# Speech-to-Text: Transcribe audio
transcription = voice_client.transcribe_audio("path/to/audio.wav")
print(f"Transcription: {transcription['text']}")

# Text-to-Speech: Generate speech
audio_data = voice_client.synthesize_speech(
    text="Hello, this is Secret AI speaking!",
    model="tts-1",
    voice="af_alloy",
    response_format="mp3"
)

# Save the generated audio
voice_client.save_audio(audio_data, "output/speech.mp3")
```

#### Network Configuration

For custom Secret Network node configuration:

```python
from secret_ai_sdk.secret import Secret

# Option 1: Direct configuration
secret_client = Secret(
    chain_id='secret-4',
    node_url='https://your-custom-lcd-node.com'
)

# Option 2: Environment variable
# export SECRET_NODE_URL='https://your-custom-lcd-node.com'
secret_client = Secret()
```

### Error Handling & Debugging

#### Exception Hierarchy

```python
SecretAIError                    # Base exception
├── SecretAIAPIKeyMissingError   # Missing API key
├── SecretAIInvalidInputError    # Invalid input parameters
├── SecretAINetworkError         # Network-related errors
│   ├── SecretAITimeoutError     # Request timeouts
│   ├── SecretAIConnectionError  # Connection failures
│   └── SecretAIRetryExhaustedError  # All retries failed
├── SecretAIResponseError        # Invalid/malformed responses
└── SecretAINotImplementedError  # Unimplemented features
```

#### Logging Configuration

Enable detailed logging for debugging:

```python
import logging

# Configure SDK logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('secret_ai_sdk')
logger.setLevel(logging.DEBUG)

# Set via environment variable
import os
os.environ['SECRET_SDK_LOG_LEVEL'] = 'debug'
```

#### Retry Logic Details

The SDK implements intelligent retry logic with exponential backoff:

* **Retryable Errors**: Network timeouts, connection errors, temporary server errors
* **Non-Retryable Errors**: Authentication failures, invalid input, permanent server errors
* **Backoff Strategy**: Exponential with jitter to prevent thundering herd
* **Configuration**: All retry parameters are configurable via environment variables

### Examples Repository

For additional examples and use cases, refer to the provided example files:

* **`example.py`**: Comprehensive streaming implementation with custom handlers
* **`voice_example.py`**: Voice processing examples with health checks and error handling
* **`test_secret_ai.py`**: Basic connectivity and functionality tests

#### Contributing

Contributions are welcome! Please submit pull requests to the [GitHub repository](https://github.com/scrtlabs/secret-ai-sdk).

### License

The Secret AI SDK is licensed under the [MIT License](https://opensource.org/licenses/MIT).

***

_This documentation covers version 0.1.5 of the Secret AI SDK. For the latest updates and features, please check the_ [_PyPI package page_](https://pypi.org/project/secret-ai-sdk/)_._

