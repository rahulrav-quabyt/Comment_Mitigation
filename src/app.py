from flask import Flask, jsonify, request
import subprocess

app = Flask(__name__)

# Endpoint to run the Python script
@app.route('/run-script', methods=['POST'])
def run_script():
    try:
        # Run the Python script
        result = subprocess.run(
            ["python", "analyze_comments.py"],  # Replace with your script name
            capture_output=True,
            text=True
        )
        # Return the script output
        return jsonify({
            "success": True,
            "output": result.stdout,
            "error": result.stderr
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5001)  # Run the Flask app on port 5001