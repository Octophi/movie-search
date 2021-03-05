import React from "react";
import MovieDisplay from "../components/MovieDisplay";
import ErrorMessage from "../components/ErrorMessage";

// ResultsPage displays the results corresponding to the query in SearchBar
export default class ResultsPage extends React.Component {
  render() {
    const searchResults = this.props.searchResults;
    const searchQuery = this.props.searchQuery;
    const imageURLPrefix = this.props.imageURLPrefix;
    const genreMapping = this.props.genreMapping;
    // Display nothing if the searchQuery was empty...
    if (searchQuery === "") {
      return <p></p>;
    } else if (
      searchResults.length === 0 ||
      searchResults.data.total_results === 0
    ) {
      // ...or a "not found" message if there were no results...
      return <ErrorMessage searchQuery={searchQuery}></ErrorMessage>;
    } else {
      // ...or else just the results, displayed as MovieDisplay elements
      const movieTabs = searchResults.data.results.map(function (movieData) {
        return (
          <MovieDisplay
            data={movieData}
            key={movieData.id}
            imageURLPrefix={imageURLPrefix}
            genreMapping={genreMapping}
          ></MovieDisplay>
        );
      });
      return <div id="movie-results">{movieTabs}</div>;
    }
  }
}
