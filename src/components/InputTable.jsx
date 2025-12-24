const inputRows = [
    { no: 1, label: "Earth Resistivity", code: "ρ", key: "earth_resistivity", unit: "ohm-meters", type: "number" },
    { no: 2, label: "Fault Current", code: "ISC", key: "fault_current", unit: "Amp", type: "number" },
    { no: 3, label: "Fault Clearing Time", code: "T", key: "fault_clearing_time", unit: "Sec", type: "number" },
    { no: 4, label: "Earthing Pipe Diameter", code: "D", key: "rod_diameter_mm", unit: "mm", type: "number" },
    { no: 5, label: "Earthing Pipe Radius", code: "r", key: "rod_radius_m", unit: "m", type: "number", step: "0.001" },
    { no: 6, label: "Earthing Pipe Length", code: "h", key: "rod_length_m", unit: "m", type: "number" },
    { no: 7, label: "Earthing Pits", code: "Nos", key: "number_of_pits", unit: "Nos", type: "number" },
    { no: 8, label: "Earth Strip Width", code: "WS", key: "strip_width_mm", unit: "mm", type: "number" },
    { no: 9, label: "Earth Strip Thickness", code: "TS", key: "strip_thickness_mm", unit: "mm", type: "number" },
    { no: 10, label: "Earthing Strip Parallel", code: "NS", key: "number_of_strips", unit: "Nos", type: "number" },
    { no: 11, label: "Strip Length", code: "LS", key: "strip_length_m", unit: "m", type: "number" },
    { no: 12, label: "Strip Material", code: "EM", key: "strip_material", unit: "-", type: "select" },
    { no: 13, label: "Constant", code: "K", key: "material_constant", unit: "-", type: "readonly" }
  ];
  
export default function InputTable({ data, setData }) {

    const handleChange = (key, value) => {
        setData(prev => ({
          ...prev,
          [key]: value
        }));
      };
  
    const handleMaterialChange = (value) => {
      const constants = { GI: 80, CU: 205, AL: 126 };
      setData(prev => ({
        ...prev,
        strip_material: value,
        material_constant: constants[value]
      }));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
      
          const inputs = Array.from(
            document.querySelectorAll("input, select")
          );
      
          const index = inputs.indexOf(e.target);
      
          // Move focus → this triggers blur naturally
          if (index > -1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
          }
        }
      };
      
      
      const handleDiameterBlur = () => {
        console.log("DIAMETER BLUR FIRED", data.rod_diameter_mm);
      
        const d = data.rod_diameter_mm;
        if (d === "") return;
      
        const diameter = parseFloat(d);
        if (isNaN(diameter)) return;
      
        const radius = (diameter / 2) / 1000;
      
        setData(prev => ({
          ...prev,
          rod_radius_m: radius.toFixed(3)
        }));
      };
      
    return (
      <>
        <h2 className="h2">Input Data</h2>
  
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Input Data</th>
              <th>Code</th>
              <th>Data</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {inputRows.map(row => (
                <tr key={row.no}>
                <td data-label="S.No">{row.no}</td>
                <td data-label="Input Data">{row.label}</td>
                <td data-label="Code">{row.code}</td>
                <td data-label="Data">
                    {row.type === "select" ? (
                    <select
                        id={row.key}
                        value={data.strip_material}
                        onChange={e => handleMaterialChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                    >
                        <option value="GI">GI</option>
                        <option value="CU">CU</option>
                        <option value="AL">AL</option>
                    </select>
                    ) : row.key === "rod_diameter_mm" ? (
                    <input
                        id={row.key}
                        value={data[row.key]}
                        onChange={e => handleChange(row.key, e.target.value)}
                        onBlur={handleDiameterBlur}
                        onKeyDown={handleKeyDown}
                    />
                    ) : (
                    <input
                        id={row.key}
                        value={data[row.key]}
                        onChange={e => handleChange(row.key, e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    )}
                </td>
                <td data-label="Unit">{row.unit}</td>
                </tr>
            ))}
        </tbody>
        </table>
      </>
    );
  }
  