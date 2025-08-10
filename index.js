const APIKEY = "9af828b4";
const BASE_URL = "https://www.omdbapi.com";

// https://omdbapi.com/?t=batman&type=movie&apikey=9af828b4

const MovieService = {
  async SearchMovies(searchParam) {
    console.warn(searchParam);

    const url = `${BASE_URL}/?s=${searchParam}&plot=full&page=1&type=movie&apikey=${APIKEY}`;

    const resp = await fetch(url)
      .then((res) => res.json())
      .catch((err) => {
        alert(err?.message || "Error Fetching Response");
      });

    // console.warn("resp", resp);

    if (resp?.Error) {
      alert(resp?.Error);
    }

    const movieIds = (resp?.Search || [])
      .filter((m) => m.imdbID)
      .map((m) => m.imdbID);

    return movieIds;
  },
  async GetMovieById(id) {
    const url = `${BASE_URL}/?i=${id}&apikey=${APIKEY}`;

    const resp = await fetch(url).then((res) => res.json());

    return resp;
  },
  async GetMoviesByIds(ids) {
    if (ids?.length) {
      let moviesResult = await Promise.allSettled(
        ids.map(async (id) => await MovieService.GetMovieById(id))
      );

      console.warn(moviesResult);

      const movies = moviesResult
        .filter((res) => res.value)
        .map((res) => res.value);

      return movies;
    }
    return [];
  },
  async RenderMovies(searchParam) {
    loadingSpinner.style.display = "flex";
    loadingSpinner.style.visibility = "visible";
    cardContainer.innerHTML = "";

    const movieIds = await MovieService.SearchMovies(searchParam);

    const movies = await MovieService.GetMoviesByIds(movieIds);

    for (let index = 0; index < movies.length; index++) {
      const movie = movies[index];

      let card = document.createElement("div");
      card.classList.add("card");

      let img = document.createElement("img");
      img.src = movie.Poster || "";
      img.onerror = () => {
        img.src = "./assets/thumbnail.svg";
      };
      img.classList.add("card-img");
      card.appendChild(img);

      let overlay = document.createElement("div");
      overlay.classList.add("card-overlay", "flex-column");

      if (movie.Title) {
        let div = document.createElement("div");
        div.classList.add("flex-center", "card-overlay-heading");

        let h2 = document.createElement("h2");
        h2.innerHTML = movie.Title;

        div.appendChild(h2);

        overlay.appendChild(div);
      }

      if (movie.Runtime) {
        let div = document.createElement("div");
        div.classList.add("flex-around");

        let i = document.createElement("i");
        i.classList.add("fa-solid", "fa-clock", "movie__info--icon");
        div.appendChild(i);

        let span = document.createElement("span");
        span.innerHTML = movie.Runtime;
        div.appendChild(span);

        overlay.appendChild(div);
      }

      let imdbRating = (movie.Ratings || [])?.find(
        (r) => r.Source === "Internet Movie Database"
      )?.Value;

      if (imdbRating) {
        let div = document.createElement("div");
        div.classList.add("flex-around");

        let i = document.createElement("i");
        i.classList.add("fa-solid", "fa-star", "movie__info--icon");
        div.appendChild(i);

        let span = document.createElement("span");
        span.innerHTML = imdbRating;
        div.appendChild(span);

        overlay.appendChild(div);
      }

      if (movie.Language) {
        let div = document.createElement("div");
        div.classList.add("flex-around");

        let i = document.createElement("i");
        i.classList.add("fa-solid", "fa-earth-americas", "movie__info--icon");
        div.appendChild(i);

        let span = document.createElement("span");
        span.innerHTML = movie.Language;
        div.appendChild(span);

        overlay.appendChild(div);
      }

      card.appendChild(overlay);

      cardContainer.appendChild(card);
    }

    loadingSpinner.style.display = "none";
    loadingSpinner.style.visibility = "hidden";
  },
};

const cardContainer = document.getElementById("card-grid-container");
const searchInput = document.getElementById("search");
const loadingSpinner = document.getElementById("loading");

window.onload = async function () {
  await MovieService.RenderMovies("Batman");
};

searchInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const searchString = searchInput.value;
    await MovieService.RenderMovies(searchString);
  }
});
