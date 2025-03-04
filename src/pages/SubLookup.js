import React, { useState, useEffect } from "react";
import StateDropdown from "./StateDropdown";
import LookupTable from "./LookupTable";
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from "react-bootstrap/Modal";
import AutoCompleteDropdown from "./AutoCompleteDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SubLookup = ({ tabData, imageCloudfront, tabSelected }) => {
    const [formValues, setFormValues] = useState({});
    const [data, setData] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showTable, setShowTable] = useState(true);
    const [success, setSuccess] = useState(false);
    const [title, setTitle] = useState("");
    const [isError, setIsError] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);




    const { formFields, services, columns, labels } = tabData;



    const getSummaryData = () => {

        fetch(services?.summaryAPI.url, { method: services?.summaryAPI.method })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setData(data.result);
                }
            })
            .catch(error => console.error('Error:', error));

    }


    useEffect(() => {
        if (showTable) {
            getSummaryData();
        }
    }, [showTable])

    useEffect(() => {
        if (tabSelected === tabData.tab) {
            getSummaryData();
        }
    }, [tabSelected])


    // Handle input change
    const handleChange = (e) => {
        
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    // Handle state selection
    const handleStateSelect = (state) => {
        setFormValues((prev) => ({ ...prev, state }));
        validateField("state", state);
    };

    // Validate a field
    const validateField = (name, value) => {
        const field = formFields.find(f => f.name === name);
        if (!field) return;

        let errorMsg = "";

        if (field.required && !value) {
            errorMsg = `${field.label} is required.`;
        } else if (field.pattern && !field.pattern.test(value)) {
            errorMsg = `Invalid ${field.label}.`;
        }

        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };

    // Validate entire form
    const validateForm = () => {
        let valid = true;
        let newErrors = {};

        formFields.forEach(field => {
            const value = formValues[field.name] || "";
            let errorMsg = "";

            if (field.required && !value) {
                errorMsg = `${field.label} is required.`;
                valid = false;
            } else if (field.pattern && !field.pattern.test(value)) {
                errorMsg = `Invalid ${field.label}.`;
                valid = false;
            }

            if (errorMsg) {
                newErrors[field.name] = errorMsg;
            }
        });

        setErrors(newErrors);
        return valid;
    };

    const changeId=(url)=>{
        if (tabData.tab === 'Models') {
            url = url.replace("$id", `${formValues.modelid}`)
        }
        else if (tabData.tab === 'Branches') {
            url = url.replace("$id", `${formValues.branchid}`)
        } else if (tabData.tab === 'Insurance') {
            url = url.replace("$id", `${formValues.insuranceid}`)
        } else if (tabData.tab === 'Finance') {
            url = url.replace("$id", `${formValues.financeid}`)
        } else if (tabData.tab === 'Fastag') {
            url = url.replace("$id", `${formValues.fastagid}`)
        } else if (tabData.tab === 'Vendor') {
            url = url.replace("$id", `${formValues.vendorid}`)
        } else {
            url = url.replace("$id", `${formValues._id}`)
        }
        return url;
    }


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const api = formValues._id
            ? services.updateAPI
            : services.createAPI;
        if (!formValues._id) {
            formValues["status"] = "Active";
        }
        let { url, method } = api;
        url = changeId(url)
        

        let body = Object.assign({}, formValues);
        delete body._id;


        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {

                setTitle(data.result)
                setSuccess(true);
                if (data.result) {
                    if (api.errors.includes(data.result)) {
                        setIsError(true)
                    } else {
                        setIsError(false)
                    }
                }
                // onSuccess(data);
            }
        } catch (error) {
            console.log(error.message)
            alert("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const addClick = () => {
        setFormValues({})
        setShowTable(false)
    }
    const backClick = () => {
        setShowTable(true)
    }
    const okClick = () => {
        setSuccess(false);
        setShowTable(!isError)
    }
    const editClick = (item) => {
        setFormValues(item);
        setShowTable(false)
    }
    const deleteClick = (item) => {
        setFormValues(item);
        setDeleteConfirm(true)
    }

    const deleteData = async () => {
        setDeleteConfirm(false);
        setIsSubmitting(true);
        let url = services?.deleteAPI?.url;
        if (formValues._id) {
            url = changeId(url)
        } else {
            console.error("Missing _id in formValues");
            alert("Error: Missing item ID.");
            setIsSubmitting(false);
            return;
        }

        // let body = { ...formValues };
        // delete body._id;
        let body = {};

        const method = services?.deleteAPI?.method || "DELETE";

        const options = {
            method,
            headers: { "Content-Type": "application/json" }
        };

        if (method !== "DELETE") {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            setFormValues({});
            if (!response.ok) {
                throw new Error(data.message || "Failed to delete item.");
            }
            setTitle(data.result);
            setSuccess(true);
            setIsError(!data.result);
        } catch (error) {
            console.error("Delete Error:", error);
            alert(error.message || "Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            {
                showTable ?
                    <LookupTable data={data} header={tabData.tab} columns={columns} addClick={addClick} imageCloudfront={imageCloudfront} editClick={editClick} deleteClick={deleteClick} /> :
                    <form onSubmit={handleSubmit}>
                        <div className="form_seciton">
                            <div className="breadcurmb">
                                <div className="title_block">
                                    <h5>{labels.add}</h5>
                                </div>
                                <div className="buttons">

                                    <a className="back_btn" onClick={backClick} style={{ cursor: 'pointer' }}><span className="material-icons icon"> arrow_back</span>BACK</a>
                                </div>
                            </div>
                            <div className="row">
                                {formFields.map((field, index) => {
                                    if (field.conditional && !field.conditional(formValues)) return null;

                                    return (
                                        <div className="col-md-6" key={index}>
                                            <div className="mb-3 input-field">
                                                <label className="form-label">{field.label}</label>

                                                {field.type === "date" && (
                                                    // <DatePicker
                                                    //     selected={formValues[field.name] || null}
                                                    //     onChange={handleChange}
                                                    //     className="form-control"
                                                    //     dateFormat="dd-MM-YYYY"
                                                    //     placeholderText={`Select ${field.label}`}
                                                    // />
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name={field.name}
                                                        placeholder={`Enter ${field.label}`}
                                                        value={formValues[field.name] || ""}
                                                        onChange={handleChange}
                                                    />
                                                )}

                                                {field.type === "text" ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name={field.name}
                                                        placeholder={`Enter ${field.label}`}
                                                        value={formValues[field.name] || ""}
                                                        onChange={handleChange}
                                                    />
                                                ) : field.type === "select" ? (

                                                    field?.autoinput ?
                                                        <AutoCompleteDropdown field={field} formValues={formValues} handleChange={handleChange} />
                                                        :
                                                        <select
                                                            className="form-select"
                                                            name={field.name}
                                                            value={formValues[field.name] || ""}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select {field.label}</option>
                                                            {field?.options?.map((option) => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                ) : field.type === "dropdown" ? (
                                                    <StateDropdown onSelect={handleStateSelect} state={formValues.state} />
                                                ) : null}

                                                {errors[field.name] && <span className="errormsg text-danger">{errors[field.name]}</span>}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Sub Branch Selection */}
                                {formValues.branch === "subbranch" && (
                                    <div className="col-md-6">
                                        <div className="mb-3 input-field">
                                            <label className="form-label">Main Branch</label>
                                            <select
                                                className="form-select"
                                                name="subbranch"
                                                value={formValues.subbranch || ""}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Main Branch</option>
                                                {data
                                                    ?.filter(item => item.branch === "mainbranch" && item.status === "Active")
                                                    .map((eachItem) => (
                                                        <option key={eachItem._id} value={eachItem._id}>
                                                            {eachItem.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="col-md-12 mb-2">
                                    <button className="update_btn" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

            }

            {success && <SweetAlert show={success}
                custom
                confirmBtnText="Ok"
                confirmBtnBsStyle="primary"
                title={title}
                onConfirm={okClick}
            ></SweetAlert>}

            {deleteConfirm &&
                <Modal className="access-denied delete_popup" show={deleteConfirm}>

                    <div className="modal-body">
                        <div className="container">
                            <button className="close-btn" onClick={e => setDeleteConfirm(false)}><span className="material-icons">close</span></button>
                            <span className="material-icons access-denied-icon">delete_outline</span>
                            <h3>Delete</h3>
                            <p>This action cannot be undone.</p>
                            <p>Are you sure you want to delete ?</p>
                            <div className="popup-footer">
                                <button className="fill_btn " onClick={e => deleteData()}> Yes, Delete</button>
                            </div>
                        </div>
                    </div>

                </Modal>}
        </>

    );
};

export default SubLookup;
