import React from "react";

// Displays error message when no results are found
export default function ErrorMessage(props) {
  return (
    <p id="error">
      <span className="pink">Oops!</span> We didn't find any search results for
      "{props.searchQuery}". Try checking your spelling or using more general
      keywords.
    </p>
  );
}
