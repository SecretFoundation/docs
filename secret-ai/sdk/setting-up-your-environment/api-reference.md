# API Reference

### API Reference

#### Secret Class

Main client for interacting with Secret Network smart contracts.

```python
class Secret:
    def __init__(self, chain_id: str = None, node_url: str = None)
    def get_models(self) -> List[str]
    def get_urls(self, model: str) -> List[str]
```

#### ChatSecret Class

LangChain-compatible chat interface for text generation.

```python
class ChatSecret(ChatOllama):
    def __init__(self, base_url: str, model: str, **kwargs)
    def invoke(self, messages: List[Tuple[str, str]], **kwargs) -> str
    def stream(self, messages: List[Tuple[str, str]], **kwargs) -> Iterator[str]
```

#### VoiceSecret Class

Unified interface for speech-to-text and text-to-speech operations.

```python
class VoiceSecret:
    def __init__(self, stt_url: str, tts_url: str, api_key: str = None)
    def transcribe_audio(self, audio_file: Union[str, Path, BinaryIO]) -> Dict[str, Any]
    def synthesize_speech(self, text: str, model: str = "tts-1", 
                         voice: str = "af_alloy", **kwargs) -> bytes
    def check_stt_health(self) -> bool
    def check_tts_health(self) -> bool
    def get_available_voices(self) -> List[str]
    def get_available_models(self) -> List[Dict[str, Any]]
```

#### Enhanced Clients

Advanced clients with retry logic and enhanced error handling.

```python
class EnhancedSecretAIClient(OllamaClient):
    def __init__(self, host: str = None, api_key: str = None, 
                 timeout: float = None, max_retries: int = None, **kwargs)

class EnhancedSecretAIAsyncClient(OllamaAsyncClient):
    def __init__(self, host: str = None, api_key: str = None, 
                 timeout: float = None, max_retries: int = None, **kwargs)
```
