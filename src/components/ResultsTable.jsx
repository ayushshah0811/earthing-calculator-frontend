import React from "react";

function ResultsTable({ results, resultsRef }) {
    if (!results) return null;
  
    return (
      <div className="results-page" ref={resultsRef}>
        <h2 className="h2">Summary of Results</h2>
        <div className="results-table">
          <table>
            <thead>
              <tr>
                <th>S.N.</th>
                <th>Description</th>
                <th>Result</th>
                <th>Unit</th>
                <th>Condition</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
            {results.summary.map((row, i) => (
                <tr key={i}>
                  <td data-label="S.N.">{String.fromCharCode(65 + i)}</td>
                  <td data-label="Description">{row.description}</td>
                  <td data-label="Result">{row.result}</td>
                  <td data-label="Unit">{row.unit}</td>
                  <td data-label="Condition">{row.condition}</td>
                  <td data-label="Remarks" className={row.remarks === "Acceptable" ? "acceptable" : "not-acceptable"}>
                    {row.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  export default React.memo(ResultsTable);