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
const menuList = [
    {
        id: '1',
        name: 'travel_explore',
        labelName: 'Search',
        route: "search"
    },
    {
        id: '2',
        name: 'collections_bookmark',
        labelName: 'Properties',
        route: "dashboard"
    },
    {
        id: '3',
        name: 'settings',
        labelName: 'Groups',
        // route: "dashboard"
    },
    // {
    //     id: '10',
    //     name: 'settings',
    //     labelName: 'Playlist'
    // },

]

const Company = () => {
    const history = useHistory();
    const [countries, setCountries] = useState('');
    const [idc, setIdc] = useState('');
    const [activeId, setActiveId] = useState();
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [emailid, setCompanyEmail] = useState("");
    const [companyEmailId, setCompanyEmailId] = useState("");
    const [companyNumber, setCompanyNumber] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
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

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        if(localStorage.getItem("token")){
            getCompany()
        }
        //  setCompanyEmail(localStorage.getItem("email"))
        setTimeout(function () {
            GetUserData();
            }, 2000);
       
        // //  GetCountries();
        userActivity();
    }, []);
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 1];
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId") || localStorage.getItem("userid"),
            "pagename": pageName,
            "pageurl": window.location.href,
            "starttime": presentTime,
            "useragent": JSON.parse(localStorage.getItem("loc"))

        };


        const previousId = localStorage.getItem("previousid");
        const urlLink = lambda + '/useractivity?appname=' + appname + (previousId ? "&previousid=" + previousId : "");


        axios({
            method: 'POST',
            url: urlLink,
            data: payload
        })
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    localStorage.setItem("previousid", response.data.result)
                }
            });
    }
    const GetUserData = async () => {
        try {

            const response = await tmdbApi.getUserData({});

            if (response.statusCode === 200) {
                if (response.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setName(response.result[0].name)
                    // setCompanyName(response.result[0].companyName)
                    setCompanyEmail(response.result[0].emailId)
                    // setIdc(response.result[0].idc)
                    setNumber(response.result[0].phoneNumber)
                    setData(response.result[0]);
                }
            }
        } catch {
            console.log("error");
        }
    };
 
    //  console.log("data", data);
    const checkInput = (e) => {
        const onlyDigits = e.target.value.replace(/\D/g, "");
        setNumber(onlyDigits);

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
        if (emailid === "") {
            setEmailError("Please Enter Email");
            formIsValid = false;
        }
        // if (Corporate === "COMPANY" && companyName === "") {
        //   setCompanyError("Please Enter Company Name");
        //   formIsValid = false;
        // }

        return formIsValid;


    }
     const handleUpdate = (e) => {
        let valid = formvalidation();
        if(companyResult?.companyId){
            let payload;
            let userid = localStorage.getItem("userId") || localStorage.getItem("userid")
            localStorage.setItem("companyId", companyResult?.companyId)
            payload = {
                "companyName": companyName,
                "companyEmailId": emailid ? emailid : companyEmailId,
                "phoneNumber": phoneNumber,
                "companyAddress": companyAddress
            };
            const urlLink = lambda + '/updateCompany?appname=' + appname + "&companyId=" + companyResult?.companyId;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.result) {
                         localStorage.setItem("companyId", response.data.result.companyId)
                        history.push("./yellowForm");
                    }
                });
        }else if(valid){
            let payload;
            let userid = localStorage.getItem("userId") || localStorage.getItem("userid")
           // localStorage.setItem("companyId", companyResult?.companyId)
            payload = {
                "companyName": companyName,
                "companyEmailId": emailid ? emailid : companyEmailId ,
                "phoneNumber": phoneNumber,
                "companyAddress": companyAddress
            };
            const urlLink = lambda + '/addCompany?appname=' + appname + (userid ? "&userid=" + userid : "");
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        localStorage.setItem("companyId", response.data.result.companyId)
                        history.push("./yellowForm");
                    }
                });
        }
        
    }
    const getCompany = (e) => {
        let userid = localStorage.getItem("userId") || localStorage.getItem("userid")
        const urlLink = lambda + '/getCompany?appname=' + appname + (userid ? "&userid=" + userid : "");
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                console.log("response?.result",response.data.result)
                if (response.data.result) {
                    // localStorage.setItem("previousid", response.data.result)
                    setCompanyName(response.data.result && response.data.result[0].companyName)
                    setCompanyEmailId(response.data.result && response.data.result[0].companyEmailId)
                    setNumber(response.data.result && response.data.result[0].phoneNumber)
                    setCompanyAddress(response.data.result && response.data.result[0].companyAddress)
                    setCompanyResult(response.data.result && response.data.result[0])
                }
            });
    }
    return (
        <>
            <div id="layout-wrapper">
                <div className="dashboard">
                    <Header />
                    <div className="main-content profile company">

                        <div className="page-content">
                            <div className="container-fluid">
                            <div className="md-container">
                        <div className="breadcurmb">
                <div className="title_block">
                <h5>company</h5>
             </div>
                        <div className="buttons">
                        <button className=" btn-primary" type="button" onClick={backClick}>Back</button>
                       
                        </div>
                        </div>
                        </div>
                                <div className="md-container profile-pic">
                                    <div className="card-block">
                                        <div className="row">
                                            <div className="col-lg-8 col-md-8 col-xs-12">
                                                <h3>Company Details</h3>
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control" id="name" placeholder="Enter Company Name" name="name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{nameerror}</span> : ""
                                                    }
                                                    <label for="floatingInput">Company Name</label>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control" id="companyEmail" placeholder="Enter Company Email" name="emailid" value={companyEmailId ? companyEmailId : emailid} onChange={(e) => setCompanyEmail(e.target.value)} onFocus={(e) => handleEmailMessage(e)} autoComplete="on" required /> {emailError != "" ?
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{emailError}</span> : ""
                                                    }
                                                    <label for="floatingInput">Company Email Id</label>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control" id="companyNumber" placeholder="Enter Company Number" name="phoneNumber" value={phoneNumber} onChange={e => checkInput(e)} autoComplete="on" />
                                                    <label for="floatingInput">Company Phone Number</label>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control" id="name" placeholder="Enter Company Address" name="companyAddress" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} autoComplete="on" />
                                                    <label for="floatingInput">Company Address</label>
                                                </div>
                                                <button className="fill_btn" onClick={e => handleUpdate(e)}> Update</button>
                                            </div>
                                            <div className="col-lg-4 col-md-4 col-xs-12">
                                                <div className="avatar-block">
                                                    <div className="avatar-header">
                                                        <div className="avatar-img-block">
                                                            {/* <p>VK</p> */}
                                                        </div>
                                                    </div>
                                                    <div className="avatar-body">
                                                        <h6 className="username mt-3">{name}</h6>

                                                    </div>
                                                </div>
                                            </div>
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
                                        {/* <div className="text-sm-end d-none d-sm-block">
                                            Design & Develop by Themesbrand
                                        </div> */}
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

export default Company;
