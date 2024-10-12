from questions import convert_questions_to_preprompt

def test_convert_question():
    test_input = [
        {
            "question": "Tell me about yourself.",
            "answer": "yadyadyada"
        }
    ]

    print(convert_questions_to_preprompt(test_input))

if __name__ == '__main__':
    test_convert_question()