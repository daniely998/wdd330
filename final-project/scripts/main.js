const display = document.querySelector("#display");
const searchBar = document.querySelector("#search-bar")
export const prompt = document.querySelector("#prompt");

const movieDetail = document.querySelector(".movie-detail");
const detailContent = document.querySelector("#detail-content");
const addButton = document.querySelector("#add");
const removeButton = document.querySelector("#remove");
const closeButton = document.querySelector("#close-detail");
const message = document.querySelector("#message");

export const tmdb = 'https://api.themoviedb.org/3';
export const tmdbKey = 'api_key=a709703cef728f1933407c8170e42f0b';
const tmdbImage = 'https://image.tmdb.org/t/p/w500';
const omdb = 'https://www.omdbapi.com/?';
const omdbKey = 'apikey=16a8d8ce';

// Search function
searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        search();
    }
});

async function search() {
    const query = searchBar.value.trim();
    if (!query) {
        return;
    }

    prompt.textContent = `Showing results for "${query}"`;

    try {
        let data = await fetchUrl(tmdb+'/search/movie?'+tmdbKey+`&query=${query}`);
        let movies = data.results;
        localStorage.setItem("movies", JSON.stringify(movies));

        displayMovies(movies);
    } catch (error) {
        console.error(error);
    }
};

// Display movies
export function displayMovies(movies) {
    display.innerHTML = "";

    if (movies && movies.length > 0) {
        movies.forEach(movie => {
            let card = document.createElement('section');
            card.className = 'movie-card';
            card.dataset.id = movie.id;

            card.innerHTML = `
            <h2>${movie.title}</h2>
            <a href="#">
                <img src="${tmdbImage + movie.poster_path}" alt="${movie.title}" width=300 loading=lazy>
            </a>
            `;
            display.appendChild(card);

            setTimeout(() => {
                card.classList.add("show");
            }, 0);
        });
    }
    else {
        prompt.textContent = "No results found";
    }
};

// Fetch function
export async function fetchUrl(url) {
    const response = await fetch(url);
    let data = await response.json();
    return data;
};

// Click movie + show detail
display.addEventListener("click", (event) => {
    if (event.target.matches(".movie-card img")) {
        const card = event.target.closest(".movie-card");

        const movieId = card.dataset.id;
        let get;
        console.log(window.location.pathname);
        if (window.location.pathname === "/list.html") {
            get = localStorage.getItem("movieList");
        } else {
            get = localStorage.getItem("movies");
        }
        const movies = JSON.parse(get);
        let movie = movies.find(m => m.id == movieId);

        if (movie) {
            getDetails(movie);

            movieDetail.showModal();
        }
    }
});

async function getDetails(movie) {
    try {
        const data = await fetchUrl(tmdb+`/movie/${movie.id}/external_ids?`+tmdbKey);
        const imdbId = data.imdb_id;

        const extra = await fetchUrl(omdb+omdbKey+`&i=${imdbId}`);

        detailContent.innerHTML = `
        <h3>${movie.title}</h3>
        <p>Rated: ${extra.Rated}</p>
        <p>Director: ${extra.Director}</p>
        <p>Starring: ${extra.Actors}</p>
        <p>Release Date: ${movie.release_date}</p>
        <p>Overview: ${movie.overview}</p>
        `;
        
        // Add and Remove from list
        let list = JSON.parse(localStorage.getItem("movieList")) || [];
        if (!list.find(m => m.id === movie.id)) {
            removeButton.style.display = 'none';
            addButton.style.display = 'inline-block';
        } else {
            addButton.style.display = 'none';
            removeButton.style.display = 'inline-block';
        }

        addButton.addEventListener("click", () => {
            list.push(movie);
            localStorage.setItem("movieList", JSON.stringify(list));

            addButton.style.display = 'none';
            removeButton.style.display = 'inline-block';

            showMessage("Movie added to your list", "green");
        });

        removeButton.addEventListener("click", () => {
            list = list.filter(m => m.id !== movie.id);
            localStorage.setItem("movieList", JSON.stringify(list));

            removeButton.style.display = 'none';
            addButton.style.display = 'inline-block';

            showMessage("Movie removed from your list", "red");
        });
    } catch (error) {
        console.error(error);
    }
};

function showMessage(text, color="green") {
    message.textContent = text;
    message.style.background = color;

    message.classList.add("show");

    setTimeout(() => {
        message.classList.remove("show");
    }, 1000);
};

closeButton.addEventListener("click", () => {
    movieDetail.close();
});