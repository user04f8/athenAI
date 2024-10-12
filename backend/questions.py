from typing import Literal

question_with_response_type = dict[Literal["question", "response"], str]
preprompt_type = dict[Literal["role", "content"], str]

def convert_questions_to_preprompt(question_response: list[question_with_response_type]) -> list[preprompt_type]:
    messages = []
    for qa in question_response:
        question = qa["question"]
        answer = qa["answer"]
        messages.append({"role": "assistant", "content": question})
        messages.append({"role": "user", "content": answer})
    return messages