import React from "react";

const EarthingTypeSelector = ({ earthingType, setEarthingType }) => {
  return (
    <div className="earthing-type-selector">
      <h2 className="h2">
        Earthing Type:
      </h2>

      <label style={{ marginRight: "20px" }}>
        <input
          className="earthing-type"
          type="radio"
          name="earthingType"
          value="pipe"
          checked={earthingType === "pipe"}
          onChange={() => setEarthingType("pipe")}
        />
        {" "}Pipe Earthing
      </label>

      <label>
        <input
          className="earthing-type"
          type="radio"
          name="earthingType"
          value="plate"
          checked={earthingType === "plate"}
          onChange={() => setEarthingType("plate")}
        />
        {" "}Plate Earthing
      </label>
    </div>
  );
};

export default EarthingTypeSelector;
