import requests
from questions import convert_questions_to_preprompt

def test_convert_question():
    test_input = [
        {
            "question": "Tell me about yourself.",
            "answer": "yadyadyada"
        }
    ]

    print(convert_questions_to_preprompt(test_input))

def test_generate_essay_outline():
    url = 'http://127.0.0.1:5000/generate_essay_outline'  # Update with your server URL if different
    data = {
        'list_of_questions': ['What are your strengths?', 'Describe a challenge you faced.']  # Example input data
    }

    # Make a POST request to the endpoint and stream the response
    response = requests.post(url, json=data, stream=True)

    # Check for successful request
    if response.status_code == 200:
        print("Streaming response:")
        for chunk in response.iter_content(chunk_size=None):
            if chunk:
                print(chunk.decode('utf-8'), end='')  # Decode and print each chunk
    else:
        print(f"Request failed with status code: {response.status_code}")

# Run the test
test_generate_essay_outline()


if __name__ == '__main__':
    test_convert_question()

