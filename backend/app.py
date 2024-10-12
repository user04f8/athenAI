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

Provide a detailed essay outline that structures the essay effectively, ensuring it showcases the student's strengths and addresses any concerns.

Focus on helping the student stand out by emphasizing their individuality and passion.
        """.strip()
        },
        *convert_questions_to_preprompt(list_of_questions),
        {
            "role": "user",
            "content": "Based on our conversation, please help me create an essay outline for my college application essay answering the below quesiton: \n\n"
                       "\"Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.\""
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
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    return Response(generate(), mimetype='text/event-stream')

@app.route('/essay_feedback', methods=['POST'])
def essay_feedback():
    data = request.get_json()
    list_of_questions = data['list_of_questions']
    essay = data['essay']

    messages = [
        {
            "role": "system",
            "content": """
You are a professional college essay coach and advisor. You have just completed an in-depth conversation with a student to understand their background, experiences, goals, and challenges for their college application. 

Your task is to help the student craft a compelling and unique essay outline for their college application essay. Use the information gathered during the conversation to highlight the student's unique qualities, experiences, and aspirations.

Focus on helping the student stand out by emphasizing their individuality and passion.

You should provide the feedback by repeating the essay verbatim and interspersing feedback inside of angle brackets < like this > and ending with a summary of feedback.

        """.strip()
        },
        *convert_questions_to_preprompt(list_of_questions),
        {
            "role": "user",
            "content": "Based on our conversation, please help me refine my essay outline for my college application essay answering the below quesiton: \n\n"
                       "\"Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.\""
                       + "\n\n" +
                       essay
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
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    return Response(generate(), mimetype='text/event-stream')


if __name__ == '__main__':
    app.run(debug=True)