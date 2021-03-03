import React from "react";
import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
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
    size = data.images.backdrop_sizes[0];
  })
  .catch(console.log);

class ContentPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    //this.handlePageClick = this.handlePageClick.bind(this);
    this.state = {
      searchQuery: "",
      searchResults: [],
      isEmpty: true,
      //paginationAttributes: { offset: 0, perPage: 20, currentPage: 0 },
    };
  }

  /*
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;
  };
  */

  handleQueryChange(query) {
    this.setState({ searchQuery: { query } });
    if (query.trim() === "") {
      setTimeout(function () {}, 500);
      this.setState({ isEmpty: true, searchResults: [] });
      return;
    }
    const language = "en-US";
    const include_adult = false;
    const page = 1;
    // Also can include an option for year
    const apiSearchRequest = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=${language}&query=${query}&page=${page}&include_adult=${include_adult}`;

    fetch(apiSearchRequest)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ isEmpty: false, searchResults: { data } });
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
        <Navbar></Navbar>
        <MainHeader></MainHeader>
        <MainDescription></MainDescription>
        <SearchBar onChange={this.handleQueryChange}></SearchBar>
        <ResultsPage
          searchQuery={this.state.searchQuery}
          searchResults={this.state.searchResults}
          isEmpty={this.state.isEmpty}
        ></ResultsPage>
      </div>
    );
  }
}
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { searchResults: [] };
  }
  handleChange(e) {
    this.props.onChange(e.target.value);
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  render() {
    return (
      <div id="searchbar-container">
        <form onSubmit={this.handleSubmit}>
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
    const isEmpty = this.props.isEmpty;
    if (isEmpty) {
      return <p></p>;
    } else if (
      searchResults.length === 0 ||
      searchResults.data.total_results === 0
    ) {
      return <p>Oops, no search results found</p>;
    } else {
      const movieTabs = searchResults.data.results.map(function (movieData) {
        return (
          <MovieDisplay data={movieData} key={movieData.id}></MovieDisplay>
        );
      });
      return <div id="results-page">{movieTabs}</div>;
    }
  }
}

//class PaginationMenu extends React.Component {}

class MovieDisplay extends React.Component {
  render() {
    const movieData = this.props.data;
    const overview = movieData.overview;
    const title = movieData.title;
    const vote_average = movieData.vote_average;

    let imgComponent;
    if (movieData.poster_path === null) {
      imgComponent = (
        <div className="filler">
          <h1 className="movie-title">{title}</h1>
        </div>
      );
    } else {
      const img_path = secure_base_url + size + movieData.poster_path;
      imgComponent = <img src={img_path} alt="Movie Poster"></img>;
    }
    return (
      <div className="movie-display-tile">
        {imgComponent}
        <MovieDescription
          title={title}
          score={vote_average}
          overview={overview}
        ></MovieDescription>
      </div>
    );
  }
}

function MovieDescription(props) {
  return (
    <div className="img-description">
      <h1 className="movie-title">{props.title}</h1>
      <p className="score-paragraph">
        <span className="score">Average Score:</span> {props.score}
      </p>
      <p className="overview">{props.overview}</p>
    </div>
  );
}

function Navbar(props) {
  return (
    <nav className="navbar navbar-light bg-light" id="main-nav">
      <span className="navbar-brand mb-0 h1">
        <b>flick</b>findr
      </span>
    </nav>
  );
}

function MainHeader(props) {
  return <p id="main-header">A modern movie search engine.</p>;
}

function MainDescription(props) {
  return (
    <p id="main-description">
      Ever wanted a single platform for finding movies by name? Curious how many
      movies there are with zombie in the title? Type into the searchbar and get
      searching.
    </p>
  );
}

ReactDOM.render(<ContentPage />, document.getElementById("root"));
