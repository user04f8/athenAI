from typing import Literal
from flask import Flask, Response, request
from dotenv import load_dotenv
import openai
# from openai.types import 
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

question_with_response_type = dict[Literal["question" | "response"], str]
preprompt_type = dict[Literal["user" | "assistant"], str]

def convert_questions_to_preprompt(question_response: list[question_with_response_type]) -> list[preprompt_type]:
    pass


def generate_question_from(question_response: list[question_with_response_type]):
    pass


@app.route('/generate_question', methods=['POST'])
def generate_question():
    """
    Endpoint to handle POST requests for OpenAI completion generation.
    Expects JSON with a 'prompt' key in the request body.
    """
    data = request.get_json()
    
    prompt = data.get('prompt', '')

    question = generate_question_from()

    # Stream the output as text/event-stream
    return Response(generate_openai_stream(prompt), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True)
