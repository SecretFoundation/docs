# Running the Application

### Understanding the application

Before you run [secret\_ai\_getting\_started.py](https://github.com/SecretFoundation/secret-ai-getting-started), let's examine the code.&#x20;

1\. **Importing the Required Modules**

```python
from secret_ai_sdk.secret_ai import ChatSecret
from secret_ai_sdk.secret import Secret
```

* **`ChatSecret`**: Handles communication with the LLM, such as sending messages and receiving responses.
* **`Secret`**: Manages secure access to LLM models and provides metadata about available models.

2\. **Initializing the Secret Client**

```python
secret_client = Secret()
```

* Creates an instance of `Secret`, which is used to interact with the Secret backend to fetch available LLM models and their connection details.

3\. **Fetching Models and URLs**

```python
models = secret_client.get_models()
urls = secret_client.get_urls(model=models[0])
```

* **`get_models()`**: Retrieves a list of all LLM models registered with the backend.
* **`get_urls(model=models[0])`**: For the first model in the list (`models[0]`), fetches a list of instance URLs where the model can be accessed.

#### 4. **Setting Up the LLM Client**

```python
secret_ai_llm = ChatSecret(
    base_url=urls[0], 
    model=models[0]', 
    temperature=1.0
)
```

* **`base_url=urls[0]`**: Specifies the first URL in the list as the endpoint to connect to the LLM.
* **`model=models[0]`**: Specifies the model to use (e.g., Llama or Deepseek, etc).
* **`temperature=1.0`**: Configures the "creativity" of the model's responses. Higher values produce more varied outputs, while lower values make responses more deterministic.

#### 5. **Defining the Chat Messages**

```python
messages = [
    ("system", "You are my therapist. Help me with my issues."),
    ("human", "I miss my cat."),
]
```

* Messages are defined as a list of tuples:
  * **`("system", ...)`**: Instructions for the model about its role (e.g., "therapist").
  * **`("human", ...)`**: A message from the user (e.g., expressing sadness about missing their cat).

#### 6. **Invoking the Model**

```python
response = secret_ai_llm.invoke(messages, stream=False)
```

* **`invoke(messages, stream=False)`**: Sends the messages to the LLM for processing.
* **`messages`**: The list of chat messages.
* **`stream=False`**: Indicates that the response should be returned all at once rather than streamed in parts.

### Manually Setting Up `node_url`

If you experience issues with the default `node_url` (`SECRET_NODE_URL_DEFAULT` config variable), instead of declaring the client like this:

```python
secret_client = Secret()
```

you can manually specify a `node_url` when instantiating the `Secret` client:

```python
from secret_ai_sdk.secret import Secret

secret_client = Secret(chain_id='pulsar-3', node_url=<LCD_NODE_URL>)
```

Alternatively, you can set the `node_url` via an environment variable:

```bash
export SECRET_NODE_URL=<LCD_NODE_URL>
```

For more details on available endpoints and a list of LCD nodes, refer to the official Secret Network documentation: [Connecting to the Network - Testnet Pulsar-3](https://docs.scrt.network/secret-network-documentation/development/resources-api-contract-addresses/connecting-to-the-network/testnet-pulsar-3)

### Run the application

To run the sample application:

```bash
python secret_ai_getting_started.py
```

Upon successful installation, you should see a response:&#x20;

{% code overflow="wrap" %}
```
It's completely normal to feel a deep sense of loss and longing when we're separated from our beloved pets, especially ones as special as cats.

Was it a recent separation, or is this a lingering feeling you've been carrying around for a while?
```
{% endcode %}

### Conclusion

Congrats on your first integration with Secret AI SDK! :tada:

The Secret AI SDK provides developers with an early glimpse into integrating confidential LLMs, enabling secure and innovative applications. As a developer preview, it is designed for testing and exploration, not production use. Feedback is encouraged to help refine the SDK for future releases.&#x20;

Join the [Secret Network Community Developers](../../overview-ecosystem-and-technology/secret-network-overview/) group on Telegram to share feedback and get code assistance :smile:
