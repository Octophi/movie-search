import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class ContentPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.state = { searchQuery: "", searchResults: [] };
  }
  handleQueryChange(query) {
    this.setState({ searchQuery: { query } });
    // Should hide this API key later
    const apiKey = "4b547eeea89c2c56ed31012705fbf0c6";
    const language = "en-US";
    const include_adult = false;
    const page = 1;
    // Also can include an option for year

    const apiRequest = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=${language}&query=${query}&page=${page}&include_adult=${include_adult}`;

    fetch(apiRequest)
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
      <form>
        <label htmlFor="searchbar"></label>
        <input
          type="text"
          id="searchbar"
          placeholder="I'm looking for a movie about..."
          onChange={this.handleChange}
        ></input>
      </form>
    );
  }
}

class ResultsPage extends React.Component {
  constructor(props) {
    super(props);
  }
  // Basically we should have a list of objects after each query
  // If the ilst is empty, display something particular here
  // Else just display all the stuff from the movie display, pageifying as necessary
  render() {
    // Pass in the search results from the search bar
    const searchResults = this.props.searchResults;
    const searchQuery = this.props.searchQuery;

    if (searchQuery === "") {
      return <p></p>;
    } else if (searchResults.length === 0) {
      return <p>Oops, no search results found</p>;
    } else {
      return <p>Search results</p>;
    }
  }
}

class MovieDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }
  render() {
    return <div className="movie-display"></div>;
  }
}

ReactDOM.render(<ContentPage />, document.getElementById("root"));
