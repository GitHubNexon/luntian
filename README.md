# 🌱 LUNTIAN - AI-Powered Plant Disease Detection

Luntian is an AI-powered plant disease detection system designed to assist farmers and plant enthusiasts in identifying plant diseases with high accuracy. Leveraging deep learning models, this project integrates a **React.js frontend**, a **Node.js backend**, and an **Ultralytics YOLOv8 AI model** for image processing and classification.

---

## 📌 Project Structure

- **Client (Frontend)** - Built with React.js for an intuitive UI/UX.
- **Server (Backend)** - Powered by Node.js & Express for handling API requests.
- **Ultralytics AI Model (YOLOv8)** - Python-based deep learning model for plant disease detection.
- **Database** - MongoDB for structured and efficient data storage.
- **Deployment** - Hosted on **Raspberry Pi 5** for localized AI inference.

---

## 🚀 Installation Guide

### 1️⃣ Setting Up the Client (React.js Frontend)
```sh
cd client
npm install
```

### 2️⃣ Setting Up the Server (Node.js Backend)
```sh
cd server
npm install
```

### 3️⃣ Setting Up Ultralytics (AI Model)
Ensure **Python 3.12+** is installed.
```sh
cd ultralytics
python -m venv venv
```
Activate the virtual environment:
```sh
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```
Then install dependencies:
```sh
pip install ultralytics matplotlib torch droid
pip install -r requirements.txt
```
To verify installed packages:
```sh
pip list
```

---

## ▶️ Running the Project

### 🎨 Running the Client (React.js)
```sh
cd client
npm run dev
```

### 🔧 Running the Server (Node.js)
```sh
cd server
npm run dev
```

### 🧠 Running the YOLOv8 AI Model
```sh
cd app
python app.py
```

---

## 🔑 Environment Variables Configuration

### 📂 Server (`server/.env`)
```env
MONGODB_URI=mongodb://0.0.0.0:27017/luntian
SALT_ROUNDS=10
SECRET_KEY=LUNTIAN_2025
TOKEN_EXPIRATION=30d
```

### 📂 Ultralytics (`ultralytics/app/.env`)
```env
MONGODB_URI=mongodb://127.0.0.1:27017/luntian
SALT_ROUNDS=10
SECRET_KEY=LUNTIAN_2025
TOKEN_EXPIRATION=30d
```

---

## 📦 Database Setup
Ensure MongoDB is installed and running:
```sh
cd mongodump
mongorestore
```

---

## 🛠 Technologies Used
- **Frontend**: React.js ⚛️
- **Backend**: Node.js + Express.js 🖥️
- **AI Model**: Ultralytics + YOLOv8 🤖
- **Database**: MongoDB 🍃
- **Deployment**: Raspberry Pi 5 for local hosting ☁️
- **Data Annotation**: Roboflow for dataset preparation 📏
- **Training**: Google Colab & Jupyter Notebook 📚

---

## 👥 Contributors
- **John Mark Lilio Pulmano** - Lead Developer & Project Manager 🚀
- **Marlon Riños** - Research Analyst & Documentation Specialist 📑
- **Princess Arielle Perez** - UI/UX Designer & Frontend Developer 🎨
- **Ardian Alpino** - Researcher, AI Specialist & Graphics Designer 🧠🖼️
- **Kenneth Suma** - AI Data Annotator & Researcher 🔍

---

## 📜 License
This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Pulmano

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🎯 Future Enhancements
- **Enhance AI Model Accuracy** - Improve dataset quality and fine-tune YOLOv8 for better detection. 🔍
- **User-Friendly Dashboard** - Develop a web-based dashboard for visualization and interaction. 📊
- **Web Based System Integration** - Extend the system for real-time disease detection. 📱
- **Cloud Deployment** - Implement cloud-based inference for scalability. ☁️

---

Happy Coding! 🎉

