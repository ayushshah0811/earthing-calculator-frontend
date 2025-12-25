import InputTable from "./components/InputTable";
import ResultsTable from "./components/ResultsTable"
import DocumentHeader from "./components/DocumentHeader";
import EarthingTypeSelector from "./components/EarthingTypeSelector";
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
  
  const [earthingType, setEarthingType] = useState("pipe");

  useEffect(() => {
    setFormData(prev => {
      const updated = { ...prev };
  
      if (earthingType === "plate") {
        // Clear pipe fields (controlled-safe)
        updated.rod_diameter_mm = "";
        updated.rod_radius_m = "";
        updated.rod_length_m = "";
  
        // Set plate defaults
        updated.plate_length_mm = "600";
        updated.plate_width_mm = "600";
        updated.plate_thickness_mm = "3";
      }
  
      if (earthingType === "pipe") {
        // Clear plate fields
        updated.plate_length_mm = "";
        updated.plate_width_mm = "";
        updated.plate_thickness_mm = "";
  
        // Set pipe defaults
        updated.rod_diameter_mm = "150";
        updated.rod_radius_m = "0.075";
        updated.rod_length_m = "4";
      }
  
      return updated;
    });
  }, [earthingType]);

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
          strip_length_m: "35",
  
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

  const commonRequiredFields = [
    "earth_resistivity",
    "fault_current",
    "fault_clearing_time",
    "number_of_pits",
    "strip_width_mm",
    "strip_thickness_mm",
    "number_of_strips",
    "strip_length_m"
  ];
  
  const pipeRequiredFields = [
    "rod_diameter_mm",
    "rod_radius_m",
    "rod_length_m"
  ];
  
  const plateRequiredFields = [
    "plate_length_mm",
    "plate_width_mm",
    "plate_thickness_mm"
  ];
  
  const [loading, setLoading] = useState(false);
  const handleCalculate = async () => {

    setResults(null);
  
    const requiredFields =
      earthingType === "plate"
        ? [...commonRequiredFields, ...plateRequiredFields]
        : [...commonRequiredFields, ...pipeRequiredFields];
  
    const emptyField = requiredFields.find(
      key => formData[key] === "" || formData[key] === null
    );
  
    if (emptyField) {
      alert("Please fill all required input fields before calculating.");
      const el = document.getElementById(emptyField);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
      return;   // ✨ Now return is SAFE — loading was never set
    }
  
    // ---- move loading below validation ----
    setLoading(true);
  
    const payload = {
      earthing_type: earthingType,
      earth_resistivity: Number(formData.earth_resistivity),
      fault_current: Number(formData.fault_current),
      fault_clearing_time: Number(formData.fault_clearing_time),
      number_of_pits: Number(formData.number_of_pits),
      strip_width_mm: Number(formData.strip_width_mm),
      strip_thickness_mm: Number(formData.strip_thickness_mm),
      number_of_strips: Number(formData.number_of_strips),
      strip_length_m: Number(formData.strip_length_m),
      strip_material: formData.strip_material
    };
  
    if (earthingType === "pipe") {
      payload.rod_diameter_mm = Number(formData.rod_diameter_mm);
      payload.rod_radius_m = Number(formData.rod_radius_m);
      payload.rod_length_m = Number(formData.rod_length_m);
    }
  
    if (earthingType === "plate") {
      payload.plate_length_mm = Number(formData.plate_length_mm);
      payload.plate_width_mm = Number(formData.plate_width_mm);
      payload.plate_thickness_mm = Number(formData.plate_thickness_mm);
    }
  
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
    
      const pdfOnlyEls = document.querySelectorAll(".pdf-only");
      const buttons = document.querySelectorAll(".calculate-container");
    
      // 1️⃣ Show PDF-only content
      pdfOnlyEls.forEach(el => {
        el.style.display = "block";
      });
    
      // Hide buttons
      buttons.forEach(btn => {
        btn.style.visibility = "hidden";
      });
    
      // 2️⃣ FORCE browser repaint
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => setTimeout(resolve, 0));
    
      // 3️⃣ Generate PDF AFTER repaint
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: "Earthing_Calculation.pdf",
          image: { type: "jpeg", quality: 1 },
          html2canvas: {
            scale: 3,
            useCORS: true,
            logging: false
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
          }
        })
        .from(element)
        .save();
    
      // 4️⃣ Restore UI
      pdfOnlyEls.forEach(el => {
        el.style.display = "none";
      });
    
      buttons.forEach(btn => {
        btn.style.visibility = "visible";
      });
    };

return (
  <div className="page-container">

    <div id="pdf-content">
      <div className="pdf page">
        <h1 className="title">
          Earthing Calculation – As Per IS 3043
        </h1>

        <DocumentHeader
          headerData={headerData}
          setHeaderData={setHeaderData}
        />

        <EarthingTypeSelector
          earthingType={earthingType}
          setEarthingType={setEarthingType}
        />

        <InputTable
          data={formData}
          setData={setFormData}
          earthingType={earthingType}
        />
      </div>

      {results && (
        <div className="pdf page">
          {/* 🔹 Spacer prevents border bleed */}
          <div className="page-top-spacer" />
          <div className="pdf-only">
            <DocumentHeader
              headerData={headerData}
              setHeaderData={setHeaderData}
            />
          </div>


          <ResultsTable
            results={results}
            resultsRef={resultsRef}
          />
        </div>
      )}
    </div>

    <div className="calculate-container">
    <button onClick={handleCalculate} disabled={loading}>
      Calculate
    </button>

    {loading && (
      <div className="loader" aria-label="Calculating" />
    )}

      {results && (
        <button onClick={handleDownloadPDF}>
          Download PDF
        </button>
      )}
    </div>
  </div>
)}
