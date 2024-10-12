from typing import Literal

question_with_response_type = dict[Literal["question" | "response"], str]
preprompt_type = dict[Literal["user" | "assistant"], str]

def convert_questions_to_preprompt(question_response: list[question_with_response_type]) -> list[preprompt_type]:
    pass
