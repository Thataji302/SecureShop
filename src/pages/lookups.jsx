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
const Lookups = () => {
    const history = useHistory();
    const [countries, setCountries] = useState('');
    const [idc, setIdc] = useState('');
    const [activeId, setActiveId] = useState();
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [emailid, setCompanyEmail] = useState("");
    const [companyNumber, setCompanyNumber] = useState("");
    const [branchAddress, setBranchAddress] = useState("");
    const [dealerCode, setDealerCode] = useState("");
    const [companyResult, setCompanyResult] = useState("");
    const [data, setData] = useState([])
    const [success, setSuccess] = useState(false);
    const [phoneerror, setPhoneError] = useState('');
    const [nameerror, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [resultSuccess, setResultSuccess] = useState(false);
    const [passwordInput, setPasswordInput] = useState({
        password: '',
        confirmPassword: ''
    })
    const [IdcError, setIdcError] = useState('');
    const [config, setConfig] = useState({});
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
    const [vendorNumber, setVendorNumber] = useState('');
    const [financeName, setFinanceName] = useState('');
    const [savedPropertyData, setSavedPropertyData] = useState({})
    const [branchStatus, setBranchStatus] = useState(false);
    const [modelStatus, setModelStatus] = useState(false);
    const [insuranceStatus, setInsuranceStatus] = useState(false);
    const [financeStatus, setFinanceStatus] = useState(false);
    const [fastagStatus, setFastagStatus] = useState(false);
    const [vendorStatus, setVendorStatus] = useState(false);

    useEffect(() => {
        if (window.site) {
            setConfig(window.site);

        }

    }, [window.site]);
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
       
            branchTab()
            console.log("hiiiiiiiiiiiiiii")
        

        // console.log('urlParams', urlParams)
        if (urlParams == "branches") {
            branchClick()
            setBranchStatus(true)
        }
        if (urlParams == "models") {
            modelsClick()
            setModelStatus(true)
        }
        if (urlParams == "insurance") {
            insuranceClick()
            setInsuranceStatus(true)
        }
        if (urlParams == "finance") {
            financeClick()
            setFinanceStatus(true)
        }
        if (urlParams == "fastag") {
            fastagClick()
            setFastagStatus(true)
        }
        if (urlParams == "vendor") {
            vendorClick()
            setVendorStatus(true)
        }
    }, []);
    //  console.log("data", data);setCommission
    const goBack = () => {
        history.goBack();
    }
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
    const checkInput4 = (e) => {
        const onlyDigits = e.target.value.replace(/\D/g, "");
        setVendorNumber(onlyDigits);

    };
    const backClick = () => {
        // history.goBack();
        setBranchStatus(false)
    }
    const modelBack = () => {
        // history.goBack();
        setModelStatus(false)
    }
    const insuranceBack = () => {
        // history.goBack();
        setInsuranceStatus(false)
    }
    const financeBack = () => {
        // history.goBack();
        setFinanceStatus(false)
    }
    const fastagBack = () => {
        // history.goBack();
        setFastagStatus(false)
    }
    const vendorBack = () => {
        // history.goBack();
        setVendorStatus(false)
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
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + urlParams + "&lookupId=" + id + (userid ? "&userid=" + userid : "");
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
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + urlParams + "&lookupId=" + id + (userid ? "&userid=" + userid : "");
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
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + urlParams + "&lookupId=" + id + (userid ? "&userid=" + userid : "");
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
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + urlParams + "&lookupId=" + id + (userid ? "&userid=" + userid : "");
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
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + urlParams + "&lookupId=" + id + (userid ? "&userid=" + userid : "");
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
    const vendorClick = () => {
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + urlParams + "&lookupId=" + id + (userid ? "&userid=" + userid : "");
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    let vendorData = response.data.result && response.data.result.data && response.data.result.data[0] && response.data.result.data[0].vendor && response.data.result.data[0].vendor[0]
                    setName(vendorData && vendorData.name)
                    setVendorNumber(vendorData && vendorData.Gst)
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
                "lookupId": lookupid,
                "userid": userid,
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
                        setBranchStatus(false)
                        branchTab()

                    }
                });
        } else if (valid) {
            let payload;

            payload = {
                "name": name,
                "phoneNumber": phoneNumber,
                "address": branchAddress,
                "type": "branches",
                "status": "Active",
                "userid": userid,
            };
            console.log('payload', payload)
            const urlLink = lambda + '/lookups?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./branches");
                        setBranchStatus(false)
                        branchTab()
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
                "lookupId": lookupid,
                "userid": userid,
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
                        // history.push("./models");
                        setModelStatus(false)
                        modelTab()
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
                "userid": userid,
            };
            console.log('payload', payload)
            const urlLink = lambda + '/lookups?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./models");
                        setModelStatus(false)
                        modelTab()
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
                "lookupId": lookupid,
                "userid": userid,
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
                        //history.push("./insurance");
                        setInsuranceStatus(false)
                        insuranceTab()
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
                "userid": userid,
            };
            console.log('payload', payload)
            const urlLink = lambda + '/lookups?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                       // history.push("./insurance");
                       setInsuranceStatus(false)
                       insuranceTab()
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
                "userid": userid,
                "lookupId": lookupid
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
                        //history.push("./finance");
                        setFinanceStatus(false)
                        financeTab()
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
                "userid": userid,
            };
            console.log('payload', payload)
            const urlLink = lambda + '/lookups?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        //history.push("./finance");
                        setFinanceStatus(false)
                        financeTab()
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
                "lookupId": lookupid,
                "userid": userid,
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
                       // history.push("./fastag");
                       setFastagStatus(false)
                       fastagTab()

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
                "userid": userid,

            };
            console.log('payload', payload)
            const urlLink = lambda + '/lookups?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                       // history.push("./fastag");
                       setFastagStatus(false)
                       fastagTab()
                    }
                });
        }
        // formvalidation()
    }
    const vendorUpdate = (e) => {
        let valid = formvalidation();
        let lookupid = id;
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        if (valid && lookupid) {
            let payload;
            // let userid = localStorage.getItem("userid")
            payload = {
                "name": name,
                "Gst": fastagNumber,
                "type": "vendor",
                "status": "Active",
                "lookupId": lookupid,
                "userid": userid,
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
                       // history.push("./fastag");
                       setVendorStatus(false)
                       vendorTab()

                    }
                });
        } else if (valid) {
            let payload;
            // let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
            payload = {
                "name": name,
                "Gst": fastagNumber,
                "type": "vendor",
                "status": "Active",
                "userid": userid,

            };
            console.log('payload', payload)
            const urlLink = lambda + '/lookups?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                       // history.push("./fastag");
                       setVendorStatus(false)
                       vendorTab()
                    }
                });
        }
        // formvalidation()
    }
    const branchTab = (e) => {
        const type = "branches";
        GetPropertyData(type);
        setBranchStatus(false)
    }
    const modelTab = (e) => {
        const type = "models";
        GetPropertyData(type);
        setModelStatus(false)
    }
    const insuranceTab = (e) => {
        const type = "insurance";
        GetPropertyData(type);
        setInsuranceStatus(false)
    }
    const financeTab = (e) => {
        const type = "finance";
        GetPropertyData(type);
        setFinanceStatus(false)
    }
    const fastagTab = (e) => {
        const type = "fastag";
        GetPropertyData(type);
        setFastagStatus(false)
    }
    const vendorTab = (e) => {
        const type = "vendor";
        GetPropertyData(type);
        setVendorStatus(false)
    }
    
    const GetPropertyData = (type) => {
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + type + (userid ? "&userid=" + userid : "");
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    setSavedPropertyData(response.data.result && response.data.result.data && response.data.result.data[0])
                }
            });
    }

    const editClick = (e, item) => {
        let type = item && item.type;
        let id = item && item.lookupId;
        //localStorage.setItem("item", JSON.stringify(item));
        //history.push("/lookupForm")
        localStorage.removeItem("formType");
        window.location = `/lookups?id=${id}&type=${type} `;
    }
    const deleteClick = (e, item) => {
        let type = item && item.type;
        let id = item && item.lookupId;
        let lookupid = id;
        if (lookupid) {
            let payload;
            // let userid = localStorage.getItem("userid")
            payload = {
                "name": item && item.name,
                "phoneNumber": item && item.phoneNumber,
                "address": item && item.address,
                "type": type,
                "status": "Archive",
                "lookupId": lookupid
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
                        // history.push("./fastag");
                        setResultSuccess(true)
                    }
                });
        }
    }
    function onConfirm1() {
        setResultSuccess(false)
        const type = "branches";
        GetPropertyData(type);
    };
    let type = localStorage.getItem("formType");
    let imageCloudfront;
    if (config.common && config.common.imageCloudfront) {
        imageCloudfront = config.common.imageCloudfront;
    }
    console.log("imageCloudfront",imageCloudfront)
    const addClick = (e, item) => {
        setBranchStatus(true)
        setName("")
                    setBranchAddress("")
                    setNumber("")
    }
    const modeladdClick = (e, item) => {
        setModelStatus(true)
        setName("")
                    setModelColor("")
                    setModelVersion("")
    }
    const insuranceaddClick = (e, item) => {
        setInsuranceStatus(true)
        setName("")
                    setCommission("")
                    setInsuranceNumber("")
    }
    const financeaddClick = (e, item) => {
        setFinanceStatus(true)
        setName("")
                    setCommission("")
                    setFinanceNumber("")
    }
    const fastagaddClick = (e, item) => {
        setName("")
                    setCommission("")
                    setFastagNumber("")
        setFastagStatus(true)
    }
    const vendoraddClick = (e, item) => {
        setName("")
        setVendorNumber("")
                    setVendorStatus(true)
    }
    return (
        <>
            <div id="layout-wrapper">
                <div className="dashboard">
                    <Header />
                    <div className="main-content look_ups">

                        <div className="page-content">
                            <div className="container-fluid">
                                <div className="breadcurmb">
                                    <div className="title_block">
                                        <h5>Lookups</h5>
                                    </div>
                                    <div className="buttons">

                                        <button className=" btn-primary">Back</button>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">


                                        <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                            <li className="nav-item" onClick={branchTab}>
                                                <a className="nav-link active" data-bs-toggle="tab" href="#ENTITY" role="tab">
                                                    <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                    <span className="d-none d-sm-block">Branches</span>
                                                </a>
                                            </li>
                                            <li className="nav-item" onClick={modelTab}>
                                                <a className="nav-link " data-bs-toggle="tab" href="#APPLICANT" role="tab">
                                                    <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                    <span className="d-none d-sm-block">Models</span>
                                                </a>
                                            </li>
                                            <li className="nav-item" onClick={insuranceTab}>
                                                <a className="nav-link " data-bs-toggle="tab" href="#HMDA" role="tab">
                                                    <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                    <span className="d-none d-sm-block">Insurance</span>
                                                </a>
                                            </li>
                                            <li className="nav-item" onClick={financeTab}>
                                                <a className="nav-link " data-bs-toggle="tab" href="#fin" role="tab">
                                                    <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                    <span className="d-none d-sm-block">Finance</span>
                                                </a>
                                            </li>
                                            <li className="nav-item" onClick={fastagTab}>
                                                <a className="nav-link " data-bs-toggle="tab" href="#fas" role="tab">
                                                    <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                    <span className="d-none d-sm-block">Fastag</span>
                                                </a>
                                            </li>
                                            <li className="nav-item" onClick={vendorTab}>
                                                <a className="nav-link " data-bs-toggle="tab" href="#ven" role="tab">
                                                    <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                    <span className="d-none d-sm-block">Vendor</span>
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="tab-content pt-15 text-muted">
                                            <div className="tab-pane active branches" id="ENTITY" role="tabpanel">
                                                {!branchStatus &&
                                                    <div className="breadcurmb">
                                                        <div className="title_block">
                                                            <h5>branches</h5>
                                                        </div>
                                                        <div className="buttons">

                                                            <button className=" btn-primary" onClick={addClick}>add</button>
                                                        </div>
                                                    </div>}
                                                {!branchStatus ?
                                                    <div className="table-responsive">
                                                        <table className="table table-striped ">
                                                            <thead>
                                                                <tr>

                                                                    {/* <th className="align-middle">S No</th> */}
                                                                    <th className="align-middle">Branch Name</th>
                                                                    <th className="align-middle">Phone Number</th>
                                                                    <th className="align-middle">Created</th>
                                                                    <th className="align-middle">Address</th>
                                                                    <th className="align-middle">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {savedPropertyData && savedPropertyData?.branches && savedPropertyData?.branches?.length > 0 ? savedPropertyData?.branches?.map((eachItem, key) => {
                                                                    return (eachItem && eachItem.status == "Active" &&
                                                                        <tr key={key}>
                                                                            <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                            <td>{eachItem?.phoneNumber ? eachItem?.phoneNumber : 'N/A'}</td>
                                                                            <td>{eachItem?.created ? eachItem?.created : 'N/A'}</td>
                                                                            <td>{eachItem?.address ? eachItem?.address : 'N/A'}</td>
                                                                            <td><div className="d-flex">
                                                                                <a className="action-button edit tooltip-container" onClick={e => editClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Edit</span>edit</span></a>
                                                                                <a className="action-button delete tooltip-container" onClick={e => deleteClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Delete</span>delete</span></a></div></td>
                                                                        </tr>
                                                                    )

                                                                }

                                                                )

                                                                    :
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="card mb-3">
                                                                                <div className="card-body">
                                                                                    <div className="new_search error_wrapper">
                                                                                        <img src={imageCloudfront + "propertyCalculator/images/not-found.png"} height="300px" />
                                                                                        <p>There are no branches available.</p>
                                                                                        <br/>
                                                                                        <p>Please add branches.</p>
                                                                                        {/* <button className="button_style" href="#" onClick={goBack}> GO BACK</button> */}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div> :

                                                    <div className="form_seciton">
                                                        <div className="breadcurmb">
                                                            <div className="title_block">
                                                                <h5>add branch</h5>
                                                            </div>
                                                            <div className="buttons">

                                                                <a href="#" className="back_btn" onClick={backClick} style={{ cursor: 'pointer' }}><span className="material-icons icon"> arrow_back</span>BACK</a>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Branch Name</label>
                                                                    <input type="text" className="form-control" id="name" placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                                        <span className="errormsg" style={{
                                                                            fontWeight: 'bold',
                                                                            color: 'red',
                                                                        }}>{nameerror}</span> : ""
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Phone Number</label>
                                                                    <input type="text" className="form-control" id="companyNumber" placeholder="Enter Number" name="phoneNumber" value={phoneNumber} onChange={e => checkInput(e)} autoComplete="on" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Address</label>
                                                                    <input type="text" className="form-control" id="name" placeholder="Enter Address" name="address" value={branchAddress} onChange={(e) => setBranchAddress(e.target.value)} autoComplete="on" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Dealer Code</label>
                                                                    <input type="text" className="form-control" id="name" placeholder="Enter Dealer Code" name="dealerCode" value={dealerCode} onChange={(e) => setDealerCode(e.target.value)} autoComplete="on" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12 mb-2">
                                                                <button className="update_btn" type="submit" onClick={e => handleUpdate(e)} style={{ cursor: 'pointer' }}>save</button>
                                                            </div>
                                                        </div>
                                                    </div>}
                                            </div>

                                            <div className="tab-pane models" id="APPLICANT" role="tabpanel">
                                                {!modelStatus &&
                                                    <div className="breadcurmb">
                                                        <div className="title_block">
                                                            <h5>Models</h5>
                                                        </div>
                                                        <div className="buttons">

                                                            <button className=" btn-primary" onClick={modeladdClick}>add</button>
                                                        </div>
                                                    </div>}
                                                {!modelStatus ?
                                                    <div className="table-responsive">
                                                        <table className="table table-striped ">
                                                            <thead>
                                                                <tr>

                                                                    {/* <th className="align-middle">S No</th> */}
                                                                    <th className="align-middle">Model Name</th>
                                                                    <th className="align-middle">Color</th>
                                                                    <th className="align-middle">Created</th>
                                                                    <th className="align-middle">version</th>
                                                                    <th className="align-middle">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {savedPropertyData && savedPropertyData?.models && savedPropertyData?.models?.length > 0 ? savedPropertyData?.models?.map((eachItem, key) => {
                                                                    return (eachItem && eachItem.status == "Active" &&
                                                                        <tr>
                                                                            {/* <td>1</td> */}
                                                                            <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                            <td>{eachItem?.color ? eachItem?.color : 'N/A'}</td>
                                                                            <td>{eachItem?.created ? eachItem?.created : 'N/A'}</td>
                                                                            <td>{eachItem?.version ? eachItem?.version : 'N/A'}</td>
                                                                            <td><div className="d-flex">
                                                                                <a className="action-button edit tooltip-container" onClick={e => editClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Edit</span>edit</span></a>
                                                                                <a className="action-button delete tooltip-container" onClick={e => deleteClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Delete</span>delete</span></a></div></td>
                                                                        </tr>)

                                                                }) :
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="card mb-3">
                                                                                <div className="card-body">
                                                                                    <div className="new_search error_wrapper">
                                                                                        <img src={imageCloudfront + "propertyCalculator/images/not-found.png"} height="300px" />
                                                                                        <p>There are no models available.</p>
                                                                                        <br/>
                                                                                        <p>Please add models.</p>
                                                                                        {/* <button className="button_style" href="#" onClick={goBack}> GO BACK</button> */}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div> :
                                                    <div className="form_seciton">
                                                        <div className="breadcurmb">
                                                            <div className="title_block">
                                                                <h5>add model</h5>
                                                            </div>
                                                            <div className="buttons">

                                                                <a href="#" className="back_btn" onClick={modelBack} style={{ cursor: 'pointer' }}><span className="material-icons icon"> arrow_back</span>BACK</a>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Model Name</label>
                                                                    <input type="text" className="form-control" id="name" placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{nameerror}</span> : ""
                                                        }
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Color</label>
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
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Version</label>
                                                                    <select className="form-select" aria-label="Default select example" name="version" value={modelVersion} onChange={(e) => setModelVersion(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required>
                                                            <option value="">Select Version </option>
                                                            <option value="Low Version">Low Version </option>
                                                            <option value="Mid Version">Mid Version</option>
                                                            <option value="High Version"> High Version</option>

                                                        </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12 mb-2">
                                                                <button className="update_btn" type="submit" onClick={e => modelUpdate(e)} style={{ cursor: 'pointer' }}>Save</button>
                                                            </div>
                                                        </div>
                                                    </div>}
                                            </div>



                                            <div className="tab-pane insurance" id="HMDA" role="tabpanel">
                                                {!insuranceStatus && 
                                                <div className="breadcurmb">
                                                    <div className="title_block">
                                                        <h5>Insurance</h5>
                                                    </div>
                                                    <div className="buttons">

                                                        <button className=" btn-primary" onClick={insuranceaddClick}>add</button>
                                                    </div>
                                                </div>}
                                                {!insuranceStatus ?
                                                <div className="table-responsive">
                                                    <table className="table table-striped ">
                                                        <thead>
                                                            <tr>

                                                                {/* <th className="align-middle">S No</th> */}
                                                                <th className="align-middle">Insurance Name</th>
                                                                <th className="align-middle">Commission</th>
                                                                <th className="align-middle">Phone Number</th>
                                                                <th className="align-middle">Created</th>
                                                                <th className="align-middle">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        {savedPropertyData && savedPropertyData?.insurance && savedPropertyData?.insurance?.length > 0 ? savedPropertyData?.insurance?.map((eachItem, key) => {
                                                    return (
                                                            <tr>
                                                                {/* <td>1</td> */}
                                                                <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                <td>{eachItem?.commission ? eachItem?.commission : 'N/A'}</td>
                                                                <td>{eachItem?.phoneNumber ? eachItem?.phoneNumber : 'N/A'}</td>
                                                                <td>{eachItem?.created ? eachItem?.created : 'N/A'}</td>
                                                                <td><div className="d-flex"><a className="action-button edit tooltip-container" onClick={e => editClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Edit</span>edit</span></a><a className="action-button delete tooltip-container" onClick={e => deleteClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Delete</span>delete</span></a></div></td>
                                                            </tr>
                                                             )

                                                            }):<div className="row">
                                                            <div className="col-md-12">
                                                                <div className="card mb-3">
                                                                    <div className="card-body">
                                                                        <div className="new_search error_wrapper">
                                                                            <img src={imageCloudfront + "propertyCalculator/images/not-found.png"} height="300px" />
                                                                            <p>There are no insurance available.</p>
                                                                            <br/>
                                                                            <p>Please add insurance.</p>
                                                                            {/* <button className="button_style" href="#" onClick={goBack}> GO BACK</button> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                        </tbody>
                                                    </table>
                                                </div>:
                                                <div className="form_seciton">
                                                    <div className="breadcurmb">
                                                        <div className="title_block">
                                                            <h5>add insurance</h5>
                                                        </div>
                                                        <div className="buttons">

                                                            <a href="#" className="back_btn" style={{ cursor: 'pointer' }} onClick={insuranceBack}><span className="material-icons icon"> arrow_back</span>BACK</a>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">Insurance Name</label>
                                                                <input type="text" className="form-control" id="name" placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{nameerror}</span> : ""
                                                        }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">Commission(%)</label>
                                                                <input type="text" className="form-control" id="commission" placeholder="Enter Commission" name="commission" value={commission} onChange={e => Commission(e)} autoComplete="on" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">Phone Number</label>
                                                                <input type="text" className="form-control" id="companyNumber" placeholder="Enter Number" name="phoneNumber" value={insuranceNumber} onChange={e => checkInput1(e)} autoComplete="on" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 mb-2">
                                                            <button className="update_btn" type="submit" onClick={e => insuranceUpdate(e)} style={{ cursor: 'pointer' }}>Save</button>
                                                        </div>
                                                    </div>
                                                </div>}

                                            </div>
                                            <div className="tab-pane finance" id="fin" role="tabpanel">
                                            {!financeStatus && 
                                                <div className="breadcurmb">
                                                    <div className="title_block">
                                                        <h5>finance</h5>
                                                    </div>
                                                    <div className="buttons">

                                                        <button className=" btn-primary" onClick={financeaddClick}>Add</button>
                                                    </div>
                                                </div>}
                                                {!financeStatus ?
                                                <div className="table-responsive">
                                                    <table className="table table-striped ">
                                                        <thead>
                                                            <tr>

                                                                {/* <th className="align-middle">S No</th> */}
                                                                <th className="align-middle">Finance Name</th>
                                                                <th className="align-middle">Commission</th>
                                                                <th className="align-middle">Phone Number</th>
                                                                <th className="align-middle">Created</th>
                                                                <th className="align-middle">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                        {savedPropertyData && savedPropertyData?.finance && savedPropertyData?.finance?.length > 0 ? savedPropertyData?.finance?.map((eachItem, key) => {
                                        return (
                                                            <tr key ={key}>
                                                                {/* <td>1</td> */}
                                                                <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                <td>{eachItem?.commission ? eachItem?.commission : 'N/A'}</td>
                                                                <td>{eachItem?.phoneNumber ? eachItem?.phoneNumber : 'N/A'}</td>
                                                                <td>{eachItem?.created ? eachItem?.created : 'N/A'}</td>
                                                                <td><div className="d-flex"><a className="action-button edit tooltip-container" onClick={e => editClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Edit</span>edit</span></a><a className="action-button delete tooltip-container" onClick={e => deleteClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Delete</span>delete</span></a></div></td>
                                                            </tr>
                                                             )

                                                            }):<div className="row">
                                                            <div className="col-md-12">
                                                                <div className="card mb-3">
                                                                    <div className="card-body">
                                                                        <div className="new_search error_wrapper">
                                                                            <img src={imageCloudfront + "propertyCalculator/images/not-found.png"} height="300px" />
                                                                            <p>There are no finance available.</p>
                                                                            <br/>
                                                                            <p>Please add finance.</p>
                                                                            {/* <button className="button_style" href="#" onClick={goBack}> GO BACK</button> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                        </tbody>
                                                    </table>
                                                </div>:
                                                <div className="form_seciton">
                                                    <div className="breadcurmb">
                                                        <div className="title_block">
                                                            <h5>Add Finance</h5>
                                                        </div>
                                                        <div className="buttons">

                                                            <a href="#" className="back_btn" style={{ cursor: 'pointer' }} onClick={financeBack}><span className="material-icons icon"> arrow_back</span>BACK</a>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">Finance Name</label>
                                                                <input type="text" className="form-control" id="name" placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{nameerror}</span> : ""
                                                        }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">Phone Number</label>
                                                                <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="companyNumber" placeholder="Enter Number" name="phoneNumber" value={financeNumber} onChange={e => checkInput2(e)} autoComplete="on" />
                                                        {/* <label for="floatingInput">Phone Number</label> */}
                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="commission" placeholder="Enter Commission" name="commission" value={commission} onChange={e => financeCommission(e)} autoComplete="on" />
                                                        <label for="floatingInput">Commission %</label>
                                                    </div>
                                                        <div className="col-md-12 mb-2">
                                                            <button className="update_btn" type="submit" onClick={e => financeUpdate(e)} style={{ cursor: 'pointer' }}>Save</button>
                                                        </div>
                                                    </div>
                                                </div>}

                                            </div>
                                            <div className="tab-pane fastag" id="fas" role="tabpanel">
                                            {!fastagStatus && 
                                                <div className="breadcurmb">
                                                    <div className="title_block">
                                                        <h5>fastag</h5>
                                                    </div>
                                                    <div className="buttons">

                                                        <button className=" btn-primary" onClick={fastagaddClick}>Add</button>
                                                    </div>
                                                </div>}
                                                {!fastagStatus ?
                                                <div className="table-responsive">
                                                    <table className="table table-striped ">
                                                        <thead>
                                                            <tr>

                                                                {/* <th className="align-middle">S No</th> */}
                                                                <th className="align-middle">Fastag Name</th>
                                                                <th className="align-middle">Commission</th>
                                                                <th className="align-middle">Phone Number</th>
                                                                <th className="align-middle">Created</th>
                                                                <th className="align-middle">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                        {savedPropertyData && savedPropertyData?.fastag && savedPropertyData?.fastag?.length > 0 ? savedPropertyData?.fastag?.map((eachItem, key) => {
                                        return (
                                                            <tr key ={key}>
                                                                {/* <td>1</td> */}
                                                                <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                <td>{eachItem?.commission ? eachItem?.commission : 'N/A'}</td>
                                                                <td>{eachItem?.phoneNumber ? eachItem?.phoneNumber : 'N/A'}</td>
                                                                <td>{eachItem?.created ? eachItem?.created : 'N/A'}</td>
                                                                <td><div className="d-flex"><a className="action-button edit tooltip-container" onClick={e => editClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Edit</span>edit</span></a><a className="action-button delete tooltip-container" onClick={e => deleteClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Delete</span>delete</span></a></div></td>
                                                            </tr>
                                                             )

                                                            }):<div className="row">
                                                            <div className="col-md-12">
                                                                <div className="card mb-3">
                                                                    <div className="card-body">
                                                                        <div className="new_search error_wrapper">
                                                                            <img src={imageCloudfront + "propertyCalculator/images/not-found.png"} height="300px" />
                                                                            <p>There are no fastag available.</p>
                                                                            <br/>
                                                                            <p>Please add fastag.</p>
                                                                            {/* <button className="button_style" href="#" onClick={goBack}> GO BACK</button> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                        </tbody>
                                                    </table>
                                                </div>:
                                                <div className="form_seciton">
                                                    <div className="breadcurmb">
                                                        <div className="title_block">
                                                            <h5>Add Fastag</h5>
                                                        </div>
                                                        <div className="buttons">

                                                            <a href="#" className="back_btn" onClick={fastagBack} style={{ cursor: 'pointer' }}><span className="material-icons icon"> arrow_back</span>BACK</a>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">Fastag Name</label>
                                                                <input type="text" className="form-control" id="name" placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{nameerror}</span> : ""
                                                        }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">Phone Number</label>
                                                                <div className="form-floating mb-3">
                                                                <input type="text" className="form-control" id="companyNumber" placeholder="Enter Number" name="phoneNumber" value={fastagNumber} onChange={e => checkInput3(e)} autoComplete="on" />
                                                        {/* <label for="floatingInput">Phone Number</label> */}
                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                        <div className="mb-3 input-field">
                                                                <label className="form-label form-label">Commission</label>
                                                                <div className="form-floating mb-3">
                                                                <input type="text" className="form-control" id="commission" placeholder="Enter Commission" name="commission" value={commission} onChange={e => fastagCommission(e)} autoComplete="on" />
                                                    </div>
                                                            </div>
                                                        
                                                        
                                                    </div>
                                                        <div className="col-md-12 mb-2">
                                                            <button className="update_btn" type="submit" onClick={e => fastagUpdate(e)} style={{ cursor: 'pointer' }}>Save</button>
                                                        </div>
                                                    </div>
                                                </div>}

                                            </div>
                                            <div className="tab-pane vendor" id="ven" role="tabpanel">
                                            {!vendorStatus && 
                                                <div className="breadcurmb">
                                                    <div className="title_block">
                                                        <h5>vendor</h5>
                                                    </div>
                                                    <div className="buttons">

                                                        <button className=" btn-primary" onClick={vendoraddClick}>Add</button>
                                                    </div>
                                                </div>}
                                                {!vendorStatus ?
                                                <div className="table-responsive">
                                                    <table className="table table-striped ">
                                                        <thead>
                                                            <tr>

                                                                {/* <th className="align-middle">S No</th> */}
                                                                <th className="align-middle">Vendor Name</th>
                                                                <th className="align-middle">GST Number</th>
                                                                <th className="align-middle">Created</th>
                                                                <th className="align-middle">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                        {savedPropertyData && savedPropertyData?.vendor && savedPropertyData?.vendor?.length > 0 ? savedPropertyData?.vendor?.map((eachItem, key) => {
                                        return (
                                                            <tr key ={key}>
                                                                {/* <td>1</td> */}
                                                                <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                <td>{eachItem?.Gst ? eachItem?.Gst : 'N/A'}</td>
                                                                <td>{eachItem?.created ? eachItem?.created : 'N/A'}</td>
                                                                <td><div className="d-flex"><a className="action-button edit tooltip-container" onClick={e => editClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Edit</span>edit</span></a><a className="action-button delete tooltip-container" onClick={e => deleteClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Delete</span>delete</span></a></div></td>
                                                            </tr>
                                                             )

                                                            }):<div className="row">
                                                            <div className="col-md-12">
                                                                <div className="card mb-3">
                                                                    <div className="card-body">
                                                                        <div className="new_search error_wrapper">
                                                                            <img src={imageCloudfront + "propertyCalculator/images/not-found.png"} height="300px" />
                                                                            <p>There are no vendors available.</p>
                                                                            <br/>
                                                                            <p>Please add vendors.</p>
                                                                            {/* <button className="button_style" href="#" onClick={goBack}> GO BACK</button> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                        </tbody>
                                                    </table>
                                                </div>:
                                                <div className="form_seciton">
                                                    <div className="breadcurmb">
                                                        <div className="title_block">
                                                            <h5>Add Vendor</h5>
                                                        </div>
                                                        <div className="buttons">

                                                            <a href="#" className="back_btn" onClick={vendorBack} style={{ cursor: 'pointer' }}><span className="material-icons icon"> arrow_back</span>BACK</a>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">Vendor Name</label>
                                                                <input type="text" className="form-control" id="name" placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{nameerror}</span> : ""
                                                        }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">Gst Number</label>
                                                                <div className="form-floating mb-3">
                                                                <input type="text" className="form-control" id="companyNumber" placeholder="Enter Gst Number" name="Gst" value={vendorNumber} onChange={e => checkInput4(e)} autoComplete="on" />
                                                        
                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 mb-2">
                                                            <button className="update_btn" type="submit" onClick={e => vendorUpdate(e)} style={{ cursor: 'pointer' }}>Save</button>
                                                        </div>
                                                    </div>
                                                </div>}

                                            </div>
                                        </div>
                                    </div>
                                </div>




                            </div>
                        </div>
                        {resultSuccess &&
                            <SweetAlert show={resultSuccess}
                                custom
                                confirmBtnText="Ok"
                                confirmBtnBsStyle="primary"
                                title={"Deleted Successfully"}
                                onConfirm={e => onConfirm1()}
                            >
                            </SweetAlert>}
                        <footer className="footer">
                            <div className="container-fluid">
                                <div className="row">

                                    <div className="col-sm-12 text-center">
                                        <div className="text-sm-center d-none d-sm-block text-center">
                                            2024 ALL RIGHTS RESERVED.
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

export default Lookups;
