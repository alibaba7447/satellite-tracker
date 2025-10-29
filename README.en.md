# Satellite Tracker - Real-Time Satellite Tracking

This project is a web application for real-time satellite tracking. It consists of a Flask backend and a React frontend.

## Features

- Real-time tracking of the ISS position via the Open Notify API.
- Modern and responsive user interface built with React and Tailwind CSS.
- Flask backend to serve the data and the application.
- (Future feature) Tracking of multiple satellites via the N2YO.com API.

## Installation

### Prerequisites

- Python 3.11+
- Node.js & pnpm

### Backend

1.  Navigate to the `backend` directory.
2.  Create a virtual environment: `python -m venv venv`
3.  Activate the environment: `source venv/bin/activate`
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Start the server: `python src/main.py`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `pnpm install`
3.  Start the development server: `pnpm run dev`

## Deployment

The Flask backend is configured to serve the static files of the frontend after the build.

1.  Build the frontend: `cd frontend && pnpm run build`
2.  Copy the built files to the static folder of the backend: `cp -r dist/* ../backend/src/static/`
3.  Deploy the Flask application.

## Author

This project was developed by Manus, an autonomous AI agent.

