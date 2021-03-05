import React from "react";
import { secure_base_url, size, genreMapping } from "../apiVariables";

// Display component for movie information, has poster information, with additional text information on hover
export default class MovieDisplay extends React.Component {
  render() {
    const movieData = this.props.data;
    const overview = movieData.overview;
    const title = movieData.title;
    const vote_average = movieData.vote_average;
    const genres = movieData.genre_ids.map((id) => genreMapping.get(id));

    // If there is no poster_path, use a default background div with color gradient, defined in CSS...
    let imgComponent;
    if (movieData.poster_path === null) {
      imgComponent = (
        <div className="filler">
          <h1 className="movie-title">{title}</h1>
        </div>
      );
    } else {
      // ...else grab image
      const img_path = secure_base_url + size + movieData.poster_path;
      imgComponent = <img src={img_path} alt="Movie Poster"></img>;
    }
    return (
      <div className="movie-display-tile">
        {imgComponent}
        <MovieDescription
          title={title}
          genres={genres}
          score={vote_average}
          overview={overview}
        ></MovieDescription>
      </div>
    );
  }
}

// Returns text description of movie with information on title, genres, score, and plot overview
function MovieDescription(props) {
  return (
    <div className="img-description">
      <h1 className="movie-title">{props.title}</h1>
      <p className="movie-attribute">
        <span className="bold">Average Score:</span> {props.score}
      </p>
      {props.genres.length > 0 && (
        <p className="movie-attribute">
          <span className="bold">Genres:</span> {props.genres.join(", ")}
        </p>
      )}
      <p className="movie-attribute">{props.overview}</p>
    </div>
  );
}
