import React, { useState, useEffect } from "react";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const StateDropdown = ({ onSelect, state }) => {
  const [selectedState, setSelectedState] = useState(state || ""); // Ensure an empty string as the default value

  // Sync state prop with local state when it changes
  useEffect(() => {
    setSelectedState(state || "");
  }, [state]);

  const handleChange = (event) => {
    setSelectedState(event.target.value);
    if (onSelect) {
      onSelect(event.target.value);
    }
  };

  return (
    
      
      <select id="state-select" value={selectedState} onChange={handleChange} className="form-control">
        <option value="">--Choose a state--</option>
        {indianStates.map((state, index) => (
          <option key={index} value={state}>{state}</option>
        ))}
      </select>
    
  );
};

export default StateDropdown;
