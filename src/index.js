document.addEventListener('DOMContentLoaded', function () {
  // Define the base URL for the API
  const baseURL = 'http://localhost:3000';

  
  // Function to get movie details and update the webpage
  function getMovieDetails(movieId) {
    // Make a GET request to fetch details of the selected movie
    fetch(`${baseURL}/films/${movieId}`)
      .then((response) => response.json())
      .then((movieData) => {
        // Calculate available tickets by subtracting sold tickets from total capacity
        const availableTickets = movieData.capacity - movieData.tickets_sold;

        // Update the webpage with movie details
        updateMovieDetails(movieData, availableTickets);
      })
      .catch((error) => console.error('Error fetching movie details:', error));
  }

  // Function to update the webpage with movie details
  function updateMovieDetails(movieData, availableTickets) {
    // Get HTML elements by their IDs
    const poster = document.getElementById('poster');
    const title = document.getElementById('title');
    const runtime = document.getElementById('runtime');
    const showtime = document.getElementById('showtime');
    const filmInfo = document.getElementById('film-info');
    const ticketNum = document.getElementById('ticket-num');

    // Update the elements with movie data
    poster.src = movieData.poster;
    title.textContent = movieData.title;
    runtime.textContent = `${movieData.runtime} minutes`;
    showtime.textContent = movieData.showtime;
    filmInfo.textContent = movieData.description;
    ticketNum.textContent = availableTickets;
  }

  // Function to fetch all movies and display them in the menu
  function fetchAndPopulateMovies() {
    // Make a GET request to fetch a list of all movies
    fetch(`${baseURL}/films`)
      .then((response) => response.json())
      .then((moviesData) => {
        // Get the movie list element and remove any placeholder
        const filmsList = document.getElementById('films');
        const placeholderLi = document.querySelector('#films .film.item');

        if (placeholderLi) {
          placeholderLi.remove();
        }

        // Create list items for each movie and add them to the menu
        moviesData.forEach((movie) => {
          const li = document.createElement('li');
          li.className = 'film item';
          li.textContent = movie.title;

          //Bonus Deliverable
          // Add a click event listener for each movie item
          li.addEventListener('click', () => {
            getMovieDetails(movie.id); // Handle click event to show movie details
          });

          filmsList.appendChild(li);
        });
      })
      .catch((error) => console.error('Error fetching movie list:', error));
  }

  // Handle the "Buy Ticket" button click
  const buyTicketButton = document.getElementById('buy-ticket');
  buyTicketButton.addEventListener('click', function () {
    // Make a request to "buy" a ticket for the first movie
    fetch(`${baseURL}/films/1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tickets_sold: 1 }), // Buy 1 ticket
    })
      .then((response) => {
        if (response.ok) {
          // Update available ticket count after a successful purchase
          getMovieDetails(1); // Show updated ticket count
        } else {
          console.error('Error buying ticket');
        }
      })
      .catch((error) => console.error('Error buying ticket:', error));
  });

  // Initial actions when the page loads
  getMovieDetails(1); // Fetch and display movie details for the first movie
  fetchAndPopulateMovies(); // Fetch and populate the movie list
});
