import React, { useState } from "react";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const StateDropdown = ({ onSelect,state }) => {
  const [selectedState, setSelectedState] = useState(state);

  const handleChange = (event) => {
    
    setSelectedState(event.target.value);
    if (onSelect) {
      onSelect(event.target.value);
    }
  };

  return (
    <div>
    <label className="form-label form-label">State</label>
      <select id="state-select" value={selectedState} onChange={handleChange} className="form-control">
        <option value="">--Choose a state--</option>
        {indianStates.map((state, index) => (
          <option key={index} value={state}>{state}</option>
        ))}
      </select>
    </div>
  );
};

export default StateDropdown;
