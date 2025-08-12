import { MovieService } from "../index.js";

window.onload = async function () {
  let url = new URL(window.location.href);
  let params = url.searchParams;
  let movieId = params.get("movieId");

  if (movieId) {
    let movie = await MovieService.GetMovieById(movieId);
    console.log(movie);
  }
};
