import React from "react";
import ReactDOM from "react-dom";
import SearchBar from "./components/SearchBar";
import Navbar from "./components/Navbar";
import MainDescription from "./components/MainDescription";
import PaginationMenu from "./components/PaginationMenu";
import ResultsPage from "./components/ResultsPage";
import "./index.css";

/* Uncomment this portion and comment out following portion if running locally
import config from "./config.json";

// Grab API key, store it for queries
const apiKey = config.apiKey;
*/

/* Comment out following line and uncomment above portion if running locally */
const apiKey = process.env.apiKey;

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

ReactDOM.render(<App />, document.getElementById("root"));
