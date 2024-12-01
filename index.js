const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path'); 
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(express.static('img'));



const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'دسترسی غیرمجاز. لطفاً لاگین کنید.' });
  }

  jwt.verify(token, 'secret_key', (err, user) => { // از کلید امن خودتان استفاده کنید
    if (err) {
      return res.status(403).json({ message: 'توکن نامعتبر است.' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
// اتصال به دیتابیس MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // نام کاربری MySQL
  password: '', // رمز عبور MySQL 
  database: 'movies_db', // نام دیتابیس
});

db.connect((err) => {
  if (err) {
    console.error('خطا در اتصال به دیتابیس:', err.message);
    return;
  }
  console.log('اتصال موفق به دیتابیس MySQL برقرار شد.');
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    imdbRating FLOAT,
    genre VARCHAR(255),
    imageUrl VARCHAR(255), -- لینک تصویر
    videoUrl VARCHAR(255) -- نام فایل ویدیو در سرور
  )
`;

db.query(createTableQuery, (err) => {
  if (err) console.error('خطا در ایجاد جدول:', err.message);
  else console.log('جدول movies با موفقیت ایجاد شد.');
});

app.get('/api/movies', (req, res) => {
 
  const query = 'SELECT * FROM movies';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'خطایی رخ داد.', error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/api/movies', authenticateToken, (req, res) => {
  const { title, description, imdbRating, genre, imageUrl, videoUrl } = req.body;

  const query = `
    INSERT INTO movies (title, description, imdbRating, genre, imageUrl, videoUrl)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [title, description, imdbRating, genre, imageUrl, videoUrl];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'خطایی رخ داد.', error: err.message });
    } else {
      res.status(201).json({ message: 'فیلم با موفقیت اضافه شد.', movieId: results.insertId });
    }
  });
  
});
app.post('/api/login', (req, res) => {
  
  const { username, password } = req.body;

  if (username === 'edrisss' && password === '12041381') {
      const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
      return res.status(200).json({ token });
      
  } else {
      return res.status(401).json({ message: 'نام کاربری یا رمز عبور نادرست است.' });
  }
  
});

app.get('/api/stream/:id', (req, res) => {
  const videoPath = path.join(__dirname, 'videos', req.params.id); // مسیر فایل
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ message: 'ویدیو یافت نشد.' });
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.delete('/api/movies/:id', authenticateToken, (req, res) => {
  const movieId = req.params.id;

  const query = 'DELETE FROM movies WHERE id = ?';
  
  db.query(query, [movieId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'خطایی رخ داد در حذف فیلم.', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'فیلم مورد نظر یافت نشد.' });
    }

    res.status(200).json({ message: 'فیلم با موفقیت حذف شد.' });
  });
});

app.put('/api/movies/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, imdbRating, genre, imageUrl, videoUrl } = req.body;

  const query = `
    UPDATE movies
    SET title = ?, description = ?, imdbRating = ?, genre = ?, imageUrl = ?, videoUrl = ?
    WHERE id = ?
  `;
  const values = [title, description, imdbRating, genre, imageUrl, videoUrl, id];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'خطایی در آپدیت فیلم رخ داد.', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'فیلم مورد نظر یافت نشد.' });
    }

    res.status(200).json({ message: 'فیلم با موفقیت به‌روزرسانی شد.' });
  });
});
app.get('/api/movies/:id', (req, res) => {
  const movieId = req.params.id;

  const query = 'SELECT * FROM movies WHERE id = ?';
  
  db.query(query, [movieId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'خطایی در دریافت اطلاعات فیلم رخ داد.', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'فیلم مورد نظر یافت نشد.' });
    }

    res.status(200).json(results[0]);
  });
});



app.get('/api/embed/:id', (req, res) => {
  const movieId = req.params.id;

  const query = 'SELECT videoUrl FROM movies WHERE id = ?';
  db.query(query, [movieId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'خطایی رخ داد.', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'فیلم مورد نظر یافت نشد.' });
    }

    const videoUrl = results[0].videoUrl;
    res.send(`
      <html>
        <body style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: black;">
          <iframe src="${videoUrl}" frameborder="0" allowfullscreen style="width: 80%; height: 80%;"></iframe>
        </body>
      </html>
    `);
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
