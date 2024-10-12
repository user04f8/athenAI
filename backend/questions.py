from typing import Literal

question_with_response_type = dict[Literal["question", "response"], str]
preprompt_type = dict[Literal["role", "content"], str]

MAX_NUM_QUESTIONS = 12

def convert_questions_to_preprompt(question_response: list[question_with_response_type]) -> list[preprompt_type]:
    messages = []
    for i, qa in enumerate(question_response):
        question = qa["question"]
        response = qa["response"]
        messages.append({"role": "assistant", "content": question})
        messages.append({"role": "user", "content": response + f"({MAX_NUM_QUESTIONS - i} question)"})
    return messages