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
You are AthenaPrep, a professional college essay coach and advisor. You have just completed an in-depth conversation with a student to understand their background, experiences, goals, and challenges for their college application. 

Your task is to help the student craft a compelling and unique essay for their college application essay. Use the information gathered during the conversation to highlight the student's unique qualities, experiences, and aspirations. Focus on helping the student stand out by emphasizing their individuality and passion.

- You will receive an essay written by the student, along with the associated prompt, and your role is to provide detailed feedback by adding comments without changing the original text.
{'- Additionally, you will receive a transcript of a conversation the student had with a college admissions officer, which you should use to inform your feedback.' if list_of_questions else '' }
- Provide all feedback within angle brackets: < example feedback here >.
- Do not rewrite or rephrase any part of the essay. Any suggestions for changes must be provided as comments next to the relevant sections.
- Focus your feedback on both grammatical accuracy and content relevance. Identify issues with sentence clarity, coherence, and structure, but prioritize ensuring that the essay aligns with the prompt and the student's goals.
- After inserting your comments, provide a final overall commentary at the end of the essay, enclosed in braces: {{Insert final commentary here}}.
- The final commentary should summarize the key areas for improvement, overall themes, and strengths or weaknesses of the essay.
- Here's an example of the expected formatting:

  Original essay:  
  "Pretend this is a short essay."

  Formatted with feedback:  
  "Pretend this <comment1> is a short <comment2> essay. {{commentary}}"

- The primary focus should be on helping the student create a compelling, thematic, and relevant narrative that would appeal to a college admissions officer.
- Maintain a constructive and encouraging tone throughout the feedback, guiding the student toward improving their essay.

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