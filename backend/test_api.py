import requests
import json

# Define the API endpoint and the data payload
url = "http://localhost:5000/generate_question"
data = {
    "list_of_questions": [
  {
    "question": "Tell me about yourself.",
    "answer": "Hi, I'm Alex, a high school junior. I'm passionate about computer science and enjoy coding in Python. I’m also involved in my school's robotics team."
  },
  {
    "question": "What are your academic goals after high school?",
    "answer": "I want to major in computer science, focusing on AI and machine learning. I'm aiming to get into a top-tier university and eventually work at a tech company like Google or start my own tech business."
  },
  {
    "question": "What subjects are you currently struggling with, if any?",
    "answer": "Math is a bit challenging for me, especially calculus, but I’m working on improving with the help of online resources and a tutor."
  },
  {
    "question": "Do you participate in any extracurricular activities?",
    "answer": "Yes, I'm part of the robotics team, and I also play soccer. I like how robotics allows me to apply what I learn in class, and soccer helps me stay active and work as part of a team."
  },
  {
    "question": "Have you thought about any specific colleges you'd like to apply to?",
    "answer": "Yes, I’m looking at schools like MIT, Stanford, and Carnegie Mellon because of their strong computer science programs and innovation-driven culture."
  },
  {
    "question": "Do you have a plan to make your application stand out?",
    "answer": "I’m planning to showcase my leadership skills from robotics, as well as a machine learning project I’ve been working on. I’m also trying to develop a strong personal statement that highlights my passion for solving real-world problems through technology."
  },
  {
    "question": "What direction do you want to go with your college essay?",
    "answer": "I want to write about my experience leading the robotics team and how it taught me problem-solving and leadership skills, but I'm also thinking about discussing how I’ve used coding to help local businesses automate their processes."
  },
  {
    "question": "What are you struggling with in your essay right now?",
    "answer": "I'm struggling with making my essay sound unique. I feel like a lot of people have similar experiences with leadership and tech, so I’m not sure how to make mine stand out."
  }
]
}

response = requests.post(url, headers={"Content-Type": "application/json"}, data=json.dumps(data), stream=True)

if response.status_code == 200:
    for line in response.iter_lines():
        if line:
            print(line.decode('utf-8'))
else:
    print(f"Request failed with status code {response.status_code}")

