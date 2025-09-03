# Troubleshooting

### Troubleshooting

#### Common Issues

**API Key Problems**

```bash
# Error: SecretAIAPIKeyMissingError
export SECRET_AI_API_KEY='your_actual_api_key'
```

**Connection Issues**

```python
# Test different node URLs
from secret_ai_sdk.secret import Secret

# Try alternative LCD endpoints
test_urls = [
    'https://lcd.secret.tactus.starshell.net/',
    'https://scrt-lcd.stakingcabin.com/',
    'https://secret-4.api.trivium.network:1317/'
]

for url in test_urls:
    try:
        client = Secret(node_url=url)
        models = client.get_models()
        print(f"✅ Working URL: {url}")
        break
    except Exception as e:
        print(f"❌ Failed URL {url}: {e}")
```

**Timeout Configuration**

```python
# Increase timeouts for slow networks
import os
os.environ['SECRET_AI_REQUEST_TIMEOUT'] = '60'
os.environ['SECRET_AI_CONNECT_TIMEOUT'] = '20'
os.environ['SECRET_AI_MAX_RETRIES'] = '5'
```

**Voice Service Issues**

```python
# Check voice service availability
def diagnose_voice_services():
    from secret_ai_sdk.voice_secret import VoiceSecret
    
    try:
        voice = VoiceSecret(
            stt_url="http://localhost:25436",
            tts_url="http://localhost:25435"
        )
        
        # Test individual services
        services = {
            'STT': voice.check_stt_health,
            'TTS': voice.check_tts_health
        }
        
        for name, check_func in services.items():
            try:
                status = check_func()
                print(f"{name}: {'✅ Available' if status else '❌ Unavailable'}")
            except Exception as e:
                print(f"{name}: ❌ Error - {e}")
    
    except Exception as e:
        print(f"Voice client initialization failed: {e}")

diagnose_voice_services()
```
