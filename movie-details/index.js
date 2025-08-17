import { MovieService, Utils } from "../index.js";

let searchParam = "";

const MovieDetailsService = {
  renderHtml(movie) {
    let body = document.getElementsByTagName("body")?.[0];

    if (body) {
      let header = Utils.createElement("header", ["header"]);

      let headerDiv = document.createElement("div");
      headerDiv.classList.add("header-row");

      let headerTitle = document.createElement("h1");
      headerTitle.classList.add("header-title");
      headerTitle.innerHTML = movie.Title || "";

      headerDiv.append(headerTitle);

      if (movie?.Rated) {
        let ratingSource = "";
        let movieRating = movie?.Rated?.toLocaleLowerCase?.() || "";

        if (movieRating?.includes("pg")) {
          ratingSource = "../assets/classification-pg-square.png";
        } else if (movieRating?.includes("ma")) {
          ratingSource = "../assets/classification-ma-square.png";
        } else if (movieRating?.includes("m")) {
          ratingSource = "../assets/classification-ma-square.png";
        } else if (movieRating?.includes("g")) {
          ratingSource = "../assets/classification-g-square.png";
        } else if (movieRating?.includes("r")) {
          ratingSource = "../assets/classification-r18-square.png";
        }

        if (ratingSource) {
          let ratingContainer = document.createElement("div");
          ratingContainer.classList.add("rating-container");

          let ratingImg = document.createElement("img");
          ratingImg.src = ratingSource;
          ratingImg.classList.add("rating-img");

          ratingContainer.appendChild(ratingImg);

          headerDiv.appendChild(ratingContainer);
        }
      }

      if (movie?.Genre) {
        let genre = movie?.genre || "";

        if (genre?.split(",")?.length > 3) {
          let splitGenre = genre?.split(",");

          let genreLimited = "";
          for (let index = 0; index < 3; index++) {
            const item = splitGenre[index];

            if (index !== 2) {
              genreLimited += `${item}, `;
            } else {
              genreLimited += `${item}`;
            }
          }

          genre = genreLimited;
        }

        let genreTitle = document.createElement("h3");
        genreTitle.classList.add("header-subtitle");
        genreTitle.innerHTML = `${genre}`;

        headerDiv.appendChild(genreTitle);
      }

      header.appendChild(headerDiv);

      if (movie?.Director) {
        let directorTitle = document.createElement("h3");
        directorTitle.classList.add("header-subtitle");
        directorTitle.innerHTML = `${movie?.Director}`;

        header.appendChild(directorTitle);
      }

      body.appendChild(header);

      let mainContainer = Utils.createElement(
        "main",
        ["main-container"],
        "",
        "main-container"
      );

      if (movie?.Poster) {
        mainContainer.style.background = `url(${movie?.Poster})`;
        mainContainer.style.backgroundRepeat = "no-repeat";
        mainContainer.style.backgroundSize = "contain";
        mainContainer.style.backgroundPosition = "center";
      }

      let contentContainer = Utils.createElement("div", [
        "main-container-content",
      ]);

      if (movie?.Plot) {
        let plotHeader = Utils.createElement("h2", ["plot-title"], "Plot");

        contentContainer.appendChild(plotHeader);

        let plotText = Utils.createElement("p", ["plot-text"], movie?.Plot);

        contentContainer.appendChild(plotText);
      }

      if (typeof movie?.Awards === "string") {
        let awardsContainer = Utils.createElement("div", ["awards-container"]);

        let awardTitle = Utils.createElement(
          "h2",
          ["award-title"],
          `<h2 class="award-title">Awards <i class="fa-regular fa-star"></i></h2>`
        );

        awardsContainer.appendChild(awardTitle);

        let awardText = Utils.createElement("h3", [], movie?.Awards);

        awardsContainer.appendChild(awardText);

        contentContainer.appendChild(awardsContainer);
      }

      let actionContainer = Utils.createElement("div", ["action-container"]);

      let backButton = Utils.createElement("a", [], "Back to Search", "back");

      let url = new URL(`${window.location.origin}`);
      let params = url.searchParams;
      if (searchParam) {
        params.set("search", `${searchParam}`);
      } else {
        params.set("search", "Batman");
      }

      backButton.href = url.toString();

      actionContainer.appendChild(backButton);

      if (searchParam || movie?.Title) {
        let trailerButton = Utils.createElement(
          "button",
          [],
          "Search Trailer",
          "btn-trailer"
        );

        let youtubeUrl = new URL("https://www.youtube.com/results");
        let params = youtubeUrl.searchParams;

        params.set("search_query", movie?.Title || searchParam);

        trailerButton.onclick = () => {
          window.open(`${youtubeUrl.toString()}+trailer`, "_blank");
        };

        actionContainer.appendChild(trailerButton);
      }

      contentContainer.appendChild(actionContainer);

      mainContainer.appendChild(contentContainer);

      body.appendChild(mainContainer);
    }
  },
};

let loading = document.getElementById("loading");

window.onload = async function () {
  loading.style.display = "flex";
  loading.style.visibility = "visible";
  let url = new URL(window.location.href);
  let params = url.searchParams;
  let movieId = params.get("movieId");
  searchParam = params.get("search");
  if (movieId) {
    let movie = await MovieService.GetMovieById(movieId);

    if (movie) {
      MovieDetailsService.renderHtml(movie);
    }
  }

  loading.style.display = "none";
  loading.style.visibility = "hidden";
};

// https://www.youtube.com/results?search_query=batman+begins+trailer
