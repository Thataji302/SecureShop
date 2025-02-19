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
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import axios from 'axios';
import { removeSpecialCharecters, location } from '././../utils/commonUtils';
import StateDropdown from "./StateDropdown";

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
    const [deleteConfirm, setDeleteConfirm] = useState(false);
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
    const [fasttagState, setFasttagState] = useState('');
    const [fasttagstatus, setFasttagstatus] = useState('');
    const [fasttaggst, setFasttaggst] = useState('');
    const [financegst, setFinancegst] = useState('');
    const [insurancegst, setInsurancegst] = useState('');

    
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
    const [deleteData, setDeleteData] = useState('');
    const [dataType, setDataType] = useState('');
    const [submitButton, setSubmitButton] = useState(false);
    const [userSuccess, setUserSuccess] = useState(false);
    const [title, setTitle] = useState("");
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
    const handleBackClick = (setStatus) => {
        // history.goBack();
        setStatus(false);
        history.push("/lookups");
      //  navigate(`/lookups`)

    };
    
    const backClick = () => handleBackClick(setBranchStatus);
    const modelBack = () => handleBackClick(setModelStatus);
    const insuranceBack = () => handleBackClick(setInsuranceStatus);
    const financeBack = () => handleBackClick(setFinanceStatus);
    const fastagBack = () => handleBackClick(setFastagStatus);
    const vendorBack = () => handleBackClick(setVendorStatus);
    

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
                    debugger
                    let branchesData = response.data.result && response.data.result && response.data.result.data[0]
                    setName(branchesData && branchesData.name)
                    setBranchAddress(branchesData && branchesData.address)
                    setNumber(branchesData && branchesData.phoneNumber)
                    setDealerCode(branchesData && branchesData.dealerCode)
                    setState(branchesData && branchesData.state)
                    setBranch(branchesData && branchesData.branch)
                    setSubBranch(branchesData && branchesData.subbranch)
                    setGst(branchesData && branchesData.gst)
                    setStatus(branchesData && branchesData.status)


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
                    let modelData = response.data.result && response.data.result.data && response.data.result.data[0]
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
                    let insuranceData = response.data.result && response.data.result.data && response.data.result.data[0]
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
                    let financeData = response.data.result && response.data.result.data && response.data.result.data[0]
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
                    let fastagData = response.data.result && response.data.result.data
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
                    let vendorData = response.data.result && response.data.result.data && response.data.result.data[0]
                    setName(vendorData && vendorData.name)
                    setVendorNumber(vendorData && vendorData.Gst)
                }
            });
    }
    const handleUpdate = (e) => {
        let valid = formvalidation();
        let lookupid = id;
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId");
        let companyId = localStorage.getItem("companyid");

        console.log("lookupid", lookupid);

        if (valid && lookupid) {
            setSubmitButton(true);
            let payload = {
                "name": name,
                "phoneNumber": phoneNumber,
                "address": branchAddress,
                "type": "branches",
                "lookupId": lookupid,
                "userid": userid,
                "companyId": companyId,
                "dealerCode": dealerCode,
                "subbranch": subbranch,
                "branch": branch,
                "gst": gst,
                "state": state,
                "status": status
            };

            const urlLink = `${lambda}/updateBranch?appname=dealerReports&branchid=${lookupid}`;

            axios.post(urlLink, payload)
                .then(response => {
                    if (response.data.statusCode === 200) {
                        setSubmitButton(false);
                        setUserSuccess(true);
                    }
                });
        } else if (valid) {
            setSubmitButton(true);
            let payload = {
                "name": name,
                "phoneNumber": phoneNumber,
                "address": branchAddress,
                "type": "branches",
                "status": "ACTIVE",
                "userid": userid,
                "companyId": companyId,
                "dealerCode": dealerCode,
                "subbranch": subbranch,
                "branch": branch,
                "gst": gst,
                "state": state,
                "status": status
            };

            console.log('payload', payload);

            const urlLink = `${lambda}/addBranch?appname=dealerReports&companyid=${companyId}&userid=${userid}`;

            axios.post(urlLink, payload)
                .then(response => {
                    if (response.data.statusCode === 200) {
                        setSubmitButton(false);
                        setUserSuccess(true);
                        setTitle(response.data.result)
                    }
                });
        }
    };

    const modelUpdate = (e) => {
        let valid = formvalidation();
        let lookupid = id;
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId");
        let companyId = localStorage.getItem("companyid");

        if (valid && lookupid) {
            setSubmitButton(true)
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
            const urlLink = lambda + '/updatelookup?companyid=' + companyId + '&appname=' + appname + "&type=models" + "&modalid=" + lookupid;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./models");
                        // history.push("./lookups");
                        // setModelStatus(false)
                        // modelTab()
                        setSubmitButton(false)
                        setUserSuccess(true)
                        setTitle(response.data.result)
                    }
                });
        } else if (valid) {
            setSubmitButton(true)
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
            const urlLink = lambda + '/addlookup?companyid=' + companyId + '&?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./models");
                        //setModelStatus(false)
                        //  modelTab()
                        setSubmitButton(false)
                        setUserSuccess(true)
                        setTitle(response.data.result)
                    }
                });
        }
        // formvalidation()
    }
    const insuranceUpdate = (e) => {
        let valid = formvalidation();
        let lookupid = id;
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        let companyId = localStorage.getItem("companyid");
        if (valid && lookupid) {
            setSubmitButton(true)
            let payload;
            // let userid = localStorage.getItem("userid")
            payload = {
                "name": name,
                "phoneNumber": insuranceNumber,
                "type": "insurance",
                "commission": commission,
                "lookupId": lookupid,
                "userid": userid,
                "state": insurancestate,
                "status": insurancestatusval,
                "gst":insurancegst
               
            };
            const urlLink = `${lambda}/updateInsurance?appname=${appname}&insuranceid=${lookupid}`;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        //history.push("./insurance");
                        // history.push("./lookups");
                        // setInsuranceStatus(false)
                        //  insuranceTab()
                        setSubmitButton(false)
                        setUserSuccess(true)
                        setTitle(response.data.result)
                    }
                });
        } else if (valid) {
            setSubmitButton(true)
            let payload;
            payload = {
                "name": name,
                "phoneNumber": insuranceNumber,
                "type": "insurance",
                "commission": commission,
                "userid": userid,
                "state": insurancestate,
                "status": insurancestatusval,
                "gst":insurancegst
            };
            console.log('payload', payload)
            const urlLink = `${lambda}/addInsurance?appname=${appname}&companyid=${companyId}&userid=${userid}`;


            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./insurance");
                        // setInsuranceStatus(false)
                        //   insuranceTab()
                        setSubmitButton(false)
                        setTitle(response.data.result)
                        setUserSuccess(true)
                    }
                });
        }
        // formvalidation()
    }
    const financeUpdate = (e) => {
        let valid = formvalidation();
        let lookupid = id;
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        let companyId = localStorage.getItem("companyid");
        if (valid && lookupid) {
            setSubmitButton(true)
            let payload;
            // let userid = localStorage.getItem("userid")
            payload = {
                "name": name,
                "phoneNumber": financeNumber,
                "type": "finance",
                "status": financestatusval,
                "commission": commission,
                "userid": userid,
                "lookupId": lookupid,
                "state":financestate,
                "gst":financegst
            };
            const urlLink = `${lambda}/updateFinance?appname=${appname}&financeid=${lookupid}`;

            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        //history.push("./finance");
                        // history.push("./lookups");
                        // setFinanceStatus(false)
                        // financeTab()
                        setSubmitButton(false)
                        setUserSuccess(true)
                        setTitle(response.data.result)
                    }
                });
        } else if (valid) {
            setSubmitButton(true)
            let payload;
            payload = {
                "name": name,
                "phoneNumber": financeNumber,
                "type": "finance",
                "commission": commission,
                "status":financestatusval,
                "userid": userid,
                "state":financestate,
                "gst":financegst
            };
            console.log('payload', payload)
            const urlLink = `${lambda}/addFinance?appname=${appname}&companyid=${companyId}&userid=${userid}`;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        //history.push("./finance");
                        // setFinanceStatus(false)
                        //  financeTab()
                        setSubmitButton(false)
                        setUserSuccess(true)
                        setTitle(response.data.result)
                    }
                });
        }
        // formvalidation()
    }
    const fastagUpdate = (e) => {
        let valid = formvalidation();
        let lookupid = id;
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        let companyId = localStorage.getItem("companyid");

        if (valid && lookupid) {
            setSubmitButton(true)
            let payload;
            // let userid = localStorage.getItem("userid")
            payload = {
                "name": name,
                "phoneNumber": fastagNumber,
                "type": "fastag",
                "status": fasttagstatus,
                "commission": commission,
                "lookupId": lookupid,
                "userid": userid,
                "state": fasttagState,
                "gst": fasttaggst
            };
            const urlLink = lambda + '/updateFastag?companyid=' + companyId + '&appname=' + appname + "&type=fastag" + "&fasttagid=" + lookupid;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./fastag");
                        // history.push("./lookups");
                        // setFastagStatus(false)
                        // fastagTab()
                        setSubmitButton(false)
                        setUserSuccess(true)
                        setTitle(response.data.result)


                    }
                });
        } else if (valid) {
            setSubmitButton(true)
            let payload;
            // let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
            payload = {
                "name": name,
                "phoneNumber": fastagNumber,
                "type": "fastag",
                "status": "Active",
                "commission": commission,
                "userid": userid,
                "state": fasttagState,
                "gst": fasttaggst

            };
            console.log('payload', payload)
            const urlLink = lambda + '/addFastag?companyid=' + companyId + '&appname=' + appname + '&userid=' + userid;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./fastag");
                        //setFastagStatus(false)
                        // fastagTab()
                        setSubmitButton(false)
                        setUserSuccess(true)
                        setTitle(response.data.result)

                    }
                });
        }
        // formvalidation()
    }
    const vendorUpdate = (e) => {
        let valid = formvalidation();
        let lookupid = id;
        let companyId = localStorage.getItem("companyid");

        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        if (valid && lookupid) {
            setSubmitButton(true)
            let payload;
            // let userid = localStorage.getItem("userid")
            payload = {
                "name": name,
                "Gst": fastagNumber,
                "type": "vendor",
                "status": vendorstatusval,
                "lookupId": lookupid,
                "userid": userid,
                "state":vendorstate
            };
            const urlLink = lambda + '/updateVendor?companyid=' + companyId + '&appname=' + appname + "&type=fastag" + "&vendorid=" + lookupid;

            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./fastag");
                        // history.push("./lookups");
                        // setVendorStatus(false)
                        //  vendorTab()
                        setSubmitButton(false)
                        setUserSuccess(true)
                        setTitle(response.data.result)


                    }
                });
        } else if (valid) {
            setSubmitButton(true)
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
            const urlLink = lambda + '/addVendor?companyid=' + companyId + '&appname=' + appname + '&userid=' + userid;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./fastag");
                        //  setVendorStatus(false)
                        // vendorTab()
                        setSubmitButton(false)
                        setUserSuccess(true)
                        setTitle(response.data.result)

                    }
                });
        }
        // formvalidation()
    }
    let apiName = "branchinfo";
    let type = "branches";
    const [tabType,setTabType]=useState("")

    const branchTab = (e) => {
        type = "branches";
        apiName = "branchInfo";
        GetPropertyData(type);
        setTabType(type)
        setBranchStatus(false)
    }
    const modelTab = (e) => {
        type = "models";
        apiName = "modelsinfo"
        setTabType(type)
        GetPropertyData(type);
        setModelStatus(false)
    }
    const insuranceTab = (e) => {
        type = "insurance";
        apiName = "insuranceInfo"
        setTabType(type)
        GetPropertyData(type);
        setInsuranceStatus(false)
    }
    const financeTab = (e) => {
        type = "finance";
        apiName = "financeInfo"
        setTabType(type)
        GetPropertyData(type);
        setFinanceStatus(false)
    }
    const fastagTab = (e) => {
        type = "fastag";
        apiName = "fastagInfo"
        setTabType(type)
        GetPropertyData(type);
        setFastagStatus(false)
    }
    const vendorTab = (e) => {
        type = "vendor";
        apiName = "vendorsInfo"
        setTabType(type)
        GetPropertyData(type);
        setVendorStatus(false)
    }

    const GetPropertyData = (type) => {
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        let companyId = localStorage.getItem("companyid");
        //   const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + type + "&status=Active" + (userid ? "&userid=" + userid : "");

        const urlLink = lambda + '/' + apiName + '?appname=' + appname + "&companyid=" + companyId + "&status=Active" + (userid ? "&userid=" + userid : "");
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    setSavedPropertyData(response.data.result)
                }
            });
    }

    const editClick = (e, item) => {
        debugger
        let type = item && item.type;
        let id = item && item.companyid;
        //localStorage.setItem("item", JSON.stringify(item));
        //history.push("/lookupForm")
        localStorage.removeItem("formType");
        history.push(`/lookups?id=${id}&type=${type}`);
        if(tabType === 'branches'){
            setBranchStatus(true)
        }else if(tabType === 'models'){
            setModelStatus(true)
        }else if(tabType === 'insurance'){
            setInsuranceStatus(true)

           }else if(tabType === 'finance'){
            setFinanceStatus(true);
           }else if(tabType === 'fastag'){
            setFastagStatus(true);
           }else if(tabType === 'vendor'){
            setVendorStatus(true);
           }

    }
    const deleteClick = (e, item) => {
        setDeleteConfirm(true)
        setDeleteData(item)

    }
    const modelDelete = (e, item) => {
        setDeleteConfirm(true)
        setDeleteData(item)

    }
    const insuranceDelete = (e, item) => {
        setDeleteConfirm(true)
        setDeleteData(item)

    }
    const financeDelete = (e, item) => {
        setDeleteConfirm(true)
        setDeleteData(item)

    }
    const fastagDelete = (e, item) => {
        setDeleteConfirm(true)
        setDeleteData(item)

    }
    const vendorDelete = (e, item) => {
        setDeleteConfirm(true)
        setDeleteData(item)

    }
    function onConfirm1() {
        setResultSuccess(false)
        type = dataType;
        GetPropertyData(type);
    };
    function onUpdate() {
        // setResultSuccess(false)
       
        // setBranchStatus(false)
        setUserSuccess(false);
       if(tabType === 'branches'){
        branchTab();
       }else if(tabType === 'models'){
        modelTab();
       }else if(tabType === 'insurance'){
        insuranceTab();
       }else if(tabType === 'finance'){
        financeTab();
       }else if(tabType === 'fastag'){
        fastagTab();
       }else if(tabType === 'vendor'){
        vendorTab();
       }
       history.push("/lookups");
        // const type = "companyUser";
        // getUser();
        //window.location = "/lookups"
       
    };
    function closePopup() {
        setDeleteConfirm(false)
    };

    function onConfirm2() {
        setDeleteConfirm(false)
        let item = deleteData;
        setDataType(item && item.type)
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
            const urlLink = lambda + '/deletelookups?appname=' + appname + "&lookupId=" + lookupid;
            axios({
                method: 'DELETE',
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
        // const type = "branches";
        // GetPropertyData(type);
    };
    type = localStorage.getItem("formType");
    let imageCloudfront;
    if (config.common && config.common.imageCloudfront) {
        imageCloudfront = config.common.imageCloudfront;
    }
    console.log("imageCloudfront", imageCloudfront)
    const addClick = (e, item) => {
        setBranchStatus(true)
        setName("")
        setBranchAddress("")
        setNumber("")
        setDealerCode("")
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

    const [branch, setBranch] = useState("mainbranch");
    const [subbranch, setSubBranch] = useState("");
    const [gst, setGst] = useState("");
    const [state, setState] = useState("");
    const [status, setStatus] = useState("Active");

    const [insurancestate, setiInsuranceState] = useState("");
    const [insurancestatusval, setInsuranceStatusval] = useState("Active");

    const [financestate, setFinanceState] = useState("");
    const [financestatusval, setFinanceStatusval] = useState("Active");

    const [vendorstate, setVendorState] = useState("");
    const [vendorstatusval, setVendorStatusval] = useState("Active");

    return (
        <>
            <div id="layout-wrapper">
                <div className="dashboard">
                    <Header />
                    <div className="main-content look_ups">

                        <div className="page-content">
                            <div className="container-fluid">
                                {/* <div className="breadcurmb">
                                    <div className="title_block">
                                        <h5>Lookups</h5>
                                    </div>
                                    
                                </div> */}
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
                                                {!branchStatus && savedPropertyData && savedPropertyData?.length > 0 &&
                                                    <div className="breadcurmb">
                                                        <div className="title_block">
                                                            <h5>branches</h5>
                                                        </div>
                                                        <div className="buttons">

                                                            <button className=" btn-primary" onClick={addClick}>add</button>
                                                        </div>
                                                    </div>}
                                                {!branchStatus ?
                                                    <div>
                                                        {savedPropertyData && savedPropertyData?.length > 0 ?
                                                            <div className="table-responsive">
                                                                <table className="table table-striped ">
                                                                    <thead>
                                                                        <tr>

                                                                            {/* <th className="align-middle">S No</th> */}
                                                                            <th className="align-middle">Branch Name</th>
                                                                            <th className="align-middle">Address</th>
                                                                            <th className="align-middle">Phone Number</th>
                                                                            <th className="align-middle">Dealer Code</th>
                                                                            <th className="align-middle">Created</th>
                                                                            <th className="align-middle">Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {savedPropertyData && savedPropertyData?.length > 0 && savedPropertyData?.map((eachItem, key) => {
                                                                            return (eachItem && eachItem.status == "Active" &&
                                                                                <tr key={key}>
                                                                                    <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                                    <td>{eachItem?.address ? eachItem?.address : 'N/A'}</td>
                                                                                    <td>{eachItem?.phoneNumber ? eachItem?.phoneNumber : 'N/A'}</td>
                                                                                    <td>{eachItem?.dealerCode ? eachItem?.dealerCode : 'N/A'}</td>
                                                                                    <td>{moment(eachItem?.created).format('DD-MM-YYYY')}</td>

                                                                                    <td><div className="d-flex">
                                                                                        <a className="action-button edit tooltip-container" onClick={e => editClick(e, eachItem)}><span className="material-symbols-outlined"><span className="tooltip">Edit</span>edit</span>edit</a>
                                                                                        <a className="action-button delete tooltip-container" onClick={e => deleteClick(e, eachItem)}><span className="material-symbols-outlined"><span className="tooltip">Delete</span>delete</span>delete</a></div></td>
                                                                                </tr>
                                                                            )

                                                                        }

                                                                        )


                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            :
                                                            <div className="form_section"><div className="empty_page">
                                                                <img src={imageCloudfront + "propertyCalculator/images/dashboard.png"} />
                                                                <p>There are no branches available.<br />Please add branches.</p>
                                                                <a className="btn btn-primary" onClick={addClick}>ADD</a>
                                                            </div> </div>}
                                                    </div>
                                                    :

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
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">GST</label>
                                                                    <input type="text" className="form-control" id="gst" placeholder="Enter GST" name="gst" value={gst} onChange={(e) => setGst(e.target.value)} />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <StateDropdown onSelect={(e) => setState(e)} state={state} />
                                                                </div></div>


                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Branch</label>
                                                                    <select
                                                                        className="form-select"
                                                                        aria-label="Default select example"
                                                                        name="branch"
                                                                        value={branch} onChange={(e) => setBranch(e.target.value)} onFocus={(e) => handleMessage(e)}
                                                                    >
                                                                        <option value="">Select Branch</option>
                                                                        <option value="mainbranch">Main Branch</option>
                                                                        <option value="subbranch">Sub Branch</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            {
                                                                //savedPropertyData
                                                                branch === 'subbranch' && <div className="col-md-6">
                                                                    <div className="mb-3 input-field">
                                                                        <label className="form-label form-label">Sub Branch</label>
                                                                        <select
                                                                            className="form-select"
                                                                            aria-label="Default select example"
                                                                            name="subbranch"
                                                                            value={subbranch}
                                                                            onChange={(e) => setSubBranch(e.target.value)}
                                                                            onFocus={(e) => handleMessage(e)}
                                                                        >
                                                                            <option value="">Select sub Branch</option>

                                                                            {savedPropertyData &&
                                                                                savedPropertyData.length > 0 &&
                                                                                savedPropertyData
                                                                                    .filter(item => item.branch === 'mainbranch' && item.status === "Active" && (!id || item._id !== id))
                                                                                    .map((eachItem) => (
                                                                                        <option key={eachItem._id} value={eachItem._id}>
                                                                                            {eachItem.name}
                                                                                        </option>
                                                                                    ))
                                                                            }
                                                                        </select>

                                                                    </div>
                                                                </div>
                                                            }
                                                            <div className="col-md-6">
                                                                {id && <div className="mb-3 input-field">

                                                                    <label className="form-label form-label">Status</label>
                                                                    <select
                                                                        className="form-select"
                                                                        aria-label="Default select example"
                                                                        name="status"
                                                                        value={status} onChange={(e) => setStatus(e.target.value)} onFocus={(e) => handleMessage(e)}
                                                                    >
                                                                        <option value="">Select Status</option>
                                                                        <option value="active">Active</option>
                                                                        <option value="inactive">InActive</option>
                                                                    </select>

                                                                </div>
                                                                }</div>

                                                            <div className="col-md-12 mb-2">
                                                                <button className="update_btn" type="submit" onClick={e => handleUpdate(e)} style={{ cursor: 'pointer' }}>{submitButton ? "Saving..." : "Save"}</button>
                                                            </div>
                                                        </div>
                                                    </div>}
                                            </div>

                                            <div className="tab-pane models" id="APPLICANT" role="tabpanel">
                                                {!modelStatus && savedPropertyData && savedPropertyData?.length > 0 &&
                                                    <div className="breadcurmb">
                                                        <div className="title_block">
                                                            <h5>Models</h5>
                                                        </div>
                                                        <div className="buttons">

                                                            <button className=" btn-primary" onClick={modeladdClick}>add</button>
                                                        </div>
                                                    </div>}

                                                {!modelStatus ?
                                                    <div>
                                                        {savedPropertyData && savedPropertyData?.length > 0 ?
                                                            <div className="table-responsive">
                                                                <table className="table table-striped ">
                                                                    <thead>
                                                                        <tr>

                                                                            {/* <th className="align-middle">S No</th> */}
                                                                            <th className="align-middle">Model Name</th>
                                                                            <th className="align-middle">Color</th>
                                                                            <th className="align-middle">Version</th>
                                                                            <th className="align-middle">Created</th>

                                                                            <th className="align-middle">Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {savedPropertyData && savedPropertyData?.length > 0 && savedPropertyData?.map((eachItem, key) => {
                                                                            return (eachItem && eachItem.status == "Active" &&
                                                                                <tr>
                                                                                    {/* <td>1</td> */}
                                                                                    <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                                    <td>{eachItem?.color ? eachItem?.color : 'N/A'}</td>
                                                                                    <td>{eachItem?.version ? eachItem?.version : 'N/A'}</td>
                                                                                    <td>{moment(eachItem?.created).format('DD-MM-YYYY')}</td>

                                                                                    <td><div className="d-flex">
                                                                                        <a className="action-button edit tooltip-container" onClick={e => editClick(e, eachItem)}><span className="material-symbols-outlined"><span className="tooltip">Edit</span>edit</span>edit</a>
                                                                                        <a className="action-button delete tooltip-container" onClick={e => modelDelete(e, eachItem)}><span className="material-symbols-outlined"><span className="tooltip">Delete</span>delete</span>delete</a></div></td>
                                                                                </tr>)

                                                                        })

                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div> :
                                                            <div className="form_section"><div className="empty_page">
                                                                <img src={imageCloudfront + "propertyCalculator/images/dashboard.png"} />
                                                                <p>There are no models available.<br />Please add models.</p>
                                                                <a className="btn btn-primary" onClick={modeladdClick}>ADD</a>
                                                            </div> </div>}
                                                    </div>
                                                    :
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
                                                                <button className="update_btn" type="submit" onClick={e => modelUpdate(e)} style={{ cursor: 'pointer' }}>{submitButton ? "Saving..." : "Save"}</button>
                                                            </div>
                                                        </div>
                                                    </div>}
                                            </div>



                                            <div className="tab-pane insurance" id="HMDA" role="tabpanel">
                                                {!insuranceStatus && savedPropertyData && savedPropertyData?.length > 0 &&
                                                    <div className="breadcurmb">
                                                        <div className="title_block">
                                                            <h5>Insurance</h5>
                                                        </div>
                                                        <div className="buttons">

                                                            <button className=" btn-primary" onClick={insuranceaddClick}>add</button>
                                                        </div>
                                                    </div>}
                                                {!insuranceStatus ?
                                                    <div>
                                                        {savedPropertyData && savedPropertyData?.length > 0 ?
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
                                                                        {savedPropertyData && savedPropertyData?.length > 0 && savedPropertyData?.map((eachItem, key) => {
                                                                            return (
                                                                                <tr>
                                                                                    {/* <td>1</td> */}
                                                                                    <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                                    <td>{eachItem?.commission ? eachItem?.commission : 'N/A'}</td>
                                                                                    <td>{eachItem?.phoneNumber ? eachItem?.phoneNumber : 'N/A'}</td>
                                                                                    <td>{moment(eachItem?.created).format('DD-MM-YYYY')}</td>
                                                                                    <td><div className="d-flex"><a className="action-button edit tooltip-container" onClick={e => editClick(e, eachItem)}><span className="material-symbols-outlined"><span className="tooltip">Edit</span>edit</span>edit</a><a className="action-button delete tooltip-container" onClick={e => insuranceDelete(e, eachItem)}><span className="material-symbols-outlined"><span className="tooltip">Delete</span>delete</span>delete</a></div></td>
                                                                                </tr>
                                                                            )

                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div> : <div className="form_section"><div className="empty_page">
                                                                <img src={imageCloudfront + "propertyCalculator/images/dashboard.png"} />
                                                                <p>There are no insurance available.<br />Please add insurance.</p>
                                                                <a className="btn btn-primary" onClick={insuranceaddClick}>ADD</a>
                                                            </div> </div>}

                                                    </div> :
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
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <StateDropdown onSelect={(e) => setiInsuranceState(e)} state={insurancestate} />
                                                                </div></div>

                                                                <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Gst Number</label>
                                                                    <div className="form-floating mb-3">
                                                                        <input type="text" className="form-control" id="insurancegst" placeholder="Enter Gst Number" name="insurancegst" value={insurancegst} onChange={e => setInsurancegst(e.target.value)} autoComplete="on" />
                                                                    </div>
                                                                </div>
                                                            </div>


                                                                <div className="col-md-6">
                                                                {id && <div className="mb-3 input-field">

                                                                    <label className="form-label form-label">Status</label>
                                                                    <select
                                                                        className="form-select"
                                                                        aria-label="Default select example"
                                                                        name="insurancestatusval"
                                                                        value={insurancestatusval} onChange={(e) => setInsuranceStatusval(e.target.value)} onFocus={(e) => handleMessage(e)}
                                                                    >
                                                                        <option value="">Select Status</option>
                                                                        <option value="active">Active</option>
                                                                        <option value="inactive">InActive</option>
                                                                    </select>

                                                                </div>
                                                                }</div>
                                                            <div className="col-md-12 mb-2">
                                                                <button className="update_btn" type="submit" onClick={e => insuranceUpdate(e)} style={{ cursor: 'pointer' }}>{submitButton ? "Saving..." : "Save"}</button>
                                                            </div>
                                                        </div>
                                                    </div>}

                                            </div>
                                            <div className="tab-pane finance" id="fin" role="tabpanel">
                                                {!financeStatus && savedPropertyData && savedPropertyData?.length > 0 &&
                                                    <div className="breadcurmb">
                                                        <div className="title_block">
                                                            <h5>finance</h5>
                                                        </div>
                                                        <div className="buttons">

                                                            <button className=" btn-primary" onClick={financeaddClick}>Add</button>
                                                        </div>
                                                    </div>}
                                                {!financeStatus ?
                                                    <div>
                                                        {savedPropertyData && savedPropertyData?.length > 0 ?
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

                                                                        {savedPropertyData && savedPropertyData?.length > 0 && savedPropertyData?.map((eachItem, key) => {
                                                                            return (
                                                                                <tr key={key}>
                                                                                    {/* <td>1</td> */}
                                                                                    <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                                    <td>{eachItem?.commission ? eachItem?.commission : 'N/A'}</td>
                                                                                    <td>{eachItem?.phoneNumber ? eachItem?.phoneNumber : 'N/A'}</td>
                                                                                    <td>{moment(eachItem?.created).format('DD-MM-YYYY')}</td>
                                                                                    <td><div className="d-flex"><a className="action-button edit tooltip-container" onClick={e => editClick(e, eachItem)}><span className="material-symbols-outlined"><span className="tooltip">Edit</span>edit</span>edit</a><a className="action-button delete tooltip-container" onClick={e => financeDelete(e, eachItem)}><span className="material-symbols-outlined"><span className="tooltip">Delete</span>delete</span>delete</a></div></td>
                                                                                </tr>
                                                                            )

                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div> : <div class="form_section"> <div className="empty_page">
                                                                <img src={imageCloudfront + "propertyCalculator/images/dashboard.png"} />
                                                                <p>There are no finance available.<br />Please add finance.</p>
                                                                <a className="btn btn-primary" onClick={financeaddClick}>ADD</a>
                                                            </div></div>}
                                                    </div> :
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
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <StateDropdown onSelect={(e) => setFinanceState(e)} state={financestate} />
                                                                </div></div>


                                                                <div className="col-md-6">
                                                                {id && <div className="mb-3 input-field">

                                                                    <label className="form-label form-label">Status</label>
                                                                    <select
                                                                        className="form-select"
                                                                        aria-label="Default select example"
                                                                        name="financestatusval"
                                                                        value={financestatusval} onChange={(e) => setFinanceStatusval(e.target.value)} onFocus={(e) => handleMessage(e)}
                                                                    >
                                                                        <option value="">Select Status</option>
                                                                        <option value="active">Active</option>
                                                                        <option value="inactive">InActive</option>
                                                                    </select>

                                                                </div>
                                                                }</div>

<div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Gst Number</label>
                                                                    <div className="form-floating mb-3">
                                                                        <input type="text" className="form-control" id="financegst" placeholder="Enter Gst Number" name="financegst" value={financegst} onChange={e => setFinancegst(e.target.value)} autoComplete="on" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12 mb-2">
                                                                <button className="update_btn" type="submit" onClick={e => financeUpdate(e)} style={{ cursor: 'pointer' }}>{submitButton ? "Saving..." : "Save"}</button>
                                                            </div>
                                                        </div>
                                                    </div>}

                                            </div>
                                            <div className="tab-pane fastag" id="fas" role="tabpanel">
                                                {!fastagStatus && savedPropertyData && savedPropertyData?.length > 0 &&
                                                    <div className="breadcurmb">
                                                        <div className="title_block">
                                                            <h5>fastag</h5>
                                                        </div>
                                                        <div className="buttons">

                                                            <button className=" btn-primary" onClick={fastagaddClick}>Add</button>
                                                        </div>
                                                    </div>}
                                                {!fastagStatus ?
                                                    <div>
                                                        {savedPropertyData && savedPropertyData?.length > 0 ?
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

                                                                        {savedPropertyData && savedPropertyData?.length > 0 && savedPropertyData?.map((eachItem, key) => {
                                                                            return (
                                                                                <tr key={key}>
                                                                                    {/* <td>1</td> */}
                                                                                    <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                                    <td>{eachItem?.commission ? eachItem?.commission : 'N/A'}</td>
                                                                                    <td>{eachItem?.phoneNumber ? eachItem?.phoneNumber : 'N/A'}</td>
                                                                                    <td>{moment(eachItem?.created).format('DD-MM-YYYY')}</td>
                                                                                    <td><div className="d-flex"><a className="action-button edit tooltip-container" onClick={e => editClick(e, eachItem)}><span className="material-symbols-outlined"><span className="tooltip">Edit</span>edit</span>edit</a><a className="action-button delete tooltip-container" onClick={e => fastagDelete(e, eachItem)}><span className="material-symbols-outlined"><span className="tooltip">Delete</span>delete</span>delete</a></div></td>
                                                                                </tr>
                                                                            )

                                                                        })}

                                                                    </tbody>
                                                                </table>
                                                            </div> : <div class="form_section"><div className="empty_page">
                                                                <img src={imageCloudfront + "propertyCalculator/images/dashboard.png"} />
                                                                <p>There are no fastags available.<br />Please add fastags.</p>
                                                                <a className="btn btn-primary" onClick={fastagaddClick}>ADD</a>
                                                            </div></div>}
                                                    </div> :
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

                                                            <div className="col-md-6">
                                                                {id && <div className="mb-3 input-field">

                                                                    <label className="form-label form-label">Status</label>
                                                                    <select
                                                                        className="form-select"
                                                                        aria-label="Default select example"
                                                                        name="fasttagstatus"
                                                                        value={status} onChange={(e) => setFastagStatus(e.target.value)} onFocus={(e) => handleMessage(e)}
                                                                    >
                                                                        <option value="">Select Status</option>
                                                                        <option value="active">Active</option>
                                                                        <option value="inactive">InActive</option>
                                                                    </select>

                                                                </div>
                                                                }</div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <div className="form-floating mb-3">
                                                                        <StateDropdown onSelect={(e) => setFasttagState(e)} state={fasttagState} />
                                                                    </div>
                                                                </div>


                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Gst Number</label>
                                                                    <div className="form-floating mb-3">
                                                                        <input type="text" className="form-control" id="gstnumber" placeholder="Enter Gst Number" name="fasttagGst" value={fasttaggst} onChange={e => setFasttaggst(e.target.value)} autoComplete="on" />

                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-md-12 mb-2">
                                                                <button className="update_btn" type="submit" onClick={e => fastagUpdate(e)} style={{ cursor: 'pointer' }}>{submitButton ? "Saving..." : "Save"}</button>
                                                            </div>
                                                        </div>
                                                    </div>}

                                            </div>
                                            <div className="tab-pane vendor" id="ven" role="tabpanel">
                                                {!vendorStatus && savedPropertyData && savedPropertyData?.length > 0 &&
                                                    <div className="breadcurmb">
                                                        <div className="title_block">
                                                            <h5>vendor</h5>
                                                        </div>
                                                        <div className="buttons">

                                                            <button className=" btn-primary" onClick={vendoraddClick}>Add</button>
                                                        </div>
                                                    </div>}
                                                {!vendorStatus ?
                                                    <div>
                                                        {savedPropertyData && savedPropertyData?.length > 0 ?
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

                                                                        {savedPropertyData && savedPropertyData?.length > 0 && savedPropertyData?.map((eachItem, key) => {
                                                                            return (
                                                                                <tr key={key}>
                                                                                    {/* <td>1</td> */}
                                                                                    <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                                    <td>{eachItem?.Gst ? eachItem?.Gst : 'N/A'}</td>
                                                                                    <td>{moment(eachItem?.created).format('DD-MM-YYYY')}</td>
                                                                                    <td><div className="d-flex"><a className="action-button edit tooltip-container" onClick={e => editClick(e, eachItem)}><span className="material-symbols-outlined"><span className="tooltip">Edit</span>edit</span>edit</a><a className="action-button delete tooltip-container" onClick={e => vendorDelete(e, eachItem)}><span className="material-symbols-outlined"><span className="tooltip">Delete</span>delete</span>delete</a></div></td>
                                                                                </tr>
                                                                            )

                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div> :
                                                            <div className="form_section"><div className="empty_page">
                                                                <img src={imageCloudfront + "propertyCalculator/images/dashboard.png"} />
                                                                <p>There are no vendors available.<br />Please add vendors.</p>
                                                                <a className="btn btn-primary" onClick={vendoraddClick}>ADD</a>
                                                            </div> </div>}
                                                    </div>
                                                    :
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
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <StateDropdown onSelect={(e) => setVendorState(e)} state={vendorstate} />
                                                                </div></div>


                                                                <div className="col-md-6">
                                                                {id && <div className="mb-3 input-field">

                                                                    <label className="form-label form-label">Status</label>
                                                                    <select
                                                                        className="form-select"
                                                                        aria-label="Default select example"
                                                                        name="vendorstatusval"
                                                                        value={vendorstatusval} onChange={(e) => setVendorStatusval(e.target.value)} onFocus={(e) => handleMessage(e)}
                                                                    >
                                                                        <option value="">Select Status</option>
                                                                        <option value="active">Active</option>
                                                                        <option value="inactive">InActive</option>
                                                                    </select>

                                                                </div>
                                                                }</div>
                                                            <div className="col-md-12 mb-2">
                                                                <button className="update_btn" type="submit" onClick={e => vendorUpdate(e)} style={{ cursor: 'pointer' }}>{submitButton ? "Saving..." : "Save"}</button>
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
                        {userSuccess &&
                            <SweetAlert show={userSuccess}
                                custom
                                confirmBtnText="Ok"
                                confirmBtnBsStyle="primary"
                                title={title}
                                onConfirm={e => onUpdate()}
                            >
                            </SweetAlert>}
                        {/* {resultSuccess &&
                            <SweetAlert show={resultSuccess}
                                custom
                                confirmBtnText="Ok"
                                confirmBtnBsStyle="primary"
                                title={"Deleted Successfully"}
                                onConfirm={e => onConfirm1()}
                            >
                            </SweetAlert>} */}
                        {/* {deleteConfirm &&
                            <SweetAlert show={deleteConfirm}
                                custom
                                confirmBtnText="Ok"
                                confirmBtnBsStyle="primary"
                                title={"Are you sure want to delete?"}
                                onConfirm={e => onConfirm2()}
                            >
                            </SweetAlert>} */}
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
                        {/* {deleteConfirm &&
                        <div className="modal delete_popup">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                   
                                    <div className="modal-body">
                                    <button className="close-btn" onClick={e => closePopup()}><span className="material-icons">close</span></button>
                                    <span className="material-icons access-denied-icon">delete_outline</span>
                                    <h3>Delete</h3>
                                    <p>This action cannot be undone.</p>
                                    <p>Are you sure you want to delete?</p>
                                    <div className="popup-footer">
                                    <button className="fill_btn" onClick={e => onConfirm2()}>Yes, Delete</button>
                                    </div>
                                  </div>

                                </div>
                            </div>
                        </div>} */}
                        {deleteConfirm &&
                            <Modal className="access-denied delete_popup" show={deleteConfirm}>

                                <div className="modal-body">
                                    <div className="container">
                                        <button className="close-btn" onClick={e => closePopup()}><span className="material-icons">close</span></button>
                                        <span className="material-icons access-denied-icon">delete_outline</span>
                                        <h3>Delete</h3>
                                        <p>This action cannot be undone.</p>
                                        <p>Are you sure you want to delete ?</p>
                                        <div className="popup-footer">
                                            <button className="fill_btn " onClick={e => onConfirm2()}> Yes, Delete</button>
                                        </div>
                                    </div>
                                </div>

                            </Modal>}
                    </div>

                </div>
            </div>

        </>
    );
};

export default Lookups;
