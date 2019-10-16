from os import path
import os
from flask import Flask, request
import speech_recognition as sr

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'
    
@app.route('/audio', methods=['POST'])
def audio():
    with open('audio.mp4', 'wb') as file:
        file.write(request.data)
    r = sr.Recognizer()
    os.system('ffmpeg -i audio.mp4 audio.wav')
    with sr.AudioFile('audio.wav') as source:
        audio = r.record(source)
    text = r.recognize_google(audio, language='fr-FR') 
    os.remove('audio.mp4')
    os.remove('audio.wav')
    return text

@app.route('/text', methods=['POST'])
def text():
    return 'hello world'

# if __name__ == '__main__':
app.run(debug=True)
