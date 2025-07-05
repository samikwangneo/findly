# Findly ✨

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge"/>
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask Badge"/>
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI Badge"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python Badge"/>
</p>

<p align="center">
  A smart lost-and-found web application for the UMD campus, designed to reconnect owners with their lost items through text, location, and cutting-edge image recognition.
</p>

## 🌟 Key Features

* **Smart Search:** Instantly query items using text descriptions or location filters.
* **Visual Search:** Harness the power of AI to find your items! Upload an image of what you've lost, and Findly will search for visually similar items.
* **Intuitive Interface:** A clean, modern, and responsive UI built with React.js for a seamless user experience.
* **Robust Backend:** Powered by a lightweight and efficient Flask server.
* **AI-Powered Classification:** Utilizes OpenAI's CLIP model to understand and categorize images with high accuracy.

## ⚙️ How It Works

When a user submits a found item with an image, the backend uses the **OpenAI CLIP model** to generate a unique numerical representation (a vector embedding) of that image. When another user searches for a lost item by uploading a picture, Findly generates a new vector embedding for that image and compares it against the embeddings stored in the database. By calculating the similarity between these vectors, the application can pinpoint the most likely matches, making the process of finding lost items faster and more intuitive than ever.

## 🛠️ Tech Stack

| Category      | Technology                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend** | `React.js`, `JavaScript`, `HTML5`, `CSS3`                                                                     |
| **Backend** | `Flask`, `Python`                                                                                           |
| **AI/ML** | `OpenAI CLIP Model`                                                                                         |
| **Package Manager** | `npm`                                                                                                   |
| **Version Control** | `Git` & `GitHub`                                                                                        |


## 🚀 Getting Started

Follow these instructions to get a local copy of Findly up and running on your machine for development and testing purposes.

### Prerequisites

* Node.js and npm installed: [https://nodejs.org/](https://nodejs.org/)
* Python and pip installed: [https://www.python.org/](https://www.python.org/)
* Git installed: [https://git-scm.com/](https://git-scm.com/)

### Installation & Running

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/samikwangneo/Findly.git](https://github.com/samikwangneo/Findly.git)
    cd Findly
    ```

2.  **Set up the Backend (Flask Server):**
    * Navigate to the backend directory.
        ```sh
        cd lost-found-backend
        ```
    * Create a virtual environment (recommended).
        ```sh
        # For macOS/Linux
        python3 -m venv venv
        source venv/bin/activate

        # For Windows
        python -m venv venv
        .\venv\Scripts\activate
        ```
    * Install the required Python packages. *(Note: You may need to create a `requirements.txt` file by running `pip freeze > requirements.txt` in your original project environment).*
        ```sh
        pip install Flask Pillow scikit-learn torch torchvision transformers
        ```
    * Run the Flask server.
        ```sh
        flask run
        ```
    * The backend will now be running on `http://127.0.0.1:5000`.

3.  **Set up the Frontend (React App):**
    * Open a new terminal window and navigate to the project's root directory.
    * Go to the frontend directory.
        ```sh
        cd lost-found-frontend
        ```
    * Install the necessary npm packages.
        ```sh
        npm install
        ```
    * Start the React development server.
        ```sh
        npm start
        ```
    * The frontend application will open and run on `http://localhost:3000`.

You should now have the Findly application running locally on your machine!

## 🔮 Future Development

* [ ] Implement real-time notifications for new item matches.
* [ ] Integrate an interactive map for precise location tagging.
* [ ] Develop user authentication and profiles to manage listings.
* [ ] Containerize the application using Docker for easier deployment.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

To contribute:
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

---
<p align="center">
Developed by samikwangneo
</p>
