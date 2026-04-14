const display = document.querySelector("#display");
const prompt = document.querySelector("#prompt");
const movieDetail = document.querySelector(".movie-detail");
const detailContent = document.querySelector(".movie-detail div");
const tmdb = 'https://api.themoviedb.org/3';
const tmdbKey = 'api_key=a709703cef728f1933407c8170e42f0b';
const tmdbImage = 'https://image.tmdb.org/t/p/w500';
const omdb = 'http://www.omdbapi.com/?';
const omdbKey = 'apikey=16a8d8ce';
const addButton = document.querySelector("#add");
const removeButton = document.querySelector("#remove");

movieList();

async function movieList() {
    prompt.textContent = 'Your Movie List';

    const movies = JSON.parse(localStorage.getItem("movieList"));
    if (movies) {
        displayMovies(movies);
    } else {
        prompt.textContent = 'Your List Is Empty';
    }
};

document.querySelector("#search-bar").addEventListener("keydown", async(event) => {
    if (event.key === "Enter") {
        search();
    }
});

async function search() {
    const query = document.querySelector("#search-bar").value.trim();
    if (!query) {
        return;
    }

    prompt.textContent = `Showing results for "${query}"`;

    try {
        let data = await fetchUrl(tmdb+'/search/movie?'+tmdbKey+`&query=${query}`);
        let movies = data.results;
        // console.log(movies); // for testing
        localStorage.setItem("movies", JSON.stringify(movies));

        displayMovies(movies);
    } catch (error) {
        console.error(error);
    }
};

function displayMovies(movies) {
    display.innerHTML = "";

    if (movies && movies.length > 0) {
        movies.forEach(movie => {
            let card = document.createElement('section');
            card.className = 'result-card';
            card.dataset.id = movie.id;

            card.innerHTML = `
            <h2>${movie.title}</h2>
            <a href="#">
                <img src="${tmdbImage + movie.poster_path}" alt="${movie.title}" width=300 loading=lazy>
            </a>
            `;
            display.appendChild(card);
        });
    }
    else {
        prompt.textContent = "No results found";
    }
};

async function fetchUrl(url) {
    const response = await fetch(url);
    let data = await response.json();
    return data;
};

display.addEventListener("click", (event) => {
    if (event.target.matches(".result-card img")) {
        const card = event.target.closest(".result-card");

        const movieId = card.dataset.id;
        const movies = JSON.parse(localStorage.getItem("movies"));
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
        });

        removeButton.addEventListener("click", () => {
            list = list.filter(m => m.id !== movie.id);
            localStorage.setItem("movieList", JSON.stringify(list));
            removeButton.style.display = 'none';
            addButton.style.display = 'inline-block';
        });

    } catch (error) {
        console.error(error);
    }
}

document.querySelector("#close-detail").addEventListener("click", () => {
    movieDetail.close();
});