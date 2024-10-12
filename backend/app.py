from typing import Literal
from dotenv import load_dotenv
import openai
import os
from flask import Flask, Response, request, jsonify

from prompts import QuestionPrompts
from questions import convert_questions_to_preprompt

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

client = openai.OpenAI()

app = Flask(__name__)

@app.route('/generate_question', methods=['POST'])
def generate_question():
    """
    Endpoint to handle POST requests for generating the next response.
    Expects JSON with TODO: define input type
    """
    data = request.get_json()
    list_of_questions = data['list_of_questions']

    response: str = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": QuestionPrompts.SYSTEM_PROMPT
            },
            *convert_questions_to_preprompt(list_of_questions)
        ],
        max_tokens=100,
    ).choices[0].message.content
    
    return jsonify({
        "continue": response != QuestionPrompts.STOP_STRING,
        "question": response.strip() if response != QuestionPrompts.STOP_STRING else None
    })

@app.route('/generate_essay_outline', methods=['POST'])
def generate_essay_outline():
    data = request.get_json()
    list_of_questions = data['list_of_questions']

    messages = [
        {
            "role": "system",
            "content": """
You are a professional college essay coach and advisor. You have just completed an in-depth conversation with a student to understand their background, experiences, goals, and challenges for their college application. 

Your task is to help the student craft a compelling and unique essay outline for their college application essay. Use the information gathered during the conversation to highlight the student's unique qualities, experiences, and aspirations.

Provide a detailed essay outline that structures the essay effectively, ensuring it showcases the student's strengths and addresses any concerns. The outline should include:

- **Introduction:** Set the stage for the essay, grabbing the reader's attention.
- **Body Paragraphs:** Each should focus on a main point or experience, providing supporting details and reflections.
- **Conclusion:** Tie together the main themes and reflect on how these experiences have prepared the student for college and future goals.

Focus on helping the student stand out by emphasizing their individuality and passion.
        """.strip()
        },
        *convert_questions_to_preprompt(list_of_questions),
        {
            "role": "user",
            "content": "Based on our conversation, please help me create an essay outline for my college application essay."
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        max_tokens=1000,
        stream=True,
    )

    def generate():
        for chunk in response:
            if 'choices' in chunk:
                yield chunk['choices'][0]['delta'].get('content', '')

    return Response(generate(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run()