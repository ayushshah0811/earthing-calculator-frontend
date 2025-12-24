import InputTable from "./components/InputTable";
import ResultsTable from "./components/ResultsTable"
import DocumentHeader from "./components/DocumentHeader";
import { calculateEarthing } from "./services/api";
import { useRef, useState } from "react";
import { useEffect } from "react";

export default function App() {
  
  const [headerData, setHeaderData] = useState(() => {
    const saved = localStorage.getItem("earthing_header");
    return saved
      ? JSON.parse(saved)
      : {
          project: "Daman Airport",
          docCode: "JAEC001 / E001",
          dateRev: "Date - 12/12/25_00"
        };
  });

  useEffect(() => {
    localStorage.setItem(
      "earthing_header",
      JSON.stringify(headerData)
    );
  }, [headerData]);

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("earthing_inputs");
    return saved
      ? JSON.parse(saved)
      : {
          earth_resistivity: "20",
          fault_current: "22100",
          fault_clearing_time: "1",
  
          rod_diameter_mm: "150",
          rod_radius_m: "0.075",
          rod_length_m: "4",
          number_of_pits: "4",
  
          strip_width_mm: "75",
          strip_thickness_mm: "3",
          number_of_strips: "2",
          strip_length_m: "25",
  
          strip_material: "GI",
          material_constant: "80"
        };
  });

  useEffect(() => {
    localStorage.setItem(
      "earthing_inputs",
      JSON.stringify(formData)
    );
  }, [formData]);
  
  const [results, setResults] = useState(null);
  const resultsRef = useRef(null);

  const requiredFields = [
    "earth_resistivity",
    "fault_current",
    "fault_clearing_time",
    "rod_diameter_mm",
    "rod_radius_m",
    "rod_length_m",
    "number_of_pits",
    "strip_width_mm",
    "strip_thickness_mm",
    "number_of_strips",
    "strip_length_m"
  ];
  
  const [loading, setLoading] = useState(false);
  const handleCalculate = async () => {

    setLoading(true);
    setResults(null);
    
    const emptyField = requiredFields.find(
      key => formData[key] === "" || formData[key] === null
    );
  
    if (emptyField) {
      alert("Please fill all required input fields before calculating.");
  
      // Optional: scroll + focus first empty field
      const el = document.getElementById(emptyField);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
  
      return; // ❌ stop here
    }

    const payload = {
      earth_resistivity: Number(formData.earth_resistivity),
      fault_current: Number(formData.fault_current),
      fault_clearing_time: Number(formData.fault_clearing_time),
  
      rod_diameter_mm: Number(formData.rod_diameter_mm),
      rod_radius_m: Number(formData.rod_radius_m),
      rod_length_m: Number(formData.rod_length_m),
      number_of_pits: Number(formData.number_of_pits),
  
      strip_width_mm: Number(formData.strip_width_mm),
      strip_thickness_mm: Number(formData.strip_thickness_mm),
      number_of_strips: Number(formData.number_of_strips),
      strip_length_m: Number(formData.strip_length_m),
  
      strip_material: formData.strip_material
    };
  
    const response = await calculateEarthing(payload);
    setResults(response);
    setLoading(false);
  
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  };

  const handleDownloadPDF = async () => {

    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("pdf-content");

    // Hide buttons temporarily
    const buttons = document.querySelectorAll("button");
    buttons.forEach(btn => (btn.style.display = "none"));

    const options = {
      margin: [10, 10, 10, 10],
      filename: "Earthing_Calculation.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 3,         
        useCORS: true
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      }
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .finally(() => {
        buttons.forEach(btn => (btn.style.display = "inline-block"));
      });
  };

  return (
    <div className="page-container">

    <div id="pdf-content">

      <h1 className="title">
        Earthing Calculation – IS 3043
      </h1>

      <DocumentHeader
        headerData={headerData}
        setHeaderData={setHeaderData}
      />

      <InputTable
        data={formData}
        setData={setFormData}
      />

      {results && (
        <ResultsTable
          results={results}
          resultsRef={resultsRef}
        />
      )}

    </div>

    <div className="calculate-container">
      <button onClick={handleCalculate}>Calculate</button>

      {loading && (
        <div className="loading">
          Calculating...
        </div>
      )}

      {results && (
        <button onClick={handleDownloadPDF}>
          Download PDF
        </button>
      )}
    </div>
  </div>
)}
