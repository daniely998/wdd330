import {prompt, tmdb, tmdbKey, fetchUrl, displayMovies} from "./main.js";

popular();

async function popular() {
    prompt.textContent = 'Popular Movies';

    try {
        let data = await fetchUrl(tmdb+'/movie/popular?'+tmdbKey);
        let movies = data.results;

        localStorage.setItem("movies", JSON.stringify(movies));
        console.log(movies); // for testing

        displayMovies(movies);
    } catch (error) {
        console.error(error);
    }
};