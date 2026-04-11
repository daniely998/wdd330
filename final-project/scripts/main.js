document.querySelector("#search-bar").addEventListener("keydown", async(event) => {
    if (event.key === "Enter") {
        await search();
    }
});

async function search() {
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
                let card = document.createElement('section');
                card.className = 'result-card';

                card.innerHTML = `
                <a href="${movie.url}" target="_blank">
                    <h2>${movie.primaryTitle}</h2>
                    <img src="${movie.primaryImage}" alt="${movie.primaryTitle}" width=300 height=450 loading=lazy>
                </a>
                `;
            result.appendChild(card);
            });
        } else {
            result.textContent = "No results found";
        }
    } catch (error) {
        console.error(error);
    }
};