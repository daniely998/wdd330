import {prompt, displayMovies} from "./main.js";

movieList();

async function movieList() {
    prompt.textContent = 'Your Movie List';

    const movies = JSON.parse(localStorage.getItem("movieList"));
    if (movies && movies.length > 0) {
        displayMovies(movies);
    } else {
        prompt.textContent = 'Your List Is Empty';
    }
};