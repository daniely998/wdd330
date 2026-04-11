document.querySelector("#search-btn").addEventListener("click", async() => {
    const query = document.querySelector("#search-bar").value.trim();

    const url = `https://imdb236.p.rapidapi.com/api/imdb/autocomplete?query=${encodeURIComponent(query)}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '6a2ffddc3emsh801a42a4b4d81bcp1a0b9ajsn596d1019be2e',
            'x-rapidapi-host': 'imdb236.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        const result = document.querySelector("#search-result");
        result.innerHTML = "";

        if (data && data.length > 0) {
            data.forEach(movie => {
                result.innerHTML += `<p>${movie.primaryTitle}</p>`;
            });
        } else {
            result.textContent = "No results found";
        }
    } catch (error) {
        console.error(error);
    }
})