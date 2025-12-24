export default function DocumentHeader({ headerData, setHeaderData }) {
    return (
      <table className="doc-header">
        <tbody>
          <tr>
            <td className="label">Project</td>
            <td className="value">
              <input
                value={headerData.project}
                onChange={e =>
                  setHeaderData({ ...headerData, project: e.target.value })
                }
              />
            </td>
            <td className="logo" rowSpan="3">
              <img src="/JA_logo.png" alt="Logo" />
            </td>
          </tr>
  
          <tr>
            <td className="label">Document Name</td>
            <td className="value">
              <input value="Earthing Calculation Main Panel" readOnly />
            </td>
          </tr>
  
          <tr>
            <td className="label">MEPF Consultant</td>
            <td className="value">
              <input value="Jhaveri Associates, Ahmedabad" readOnly />
            </td>
          </tr>
  
          <tr>
            <td className="label">Doc Code & No</td>
            <td className="value">
              <input
                value={headerData.docCode}
                onChange={e =>
                  setHeaderData({ ...headerData, docCode: e.target.value })
                }
              />
            </td>
            <td className="date-rev" colSpan="1">
              <input
                value={headerData.dateRev}
                onChange={e =>
                  setHeaderData({ ...headerData, dateRev: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
}