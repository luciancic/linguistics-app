from flask import Flask, request
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'
    
@app.route('/audio', methods=['POST'])
def audio():
    with open('audio.mp4', 'wb') as file:
        file.write(request.data)
    return 'Wrote to file!'

# if __name__ == '__main__':
app.run(debug=True)
