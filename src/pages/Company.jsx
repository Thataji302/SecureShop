/***
**Module Name: company
 **File Name :  company.js
 **Project :    Orasi Media
 **Copyright(c) : X Platform Consulting.
 **Organization : Peafowl Inc
 **author :  chandrasekhar
 **author :  Hari
 **license :
 **version :  1.0.0
 **Created on :
 **Created on: Dec 29 2022
 **Last modified on: Dec 29 2022
 **Description : contains company details.
 ***/
import React, { useState, useEffect } from "react";
import Header from "../components/header/Header";
import Sidebar from ".././components/dashboard/sidebar";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import * as Config from "../constants/Config";
import moment from "moment";
import { location } from '././../utils/commonUtils';
import SweetAlert from 'react-bootstrap-sweetalert';

let { lambda, country, appname } = window.app;
var urlParams = location("type");
var id = location("id");

const Company = () => {
    const history = useHistory();
    const [companyData, setCompanyData] = useState({});
    const [savedCompanyData, setSavedCompanyData] = useState([]);
    const [isEdited, setIsEdited] = useState(false);
    const [companySuccess, setCompanySuccess] = useState(false);
    const [companyWarning, setCompanyWarning] = useState(false);
    

    const [formChange, setFormChange] = useState({
        companyDetails: {
            companyName: "",
            companyEmailId: "",
            phoneNumber: "",
            companyAddress: ""
        },
        managerDetails: {
            emailId: "",
            name: ""
        },
        status: "ACTIVE"
    });
    const [companyErrors, setCompanyErrors] = useState({});
    const [submitButton, setSubmitButton] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [companyWarningMessage, setCompanyWarningMessage] = useState("");
    const [branchStatus, setBranchStatus] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        if (id) {
            companyClick();
            setBranchStatus(true);
        } else {
            getCompanies();
            setBranchStatus(false);
        }
    }, []);

    const goBack = () => {
        history.goBack();
    }

    const companyClick = () => {
        const urlLink = lambda + '/companyInfo?appname=' + appname + "&id=" + id;
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    // setFormChange(response.data.result && response.data.result[0]);
                }
            });
    }

    const backClick = () => {
        setBranchStatus(false);
        getCompanies();
        setCompanyErrors({})
    }

    const getCompanies = () => {
        const urlLink = lambda + '/getCompany?appname=' + appname + "&userid=" + localStorage.getItem("userId");;
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    setSavedCompanyData(response.data.result);
                }
            });
    }

    const handleUpdate = (e) => {
        let valid = formValidation();

        if (valid) {
            setSubmitButton(true);
            let payload = {

                companyDetails: {
                    companyName: formChange.companyDetails.companyName,
                    companyEmailId: formChange.companyDetails.companyEmailId,
                    phoneNumber: formChange.companyDetails.phoneNumber,
                    companyAddress: formChange.companyDetails.companyAddress
                },
                managerDetails: {
                    name: formChange.managerDetails.name,
                    emailId: formChange.managerDetails.emailId
                }

            };
            let urlLink = lambda + '/addCompany?appname=' + appname + "&userid=" + localStorage.getItem("userId");

            if (formChange._id) {

                payload = {
                    companyName: formChange.companyDetails.companyName,
                    companyEmailId: formChange.companyDetails.companyEmailId,
                    phoneNumber: formChange.companyDetails.phoneNumber,
                    companyAddress: formChange.companyDetails.companyAddress,
                    status: formChange.companyDetails.status
                }
                urlLink = lambda + '/updateCompany?appname=' + appname + "&userid=" + localStorage.getItem("userId") + "&companyid=" + formChange.companyid;
            }



            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    console.log('response ', response)
                    if (response.data.statusCode === 200) {

                        getCompanies();
                        setSubmitButton(false);
                        // setBranchStatus(false);
                        if (!id) {
                            if (response.data.result == "company already exists") {
                                setCompanyWarningMessage("Company Already Exists");
                                setCompanyWarning(true)
                            }else if (response.data.result == "Manager already exists") {
                                setCompanyWarningMessage("Manager Already Exists");
                                setCompanyWarning(true)
                            } else {
                                setSuccessMessage("Save Successfully");
                                setFormChange({
                                    companyDetails: {
                                        companyName: "",
                                        companyEmailId: "",
                                        phoneNumber: "",
                                        companyAddress: ""
                                    },
                                    managerDetails: {
                                        emailId: "",
                                        name: ""
                                    },
                                    status: "ACTIVE"
                                });
                                setCompanySuccess(true)
                            }

                        } else {
                            setSuccessMessage("Updated Successfully");
                            setFormChange({
                                companyDetails: {
                                    companyName: "",
                                    companyEmailId: "",
                                    phoneNumber: "",
                                    companyAddress: ""
                                },
                                managerDetails: {
                                    emailId: "",
                                    name: ""
                                },
                                status: "ACTIVE"
                            });
                            setCompanySuccess(true)
                        }
                        
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    setSubmitButton(false);
                });
        }
    };


    const formValidation = () => {
        let formIsValid = true;
        const errors = {};

        // Destructuring for cleaner access
        const { companyDetails, managerDetails } = { ...formChange };

        console.log('companyDetails ', companyDetails, companyDetails?.companyName, "sss")
        // Company Details Validation
        if (companyDetails && companyDetails?.companyName == "") {
            console.log("eeesss")
            errors.companyName = "Please enter company name";
            formIsValid = false;
        }
        if (!companyDetails?.companyEmailId?.trim()) {
            errors.companyEmailId = "Please enter company email";
            formIsValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyDetails.companyEmailId)) {
            errors.companyEmailId = "Invalid email format";
            formIsValid = false;
        }
        if (!companyDetails?.phoneNumber?.trim()) {
            errors.phoneNumber = "Please enter phone number";
            formIsValid = false;
        } else if (!/^\d{10}$/.test(companyDetails.phoneNumber)) {
            errors.phoneNumber = "Invalid phone number (must be 10 digits)";
            formIsValid = false;
        }
        if (!companyDetails?.companyAddress?.trim()) {
            errors.companyAddress = "Please enter company address";
            formIsValid = false;
        }

        // Manager Details Validation
        if (!isEdited) {


            if (!managerDetails?.name?.trim()) {
                errors.managerName = "Please enter manager name";
                formIsValid = false;
            }
            if (!managerDetails?.emailId?.trim()) {
                errors.managerEmailId = "Please enter manager email";
                formIsValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(managerDetails.emailId)) {
                errors.managerEmailId = "Invalid email format";
                formIsValid = false;
            }
        }

        console.log('eeee', errors)
        setCompanyErrors(errors);
        return formIsValid;
    };



    const editClick = (newObject) => {

        id = newObject?._id;
        const updatedState = {
            ...formChange,
            companyDetails: {
                companyName: newObject.companyData.companyName,
                companyEmailId: newObject.companyData.companyEmailId,
                phoneNumber: newObject.companyData.phoneNumber,
                companyAddress: newObject.companyData.companyAddress
            },
            companyid: newObject?.companyDetails?.companyid || newObject?.companyid,
            _id: id
        };
        setIsEdited(true)
        setFormChange(updatedState);
        setBranchStatus(true);
    };

    const deleteClick = (item) => {
        debugger
        const urlLink = lambda + '/delete?appname=' + appname + "&companyid=" + item?.companyData?.companyid + "&type=company";
        axios({
            method: 'DELETE',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    getCompanies();
                }
            });
    };

    const addClick = () => {
        setIsEdited(false);
        // setFormChange({});
        setBranchStatus(true);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const [section, field] = name.split(".");
            setFormChange((prevState) => ({
                ...prevState,
                [section]: {
                    ...prevState[section],
                    [field]: value,
                },
            }));
        } else {
            setFormChange((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }

        if (!!companyErrors[name]) {
            let error = { ...companyErrors };
            delete error[name];
            setCompanyErrors(error);
        }
    };
    function onUpdate() {
        // setResultSuccess(false)
        setBranchStatus(false)
        setCompanySuccess(false)
    };

    const onCompanyWarning = ()=> {
        setCompanyWarning(false)
    }

    console.log('form', formChange)

    return (
        <>
            <div id="layout-wrapper">
                <Header />
                {companySuccess &&
                    <SweetAlert show={companySuccess}
                        custom
                        confirmBtnText="Ok"
                        confirmBtnBsStyle="primary"
                        title={successMessage}
                        onConfirm={e => onUpdate()}
                    >
                    </SweetAlert>}

                {companyWarning &&
                    <SweetAlert show={companyWarning}
                        custom
                        confirmBtnText="Ok"
                        confirmBtnBsStyle="primary"
                        title={companyWarningMessage}
                        onConfirm={e => onCompanyWarning()}
                    >
                    </SweetAlert>}

                <div className="main-content look_ups purchases">
                    <div className="page-content">
                        <div className="container-fluid">
                            <div className="card">
                                <div className="card-body">
                                    {!branchStatus && (
                                        <div className="breadcurmb">
                                            <div className="title_block">
                                                <h5>Companies</h5>
                                            </div>
                                            <div className="buttons">
                                                <button className="btn btn-primary" onClick={addClick}>Add</button>
                                            </div>
                                        </div>
                                    )}

                                    {!branchStatus ? (
                                        <div>
                                            {savedCompanyData && savedCompanyData.length > 0 ? (
                                                <div className="table-responsive">
                                                    <table className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Phone Number</th>
                                                                <th>Address</th>
                                                                <th>Manager Name</th>
                                                                <th>Manager Email</th>
                                                                <th>Created</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {savedCompanyData.map((item) => (
                                                                <tr key={item.id}>
                                                                    <td>{item?.companyData?.companyName}</td>
                                                                    <td>{item?.companyData?.companyEmailId}</td>
                                                                    <td>{item?.companyData?.phoneNumber}</td>
                                                                    <td>{item?.companyData?.companyAddress}</td>
                                                                    <td>{item.name}</td>
                                                                    <td>{item.emailId}</td>
                                                                    <td>{moment(item.created).format('DD-MM-YYYY')}</td>
                                                                    <td>{item?.companyData?.status}</td>
                                                                    <td>
                                                                        <button onClick={() => editClick(item)}>Edit</button>
                                                                        {/* <button onClick={() => deleteClick(item)}>Delete</button> */}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div>No companies found.</div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="breadcurmb">
                                                <div className="title_block">
                                                    <h5>{isEdited ? "Edit Company" : "Add Company"}</h5>
                                                </div>
                                                <div className="buttons">
                                                    <button className="btn btn-secondary" onClick={backClick}>Back</button>
                                                </div>
                                            </div>
                                            <form>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <label className="form-label">Company Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="companyDetails.companyName"
                                                                placeholder="Company Name"
                                                                value={formChange?.companyDetails?.companyName || ""}
                                                                onChange={handleChange}
                                                            />
                                                            {companyErrors?.companyName && (
                                                                <div className="text-danger">{companyErrors?.companyName}</div>
                                                            )}
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="form-label">Company Email</label>
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                name="companyDetails.companyEmailId"
                                                                placeholder="Company Email"
                                                                value={formChange?.companyDetails?.companyEmailId || ""}
                                                                onChange={handleChange}
                                                            />
                                                            {companyErrors?.companyEmailId && (
                                                                <div className="text-danger">{companyErrors?.companyEmailId}</div>
                                                            )}
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="form-label">Phone Number</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="companyDetails.phoneNumber"
                                                                placeholder="Phone Number"
                                                                value={formChange?.companyDetails?.phoneNumber || ""}
                                                                onChange={handleChange}
                                                            />
                                                            {companyErrors?.phoneNumber && (
                                                                <div className="text-danger">{companyErrors?.phoneNumber}</div>
                                                            )}
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="form-label">Address</label>
                                                            <textarea
                                                                className="form-control"
                                                                name="companyDetails.companyAddress"
                                                                placeholder="Address"
                                                                value={formChange?.companyDetails?.companyAddress || ""}
                                                                onChange={handleChange}
                                                            ></textarea>
                                                            {companyErrors?.companyAddress && (
                                                                <div className="text-danger">{companyErrors?.companyAddress}</div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <label className="form-label">Status</label>
                                                            <select
                                                                className="form-select"
                                                                aria-label="Default select example"
                                                                name="status"
                                                                value={formChange?.status}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="">Select Status</option>
                                                                <option value="ACTIVE">ACTIVE</option>
                                                                <option value="INACTVIE">INACTIVE</option>
                                                            </select>
                                                        </div>

                                                        {!isEdited && (
                                                            <>
                                                                <div className="mb-3">
                                                                    <label className="form-label">Manager Name</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="managerDetails.name"
                                                                        placeholder="Manager Name"
                                                                        value={formChange?.managerDetails?.name || ""}
                                                                        onChange={handleChange}
                                                                    />
                                                                    {companyErrors?.managerName && (
                                                                        <div className="text-danger">{companyErrors?.managerName}</div>
                                                                    )}
                                                                </div>

                                                                <div className="mb-3">
                                                                    <label className="form-label">Manager Email</label>
                                                                    <input
                                                                        type="email"
                                                                        className="form-control"
                                                                        name="managerDetails.emailId"
                                                                        placeholder="Manager Email"
                                                                        value={formChange?.managerDetails?.emailId || ""}
                                                                        onChange={handleChange}
                                                                    />
                                                                    {companyErrors?.managerEmailId && (
                                                                        <div className="text-danger">{companyErrors?.managerEmailId}</div>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-center mt-3">
                                                    <button type="button" className="btn btn-primary" onClick={handleUpdate} disabled={submitButton}>
                                                        {submitButton ? (isEdited ? "Updating..." : "Saving...") : isEdited ? "Update" : "Save"}
                                                    </button>
                                                </div>
                                            </form>


                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default Company;

