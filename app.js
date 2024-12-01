document.addEventListener('DOMContentLoaded', async () => {
  const moviesContainer = document.getElementById('movies-container');
  const token = localStorage.getItem('token'); 


  const response = await fetch('/api/movies');
  const movies = await response.json();


  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';

    movieCard.innerHTML = `
      <img src="${movie.imageUrl}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>IMDB: ${movie.imdbRating}</p>
      <button onclick="playMovie('${movie.videoUrl}')">Watch Now</button>
    `;

 
    if (token) {
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete Movie';
      deleteButton.onclick = () => deleteMovie(movie.id);
      movieCard.appendChild(deleteButton);

   
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit Movie';
      editButton.onclick = () => editMovie(movie.id); 
      movieCard.appendChild(editButton);
    }

    moviesContainer.appendChild(movieCard);
  });
});


function playMovie(videoUrl) {
  window.open(`/api/stream/${videoUrl}`, '_blank');
}


async function deleteMovie(movieId) {
  const token = localStorage.getItem('token'); 

  if (!token) {
      alert('You must be logged in to delete a movie');
      return;
  }

  try {
      const response = await fetch(`/api/movies/${movieId}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`,
          }
      });

      const result = await response.json();

      if (response.ok) {
          alert('Movie deleted successfully!');
          location.reload();
      } else {
          throw new Error(result.message || 'Failed to delete movie');
      }
  } catch (error) {
      alert('Error: ' + error.message);
  }
}

function editMovie(movieId) {
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
  
  const movieCard = document.getElementById(`movie-card-${movieId}`);
  movieCard.innerHTML = '';
  movieCard.appendChild(editForm);


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
        location.reload();
      } else {
        throw new Error(result.message || 'Failed to update movie');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}
