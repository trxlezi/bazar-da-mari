from flask import Flask
from flask_cors import CORS
from config import Config
from routes import init_routes

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

init_routes(app)

if __name__ == '__main__':
    app.run(port=5000)
