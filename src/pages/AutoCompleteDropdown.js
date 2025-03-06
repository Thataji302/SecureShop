import { useState } from "react";

const AutoCompleteDropdown = ({ field, formValues, handleChange }) => {
    const [inputValue, setInputValue] = useState(formValues[field.name] || "");
    const [filteredOptions, setFilteredOptions] = useState(field.options);
    const [showDropdown, setShowDropdown] = useState(false);
console.log(field.autoinput,"autoinput")
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        handleChange({ target: { name: field.name, value } });

        // Filter options dynamically based on input
        const filtered = field.options.filter(option =>
            option.label.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOptions(filtered);
        setShowDropdown(true);
    };

    const handleOptionClick = (value) => {
        setInputValue(value);
        handleChange({ target: { name: field.name, value } });
        setShowDropdown(false);
    };

    return (
        <div className="position-relative">
            <input
                type="text"
                className="form-control"
                placeholder={`Select or type ${field.label}`}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Hides dropdown after selection
            />

            {showDropdown && (
                <ul className="dropdown-menu show position-absolute w-100" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {filteredOptions.map((option) => (
                        <li key={option.value} onMouseDown={() => handleOptionClick(option.value)}>
                            <button className="dropdown-item">{option.label}</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutoCompleteDropdown;
