import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class ContentPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { searchQuery: "", searchResults: [] };
  }
  handleChange(e) {
    const query = e.target.value;

    this.setState({ searchQuery: { query }, searchResults: e.target.value });
  }
  render() {
    return (
      <div>
        <SearchBar></SearchBar>
        <ResultsPage></ResultsPage>
      </div>
    );
  }
}
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchResults: [] };
  }
  handleChange(e) {
    this.props.onChange(e.target.value);
  }
  render() {
    return (
      <form>
        <label for="searchbar"></label>
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
  // Basically we should have a list of objects after each query
  // If the ilst is empty, display something particular here
  // Else just display all the stuff from the movie display, pageifying as necessary
  render() {
    // Pass in the search results from the search bar
    const searchResults = this.props.searchResults;
    if (searchResults.length === 0) {
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
