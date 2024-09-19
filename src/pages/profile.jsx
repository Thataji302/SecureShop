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

const Profile = () => {
    const history = useHistory();
    const [countries, setCountries] = useState('');
    const [idc, setIdc] = useState('');
    const [activeId, setActiveId] = useState();
    const [name, setName] = useState('');
    const [email, setEmail] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [data, setData] = useState([])
    const [success, setSuccess] = useState(false);
    const [phoneerror, setPhoneError] = useState('');
    const [nameerror, setNameError] = useState('');
    const [passwordInput, setPasswordInput] = useState({
        password: '',
        confirmPassword: ''
    })
    const [IdcError, setIdcError] = useState('');

    const [passwordError, setPasswordErr] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);
    const [number, setNumber] = useState(false);
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
        setEmail(localStorage.getItem("email"))
        GetUserData();
        //  GetCountries();
        userActivity();
    }, []);
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 1];
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
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
                    setEmail(response.result[0].emailid)
                    setIdc(response.result[0].idc)
                    setPhoneNumber(response.result[0].phone)
                    setData(response.result[0]);
                }
            }
        } catch {
            console.log("error");
        }
    };
    const GetCountries = async () => {
        try {
            console.log(tmdbApi);
            const response = await tmdbApi.getLookUp({
                "type": ["country"],
                "sortBy": "alpha3",
                "projection": "tiny"
            });

            // console.log(response.result);
            if (response.result.data == "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {
                setCountries(response.result.data);
            }
        } catch {
            console.log("error");
        }
    };

    //  console.log("data", data);
    const checkInput = (e) => {
        const onlyDigits = e.target.value.replace(/\D/g, "");
        setPhoneNumber(onlyDigits);

    };

    const handleBack = (e) => {
        // history.push("/usermanagement");
        history.go(-1)
    }

    const handleUserUpdate = (e) => {
        let flag = true;
        // if (phonenumber === "") {
        //     setPhoneError("Please enter phone number");
        //     flag = false
        //     setTimeout(function () { setPhoneError("") }, 3000);
        // }
        if (name === "") {
            setNameError("Please enter name");
            flag = false
            setTimeout(function () { setNameError("") }, 3000);
        }
        // if ((!phonenumber)) {

        //     setPhoneError("Enter phone number");
        //     setTimeout(function () { setPhoneError("") }, 3000);
        //     flag = false
        // }




        if (flag) {
            UpdateForm();
        }

    }

    const UpdateForm = async () => {
        setLoaderEnable(true)
        try {

            const response = await tmdbApi.userDataUpdate({
                "name": name,
                // "phone": phonenumber,

            });

            if (response.statusCode === 200) {
                if (response.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setSuccess(true);
                    GetUserData();
                    setLoaderEnable(false)
                }
            }
        } catch {
            console.log("error");
        }
    };

    function onConfirm() {
        setSuccess(false)
    };

    const handlePwdGenerate = (e) => {

        if (passwordInput.password == "") {
            setError("Please Enter Password");
            setTimeout(function () { setError("") }, 3000);

        } else if (passwordInput.confirmPassword == "") {
            setError("Please Enter Confirm Password");
            setTimeout(function () { setError("") }, 3000);

        }
        //  else if (passwordInput.oldPassword == "") {
        //     setError("Please Enter Old Password");
        //     setTimeout(function () { setError("") }, 3000);

        // }
        else if (passwordInput.confirmPassword !== passwordInput.password) {
            setConfirmPasswordError("Confirm password is not matched");
            setTimeout(function () { setConfirmPasswordError("") }, 3000);
        }
        //else if(lower === false && number === false && limit === false && lower === false && special === false){
        //     setError("Please Enter Strong Password");
        //     setTimeout(function () { setError("") }, 3000);

        // }

        else if (limit && upper && special && lower && number && confirmPasswordError === "") {
            if (passwordInput.password === passwordInput.confirmPassword) {
                pwdGenerate();
            }
        }
    }

    const pwdGenerate = async () => {
        setLoaderEnable(true)
        try {
            const response = await tmdbApi.pwdGenerate({
                "emailid": email,
                "password": passwordInput.password,
                // "oldPassword": passwordInput.oldPassword
            });
            console.log(response);


            if (response.statusCode === 200) {


                if (response.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else if (response.result == "old password is wrong") {
                    setOldPasswordError("old password is incorrect");
                    setLoaderEnable(false)
                } else {
                    setSuccess(true);
                    setPasswordInput({ ...passwordInput, password: '', confirmPassword: '', oldPassword: '' })
                    setLoaderEnable(false)
                }

            }


        } catch {
            console.log("error");
        }
    };

    const handlePasswordChange = (evnt) => {
        const passwordInputValue = evnt.target.value.trim();
        const passwordInputFieldName = evnt.target.name;
        const NewPasswordInput = { ...passwordInput, [passwordInputFieldName]: passwordInputValue }
        setPasswordInput(NewPasswordInput);

    }
    const togglePassword = (e) => {
        setPasswordShown(!passwordShown);
    };
    const handleValidation = (evnt) => {
        const passwordInputValue = evnt.target.value.trim();
        const passwordInputFieldName = evnt.target.name;
        //for password 
        if (passwordInputFieldName === 'password' || passwordInputFieldName === 'oldPassword') {
            const uppercaseRegExp = /(?=.*?[A-Z])/;
            const lowercaseRegExp = /(?=.*?[a-z])/;
            const digitsRegExp = /(?=.*?[0-9])/;
            const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
            const minLengthRegExp = /.{8,}/;
            const passwordLength = passwordInputValue.length;
            const uppercasePassword = uppercaseRegExp.test(passwordInputValue);
            const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
            const digitsPassword = digitsRegExp.test(passwordInputValue);
            const specialCharPassword = specialCharRegExp.test(passwordInputValue);
            const minLengthPassword = minLengthRegExp.test(passwordInputValue);
            let errMsg = "";
            if (passwordLength === 0) {
                errMsg = "Password is empty";
            }
            // else if (!uppercasePassword) {
            //     errMsg = "At least one Uppercase";
            // } else if (!lowercasePassword) {
            //     errMsg = "At least one Lowercase";
            // } else if (!digitsPassword) {
            //     errMsg = "At least one digit";
            // } else if (!specialCharPassword) {
            //     errMsg = "At least one Special Characters";
            // } else if (!minLengthPassword) {
            //     errMsg = "At least minumum 8 characters";
            // } else {
            //     errMsg = "";
            // }
            if (uppercasePassword) {
                var element = document.getElementById("err1");
                element.classList.add("vaild");
                setUpper(true);
            } else {
                var element = document.getElementById("err1");
                element.classList.remove("vaild");
            }
            if (lowercasePassword) {
                var element = document.getElementById("err");
                element.classList.add("vaild");
                setLower(true);
            } else {
                var element = document.getElementById("err");
                element.classList.remove("vaild");
            }
            if (digitsPassword) {
                var element = document.getElementById("err2");
                element.classList.add("vaild");
                setNumber(true);
            } else {
                var element = document.getElementById("err2");
                element.classList.remove("vaild");
            }
            if (specialCharPassword) {
                var element = document.getElementById("err3");
                element.classList.add("vaild");
                setSpecial(true)
            } else {
                var element = document.getElementById("err3");
                element.classList.remove("vaild");
            }
            if (minLengthPassword) {
                var element = document.getElementById("err4");
                element.classList.add("vaild");
                setLimit(true)
            } else {
                var element = document.getElementById("err4");
                element.classList.remove("vaild");
            }


            setPasswordErr(errMsg);
        }
        // for confirm password
        // if (passwordInputFieldName === "confirmPassword" || (passwordInputFieldName === "password")) {

        //     if (passwordInput.confirmPassword !== passwordInput.password) {
        //         setConfirmPasswordError("Confirm password is not matched");
        //     } else {
        //         setConfirmPasswordError("");
        //     }

        // }
    }
    const handleAddclass = (evnt) => {
        var element = document.getElementById("instruction");
        element.classList.add("ins-dsp-none");
        setConfirmPasswordError("");
    }
    const handleRemoveclass = (evnt) => {
        var element = document.getElementById("instruction");
        element.classList.remove("ins-dsp-none");
    }
    const handleConfirm = (evnt) => {
        const passwordInputFieldName = evnt.target.name;
        if (passwordInputFieldName === "confirmPassword" || (passwordInputFieldName === "password")) {

            // if (passwordInput.confirmPassword !== passwordInput.password) {
            //     setConfirmPasswordError("Confirm password is not matched");
            // } else {
            //     setConfirmPasswordError("");
            // }

        }
    }

    const RemoveError = () => {
        setOldPasswordError("");
    }

    console.log("passwordInput", passwordInput);

    useEffect(() => {
        myArray = localStorage.getItem("ClientName")?.split(" ");


    }, [localStorage.getItem("ClientName")]);

    let myArray = []
    myArray = localStorage.getItem("ClientName")?.split(" ");
    const searchClick = () => {
        history.push("/search");
    }
    const savedClick = () => {
        history.push("/dashboard");
    }
    const backClick = () => {
        history.goBack();
    }
    const onClickMenu = (e, item) => {
        //setMenu(id);
        console.log('handleActiveMenuObj------------>', item)
        setActiveId(item.id)

        history.push(item.route)
    }
    return (
        <>
            <div id="layout-wrapper">

                <Header />
                {/* <div className="topnav">
                    <div className="container-fluid">
                        <div className="md-container">
                            <div className="page-header">
                                <div className="block-title">
                                    <h2>Profile</h2>
                                </div>
                                <button className="plain-btn" onClick={backClick}><span class="material-icons-outlined">chevron_left</span>Back</button>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="main-content profile">

                    <div className="page-content">
                        <div className="container-fluid">
                        <div className="md-container">
                        <div className="breadcurmb">
                <div className="title_block">
                <h5>profile</h5>
             </div>
                        <div className="buttons">
                        <button className=" btn-primary" type="button">Back</button>
                       
                        </div>
                        </div>
                        </div>
                            <div className="md-container">
                                <div className="card-block">
                                    <div className="row profile-pic">
                                        <div className="col-lg-8 col-md-8 col-xs-12">

                                            <h3>User Details</h3>
                                            <div className="form-floating mb-3">

                                                <input type="text" className="form-control" id="floatingInput" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                                                {nameerror ? <span className="errormsg" style={{ fontWeight: 'bold', color: 'red', }}>{nameerror}</span> : ""}
                                                <label for="floatingInput" >Name</label>
                                            </div>


                                            <div className="form-floating mb-3">

                                                <input className="form-control contact-number" type="email" placeholder=" Enter Company Email" id="example-email-input" value={email} readOnly />
                                                <label for="floatingInput" >Email ID</label>
                                            </div>


                                            {/* <div className="col-md-12">
                                                                                 <div className="form-group">
                                                                                 <label for="example-text-input" class="col-form-label">PHONE NUMBER</label>
                                                                                 <div className="country-code">
                                                                                     <select name="idc" class="colorselect capitalize">
                                                                                         <option value="">Select</option><option value=" ABW"> ABW(+297)</option>
                                                                                         <option value=" AGO"> AGO(+244)</option><option value=" AIA"> AIA(+1-264)</option>
                                                                                         <option value=" ALB"> ALB(+355)</option>
                                                                                         <option value=" AND"> AND(+376)</option>
                                                                                     </select>
                                                                                     <input className="form-control contact-number" type="tel" name="phone" placeholder="Phone number" id="example-tel-input" value="9705226371"/>
                                                                                 </div>
                                                                             </div>
                                                                         </div> */}

                                          
                                            <button onClick={handleUserUpdate} className="fill_btn"> {loaderEnable ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}UPDATE</button>
                                            </div>
                                            <div className="col-lg-4 col-md-4 col-xs-12">
                                                <div className="avatar-block">
                                                    <div className="avatar-header">
                                                        <div className="avatar-img-block">
                                                            <p>VK</p>
                                                        </div>
                                                    </div>
                                                    <div className="avatar-body">
                                                        <h6 className="username mt-3">{name}</h6>

                                                    </div>
                                                </div>
                                            </div>
                                       
                                    </div>
                                </div>
                                {/* <div className="card-block my-3">
                                        <div class="row">
                                            <div class="col-lg-7 col-md-7 col-xs-12">
                                                <h3>Change Password</h3>
                                                <div className="form-floating mb-3">
                                                    <label for="example-text-input" className="col-form-label">New Password<span className="required">*</span></label>
                                                    <input type={passwordShown ? "text" : "password"} value={passwordInput.password} onChange={(e) => handlePasswordChange(e)} onKeyUp={handleValidation} name="password" placeholder="Password" className="form-control" onBlur={(e) => { handleAddclass(e) }}
                                                        onFocus={(e) => { handleRemoveclass(e) }} />
                                                    <p className="text-danger">{passwordError}</p>
                                                    <div className="flex-left terms-block">
                                                        <input type="checkbox" id="terms-check" onChange={(e) => togglePassword(e)} />
                                                        <label>Show Password</label>
                                                    </div>

                                                </div>


                                                <div className="form-floating mb-3">
                                                    <label for="example-text-input" className="col-form-label">Confirm Password<span className="required">*</span></label>
                                                    <input type={passwordShown ? "text" : "password"} value={passwordInput.confirmPassword} onChange={(e) => handlePasswordChange(e)} onKeyUp={handleConfirm} onBlur={(e) => { handleAddclass(e) }} onFocus={(e) => { handleRemoveclass(e) }} name="confirmPassword" placeholder="Password" className="form-control" />
                                                    <p className="text-danger">{confirmPasswordError}</p>
                                                </div>



                                                <div className="update_button">
                                                    <label>Show</label>
                                                    <button className="btn btn-primary" onClick={e => handlePwdGenerate(e)}>{loaderEnable ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null} UPDATE</button>
                                                </div>
                                            </div>

                                            <div class="create-password-instruction ins-dsp-none" id="instruction">
                                                <p className="error" id="err">{lower ? <span className="material-symbols-outlined">
                                                    check
                                                </span> : <span className="material-symbols-outlined">
                                                    close
                                                </span>} Password must contain a lower case letter</p>
                                                <p className="error" id="err1"> {upper ? <span className="material-symbols-outlined">
                                                    check
                                                </span> : <span className="material-symbols-outlined">
                                                    close
                                                </span>} Password must contain an upper case letter</p>
                                                <p className="error" id="err2">  {number ? <span className="material-symbols-outlined">
                                                    check
                                                </span> : <span className="material-symbols-outlined">
                                                    close
                                                </span>} Password must contain a number</p>
                                                <p className="error" id="err3"> {special ? <span className="material-symbols-outlined">
                                                    check
                                                </span> : <span className="material-symbols-outlined">
                                                    close
                                                </span>} Password must contain a special character or a space</p>
                                                <p className="error" id="err4"> {limit ? <span className="material-symbols-outlined">
                                                    check
                                                </span> : <span className="material-symbols-outlined">
                                                    close
                                                </span>} Password must contain at least 8 characters</p></div>


                                        </div>
                                    </div> */}
                                <div className="card-block my-3">
                                    <div className="row">
                                        <div className="col-lg-7 col-md-7 col-xs-12">
                                            <h3>Change Password</h3>
                                            <div className="form-floating mb-3">
                                                <input type={passwordShown ? "text" : "password"} value={passwordInput.password} onChange={(e) => handlePasswordChange(e)} onKeyUp={handleValidation} name="password" placeholder="Password" className="form-control" onBlur={(e) => { handleAddclass(e) }}
                                                    onFocus={(e) => { handleRemoveclass(e) }} />
                                                <p className="text-danger">{passwordError}</p>
                                                <label className="floatingInput">New Password<span>*</span></label>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input type={passwordShown ? "text" : "password"} value={passwordInput.confirmPassword} onChange={(e) => handlePasswordChange(e)} onKeyUp={handleConfirm} onBlur={(e) => { handleAddclass(e) }} onFocus={(e) => { handleRemoveclass(e) }} name="confirmPassword" placeholder="Password" className="form-control" />
                                                <p className="text-danger">{confirmPasswordError}</p>
                                                <label className="floatingInput">Confirm Password<span>*</span></label>
                                            </div>
                                            <div className="flex-left terms-block">
                                                <input type="checkbox" id="terms-check" onChange={(e) => togglePassword(e)} />
                                                <label> Show Password.</label>
                                            </div>
                                            <p className="text-danger"></p>
                                            <div className="signin-footer mt-4">
                                                <button className="fill_btn" onClick={e => handlePwdGenerate(e)}>{loaderEnable ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null} UPDATE</button>
                                            </div>
                                        </div>
                                        <div className="col-lg-5 col-md-5 col-xs-12">
                                            <div className="create-password">
                                                <div className="crpsd-cnt-blk">
                                                    <div className="create-password-instruction ins-dsp-none" id="instruction">
                                                        <p className="error" id="err">{lower ? <span className="material-symbols-outlined">
                                                            check
                                                        </span> : <span className="material-symbols-outlined">
                                                            close
                                                        </span>} Password must contain a lower case letter</p>
                                                        <p className="error" id="err1"> {upper ? <span className="material-symbols-outlined">
                                                            check
                                                        </span> : <span className="material-symbols-outlined">
                                                            close
                                                        </span>} Password must contain an upper case letter</p>
                                                        <p className="error" id="err2">  {number ? <span className="material-symbols-outlined">
                                                            check
                                                        </span> : <span className="material-symbols-outlined">
                                                            close
                                                        </span>} Password must contain a number</p>
                                                        <p className="error" id="err3"> {special ? <span className="material-symbols-outlined">
                                                            check
                                                        </span> : <span className="material-symbols-outlined">
                                                            close
                                                        </span>} Password must contain a special character or a space</p>
                                                        <p className="error" id="err4"> {limit ? <span className="material-symbols-outlined">
                                                            check
                                                        </span> : <span className="material-symbols-outlined">
                                                            close
                                                        </span>} Password must contain at least 8 characters</p></div>


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

                                <div className="col-sm-12 text-center">
                                    <div className="text-sm-center d-none d-sm-block text-center">
                                        All Rights Reserved 2024.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                    <SweetAlert show={success}
                        custom
                        confirmBtnText="Ok"
                        confirmBtnBsStyle="primary"
                        title={"Updated successfully"}
                        onConfirm={e => onConfirm()}
                    >
                    </SweetAlert>


                </div>

            </div>
        </>
    );
};

export default Profile;
