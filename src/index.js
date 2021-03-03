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
    this.handlePageClick = this.handlePageClick.bind(this);
    this.state = {
      searchQuery: "",
      searchResults: [],
      // Pagination attributes
      offset: 0,
      perPage: 20,
      currentPage: 0,
      totalPages: 0,
      language: "en-US",
      include_adult: false,
    };
  }

  receivedData(apiSearchRequest, isFake = false) {
    fetch(apiSearchRequest)
      .then((response) => response.json())
      .then((data) => {
        console.log(apiSearchRequest);
        console.log(data);
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
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;
    this.setState({ currentPage: selectedPage, offset: offset });
    const apiSearchRequest = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=${
      this.state.language
    }&query=${this.state.searchQuery}&page=${selectedPage + 1}&include_adult=${
      this.state.include_adult
    }`;
    console.log(apiSearchRequest);
    console.log(selectedPage);
    this.receivedData(apiSearchRequest);
  };

  handleQueryChange(query) {
    // Reset the page statistics every time you change the query
    this.setState({
      searchQuery: query,
      currentPage: 0,
      totalPages: 0,
      offset: 0,
    });

    // If our query is actually null, make a fake API call with key "a" (can't make API call with empty query string) and then manually set searchResults and totalPages appropriately
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
        <MainHeader></MainHeader>
        <MainDescription></MainDescription>
        <SearchBar onChange={this.handleQueryChange}></SearchBar>
        <ResultsPage
          searchQuery={this.state.searchQuery}
          searchResults={this.state.searchResults}
        ></ResultsPage>
        <PaginationMenu
          handlePageClick={this.handlePageClick}
          pageCount={this.state.totalPages}
        ></PaginationMenu>
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
    const searchQuery = this.props.searchQuery;
    if (searchQuery === "") {
      return <p></p>;
    } else if (
      searchResults.length === 0 ||
      searchResults.data.total_results === 0
    ) {
      return <ErrorMessage searchQuery={searchQuery}></ErrorMessage>;
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

class PaginationMenu extends React.Component {
  render() {
    if (this.props.pageCount === 0) {
      return <p></p>;
    }
    return (
      <ReactPaginate
        previousLabel={"prev"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={this.props.pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={this.props.handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      ></ReactPaginate>
    );
  }
}

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
      <span className="navbar-brand">
        <div id="logo">
          <span>ff</span>
        </div>
        <span className="bold">flick</span>
        <span className="thin">findr</span>
      </span>
    </nav>
  );
}

function ErrorMessage(props) {
  return (
    <p id="error">
      <span className="pink">Oops!</span> We didn't find any search results for
      "{props.searchQuery}". Try checking your spelling, or using more general
      keywords.
    </p>
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
