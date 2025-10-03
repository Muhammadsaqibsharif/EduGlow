from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from mistralai import Mistral

from dotenv import load_dotenv
import os

load_dotenv()
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
client = Mistral(api_key=MISTRAL_API_KEY)

app = FastAPI()

class QuizRequest(BaseModel):
    topic: str
    difficulty: str = "medium"

@app.post("/generate-quiz")
async def generate_quiz(request: QuizRequest):
    prompt = (
        f"Create a {request.difficulty} level multiple-choice quiz on the topic '{request.topic}'. "
        "Include 3 questions, each with 4 options, and mark the correct answer."
)

    try:
        response = client.chat(
            model="mistral-7b-instruct",
            messages=[{"role": "user", "content": prompt}]
)
        quiz = response.choices[0].message["content"]
        return {"quiz": quiz}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
