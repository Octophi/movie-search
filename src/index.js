import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// Basic API Setup
const apiKey = "4b547eeea89c2c56ed31012705fbf0c6";
const apiConfigRequest = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;

// Querying for basic config info, base_url and size used for finding images
let secure_base_url, size;
fetch(apiConfigRequest)
  .then((response) => response.json())
  .then((data) => {
    secure_base_url = data.images.secure_base_url;
    console.log(secure_base_url);
    size = data.images.backdrop_sizes[0];
  })
  .catch(console.log);

class ContentPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.state = { searchQuery: "", searchResults: [] };
  }
  handleQueryChange(query) {
    this.setState({ searchQuery: { query } });
    if (query.trim() === "") {
      setTimeout(this.setState({ searchResults: [] }), 100000);
      return;
    }
    // Should hide this API key later
    const language = "en-US";
    const include_adult = false;
    const page = 1;
    // Also can include an option for year
    const apiSearchRequest = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=${language}&query=${query}&page=${page}&include_adult=${include_adult}`;

    fetch(apiSearchRequest)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ searchResults: { data } });
      })
      .catch((error) => {
        console.error(error);
      });

    /* Testing Code
    console.log("Search Query: " + query);
    console.log("Search Results: ");
    console.log(this.state.searchResults);
    */
  }
  render() {
    return (
      <div>
        <SearchBar onChange={this.handleQueryChange}></SearchBar>
        <ResultsPage
          searchQuery={this.state.searchQuery}
          searchResults={this.state.searchResults}
        ></ResultsPage>
      </div>
    );
  }
}
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { searchResults: [] };
  }
  handleChange(e) {
    this.props.onChange(e.target.value);
  }
  render() {
    return (
      <div id="searchbar-container">
        <form>
          <label htmlFor="searchbar"></label>
          <input
            type="text"
            id="main-searchbar"
            placeholder="I'm looking for a movie about..."
            onChange={this.handleChange}
          ></input>
        </form>
      </div>
    );
  }
}

class ResultsPage extends React.Component {
  render() {
    // Pass in the search results from the search bar
    const searchResults = this.props.searchResults;
    const searchQuery = this.props.searchQuery;
    console.log(searchQuery);
    if (searchQuery.length === 0) {
      return <p>Hi</p>;
    } else if (
      searchResults.length === 0 ||
      searchResults.data.total_results === 0
    ) {
      console.log(searchQuery.length);
      console.log(typeof searchQuery);
      return <p>Oops, no search results found</p>;
    } else {
      console.log(searchResults);
      const movieTabs = searchResults.data.results.map(function (movieData) {
        return <MovieDisplay data={movieData}></MovieDisplay>;
      });
      return <div id="results-page">{movieTabs}</div>;
    }
  }
}

class MovieDisplay extends React.Component {
  render() {
    const movieData = this.props.data;
    const img_path = secure_base_url + size + movieData.poster_path;
    const overview = movieData.overview;
    const release_date = movieData.release_date;
    const title = movieData.title;
    const popularity = movieData.popularity;
    const vote_average = movieData.vote_average;
    return (
      <div className="movie-display-tile">
        <img src={img_path} alt="Movie Poster"></img>
        <div class="img-description">
          <h1 class="movie-title">{title}</h1>
          <p class="score-paragraph">
            <span class="score">Average Score:</span> {vote_average}
          </p>
          <p class="overview">{overview}</p>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<ContentPage />, document.getElementById("root"));
