const result = document.querySelector("#search-result");
const prompt = document.querySelector("#prompt");
const movieDetail = document.querySelector(".movie-detail");
const detailContent = document.querySelector(".movie-detail div");
let movies = [];

document.querySelector("#search-bar").addEventListener("keydown", async(event) => {
    if (event.key === "Enter") {
        await search();
    }
});

async function search() {
    const query = document.querySelector("#search-bar").value.trim();
    if (!query) {
        return;
    }

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNzA5NzAzY2VmNzI4ZjE5MzM0MDdjODE3MGU0MmYwYiIsIm5iZiI6MTc3NjA4NDEwNi44MjUsInN1YiI6IjY5ZGNlNDhhZjZhNzRlMDY5ZTcwYWU2YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.d8woQOGNd0A1_6Zge4Y-OIuQfTz0A73DZScs3tDVWog'
        }
    };

    try {
        const response = await fetch(url, options);
        let data = await response.json();
        movies = data.results;
        console.log(movies);

        prompt.textContent = `Showing results of "${query}"`;
        result.innerHTML = "";
        
        const image = 'https://image.tmdb.org/t/p/w500';

        if (movies && movies.length > 0) {
            movies.forEach(movie => {
                let card = document.createElement('section');
                card.className = 'result-card';
                card.dataset.id = movie.id;

                card.innerHTML = `
                <h2>${movie.title}</h2>
                <a href="#">
                    <img src="${image + movie.poster_path}" alt="${movie.title}" width=300 loading=lazy>
                </a>
                `;
            result.appendChild(card);
            });
        }
        else {
            prompt.textContent = "No results found";
        }
    } catch (error) {
        console.error(error);
    }
};

result.addEventListener("click", (event) => {
    if (event.target.matches(".result-card img")) {
        const card = event.target.closest(".result-card");
        const movieId = card.dataset.id;
        const movie = movies.find(m => m.id == movieId);

        if (movie) {
            detailContent.innerHTML = `
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date}</p>
            <p>Overview: ${movie.overview}</p>
            `;

            movieDetail.showModal();
        }
    }
});

document.querySelector("#close-detail").addEventListener("click", () => {
    movieDetail.close();
});