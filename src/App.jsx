import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("dataTable.json")
      .then((response) => response.json())
      .then((data) => {
        setJsonData(data);
        setFilteredData(data);
      });
  }, []);

  const handleFilterChange = (e, columnName) => {
    const { value } = e.target;
    setFilterValues({
      ...filterValues,
      [columnName]: value,
    });
    setCurrentPage(1);

    const filtered = jsonData.filter((item) => {
      return Object.keys(filterValues).every((column) => {
        const filterText = filterValues[column].toLowerCase();
        const cellValue = item[column].toString().toLowerCase();
        return cellValue.includes(filterText);
      });
    });

    setFilteredData(filtered);
  };

  if (!jsonData) {
    return <div>Loading...</div>;
  }

  //Pagination Logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const columns = Object.keys(jsonData[0]);

  const rows = filteredData
    .slice(startIndex, endIndex)
    .map((item) => Object.values(item));

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>
                <input
                  type="text"
                  placeholder={`Filter ${column}`}
                  value={filterValues[column] || ""}
                  onChange={(e) => handleFilterChange(e, column)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
