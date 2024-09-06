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

let { lambda, country, appname } = window.app;

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
    const [financeNumber, setFinanceNumber] = useState('');
    const [financeName, setFinanceName] = useState('');

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }

    }, []);
    //  console.log("data", data);
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
    const handleUpdate = (e) => {
        let valid = formvalidation();
        // if(companyResult?.companyId){
        //     let payload;
        //     let userid = localStorage.getItem("userid")
        //     payload = {
        //         "name": name,
        //         "emailid": emailid,
        //         "phoneNumber": phoneNumber,
        //         "companyAddress": companyAddress
        //     };
        //     const urlLink = lambda + '/updateCompany?appname=' + appname + "&companyId=" + companyResult?.companyId;
        //     axios({
        //         method: 'POST',
        //         url: urlLink,
        //         data: payload
        //     })
        //         .then(function (response) {
        //             if (response.data.result) {
        //                 // localStorage.setItem("previousid", response.data.result)
        //                 history.push("./yellowForm");
        //             }
        //         });
        // }else if(valid){
        //     let payload;
        //     let userid = localStorage.getItem("userid")
        //     payload = {
        //         "name": name,
        //         "emailid": emailid,
        //         "phoneNumber": phoneNumber,
        //         "companyAddress": companyAddress
        //     };
        //     const urlLink = lambda + '/addCompany?appname=' + appname + (userid ? "&userid=" + userid : "");
        //     axios({
        //         method: 'POST',
        //         url: urlLink,
        //         data: payload
        //     })
        //         .then(function (response) {
        //             if (response.data.statusCode === 200) {
        //                 // localStorage.setItem("previousid", response.data.result)
        //                 history.push("./yellowForm");
        //             }
        //         });
        // }
        if(valid){
                let payload;
               // let userid = localStorage.getItem("userid")
                payload = {
                    "name": name,
                    "phoneNumber": phoneNumber,
                    "address": branchAddress,
                    "type":"branches"
                };
                console.log('payload',payload)
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
            }
       // formvalidation()
    }
    const modelUpdate = (e) => {
        let valid = formvalidation();
        if(valid){
                let payload;
               // let userid = localStorage.getItem("userid")
                payload = {
                    "name": modelName,
                    "color": modelColor,
                    "address": modelVersion,
                    "type":"models"
                };
                console.log('payload',payload)
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
            }
       // formvalidation()
    }
    const insuranceUpdate = (e) => {
        let valid = formvalidation();
        if(valid){
                let payload;
               // let userid = localStorage.getItem("userid")
                payload = {
                    "name": name,
                    "phoneNumber": insuranceNumber,
                    "type":"insurance"
                };
                console.log('payload',payload)
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
            }
       // formvalidation()
    }
    const financeUpdate = (e) => {
        let valid = formvalidation();
        if(valid){
                let payload;
               // let userid = localStorage.getItem("userid")
                payload = {
                    "name": name,
                    "phoneNumber": financeNumber,
                    "type":"finance"
                };
                console.log('payload',payload)
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
            }
       // formvalidation()
    }
    let type = localStorage.getItem("formType")
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
                                                        <input type="text" className="form-control" id="name" placeholder="Enter Branch Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
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
                                                        <input type="text" className="form-control" id="companyNumber" placeholder="Enter Branch Number" name="phoneNumber" value={phoneNumber} onChange={e => checkInput(e)} autoComplete="on" />
                                                        <label for="floatingInput">Phone Number</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="name" placeholder="Enter Branch Address" name="address" value={branchAddress} onChange={(e) => setBranchAddress(e.target.value)} autoComplete="on" />
                                                        <label for="floatingInput">Address</label>
                                                    </div>
                                                    <button className="fill_btn" onClick={e => handleUpdate(e)} style={{ cursor: 'pointer' }}> Update</button>
                                                </div>
                                            }
                                            {type === "models" &&
                                                <div className="col-lg-8 col-md-8 col-xs-12">
                                                    <h3>Models Details</h3>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="name" placeholder="Enter Model Name" name="name" value={modelName} onChange={(e) => setModelName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
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
                                                        <input type="text" className="form-control" id="name" placeholder="Enter Insurance Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{nameerror}</span> : ""
                                                        }
                                                        <label for="floatingInput">Insurance Name</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="companyNumber" placeholder="Enter Branch Number" name="phoneNumber" value={insuranceNumber} onChange={e => checkInput1(e)} autoComplete="on" />
                                                        <label for="floatingInput">Phone Number</label>
                                                    </div>
                                                    <button className="fill_btn" onClick={e => insuranceUpdate(e)} style={{ cursor: 'pointer' }}> Update</button>
                                                </div>
                                            }
                                            {type === "finance" &&
                                                <div className="col-lg-8 col-md-8 col-xs-12">
                                                    <h3>Finance Details</h3>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="name" placeholder="Enter Finance Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{nameerror}</span> : ""
                                                        }
                                                        <label for="floatingInput">Finance Name</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="companyNumber" placeholder="Enter Branch Number" name="phoneNumber" value={financeNumber} onChange={e => checkInput2(e)} autoComplete="on" />
                                                        <label for="floatingInput">Phone Number</label>
                                                    </div>
                                                    <button className="fill_btn" onClick={e => financeUpdate(e)} style={{ cursor: 'pointer' }}> Update</button>
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
