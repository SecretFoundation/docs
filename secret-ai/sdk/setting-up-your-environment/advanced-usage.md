# Advanced Usage

### Advanced Usage

#### Streaming Responses

Enable real-time streaming for both text generation and voice synthesis:

```python
# Streaming text generation
from secret_ai_sdk.secret_ai import ChatSecret

messages = [("human", "Write a story about AI")]

for chunk in secret_ai_llm.stream(messages):
    print(chunk.content, end="", flush=True)
```

#### Custom Streaming Handler

Implement custom streaming behavior with callback handlers:

```python
from langchain.callbacks.base import BaseCallbackHandler
import re

class SecretStreamingHandler(BaseCallbackHandler):
    def __init__(self, width: int = 60):
        self.width = width
        self.buffer = ""
        self.in_think = False
    
    def on_llm_new_token(self, token: str, **kwargs) -> None:
        """Handle new token from LLM stream"""
        if "<think>" in token:
            self.in_think = True
            print("\n🧠 ", end="", flush=True)
        elif "</think>" in token:
            self.in_think = False
            print("\n", flush=True)
        else:
            if self.in_think:
                # Color thinking text in cyan
                print(f"\033[96m{token}\033[0m", end="", flush=True)
            else:
                print(token, end="", flush=True)

# Use with streaming
handler = SecretStreamingHandler(width=80)
response = secret_ai_llm.invoke(
    messages, 
    config={"callbacks": [handler]}, 
    stream=True
)
```

#### Enhanced Error Handling

The SDK provides comprehensive error handling with specific exception types:

```python
from secret_ai_sdk.secret_ai_ex import (
    SecretAIAPIKeyMissingError,
    SecretAIConnectionError,
    SecretAITimeoutError,
    SecretAIRetryExhaustedError,
    SecretAIResponseError
)

try:
    response = secret_ai_llm.invoke(messages)
except SecretAITimeoutError as e:
    print(f"Request timed out after {e.timeout} seconds")
except SecretAIConnectionError as e:
    print(f"Failed to connect to {e.host}: {e.original_error}")
except SecretAIRetryExhaustedError as e:
    print(f"All {e.attempts} retry attempts failed: {e.last_error}")
except SecretAIAPIKeyMissingError:
    print("API key is required. Set SECRET_AI_API_KEY environment variable")
```

#### Enhanced Client with Custom Configuration

Use the enhanced client for advanced retry and timeout configuration:

```python
from secret_ai_sdk._enhanced_client import EnhancedSecretAIClient

client = EnhancedSecretAIClient(
    host="https://your-ai-endpoint.com",
    api_key="your_api_key",
    timeout=60.0,              # 60 second request timeout
    connect_timeout=15.0,      # 15 second connection timeout
    max_retries=5,             # Retry up to 5 times
    retry_delay=2.0,           # Start with 2 second delay
    retry_backoff=1.5,         # Increase delay by 1.5x each retry
    validate_responses=True     # Validate response format
)

# Client automatically handles retries and timeouts
response = client.generate(
    model="your-model",
    prompt="Write a comprehensive analysis...",
    stream=False
)
```

#### Voice Processing Examples

**Context Manager Usage**

```python
# Use as context manager for automatic cleanup
with VoiceSecret(stt_url=stt_url, tts_url=tts_url) as voice:
    # Check service health
    stt_health = voice.check_stt_health()
    tts_health = voice.check_tts_health()
    
    if stt_health and tts_health:
        # Get available voices and models
        voices = voice.get_available_voices()
        models = voice.get_available_models()
        
        # Process audio files
        transcription = voice.transcribe_audio("meeting_recording.wav")
        
        # Generate speech with different voices
        for voice_name in voices[:3]:  # Try first 3 voices
            audio = voice.synthesize_speech(
                text="Testing different voice models",
                voice=voice_name,
                response_format="wav"
            )
            voice.save_audio(audio, f"test_{voice_name}.wav")
```

**Streaming TTS**

```python
# Streaming TTS for long text
long_text = "This is a very long piece of text that we want to synthesize..."

audio_data = voice_client.synthesize_speech_streaming(
    text=long_text,
    model="tts-1",
    voice="af_alloy",
    speed=1.2
)

# Stream audio data as it's generated
with open("streaming_output.mp3", "wb") as f:
    for chunk in audio_data:
        f.write(chunk)
```
