import openai

from dotenv import load_dotenv
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

client = openai.OpenAI()

SYSTEM_PREPROMPT_BASE = \
"""
You are a helpful assistant.
"""

def generate_prompt():
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PREPROMPT_BASE,
            },
            {
                "role": "user",
                "content": "Help me!! How do I write a Python script to generate prime numbers??",
            },
        ],
        max_tokens=100
    )

    return completion.choices[0].message.content

print(generate_prompt())
