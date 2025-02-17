import os
import subprocess
import time
import webbrowser
import sys

# Detect OS
is_windows = sys.platform.startswith("win")

# Function to open a new terminal and run a command
def run_command(command, work_dir):
    if is_windows:
        return subprocess.Popen(f'start cmd /k "{command}"', cwd=work_dir, shell=True)
    else:
        return subprocess.Popen(f'gnome-terminal -- bash -c "{command}; exec bash"', cwd=work_dir, shell=True)

# Start Ultralytics (Python API)
print("Starting Ultralytics service...")
ultralytics_process = run_command(r"venv\Scripts\activate && python app/app.py" if is_windows else "source venv/bin/activate && python app/app.py", "./ultralytics")



# Start Server
print("Starting Node.js server...")
server_process = run_command("npm run dev", "./server")

# Start Client
print("Starting React client...")
client_process = run_command("npm run dev", "./client")

# Wait for the client to be ready
time.sleep(5)  # Give it time to start

# Open the browser automatically
web_url = "http://localhost:5173/luntian/"
print(f"Opening {web_url} in browser...")
webbrowser.open(web_url)

print("All services started successfully.")
