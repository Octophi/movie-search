import React from "react";
import ReactDOM from "react-dom";
import SearchBar from "./components/SearchBar";
import Navbar from "./components/Navbar";
import MainDescription from "./components/MainDescription";
import ErrorMessage from "./components/ErrorMessage";
import PaginationMenu from "./components/PaginationMenu";
import { config } from "../src/config.js";
import { secure_base_url, size, genreMapping } from "../src/apiVariables";
import "./index.css";

// Grab API key, store it for queries
const apiKey = config.apiKey;

// App component is the entire webpage
class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.state = {
      searchQuery: "",
      searchResults: [],
      language: "en-US",
      include_adult: false,
      // Pagination attributes
      offset: 0,
      perPage: 20,
      currentPage: 0,
      totalPages: 0,
    };
  }

  /*
  Called whenever a new API request is to be made
  isFake variable tracks whether this API request should actually be made 
  (occasionally we give an API request without actually wanting the data, see if block under handleQueryChange)
  */
  receivedData(apiSearchRequest, isFake = false) {
    fetch(apiSearchRequest)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ searchResults: { data } });
        if (data.total_results > 0) {
          this.setState({ totalPages: data.total_pages });
        } else {
          this.setState({ totalPages: 0 });
        }
        if (isFake) {
          this.setState({ searchResults: [], totalPages: 0 });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Handles changing pages using pagination menu
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;
    this.setState({ currentPage: selectedPage, offset: offset });

    // Check if the query is empty to avoid making an invalid GET request
    if (this.state.searchQuery.trim() === "") {
      const fakeSearchRequest = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=${
        this.state.language
      }&query=a&page=${selectedPage + 1}&include_adult=${
        this.state.include_adult
      }`;
      this.receivedData(fakeSearchRequest, true);
      return;
    }

    // If query nonempty, make appropriate API call
    const apiSearchRequest = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=${
      this.state.language
    }&query=${this.state.searchQuery}&page=${selectedPage + 1}&include_adult=${
      this.state.include_adult
    }`;
    this.receivedData(apiSearchRequest);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handles changes in the searchbar content
  handleQueryChange(query) {
    // Reset the page statistics every time you change the query
    this.setState({
      searchQuery: query,
      currentPage: 0,
      totalPages: 0,
      offset: 0,
    });

    /*
     If our query is actually null, make a fake API call with key "a" (can't make API call with empty query string) and then manually set 
     searchResults and totalPages appropriately in receivedData. This ensures the timing works out and we don't set searchResults and 
     totalPages only to be overwritten by a previous API call.
    */
    if (query.trim() === "") {
      const fakeSearchRequest = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=${
        this.state.language
      }&query=a&page=${this.state.currentPage + 1}&include_adult=${
        this.state.include_adult
      }`;
      this.receivedData(fakeSearchRequest, true);
      return;
    }
    const apiSearchRequest = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=${
      this.state.language
    }&query=${query}&page=${this.state.currentPage + 1}&include_adult=${
      this.state.include_adult
    }`;
    this.receivedData(apiSearchRequest);
  }
  render() {
    return (
      <div>
        <Navbar></Navbar>
        <MainDescription></MainDescription>
        <SearchBar onChange={this.handleQueryChange}></SearchBar>
        <ResultsPage
          searchQuery={this.state.searchQuery}
          searchResults={this.state.searchResults}
        ></ResultsPage>
        <PaginationMenu
          searchQuery={this.state.searchQuery}
          handlePageClick={this.handlePageClick}
          pageCount={this.state.totalPages}
        ></PaginationMenu>
      </div>
    );
  }
}

// ResultsPage displays the results corresponding to the query in SearchBar
class ResultsPage extends React.Component {
  render() {
    const searchResults = this.props.searchResults;
    const searchQuery = this.props.searchQuery;
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
          <MovieDisplay data={movieData} key={movieData.id}></MovieDisplay>
        );
      });
      return <div id="results-page">{movieTabs}</div>;
    }
  }
}

// Display component for movie information, has poster information, with additional text information on hover
class MovieDisplay extends React.Component {
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

ReactDOM.render(<App />, document.getElementById("root"));
