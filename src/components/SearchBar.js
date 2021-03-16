import React from "react";

// Component for the main searchbar in the application
export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  // Lift state up to App whenever we detect a change
  handleChange(e) {
    this.props.onChange(e.target.value);
  }
  // Ignore submissions of the form
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
