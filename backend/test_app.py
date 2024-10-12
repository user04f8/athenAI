import openai
from flask import Flask, Response, request
from dotenv import load_dotenv
import openai
import os

from prompts import *

# Load environment variables from the .env file
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

client = openai.OpenAI()

app = Flask(__name__)

def generate_openai_stream(prompt):
    """
    Generator function to yield chunks of OpenAI's streamed response.
    """
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT_v0,
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        max_tokens=100,
        stream=True
    )
    for chunk in response:
        # Each chunk is a dictionary containing choices and their text
        yield chunk['choices'][0]['text']

@app.route('/generate', methods=['POST'])
def generate():
    """
    Endpoint to handle POST requests for OpenAI completion generation.
    Expects JSON with a 'prompt' key in the request body.
    """
    data = request.get_json()
    prompt = data.get('prompt', '')

    # Stream the output as text/event-stream
    return Response(generate_openai_stream(prompt), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True)
