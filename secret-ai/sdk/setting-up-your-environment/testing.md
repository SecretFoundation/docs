# Testing

### Testing

#### Basic Connectivity Test

```python
#!/usr/bin/env python3

from secret_ai_sdk.secret import Secret
from secret_ai_sdk.secret_ai import ChatSecret

# Test configuration
TEST_API_KEY = 'your_test_api_key'
TEST_MODEL = 'deepseek-r1:70b'

def test_secret_ai_connection():
    """Test basic connectivity and functionality"""
    import os
    os.environ['SECRET_AI_API_KEY'] = TEST_API_KEY
    
    # Test Secret Network client
    secret_client = Secret()
    models = secret_client.get_models()
    assert len(models) >= 1, "No models available"
    
    urls = secret_client.get_urls(model=TEST_MODEL)
    assert len(urls) >= 1, "No URLs available for model"
    
    # Test ChatSecret
    secret_ai_llm = ChatSecret(
        base_url=urls[0],
        model=TEST_MODEL,
        temperature=0.7
    )
    
    messages = [
        ("system", "Respond with exactly 'SUCCESS' if you understand."),
        ("human", "Test message"),
    ]
    
    response = secret_ai_llm.invoke(messages)
    assert response is not None, "No response received"
    assert len(response.content) > 0, "Empty response content"
    
    print("✅ All tests passed!")

if __name__ == '__main__':
    test_secret_ai_connection()
```

#### Voice Services Test

```python
from secret_ai_sdk.voice_secret import VoiceSecret
from pathlib import Path

def test_voice_services():
    """Test voice processing capabilities"""
    try:
        # Initialize with test URLs
        voice = VoiceSecret(
            stt_url="http://localhost:25436",
            tts_url="http://localhost:25435"
        )
        
        # Test service health
        stt_status = voice.check_stt_health()
        tts_status = voice.check_tts_health()
        
        print(f"STT Service: {'✅ Healthy' if stt_status else '❌ Unavailable'}")
        print(f"TTS Service: {'✅ Healthy' if tts_status else '❌ Unavailable'}")
        
        if tts_status:
            # Test TTS
            audio = voice.synthesize_speech(
                text="This is a test message",
                model="tts-1",
                voice="af_alloy"
            )
            
            # Save test audio
            output_path = Path("test_output.mp3")
            voice.save_audio(audio, output_path)
            print(f"✅ Generated test audio: {output_path}")
    
    except Exception as e:
        print(f"❌ Voice test failed: {e}")

if __name__ == '__main__':
    test_voice_services()
```
