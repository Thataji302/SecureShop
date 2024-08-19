/***
**Module Name: signin
 **File Name :  sign.js
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
 **Description : contains signin page details.
 ***/
import React, { useState, useEffect, useContext } from "react";
import tmdbApi from "../api/tmdbApi";
import { useHistory } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
//  import { ToastContainer, toast } from 'react-toastify';
//  import 'react-toastify/dist/ReactToastify.css';
// import "../../src/assets/css/style.css"
import $ from "jquery";
import * as Config from "../constants/Config";

import Footer from "../components/footer/Footer";
import { contentContext } from "../context/contentContext";
import moment from "moment";



const SignIn = () => {
    // const [menus, setMenus] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showSessionPopup, setShowSessionPopup] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();
    const [buttonText, setButtonText] = useState('Login with Password');
    const [show, setShow] = useState(false);
    const [activeLoad, setActiveLoad] = useState("");
    const [config, setConfig] = useState({});
    const [activeLogintype, setActiveLogintype] = useState("loginpwd");

    const { welcomeMsg, setWelcomeMsg, clientData, GetClientDataFunction, menus } = useContext(contentContext)

    const [locData, setLocData] = useState("");

    //  useEffect(() => {
    //      if (localStorage.getItem("token")) {
    //          history.push("/content");
    //        }
    //        setLocData(JSON.parse(localStorage.getItem("loc")));
    //      // appMenus();
    //  }, []);
    useEffect(() => {
        if (window.site) {
            setConfig(window.site);

        }

    }, [window.site]);

    if (config.common && config.common.resourcesUrl) {
        var img = config.common.resourcesUrl;
    }

    let imageCloudfront;
    if (config.common && config.common.imageCloudfront) {
        imageCloudfront = config.common.imageCloudfront;
    }

    const handleShowPopup = (msg) => {
        setErrMsg(msg)
        setShowPopup(true)
        // console.log('forrrmmvaluess', formValues)
    }
    const onConfirm = () => {
        setErrMsg("")
        setShowPopup(false)
    };
    const onCancel = () => {
        setShowSessionPopup(false)
    }
    const handleKeypress = (e) => {
        //it triggers by pressing the enter key

        if ((e.key === "Enter")) {
            setTimeout(function () {
                handleSignIn();
            }, 1000);
        }
    };

    const handleLoginOtp = (e) => {
        setActiveLogintype("loginotp")
        const valid = emailValidation()

        if (valid) {
            localStorage.setItem("email", email);
            setActiveLoad("loginOtp")
            if (activeLoad == "") {
                signin();
            }
        } else {
            setActiveLoad("")
        }

        // if (email === "") {
        //     setError("Please Enter Email Id");

        // } else {
        //     localStorage.setItem("email", email);
        //     setActiveLoad("loginOtp")
        //     if (activeLoad == "") {
        //         signin();
        //     }
        // }
    }
    const emailValidation = (e) => {
        let flag = true;
        const regEx = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}(.[a-zA-Z{2,8}])?/g;
        if (regEx.test(email)) {
            setError("");

        } else if (!regEx.test(email) && email !== "") {
            setError("Email is Not Valid");
            flag = false;
        }
        if (email === "") {
            setError("Please Enter Email");
            flag = false;
        }
        return flag

    }
    const formValidation = (e) => {
        let flag = true;
        console.log('form validation')
        const regEx = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}(.[a-zA-Z{2,8}])?/g;
        if (regEx.test(email)) {
            setError("");

        } else if (!regEx.test(email) && email !== "") {
            setError("Email is Not Valid");

            flag = false;
        }

        if (email === "" && pwd === "") {
            setError("Please Enter Email and Password");
            flag = false;

        }
        if (email === "") {
            setError("Please Enter Email");
            flag = false;

        }
        if (pwd === "") {
            setError("Please Enter Email and Password");
            flag = false;

        }
        if (email && pwd === "") {
            setError("Please Enter Password");
            flag = false;

        }


        if (flag) {
            if (activeLoad == "") {
                setActiveLoad("loginPwd")
                loginPwd();
            }
        }

    }
    const handleSignIn = (e) => {
        const valid = emailValidation()
        if (valid) {
            localStorage.setItem("email", email);
        }
        setActiveLogintype("loginpwd")

        setButtonText("Login")
        setShow(true)

        if (buttonText === "Login") {

            formValidation();

        }

    }
    const signoutsession = async () => {
        try {
            setActiveLoad("multiSession")
            const response = await tmdbApi.SignOutUser({ emailId: email });
            console.log(response);
            if (response.result == "Success") {

                if (activeLogintype == "loginotp") {

                    signin()
                } else {


                    loginPwd()
                }
            } else {
                setError("Invalid Details");
            }

        } catch {
            setActiveLoad("")
            console.log("error");
        }
    }
    const handleShowSessionPopup = () => {
        setShowSessionPopup(true)
    }
    const loginPwd = async () => {
        try {

            const response = await tmdbApi.signin({
                "emailid": email,
                "logintype": "password",
                "password": pwd,
                "useragent": locData?.headers !== undefined ? locData?.headers : {}
            });
            console.log(response);
            console.log(response.result);
            if (response.result === "Invalid email or password") {
                setError(response.result);
                //setTimeout(function () { setError("") }, 3000);
            } else if (response.result === "user not found") {
                setError("User not Found. Please SignUp");

            } else if (response.result === "Please log in using OTP and set a password") {
                setError("Please log in using OTP and set a password");

            } else if (response.result === "REJECT") {
                // localStorage.setItem("rejected", response.result);
                handleShowPopup("Your account has not been approved.")

            } else if (response.result === "INACTIVE") {
                // localStorage.setItem("inactive", response.result);
                handleShowPopup("Your account has been deactivated.")
                // setTimeout(function () { history.push("/signup") }, 3000);
            }
            else if (response.result === "Session Already Exists") {
                // signoutsession()
                setShowSessionPopup(true)
            }
            else if (response.result === "PENDING VERIFICATION") {
                setError("Please Complete SignUp Process");
                setTimeout(function () { history.push("/signup") }, 3000);

            } else if (response.result === "PENDING TERMS") {
                setError("Please Check And Accept Terms ");
                setTimeout(function () { history.push("./terms/" + email) }, 3000);

            } else if (response.result === "PENDING REGISTRATION") {
                setError("Please Complete SignUp Process");
                setTimeout(function () { history.push("/signup") }, 3000);

            } else if (response.result === "user not found") {
                setError("User not Found. Please SignUp ");
                // setTimeout(function () { setError("")}, 3000);
            } else if (response.result === "PENDING APPROVAL") {
                setError("Please Wait For Admin Approval");
                setTimeout(function () { history.push("/message") }, 3000);
            } else if (localStorage.getItem("check") && response.statusCode === 200) {
                console.log("came");
                localStorage.setItem("token", response.result.token.token);
                localStorage.setItem("userId", response.result.userid);
                localStorage.setItem("login", "setlogin");
                let currentDate = new Date().toJSON();
                localStorage.setItem("currentSessionClientTime", currentDate);
                GetClientDataFunction();
                history.push("/moreinfo/" + localStorage.getItem("check"));
            } else if (response.result.token) {
                console.log("came");
                localStorage.setItem("token", response.result.token.token);
                localStorage.setItem("userId", response.result.userid);
                let currentDate = new Date().toJSON();
                localStorage.setItem("currentSessionClientTime", currentDate);
                let calculationValues = JSON.parse(localStorage.getItem("calculationValues"));
                if (calculationValues) {
                    history.push("/calculator");
                } else {
                    history.push("/search");
                }
            } else if (response.result === "Invalid password") {
                setError("Invalid password");
            } else if (response.result === "Client not found") {
                setError("User not Found. Please SignUp ");
            }
            else {
                setError("Invalid Details");

            }
            setActiveLoad("")
        } catch {
            setActiveLoad("")
            console.log("error");
        }
    };

    //  const AddNotify = () => toast.success('Email Sent Successfully', {
    //      position: "bottom-center",
    //      autoClose: 3000,
    //      hideProgressBar: false,
    //      closeOnClick: true,
    //      pauseOnHover: true,
    //      draggable: true, 
    //      progress: undefined,
    //      theme: "light",
    //  },)


    const signin = async () => {
        try {
            const response = await tmdbApi.signin({
                "emailid": email,
                "logintype": "otp"
            });
            // console.log()
            console.log(response);
            // if (response.statusCode === 200) {
            if (response.result === "PENDING VERIFICATION") {
                setError("Please Complete SignUp Process");
                setTimeout(function () { history.push("/signup") }, 3000);

            } else if (response.result === "PENDING TERMS") {
                setError("Please Check And Accept Terms ");
                setTimeout(function () { history.push("./terms/" + email) }, 3000);

            } else if (response.result === "PENDING REGISTRATION") {
                setError("Please Complete SignUp Process");
                setTimeout(function () { history.push("/signup") }, 3000);

            } else if (response.result === "user not found") {
                setError("User not Found. Please SignUp ");
                // setTimeout(function () { setError("")}, 3000);
            } else if (response.result === "PENDING APPROVAL") {
                setError("Please Wait For Admin Approval");
                setTimeout(function () { history.push("/message") }, 3000);
            }
            else if (response.result === "REJECT") {
                localStorage.setItem("rejected", response.result);
                handleShowPopup("Your account has not been approved.")

            } else if (response.result === "INACTIVE") {
                localStorage.setItem("inactive", response.result);
                handleShowPopup("Your account has been deactivated.")
                // setTimeout(function () { history.push("/signup") }, 3000);
            } else if (response.result === "Session Already Exists") {
                // signoutsession()
                setShowSessionPopup(true)
            } else if (response.result === "ACTIVE" || response.result === "Email Sent Successfully") {
                console.log("response.result", response.result);
                history.push("/loginotp");
                localStorage.setItem("loginuser", email);
                localStorage.setItem("login", "setlogin");
                let currentDate = new Date().toJSON();
                localStorage.setItem("currentSessionClientTime", currentDate);
                setWelcomeMsg(true)


            } else if (response.result === "Invalid password") {
                setError("Invalid password");
            } else if (response.result === "Invalid email") {
                setError("Invalid email");
            } else if (response.result === "Client not found") {
                setError("User not Found. Please SignUp ");
            }
            else {
                setError("Invalid Details");

            }
            setActiveLoad("")
        } catch {
            setActiveLoad("")
            history.push("/loginotp");
            console.log("error");
        }
    };
    function handleClose() {
        history.push("/");
    }

    const handleMessage = (e) => {
        setError("");
    }
    const handleForgot = (e) => {
        const valid = emailValidation()
        setActiveLoad("forgotPwd")
        if (valid) {
            if (activeLoad == "") {
                forgotPassword();
            }
        } else {
            setActiveLoad("")
        }
    }

    const forgotPassword = async () => {
        try {
            const response = await tmdbApi.ForgotPassword({
                "emailid": email
            });
            console.log(response);
            if (response.statusCode == 200) {
                // setSuccess(true);
                if (response.result === "PENDING VERIFICATION") {
                    setError("Please Complete SignUp Process");
                    setTimeout(function () { history.push("/signup") }, 3000);

                } else if (response.result === "PENDING TERMS") {
                    setError("Please Check And Accept Terms ");
                    setTimeout(function () { history.push("./terms/" + email) }, 3000);

                } else if (response.result === "PENDING REGISTRATION") {
                    setError("Please Complete SignUp Process");
                    setTimeout(function () { history.push("/signup") }, 3000);

                } else if (response.result === "Client not found") {
                    setError("User not Found. Please SignUp ");
                    // setTimeout(function () { setError("")}, 3000);
                } else if (response.result === "user not found") {
                    setError("User not Found. Please SignUp ");
                    // setTimeout(function () { setError("")}, 3000);
                } else if (response.result === "PENDING APPROVAL") {
                    setError("Please Wait For Admin Approval");
                    setTimeout(function () { history.push("/message") }, 3000);
                }
                else if (response.result === "REJECT") {
                    localStorage.setItem("rejected", response.result);
                    handleShowPopup("Your account has not been approved.")

                } else if (response.result === "INACTIVE") {
                    localStorage.setItem("inactive", response.result);
                    handleShowPopup("Your account has been deactivated.")

                }
                //  else if(response?.result == 'Email Sent Successfully'){
                //      AddNotify();   
                //  }
                setActiveLoad("")
            } else {
                setActiveLoad("")
                setError("invalid Email Id");
                setTimeout(function () { setError("") }, 3000);
            }

        } catch {
            console.log("error");
            setActiveLoad("")
            //setError("invalid Email Id");
            setTimeout(function () { setError("") }, 3000);
        }
    };


    const cardWidth = $(".signin-graphic").width();

    return (
        <>

            <Modal className="access-denied" show={showPopup} >

                <div className="modal-body enquiry-form">
                    <div className="container">
                        <button className="close-btn" onClick={e => onConfirm()}><span className="material-icons">close</span></button>
                        <span className="material-icons access-denied-icon">https</span>
                        <h3>Access Denied</h3>
                        <p>{errMsg}</p>
                        <p>Please contact administrator</p>
                        <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => onConfirm()}>close</button>
                    </div>
                </div>

            </Modal>
            {/* <Modal className="access-denied" show={showSessionPopup} >
 
                 <div className="modal-body enquiry-form">
                     <div className="container">
                         <button className="close-btn" onClick={e => onCancel()}><span className="material-icons">close</span></button>
                     
                         <span className="material-icons access-denied-icon">
                             web_asset_off
                         </span>
                         <h3>Multiple Sessions Found</h3>
                         <p>Another session is running in another browser. Do you want to terminate that session?</p>
                        <div className="popup-footer">
                             <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => signoutsession()}>{   activeLoad === "multiSession" ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon"/>) : null}Yes</button>
                                 <button className="fill_btn" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => onCancel()}>No</button>
                        </div>
                     </div>
                 </div>
 
             </Modal> */}

            <div className="login-section">
                <button className="close-btn" onClick={handleClose}><span className="material-icons">close</span></button>
                <div className="signin-wrapper">
                    <a href="/">
                        <img className="logo" src={imageCloudfront + "propertyCalculator/images/brand-logo.png"} /></a>
                    <div className="signin-body">
                        <div className="signin-graphic">
                            <img src={imageCloudfront + "propertyCalculator/images/signin-graphic.jpeg"} />
                        </div>
                        <div className="signin-section emaillogin ">
                            <h1 className="bold-heading">Login</h1>
                            <p>Enter Login Credentials</p>
                            <p className="note-msg"><span>Note: </span>First time users must log in via OTP</p>
                            <div className="form-floating mb-3 mt-5">
                                <input type="text" className="form-control" id="floatingInput" name="emailid" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="" onFocus={(e) => handleMessage(e)} onKeyPress={handleKeypress} autoComplete="on" />
                                <label htmlFor="floatingInput">Email<span>*</span></label>
                            </div>

                            {show === true ?
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control" id="floatingInput" placeholder="Password" onChange={(e) => setPwd(e.target.value)} onFocus={(e) => handleMessage(e)} onKeyPress={handleKeypress} />
                                    <label htmlFor="floatingInput">Password<span>*</span></label>
                                </div>
                                : ""}


                            <div className="signin-footer">
                                {error ? <span className="errormsg-floating" style={{
                                    fontWeight: 'bold',
                                    color: 'red',
                                }}>{error}</span> : ""
                                }
                                <button className="fill_btn yellow-gradient lgn-otp-btn" onClick={e => handleLoginOtp(e)}>
                                    {activeLoad === "loginOtp" ?

                                        (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}
                                    Login with OTP</button>


                                <button className="fill_btn yellow-gradient" onClick={e => handleSignIn(e)} >
                                    {activeLoad === "loginPwd" ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}
                                    {buttonText}</button>

                                {/* {buttonText === "Login" && email != "" ? 
                                 <button className="plain-btn-sm forgotPwd" onClick={e => handleForgot(e)}>
                                 
                                 {   activeLoad === "forgotPwd" ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon"/>) : null}  Forgot your password?
                             </button> : null
 } */}
                            </div>
                            {/* <div className="signin-footer mt-4"> */}
                            {/* <p className="signup-prompt mt-5" >Not Registered Yet?<a href="/signup" className="mx-2">Sign Up</a></p> */}
                            {/* <p className="signup-prompt mt-5" >New users can set password using login with otp!</p> */}


                            {/* </div> */}

                        </div>


                    </div>
                    <div className="mt-1 text-center"><p>� 2024 Fusion Finance.</p></div>
                </div>
            </div>



            {/* <ToastContainer
                 position="bottom-center"
                 autoClose={3000}
                 hideProgressBar={false}
                 newestOnTop={false}
                 closeOnClick
                 rtl={false}
                 pauseOnFocusLoss
                 draggable
                 pauseOnHover={false}
                 theme="light"
             /> */}
        </>
    );
};

export default SignIn;
