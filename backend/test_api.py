import requests
import json

# Define the API endpoint and the data payload
url = "http://localhost:5000/generate_question"
data = {
    "list_of_questions": [
    ]
}

# Send the POST request
response = requests.post(url, headers={"Content-Type": "application/json"}, data=json.dumps(data), stream=True)

# Check the response status code
if response.status_code == 200:
    # Stream the response content as it comes in
    for line in response.iter_lines():
        if line:
            print(line.decode('utf-8'))
else:
    print(f"Request failed with status code {response.status_code}")