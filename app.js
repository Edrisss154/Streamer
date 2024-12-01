document.addEventListener('DOMContentLoaded', async () => {
  const moviesContainer = document.getElementById('movies-container');
  const token = localStorage.getItem('token'); // دریافت توکن از Local Storage

  // دریافت فیلم‌ها از سرور
  const response = await fetch('/api/movies');
  const movies = await response.json();

  // نمایش فیلم‌ها
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';

    movieCard.innerHTML = `
      <img src="${movie.imageUrl}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>IMDB: ${movie.imdbRating}</p>
      <button onclick="playMovie('${movie.videoUrl}')">Watch Now</button>
    `;

    // اگر کاربر وارد شده باشد، دکمه حذف و دکمه ویرایش نمایش داده می‌شود
    if (token) {
      // دکمه حذف
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete Movie';
      deleteButton.onclick = () => deleteMovie(movie.id); // دکمه حذف فیلم
      movieCard.appendChild(deleteButton);

      // دکمه ویرایش
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit Movie';
      editButton.onclick = () => editMovie(movie.id); // دکمه ویرایش فیلم
      movieCard.appendChild(editButton);
    }

    moviesContainer.appendChild(movieCard);
  });
});

// پخش فیلم
function playMovie(videoUrl) {
  window.open(`/api/stream/${videoUrl}`, '_blank');
}

// حذف فیلم
async function deleteMovie(movieId) {
  const token = localStorage.getItem('token'); // دریافت توکن از Local Storage

  if (!token) {
      alert('You must be logged in to delete a movie');
      return;
  }

  try {
      const response = await fetch(`/api/movies/${movieId}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`, // ارسال توکن در هدر Authorization
          }
      });

      const result = await response.json();

      if (response.ok) {
          alert('Movie deleted successfully!');
          location.reload(); // صفحه مجدداً بارگذاری می‌شود تا فیلم حذف شده از لیست ناپدید شود
      } else {
          throw new Error(result.message || 'Failed to delete movie');
      }
  } catch (error) {
      alert('Error: ' + error.message);
  }
}

// ویرایش فیلم
function editMovie(movieId) {
  // باز کردن فرم ویرایش
  const editForm = document.createElement('form');
  editForm.innerHTML = `
    <h3>Edit Movie</h3>
    <label for="title">Title:</label>
    <input type="text" id="title" required><br>
    <label for="description">Description:</label>
    <textarea id="description" required></textarea><br>
    <label for="imdbRating">IMDB Rating:</label>
    <input type="number" id="imdbRating" required><br>
    <label for="genre">Genre:</label>
    <input type="text" id="genre" required><br>
    <label for="imageUrl">Image URL:</label>
    <input type="text" id="imageUrl" required><br>
    <label for="videoUrl">Video URL:</label>
    <input type="text" id="videoUrl" required><br>
    <button type="submit">Save Changes</button>
  `;
  
  // افزودن فرم به صفحه
  const movieCard = document.getElementById(`movie-card-${movieId}`);
  movieCard.innerHTML = ''; // پاک کردن محتوای قبلی
  movieCard.appendChild(editForm);

  // دریافت اطلاعات فیلم از سرور و نمایش آن‌ها در فرم ویرایش
  fetch(`/api/movies/${movieId}`)
    .then(response => response.json())
    .then(movie => {
      document.getElementById('title').value = movie.title;
      document.getElementById('description').value = movie.description;
      document.getElementById('imdbRating').value = movie.imdbRating;
      document.getElementById('genre').value = movie.genre;
      document.getElementById('imageUrl').value = movie.imageUrl;
      document.getElementById('videoUrl').value = movie.videoUrl;
    });

  // ارسال تغییرات به سرور
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedMovie = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      imdbRating: parseFloat(document.getElementById('imdbRating').value),
      genre: document.getElementById('genre').value,
      imageUrl: document.getElementById('imageUrl').value,
      videoUrl: document.getElementById('videoUrl').value,
    };

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to edit a movie');
      return;
    }

    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMovie),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Movie updated successfully!');
        location.reload(); // صفحه مجدداً بارگذاری می‌شود تا تغییرات نمایش داده شوند
      } else {
        throw new Error(result.message || 'Failed to update movie');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}
