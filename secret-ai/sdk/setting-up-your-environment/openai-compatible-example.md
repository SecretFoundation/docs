# OpenAI-Compatible Example

**OpenAI-Compatible Example**

```python
from openai import OpenAI
import os
from secret_ai_sdk.secret_ai import ChatSecret
from secret_ai_sdk.secret import Secret

# Initialize client & get models
secret_client = Secret()
models = secret_client.get_models()
base_url = secret_client.get_urls(model=models[0])

# Point OpenAI client to Secret AI via Ollama
client = OpenAI(
    base_url=base_url,
    api_key=os.getenv("SECRET_AI_API_KEY")  # enforced by SecretAI
)

response = client.chat.completions.create(
    model="llama3.1",
    messages=[
        {"role": "system", "content": "You are a weather assistant."},
        {"role": "user", "content": "What's the weather in Paris today?"}
    ],
    tools=[
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get current weather for a location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string", "description": "City name"}
                    },
                    "required": ["location"]
                }
            }
        }
    ]
)

print(response.choices[0].message)
```
