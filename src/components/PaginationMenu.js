import React from "react";
import ReactPaginate from "react-paginate";

// Menu with buttons for different pages of results, adapted from react-paginate
export default class PaginationMenu extends React.Component {
  render() {
    if (this.props.pageCount === 0 || this.props.searchQuery === "") {
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
