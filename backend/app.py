from typing import Literal
from dotenv import load_dotenv
import openai
import os
from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import sys

from prompts import QuestionPrompts
from questions import convert_questions_to_preprompt

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

client = openai.OpenAI()

app = Flask(__name__)
CORS(app)
# NOTE: for security eventually should do resources={r"/generate_question": {"origins": "http://localhost:3000"}} etc.

@app.route('/generate_question', methods=['POST'])
def generate_question():
    """
    Endpoint to handle POST requests for generating the next response.
    """
    data = request.get_json()
    list_of_questions = data['list_of_questions']

    print(list_of_questions, file=sys.stdout, flush=True)

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
    list_of_questions = data.get('list_of_questions')
    essay = data['essay']
    essay_prompt = data['essay_prompt']

    messages = [
        {
            "role": "system",
            "content": f"""
You are AthenaPrep, a professional college essay coach and advisor.

You are an AI assistant designed to provide detailed feedback on essays. When given an essay, you will analyze each block of text and provide constructive feedback in the following format:

< Text from the original essay | feedback on this block of text >

Your feedback should focus on content, structure, clarity, style, grammar, and how effectively the text addresses the prompt. Be specific in your suggestions for improvement.



As an example, for the following input essay:

"I have always been fascinated by the stars. Ever since I was a child, I would spend nights gazing up at the sky, wondering what lies beyond our planet. This curiosity led me to join the astronomy club in high school, where I learned to operate telescopes and analyze celestial events. My passion for astronomy is not just a hobby; it's a significant part of who I am."

You should return:

< I have always been fascinated by the stars. | This is a strong opening that immediately introduces your passion. Consider adding a vivid anecdote to draw the reader in even more. >

< Ever since I was a child, I would spend nights gazing up at the sky, wondering what lies beyond our planet. | Good continuation that adds depth. Describing specific memories or feelings during these stargazing moments could enhance the emotional connection. >

< This curiosity led me to join the astronomy club in high school, where I learned to operate telescopes and analyze celestial events. | This shows active pursuit of your interest. You might include a particular event or discovery that was significant to you to illustrate your experiences. >

< My passion for astronomy is not just a hobby; it's a significant part of who I am. | A strong concluding statement that ties back to the prompt. Elaborating on how this passion influences your future goals or worldview could strengthen your essay further. >

        """.strip() + ("Here is a transcript of the initial conversation between the advisor and the student:" if list_of_questions else "")
        },
        *(convert_questions_to_preprompt(list_of_questions) if list_of_questions else ()),
        {
            "role": "user",
            "content": "Based on our conversation, please help me refine my essay outline for my college application essay answering the below question: \n\n"
                       f'"{essay_prompt}"\n\n{essay}'
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