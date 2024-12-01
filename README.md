# Streamer 🎥  
**An online streaming platform for managing and displaying movies!**

## 📋 Project Description
This project is a web application designed for video streaming and movie information management. Built with Node.js and Express, it uses MySQL as the database to store movie data. The application allows users to:
- **Stream videos**
- **Add, delete, and edit movies** (protected by JWT authentication)
- **Search and view movie information**
- **Generate embed codes for displaying videos on external websites**

---

## 🚀 Features
1. **Movie Management API:**
   - Retrieve a list of movies
   - View details of a specific movie
   - Add a new movie (requires authentication)
   - Delete a movie (requires authentication)
   - Update movie information (requires authentication)

2. **Video Streaming:**
   - Stream videos with support for "Range Requests" to enhance playback performance

3. **Authentication:**
   - JWT-based authentication for protecting sensitive endpoints

4. **Embed Code:**
   - Generate HTML embed code to display videos on external websites

---

## 📁 Project Structure
```
Streamer/
├── public/                 # Public files (CSS, HTML)
├── img/                    # Image directory
├── videos/                 # Video files (must be created)
├── index.js                # Main server file
├── package.json            # Project details and dependencies
├── README.md               # Project documentation
```

---

## 🛠️ Installation and Setup
Follow these steps to set up the project:

1. Clone the repository:
   ```bash
   git clone https://github.com/Edrisss154/Streamer.git
   cd Streamer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a MySQL database:
   - Create a database named `movies_db`.
   - Update the `index.js` file with your MySQL username and password.

4. Run the server:
   ```bash
   node index.js
   ```

5. Access the application:
   - The server will be available at `http://localhost:3000`.

---

## 🔑 Authentication
For endpoints requiring authentication (e.g., adding, deleting, or editing movies), JWT is used. Obtain a token via the `/api/login` endpoint:
```bash
POST /api/login
{
  "username": "edrisss",
  "password": "12041381"
}
```

---

## 📦 API Endpoints

### 1. **Movie Management**
- **GET /api/movies**  
  Retrieve a list of all movies
- **GET /api/movies/:id**  
  View details of a specific movie
- **POST /api/movies**  
  Add a new movie (requires token)
- **DELETE /api/movies/:id**  
  Delete a movie (requires token)
- **PUT /api/movies/:id**  
  Update movie information (requires token)

### 2. **Video Streaming**
- **GET /api/stream/:id**  
  Stream a video

### 3. **Embed**
- **GET /api/embed/:id**  
  Generate HTML embed code for a video

---

## 🧰 Requirements
- Node.js (v14 or later)
- MySQL
- Modern web browser

---

## 💡 Important Notes
- Video files must be placed in the `videos` folder.
- Alternatively, you can provide a video URL, and it will display as an iframe.
- Replace the `secret_key` in JWT settings with your own secure key.
- Adjust file paths and database configurations as needed.

---

## 👨‍💻 Author
This project was developed by [Edrisss154](https://github.com/Edrisss154). If you have any suggestions or ideas, feel free to share them—I’d love to hear your feedback!

---
