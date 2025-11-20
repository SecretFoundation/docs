# Performance & Best Practices

### Performance & Best Practices

#### Optimization Tips

1. **Connection Pooling**: Reuse client instances to benefit from connection pooling
2. **Concurrent Requests**: Use async clients for high-throughput applications
3. **Streaming**: Use streaming for long-form content to improve perceived performance
4. **Error Handling**: Implement proper retry logic for production environments
5. **Resource Management**: Use context managers for proper cleanup

#### Production Deployment

```python
import asyncio
from secret_ai_sdk._enhanced_client import EnhancedSecretAIAsyncClient

class ProductionSecretAIService:
    def __init__(self):
        self.client = EnhancedSecretAIAsyncClient(
            host="https://your-ai-endpoint.com",
            api_key="your_api_key",
            timeout=30.0,
            max_retries=3,
            validate_responses=True
        )
    
    async def generate_text(self, messages, **kwargs):
        """Production-ready text generation with error handling"""
        try:
            response = await self.client.chat(
                model=kwargs.get('model', 'default-model'),
                messages=messages,
                stream=kwargs.get('stream', False)
            )
            return response
        except Exception as e:
            # Log error and implement fallback logic
            print(f"Generation failed: {e}")
            raise
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        # Cleanup resources
        if hasattr(self.client, 'close'):
            await self.client.close()

# Usage
async def main():
    async with ProductionSecretAIService() as service:
        response = await service.generate_text([
            {"role": "user", "content": "Generate a summary of quantum computing"}
        ])
        print(response)

# Run
asyncio.run(main())
```
