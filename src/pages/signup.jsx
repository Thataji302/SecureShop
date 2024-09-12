/***
**Module Name: Signup 
 **File Name :  Signup.js
 **Project :    Orasi Media
 **Copyright(c) : X Platform Consulting.
 **Organization : Peafowl Inc
 **author :  chandrasekhar
 **author :  Hari
 **license :
 **version :  1.0.0
 **Created on :
 **Created on: Dec 27 2022
 **Last modified on: Dec 27 2022
 **Description : contains Signup details.
 ***/
import React, { useState, useRef, useEffect, useContext } from "react";
import tmdbApi from "../api/tmdbApi";
import axios from 'axios';
// import "../../src/assets/css/style.css";
import moment from "moment";
import { useHistory } from "react-router-dom";
import * as Config from "../constants/Config";
import OTPInput from "otp-input-react";
import { contentContext } from "../context/contentContext";
let { lambda, appname } = window.app;

const SignUp = () => {
  const [number, setNumber] = useState("");
  const [emailError, setEmailError] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [Corporate, setCorporate] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [mpin, setInput] = useState({});
  const [otp, setOtp] = useState('');
  const [show, setShow] = useState(false);
  const [categoryerror, setCategoryError] = useState('');
  const [typeerror, setTypeError] = useState('');
  const [nameerror, setNameError] = useState('');
  const history = useHistory();

  const [buttonText, setButtonText] = useState("CONTINUE");
  const [validation, setValidation] = useState(false);
  const [isLoadVerify, SetIsLoadVerify] = useState(false);
  const [otperror, setOtpError] = useState('');
  const [countries, setCountries] = useState('');
  const [values, setValues] = useState('');
  const [error, setError] = useState('');
  const [config, setConfig] = useState({});
  const [activeLoad, setActiveLoad] = useState("");
  const [defaultCountryCode, setDefaultCountryCode] = useState("");
  const [locData, setLocData] = useState("");

  const [otpclass, setOtpClass] = useState(false);
  const { userAgent } = useContext(contentContext)


  const one = useRef();
  const two = useRef();
  const three = useRef();
  const four = useRef();
  const five = useRef();

  useEffect(() => {
    setLocData(JSON.parse(localStorage.getItem("loc")));
    if (localStorage.getItem("loc") === null) {
     // userAgent();
      clientActivity();
    } else {
      clientActivity();
    }
    // GetCountries();

  }, []);

  useEffect(() => {
    if (window.site) {
      setConfig(window.site);
      let k = window.site && window.site.common && window.site.common.verificationRequired && window.site.common.verificationRequired ? 'VERIFY & CONTINUE' : 'CONTINUE'
      setButtonText(k)
    }
  }, [window.site]);

  var verificationRequired = window.site && window.site.common && window.site.common.verificationRequired && window.site.common.verificationRequired

  // const userAgent = async () => {
  //   console.log('user agent')
  //   await axios({
  //     method: 'GET',
  //     url: "https://d4nv8o5tzs3mt.cloudfront.net/",
  //   })
  //     .then(function (response) {
  //       // let locData = JSON.stringify(response.data)
  //       let temp = response.data.headers['cloudfront-viewer-country'][0].value
  //       setDefaultCountryCode(temp)

  //       let k = countries && countries.length > 0 && countries.filter(eachItem => eachItem.alpha2 === temp)
  //       setValues(k[0].alpha3)

  //     });
  // }




  if (window.site === undefined) {
    setTimeout(function () {
      if (window.site && window.site.common && window.site.common.resourcesUrl) {
        var img = window.site.common.resourcesUrl;
      }
    }, 1000);
  }
  if (window.site && window.site.common && window.site.common.resourcesUrl) {
    var img = window.site.common.resourcesUrl;
  }


  const GetCountries = async () => {
    try {
      // console.log(tmdbApi);
      const response = await tmdbApi.getLookUp({
        "type": ["country"],
        "sortBy": "alpha3"
      });

       console.log(response.result);
      setCountries(response.result.data);
      if (localStorage.getItem("loc") !== null) {
        let userAgentData = JSON.parse(localStorage.getItem("loc"))
        let temp = userAgentData?.headers['cloudfront-viewer-country'][0]?.value
        setDefaultCountryCode(temp)

        let k = response?.result?.data?.length > 0 && response?.result?.data?.filter(eachItem => eachItem.alpha2 === temp)
        setValues(k[0].alpha3)
      }


    } catch {
      console.log("error");
    }
  };

  const checkInput = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    setNumber(onlyDigits);

  };




  const emailValidation = (e) => {
    let flag = true;
    const regEx = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}(.[a-zA-Z{2,8}])?/g;
    if (regEx.test(email)) {
      setEmailError("");

    } else if (!regEx.test(email) && email !== "") {
      setEmailError("Email is Not Valid");
      flag = false;
    }
    if (email === "") {
      setEmailError("Please Enter Email");
      flag = false;
    }
    return flag

  }



  const handleTypeClick = (e, type) => {
    if (type) {
      setTypeError("");
    }
    setType(type);
  }

  const handlestatusClick = (e, type) => {
    if (type) {
      setCategoryError("");
    }
    setCorporate(type);

  }

  function formvalidation() {
    let formIsValid = true;
    const regEx = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}(.[a-zA-Z{2,8}])?/g;
    if (regEx.test(email)) {
      setEmailError("");
    } else if (!regEx.test(email) && email !== "") {
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
    if (email === "") {
      setEmailError("Please Enter Email");
      formIsValid = false;
    }
    // if (Corporate === "COMPANY" && companyName === "") {
    //   setCompanyError("Please Enter Company Name");
    //   formIsValid = false;
    // }

    return formIsValid;


  }

  const handleStatus = (e) => {
    console.log('handleStatus triggered')


    SetIsLoadVerify(true)
    localStorage.setItem("email", email);
    if (buttonText === 'VERIFY & CONTINUE') {
      const isValid = formvalidation();
      if (isValid) {
         console.log('asdfasd is valid')
        setButtonText('VERIFY & CREATE');
        console.log('VERIFY & CONTINUE and signup triggered')
        if (activeLoad == "") {
          clientActivity();
          signUp();
        }
      }
    } 




    if (buttonText === 'VERIFY & CREATE') {

      if (otp.length === undefined) {
        setOtpError("Please Enter Otp");
        setActiveLoad("")
        setTimeout(function () { setOtpError("") }, 3000);
        console.log('otp undefined block')

      } else {
        console.log('otpVerifyyyyyyyyyyy calll ')
        if (activeLoad == "") {
          otpVerify();
        }

      }
    }

  }
  // console.log(values)

  const clientActivity = () => {
    let path = window.location.pathname.split("/");
    // const pageName = path[path.length - 1];
    var presentTime = moment();
    let payload;

    payload = {
      "pagename": 'SIGNUP',
      "pageurl": window.location.href,
      "starttime": presentTime,
      "useragent": JSON.parse(localStorage.getItem("loc")),
      "userType": "type",
     // "corporate": Corporate,
      "name": name,
      "idc": values,
      "phone": number,
      "companyName": companyName != "" && companyName !== undefined ? companyName : "",
      "clienttype": "ONLINE",
      "emailid": email,
    };
    const filteredObject = {};
    for (let key in payload) {
      if (payload[key] !== '' && payload[key] !== undefined && !(Array.isArray(payload[key]) && payload[key].length === 0)) {
        filteredObject[key] = payload[key];
      }
    }


    let urlLink;
    if (localStorage.getItem("previousid")) {
      urlLink = lambda + '/activity?appname=' + appname + "&previousid=" + localStorage.getItem("previousid")
    } else {
      urlLink = lambda + '/activity?appname=' + appname
    }

    axios({
      method: 'POST',
      url: urlLink,
      data: filteredObject
    })
      .then(function (response) {
        if (response.data.statusCode === 200) {
          localStorage.setItem("previousid", response.data.result)
        }
      });
  }
  // console.log('Corporate', Corporate)

  const signUp = async () => {
    console.log('signup call triggered ')
    try {
      console.log('signup try block')
      setActiveLoad("signUpActive")
      const response = await tmdbApi.signUp({
        "userType": type != "" && type !== undefined ? type : "SuperAdmin",
        // "corporate": Corporate != "" && Corporate !== undefined ? Corporate : "",
        "name": name != "" && name !== undefined ? name : "",
        "idc": values != "" && values !== undefined ? values : "",
        "phone": number != "" && number !== undefined ? number : "",
        "companyName": companyName != "" && companyName !== undefined ? companyName : "",
        "clienttype": "ONLINE",
        "emailid": email != "" && email !== undefined ? email : "",
        "useragent": locData?.headers !== undefined ? locData?.headers : {}
      });
      console.log('response--->', response);

      if (response.statusCode === 200 && response.result === "Success") {
        setShow(true);

      } else if (response.result === "User already exists") {
        setShow(false);
        setError("Email Already Exist. Please Enter another Email");
        if (verificationRequired === false) {
          setButtonText("CONTINUE");
        } else {
          setButtonText("VERIFY & CONTINUE");

        }
      }
      else if (response.result === "PENDING VERIFICATION") {
        setShow(true);
      }
      else if (response.result === "PENDING APPROVAL") {
        setError("Please Wait For Admin Approval");
        setTimeout(function () { history.push("/message") }, 3000);

      }

      else if (response.result === "PENDING TERMS") {
        history.push("./terms/" + email);

      }
      else {
        setError("Something Went Wrong Please Try Again");

      }
      setActiveLoad("")
      SetIsLoadVerify(false)
    } catch {
      // setShow(false);
      setActiveLoad("")
      console.log("signup block error");
    }
  };
  const validateEmail = (e) => {

    setEmail(e.target.value);

    // if (validator.isEmail(email)) {
    //   setEmailError('Valid Email :)')
    //   setTimeout(function () { setEmailError("") }, 3000)
    // } else {
    //   setEmailError('Enter valid Email!')
    //   setTimeout(function () { setEmailError("") }, 3000)
    // }


  }
  const handleResendOtp = async () => {
    const valid = emailValidation()
    if (valid) {
      setActiveLoad("ResendActive")
      setTimeout(function () {
        setActiveLoad("")
      }, 3000)
      try {
        console.log(tmdbApi);
        const response = await tmdbApi.resendMail({
          "emailid": email,
          "page": "signup"
        });
        console.log(response);
        // setActiveLoad("")
      } catch {
        setActiveLoad("")
        console.log("error");
      }
    }
  };



  const otpVerify = async () => {
    try {
      setActiveLoad("signUpActive")
      const response = await tmdbApi.otpVerify({
        "otp": Number(otp),
        "emailid": email
      });
      if (response.result == "User verified Successfully" || response.result.token) {
        // localStorage.setItem("Terms", "terms");
        console.log('otp verify block user verified and redirect to terms page')
        localStorage.setItem("token", response?.result?.token?.token)
        localStorage.setItem("userid", response?.result?.userid)
        history.push("/company");
      }
      else {
        setOtpClass(true)
      }
      setActiveLoad("")
    } catch {
      setActiveLoad("")
      console.log("error");
    }
  };

  const handlecancel = (e) => {
    history.push("/");
  }

  const handleMessage = (e) => {
    setNameError("");
  }
  const handleEmailMessage = (e) => {
    setError("");
    setEmailError("");
  }
  const handleCompanyMessage = (e) => {
    setCompanyError("");
  }
  const handleOtpError = (e) => {
    console.log("came");

    setOtpClass(false)
  }

  const handleChange = (otp) => {
    setOtpClass(false);
    setOtp(otp)
  };

  let k = countries && countries.length > 0 && countries.filter(eachItem => eachItem.alpha2 === defaultCountryCode)
  // console.log('countries',countries)
  let imageCloudfront;
  if (config.common && config.common.imageCloudfront) {
    imageCloudfront = config.common.imageCloudfront;
  }
  return (
    <>
    <div className="signup_section">
      <button className="close-btn" onClick={handlecancel}><span className="material-icons">close</span></button>
      <div className="sign-wrapper">
        <div className="sign-header">
          <a href="/">
        <img src={imageCloudfront + "propertyCalculator/images/dealerbrand-logo.png"} className="logo"/></a>
          <h1 className="mb-3">Create Account</h1>
          
        </div>
        <div className="sign-body">
          {/* <div className="sign-block">
            <h2 className="title">I Want to</h2>
            <div className="flex-center">
              <button className={type === "BUYER" ? "icon-btn buy-icon-bg selected" : "icon-btn buy-icon-bg"} onClick={e => handleTypeClick(e, "BUYER")} >
                BUY
              </button>
              <button className={type === "SELLER" ? "icon-btn sell-icon-bg selected" : "icon-btn sell-icon-bg"} onClick={e => handleTypeClick(e, "SELLER")}>
                SELL
              </button>
              <button className={type === "BOTH" ? "icon-btn both-icon-bg selected" : "icon-btn both-icon-bg"} onClick={e => handleTypeClick(e, "BOTH")} >
                BOTH
              </button>
            </div>
            {typeerror != "" ?
              <span className="errormsg" style={{
                fontWeight: 'bold',
                color: 'red',
              }}>{typeerror}</span> : ""
            }
          </div> */}

          {/* <div className="sign-block type-block">
            <h2 className="title">I'm</h2>
            <div className="flex-center">
              <button className={Corporate === "INDIVIDUAL" ? "icon-btn individual-icon-bg  sm-font selected" : "icon-btn individual-icon-bg  sm-font"} onClick={e => handlestatusClick(e, "INDIVIDUAL")}>
                Individual
              </button>
              <button className={Corporate === "COMPANY" ? "icon-btn company-icon-bg sm-font  sm-font selected" : "icon-btn company-icon-bg sm-font"} onClick={e => handlestatusClick(e, "COMPANY")}>
                Company
              </button>
            </div>
            {categoryerror != "" ?
              <span className="errormsg" style={{
                fontWeight: 'bold',
                color: 'red',
              }}>{categoryerror}</span> : ""
            }

          </div> */}
          <div className="tab-content p-3 text-muted">
            <div className="sign-block">
              <h2 className="title mb-3">Enter Your Personal Details</h2>


              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="name" placeholder="Enter Name" name="fullname" value={name} onChange={(e) => setName(e.target.value)} onFocus={(e) => handleMessage(e)} autoComplete="on" required /> {nameerror != "" ?
                  <span className="errormsg" style={{
                    fontWeight: 'bold',
                    color: 'red',
                  }}>{nameerror}</span> : ""
                }
                <label htmlFor="name">Name</label>
              </div>
              {/* <div class="form-floating mb-3">
                <input type="text" class="form-control" id="name" placeholder="Enter Company Name" name="companyName" autocomplete="on" required="" value={companyName} onChange={(e) => setCompanyName(e.target.value)}/>
                <label for="name">Company Name</label>
              </div>
              <div class="form-floating mb-3">
                <input type="text" class="form-control" id="name" placeholder="Enter Role" name="role" autocomplete="on" required="" value={role} onChange={(e) => setRole(e.target.value)}/>
                <label for="name">Role</label>
              </div> */}
              <div className="input-group mb-3 custom-drop_down">

                {/* <select name="countryCodeAlpha2" value={values} className="colorselect capitalize" onChange={(e) => setValues(e.target.value)}>

                  <option value={k && k[0] && k[0].alpha3}>{k && k[0] && k[0].alpha3}{k && k[0] && k[0].countrycode}</option>
                  {countries && countries.length > 0 && countries.map((task, i) => {
                    // console.log('taskkk',task)
                    return (
                      <><option key={i} value={task.alpha3}>{task.alpha3}{task.countrycode}</option></>
                    )
                  }
                  )}
                </select> */}
                <div className="form-floating">

                  <input type="text" className="field form-control" placeholder="Enter Phone Number" maxLength="10" value={number} name="phonenumber" onChange={e => checkInput(e)} autoComplete="on" />

                  <label htmlFor="contact">Contact Number</label>
                </div>
              </div>
              <div className="form-floating mb-3">
                <input type="email" className="form-control" id="email" name="emailid" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={(e) => handleEmailMessage(e)} autoComplete="on" />
                <span className="errormsg" style={{
                  fontWeight: 'bold',
                  color: 'red',
                }}>{emailError}</span>

                <label htmlFor="email">Email Id</label>
              </div>

            </div>
            {/* {Corporate == "COMPANY" &&
              <div className="sign-block">



                <div>
                  <h2 className="title mb-4">Enter Your Company Details</h2>
                  <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="company" placeholder="name@example.com" value={companyName} onChange={(e) => setCompanyName(e.target.value)} onFocus={(e) => handleCompanyMessage(e)} />
                    {companyError != "" ?
                      <span className="errormsg" style={{
                        fontWeight: 'bold',
                        color: 'red',
                      }}>{companyError}</span> : ""
                    }
                    <label htmlFor="company">Company Name</label>
                  </div>



                </div>

              </div>

            } */}

            {show === true &&
              <div className="otp-block">
                <p>Enter the OTP we just sent to the above Email</p>
                <div className={otpclass ? "otp-inputs signup-otp-inputs invalid errorStyle" : "otp-inputs signup-otp-inputs"} id="otp">

                  <OTPInput value={otp}

                    onChange={handleChange}
                    autoFocus OTPLength={5} otpType="number" onFocus={(e) => handleOtpError(e)} />
                  <p>The OTP you have entered is incorrect. Please try again or request a new OTP</p>
                </div>
                <div className="otp-footer">


                  <button onClick={handleResendOtp}>
                    {activeLoad === "ResendActive" ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}
                    Resend</button> {activeLoad === "ResendActive" ? <p style={{ 'font-size': '12px', 'color': 'green' }}>OTP Resent!</p> : null}
                </div>
              </div>
            }
            <div className="signup">
              <button className="fill_btn" onClick={e => handleStatus(e)}>
                {activeLoad === "signUpActive" ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}

                {buttonText}</button>

            </div>
            {error != "" ?
              <span className="errormsg" style={{
                fontWeight: 'bold',
                color: 'red',
              }}>{error}</span> : ""
            }
            <p className="signup-prompt mt-5" >Already have an Account<a href="/login" className="mx-2">Sign In</a></p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default SignUp;
