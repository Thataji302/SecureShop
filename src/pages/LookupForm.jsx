/***
**Module Name: profile
 **File Name :  profile.js
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
 **Description : contains profile page details.
 ***/
import React, { useState, useEffect } from "react";
// import Footer from "../components/dashboard/footer";
import Header from "../components/header/Header";
import Sidebar from ".././components/dashboard/sidebar";
import tmdbApi from "../api/tmdbApi";
import SweetAlert from 'react-bootstrap-sweetalert';
import SessionPopup from "./SessionPopup"
import { useHistory, Link } from "react-router-dom";
import * as Config from "../constants/Config";
import moment from "moment";
import axios from 'axios';
import { removeSpecialCharecters, location } from '././../utils/commonUtils';

let { lambda, country, appname } = window.app;
var urlParams = location("type");
var id = location("id");
const LookupForm = () => {
    const history = useHistory();
    const [countries, setCountries] = useState('');
    const [idc, setIdc] = useState('');
    const [activeId, setActiveId] = useState();
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [emailid, setCompanyEmail] = useState("");
    const [companyNumber, setCompanyNumber] = useState("");
    const [branchAddress, setBranchAddress] = useState("");
    const [companyResult, setCompanyResult] = useState("");
    const [data, setData] = useState([])
    const [success, setSuccess] = useState(false);
    const [phoneerror, setPhoneError] = useState('');
    const [nameerror, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordInput, setPasswordInput] = useState({
        password: '',
        confirmPassword: ''
    })
    const [IdcError, setIdcError] = useState('');

    const [passwordError, setPasswordErr] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);
    const [phoneNumber, setNumber] = useState("");
    const [upper, setUpper] = useState(false);
    const [limit, setLimit] = useState(false);
    const [lower, setLower] = useState(false);
    const [special, setSpecial] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [error, setError] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [loaderEnable, setLoaderEnable] = useState(false);
    const [modelName, setModelName] = useState('');
    const [modelColor, setModelColor] = useState('');
    const [modelVersion, setModelVersion] = useState('');
    const [insuranceName, setInsuranceName] = useState('');
    const [insuranceNumber, setInsuranceNumber] = useState('');
    const [commission, setCommission] = useState('');
    const [financeNumber, setFinanceNumber] = useState('');
    const [fastagNumber, setFastagNumber] = useState('');
    const [financeName, setFinanceName] = useState('');

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
       // console.log('urlParams', urlParams)
        if (urlParams == "branches") {
            branchClick()
        }
        if (urlParams == "models") {
            modelsClick()
        }
        if (urlParams == "insurance") {
            insuranceClick()
        }
        if (urlParams == "finance") {
            financeClick()
        }
        if (urlParams == "fastag") {
            fastagClick()
        }
    }, []);
    //  console.log("data", data);setCommission
    const Commission = (e) => {
        const onlyDigits = e.target.value.replace(/\D/g, "");
        setCommission(onlyDigits);

    };
    const financeCommission = (e) => {
        const onlyDigits = e.target.value.replace(/\D/g, "");
        setCommission(onlyDigits);

    };
    const fastagCommission = (e) => {
        const onlyDigits = e.target.value.replace(/\D/g, "");
        setCommission(onlyDigits);

    };
    const checkInput = (e) => {
        const onlyDigits = e.target.value.replace(/\D/g, "");
        setNumber(onlyDigits);

    };
    const checkInput1 = (e) => {
        const onlyDigits = e.target.value.replace(/\D/g, "");
        setInsuranceNumber(onlyDigits);

    };
    const checkInput2 = (e) => {
        const onlyDigits = e.target.value.replace(/\D/g, "");
        setFinanceNumber(onlyDigits);

    };
    const checkInput3 = (e) => {
        const onlyDigits = e.target.value.replace(/\D/g, "");
        setFastagNumber(onlyDigits);

    };
    const backClick = () => {
        history.goBack();
    }
    const handleMessage = (e) => {
        setNameError("");
    }
    const handleEmailMessage = (e) => {
        setError("");
        setEmailError("");
    }
    function formvalidation() {
        let formIsValid = true;
        const regEx = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}(.[a-zA-Z{2,8}])?/g;
        if (regEx.test(emailid)) {
            setEmailError("");
        } else if (!regEx.test(emailid) && emailid !== "") {
            setEmailError("Email is Not Valid");
            formIsValid = false;
        }

        // if (type === "") {
        //   setTypeError("Please Select Type");
        //   formIsValid = false;
        // }

        // if (Corporate === "") {
        //   setCategoryError("Please Select Corporate");
        //   formIsValid = false;
        // }
        if (name === "") {
            setNameError("Please Enter Name");
            formIsValid = false;
        }
        // if (emailid === "") {
        //     setEmailError("Please Enter Email");
        //     formIsValid = false;
        // }
        // if (Corporate === "COMPANY" && companyName === "") {
        //   setCompanyError("Please Enter Company Name");
        //   formIsValid = false;
        // }

        return formIsValid;


    }
    const branchClick = () => {
        // let item = JSON.parse(localStorage.getItem('item'));
        // console.log("item", item)
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + urlParams + "&lookupId=" + id  + (userid ? "&userid=" + userid : "");
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    let branchesData = response.data.result && response.data.result.data && response.data.result.data[0] && response.data.result.data[0].branches && response.data.result.data[0].branches[0]
                    setName(branchesData && branchesData.name)
        setBranchAddress(branchesData && branchesData.address)
        setNumber(branchesData && branchesData.phoneNumber)
                }
            });
        
       // console.log("name", name)
    }
    const modelsClick = () => {
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + urlParams + "&lookupId=" + id  + (userid ? "&userid=" + userid : "");
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    let modelData = response.data.result && response.data.result.data && response.data.result.data[0] && response.data.result.data[0].models && response.data.result.data[0].models[0]
                    setName(modelData && modelData.name)
        setModelColor(modelData && modelData.color)
        setModelVersion(modelData && modelData.version)
                }
            });
    }
    const insuranceClick = () => {
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + urlParams + "&lookupId=" + id  + (userid ? "&userid=" + userid : "");
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    let insuranceData = response.data.result && response.data.result.data && response.data.result.data[0] && response.data.result.data[0].insurance && response.data.result.data[0].insurance[0]
                    setName(insuranceData && insuranceData.name)
                    setCommission(insuranceData && insuranceData.commission)
                    setInsuranceNumber(insuranceData && insuranceData.phoneNumber)
                }
            });
    }
    const financeClick = () => {
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + urlParams + "&lookupId=" + id  + (userid ? "&userid=" + userid : "");
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    let financeData = response.data.result && response.data.result.data && response.data.result.data[0] && response.data.result.data[0].finance && response.data.result.data[0].finance[0]
                    setName(financeData && financeData.name)
                    setCommission(financeData && financeData.commission)
                    setFinanceNumber(financeData && financeData.phoneNumber)
                }
            });
    }
    const fastagClick = () => {
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + urlParams + "&lookupId=" + id  + (userid ? "&userid=" + userid : "");
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    let fastagData = response.data.result && response.data.result.data && response.data.result.data[0] && response.data.result.data[0].fastag && response.data.result.data[0].fastag[0]
                    setName(fastagData && fastagData.name)
                    setCommission(fastagData && fastagData.commission)
                    setFastagNumber(fastagData && fastagData.phoneNumber)
                }
            });
    }
    const handleUpdate = (e) => {
        let valid = formvalidation();
        let lookupid = id;
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        console.log("lookupid", lookupid)
        if (valid && lookupid) {
            let payload;
            // let userid = localStorage.getItem("userid")
            payload = {
                "name": name,
                "phoneNumber": phoneNumber,
                "address": branchAddress,
                "type": "branches",
                "status": "Active",
                "lookupId":lookupid
            };
            const urlLink = lambda + '/lookups?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        history.push("./branches");
                        
                    }
                });
        } else if (valid) {
            let payload;

            payload = {
                "name": name,
                "phoneNumber": phoneNumber,
                "address": branchAddress,
                "type": "branches",
                "status": "Active"
            };
            console.log('payload', payload)
            const urlLink = lambda + '/lookups?appname=' + appname + (userid ? "&userid=" + userid : "");
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        history.push("./branches");
                    }
                });
        }

        // formvalidation()
    }
    const modelUpdate = (e) => {
        let valid = formvalidation();
        let lookupid = id;
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        if (valid && lookupid) {
            let payload;
            // let userid = localStorage.getItem("userid")
            payload = {
                "name": name,
                "color": modelColor,
                "version": modelVersion,
                "type": "models",
                "status": "Active",
                "lookupId":lookupid
            };
            const urlLink = lambda + '/lookups?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        history.push("./models");
                        
                    }
                });
        } else if (valid) {
            let payload;
            payload = {
                "name": name,
                "color": modelColor,
                "version": modelVersion,
                "type": "models",
                "status": "Active",
            };
            console.log('payload', payload)
            const urlLink = lambda + '/lookups?appname=' + appname + (userid ? "&userid=" + userid : "");
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        history.push("./models");
                    }
                });
        }
        // formvalidation()
    }
    const insuranceUpdate = (e) => {
        let valid = formvalidation();
        let lookupid = id;
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        if (valid && lookupid) {
            let payload;
            // let userid = localStorage.getItem("userid")
            payload = {
                "name": name,
                "phoneNumber": insuranceNumber,
                "type": "insurance",
                "status": "Active",
                "commission": commission,
                "lookupId":lookupid
            };
            const urlLink = lambda + '/lookups?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        history.push("./insurance");
                        
                    }
                });
        } else if (valid) {
            let payload;
            payload = {
                "name": name,
                "phoneNumber": insuranceNumber,
                "type": "insurance",
                "status": "Active",
                "commission": commission,
            };
            console.log('payload', payload)
            const urlLink = lambda + '/lookups?appname=' + appname + (userid ? "&userid=" + userid : "");
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        history.push("./insurance");
                    }
                });
        }
        // formvalidation()
    }
    const financeUpdate = (e) => {
        let valid = formvalidation();
        let lookupid = id;
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        if (valid && lookupid) {
            let payload;
            // let userid = localStorage.getItem("userid")
            payload = {
                "name": name,
                "phoneNumber": financeNumber,
                "type": "finance",
                "status": "Active",
                "commission": commission,
                "lookupId":lookupid
            };
            const urlLink = lambda + '/lookups?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        history.push("./finance");
                        
                    }
                });
        } else if (valid) {
            let payload;
            payload = {
                "name": name,
                "phoneNumber": financeNumber,
                "type": "finance",
                "commission": commission,
                "status": "Active",
            };
            console.log('payload', payload)
            const urlLink = lambda + '/lookups?appname=' + appname + (userid ? "&userid=" + userid : "");
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        history.push("./finance");
                    }
                });
        }
        // formvalidation()
    }
    const fastagUpdate = (e) => {
        let valid = formvalidation();
        let lookupid = id;
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        if (valid && lookupid) {
            let payload;
            // let userid = localStorage.getItem("userid")
            payload = {
                "name": name,
                "phoneNumber": fastagNumber,
                "type": "fastag",
                "status": "Active",
                "commission": commission,
                "lookupId":lookupid
            };
            const urlLink = lambda + '/lookups?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        history.push("./fastag");
                        
                    }
                });
        } else if (valid) {
            let payload;
           // let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
            payload = {
                "name": name,
                "phoneNumber": fastagNumber,
                "type": "fastag",
"status": "Active",
"commission": commission,

            };
            console.log('payload', payload)
            const urlLink = lambda + '/lookups?appname=' + appname + (userid ? "&userid=" + userid : "");
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        history.push("./fastag");
                    }
                });
        }
        // formvalidation()
    }

    let type = localStorage.getItem("formType");
    return (
        <>
            <div id="layout-wrapper">
                <div className="dashboard">
                    <Header />
                    <div className="main-content profile">

                        <div className="page-content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <div className="title-block">
                                                    {/* <div className="d-flex">
                                                        <h4 className="mb-2 card-title">Company</h4>
                                                    </div> */}
                                                    <div className="property_info">
                                                        <button type="button" className="back" onClick={backClick}><span className="material-symbols-outlined">chevron_left</span>back</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md-container">
                                    <div className="card-block">
                                        <div className="row profile-pic">
                                            {type === "branches" &&
                                                <div className="col-lg-8 col-md-8 col-xs-12">
                                                    <h3>Branch Details</h3>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="name" placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{nameerror}</span> : ""
                                                        }
                                                        <label for="floatingInput">Branch Name</label>
                                                    </div>
                                                    {/* <div className="form-floating mb-3">
                                                    <input type="text" className="form-control" id="companyEmail" placeholder="Enter Company Email" name="emailid" value={emailid} onChange={(e) => setCompanyEmail(e.target.value)} onFocus={(e) => handleEmailMessage(e)} autoComplete="on" required /> {emailError != "" ?
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{emailError}</span> : ""
                                                    }
                                                    <label for="floatingInput">Company Email Id</label>
                                                </div> */}
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="companyNumber" placeholder="Enter Number" name="phoneNumber" value={phoneNumber} onChange={e => checkInput(e)} autoComplete="on" />
                                                        <label for="floatingInput">Phone Number</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="name" placeholder="Enter Address" name="address" value={branchAddress} onChange={(e) => setBranchAddress(e.target.value)} autoComplete="on" />
                                                        <label for="floatingInput">Address</label>
                                                    </div>
                                                    <button className="fill_btn" onClick={e => handleUpdate(e)} style={{ cursor: 'pointer' }}> Update</button>
                                                </div>
                                            }
                                            {type === "models" &&
                                                <div className="col-lg-8 col-md-8 col-xs-12">
                                                    <h3>Models Details</h3>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="name" placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{nameerror}</span> : ""
                                                        }
                                                        <label for="floatingInput">Model Name</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <select className="form-select" aria-label="Default select example" name="color" value={modelColor} onChange={(e) => setModelColor(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required>
                                                            <option value="">Select Color </option>
                                                            <option value="Red">Red </option>
                                                            <option value="Black">Black</option>
                                                            <option value="Yellow"> Yellow</option>
                                                            <option value="White"> White</option>
                                                            <option value="Blue"> Blue</option>
                                                            <option value="Green"> Green</option>
                                                            <option value="Silver"> Silver</option>
                                                            <option value="Maroon"> Maroon</option>
                                                        </select>
                                                        {/* <label for="floatingInput">Color</label> */}
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <select className="form-select" aria-label="Default select example" name="version" value={modelVersion} onChange={(e) => setModelVersion(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required>
                                                            <option value="">Select Version </option>
                                                            <option value="Low Version">Low Version </option>
                                                            <option value="Mid Version">Mid Version</option>
                                                            <option value="High Version"> High Version</option>

                                                        </select>
                                                        {/* <label for="floatingInput">Versions</label> */}
                                                    </div>
                                                    <button className="fill_btn" onClick={e => modelUpdate(e)} style={{ cursor: 'pointer' }}> Update</button>
                                                </div>
                                            }
                                            {type === "insurance" &&
                                                <div className="col-lg-8 col-md-8 col-xs-12">
                                                    <h3>Insurance Details</h3>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="name" placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{nameerror}</span> : ""
                                                        }
                                                        <label for="floatingInput">Insurance Name</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="commission" placeholder="Enter Commission" name="commission" value={commission} onChange={e => Commission(e)} autoComplete="on" />
                                                        <label for="floatingInput">Commission %</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="companyNumber" placeholder="Enter Number" name="phoneNumber" value={insuranceNumber} onChange={e => checkInput1(e)} autoComplete="on" />
                                                        <label for="floatingInput">Phone Number</label>
                                                    </div>
                                                    <button className="fill_btn" onClick={e => insuranceUpdate(e)} style={{ cursor: 'pointer' }}> Update</button>
                                                </div>
                                            }
                                            {type === "finance" &&
                                                <div className="col-lg-8 col-md-8 col-xs-12">
                                                    <h3>Finance Details</h3>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="name" placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{nameerror}</span> : ""
                                                        }
                                                        <label for="floatingInput">Finance Name</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="commission" placeholder="Enter Commission" name="commission" value={commission} onChange={e => financeCommission(e)} autoComplete="on" />
                                                        <label for="floatingInput">Commission %</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="companyNumber" placeholder="Enter Number" name="phoneNumber" value={financeNumber} onChange={e => checkInput2(e)} autoComplete="on" />
                                                        <label for="floatingInput">Phone Number</label>
                                                    </div>
                                                    <button className="fill_btn" onClick={e => financeUpdate(e)} style={{ cursor: 'pointer' }}> Update</button>
                                                </div>
                                            }
                                            {type === "fastag" &&
                                                <div className="col-lg-8 col-md-8 col-xs-12">
                                                    <h3>Fastag Details</h3>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="name" placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{nameerror}</span> : ""
                                                        }
                                                        <label for="floatingInput">Fastag Name</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="commission" placeholder="Enter Commission" name="commission" value={commission} onChange={e => fastagCommission(e)} autoComplete="on" />
                                                        <label for="floatingInput">Commission %</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="companyNumber" placeholder="Enter Number" name="phoneNumber" value={fastagNumber} onChange={e => checkInput3(e)} autoComplete="on" />
                                                        <label for="floatingInput">Phone Number</label>
                                                    </div>
                                                    <button className="fill_btn" onClick={e => fastagUpdate(e)} style={{ cursor: 'pointer' }}> Update</button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <footer className="footer">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <p className="rights">2024 ALL RIGHTS RESERVED MOTOR SALES</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="text-sm-end d-none d-sm-block">
                                            Design & Develop by Themesbrand
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>

                </div>
            </div>

        </>
    );
};

export default LookupForm;
