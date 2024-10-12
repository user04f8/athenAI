from typing import Literal
from dotenv import load_dotenv
import openai
import os
from flask import Flask, Response, request

from prompts import QuestionPrompts
from questions import convert_questions_to_preprompt

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

client = openai.OpenAI()

app = Flask(__name__)

@app.route('/generate_question', methods=['POST'])
def generate_question():
    """
    Endpoint to handle POST requests for OpenAI completion generation.
    Expects JSON with TODO: define input type
    """
    data = request.get_json()

    # Stream the output as text/event-stream
    return Response(client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": QuestionPrompts.SYSTEM_PROMPT
            }
            *convert_questions_to_preprompt(data['list_of_questions'])
        ],
        max_tokens=10,
    ), mimetype='text/event-stream')

# TODO define API