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
import React, { useState, useEffect } from "react";
import { Row, Col, CardBody, Card, Container, Input, Label, Form } from "reactstrap";
import "../../src/assets/css/style.css";
import SweetAlert from 'react-bootstrap-sweetalert';
import tmdbApi from "../api/tmdbApi";
import { Link, useHistory } from "react-router-dom";
import { getSuggestedQuery } from "@testing-library/react";
import axios from 'axios';
import * as Config from "../constants/Config";
let { lambda, appname } = window.app;


const CreatePassword = () => {

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
  let id = params.id;



  const history = useHistory();
  const [image, setImg] = useState('');
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordErr] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [requirementerror, setRequirementError] = useState("");
  const [number, setNumber] = useState(false);
  const [upper, setUpper] = useState(false);
  const [limit, setLimit] = useState(false);
  const [lower, setLower] = useState(false);
  const [special, setSpecial] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [passwordInput, setPasswordInput] = useState({
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {

    if (window.site === undefined) {
      setTimeout(() => {
        if (window.site && window.site.common && window.site.common.resourcesUrl) {
          setImg(window.site.common.resourcesUrl)
        }
      }, 1000);
    }
    if (window.site && window.site.common && window.site.common.resourcesUrl) {
      setImg(window.site.common.resourcesUrl)
    }

  }, [window.site]);

  useEffect(() => {
    getuser();
  }, []);

  const getuser = (e) => {
    axios({
      method: 'GET',
      url: lambda + '/user?appname=' + appname + '&userid=' + id,
    })
      .then(function (response) {
        console.log("response", response.data.result[0].emailid);
        setEmail(response.data.result[0].emailid)
      });
  }


  const checkInput = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    setNumber(onlyDigits);

  };

  const handlePasswordChange = (evnt) => {
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;
    const NewPasswordInput = { ...passwordInput, [passwordInputFieldName]: passwordInputValue }
    setPasswordInput(NewPasswordInput);

  }
  const handleAddclass = (evnt) => {
    var element = document.getElementById("instruction");
    element.classList.add("ins-dsp-none");
  }
  const handleRemoveclass = (evnt) => {
    var element = document.getElementById("instruction");
    element.classList.remove("ins-dsp-none");
  }

  const handleValidation = (evnt) => {
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;
    setConfirmPasswordError("")
    //for password 
    if (passwordInputFieldName === 'password') {
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
      //   errMsg = "At least one Uppercase";
      // } else if (!lowercasePassword) {
      //   errMsg = "At least one Lowercase";
      // } else if (!digitsPassword) {
      //   errMsg = "At least one digit";
      // } else if (!specialCharPassword) {
      //   errMsg = "At least one Special Characters";
      // } else if (!minLengthPassword) {
      //   errMsg = "At least minumum 8 characters";
      // } else {
      //   errMsg = "";
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
        var element = document.getElementById("err4");
        element.classList.add("vaild");
        setSpecial(true)
      } else {
        var element = document.getElementById("err4");
        element.classList.remove("vaild");
      }
      if (minLengthPassword) {
        var element = document.getElementById("err3");
        element.classList.add("vaild");
        setLimit(true)
      } else {
        var element = document.getElementById("err3");
        element.classList.remove("vaild");
      }


      setPasswordErr(errMsg);
    }
    // for confirm password

  }
  const togglePassword = (e) => {
    setPasswordShown(!passwordShown);
  };
  const handleCreate = (e) => {

    if (passwordInput.password == "") {
      setError("Please Enter Password");
      setTimeout(function () { setError("") }, 3000);

    } else if (passwordInput.confirmPassword == "") {
      setError("Please Enter Confirm Password");
      setTimeout(function () { setError("") }, 3000);

    } else if (passwordInput.confirmPassword && (passwordInput.confirmPassword !== passwordInput.password)) {
      setConfirmPasswordError("Confirm password is not matched");
    }
    else if (limit === true) {
      if(upper === true){
        if(special === true){
          if(lower === true){
            if(number === true){
              if(confirmPasswordError === ""){
              if(passwordInput.password == passwordInput.confirmPassword){
                createpwd();
              }else{
                setRequirementError("password doesn't met reqirement")
                setTimeout(function () { setRequirementError("") }, 3000);
              }
            }else{
              setRequirementError("password doesn't met reqirement")
              setTimeout(function () { setRequirementError("") }, 3000);
            }
            }else{
              setRequirementError("password doesn't met reqirement")
              setTimeout(function () { setRequirementError("") }, 3000);
            }
          }else{
            setRequirementError("password doesn't met reqirement")
            setTimeout(function () { setRequirementError("") }, 3000);
          }
        }else{
          setRequirementError("password doesn't met reqirement")
          setTimeout(function () { setRequirementError("") }, 3000);
        }

      }else{
        setRequirementError("password doesn't met reqirement")
        setTimeout(function () { setRequirementError("") }, 3000);
      }

    }else{
      setRequirementError("password doesn't met reqirement")
      setTimeout(function () { setRequirementError("") }, 3000);
    }
    // else (limit && upper && special && lower && number && confirmPasswordError === "") {
    //   if (passwordInput.password == passwordInput.confirmPassword) {
    //     createpwd();
    //   }
    // }
    // else{
    //   createpwd();
    // }

  }

  const createpwd = async () => {
    try {
      const response = await tmdbApi.CreatePassword({
        "emailid": email,
        "password": passwordInput.password
      });
      console.log(response);
      if (response.statusCode == 200) {
        setSuccess(true);
      }
    } catch {
      console.log("error");
    }
  };
  function onConfirm() {
    history.push("/");
  };

  function handleBack() {
    history.push("/");
  };


  console.log(email)
  return (
    <>

      <div className="account-pages my-5 pt-sm-5 Orasi-signup">
        <Container>
          <button className="close-btn" onClick={handleBack}><span className="material-icons">close</span></button>
          <Row className="justify-content-center">
            <Col className="col-6 content col-xl-5">
              <img src={image + Config.imgmiddle + "logo-light.png?auto=compress,format"} />
              <Card className="overflow-hidden">

                <CardBody className="pt-0">

                  <div className="p-2">
                    <div
                      className="form-horizontal">
                      <h1>create Password</h1>
                      <p>Get your admin account now</p>
                      <div className="mb-3 input-field">
                        <Label className="form-label">Email</Label>
                        {/* <Input
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder={email}
                          type="email"  value={email} /> */}
                        <input type="email" className="form-control" id="floatingInput" value={email} placeholder={email} disabled />

                      </div>

                      <div className="mb-3 input-field">
                        <Label className="form-label">New Password</Label>
                        <input type={passwordShown ? "text" : "password"} value={passwordInput.password} onChange={(e) => handlePasswordChange(e)} onKeyUp={handleValidation} onBlur={(e) => { handleAddclass(e) }} onFocus={(e) => { handleRemoveclass(e) }} name="password" placeholder="Password" className="form-control" />
                        <p className="text-danger">{passwordError}</p>
                      </div>
                      <div className="mb-3 input-field">
                        <Label className="form-label">Confirm Password</Label>
                        <input type={passwordShown ? "text" : "password"} value={passwordInput.confirmPassword} onChange={(e) => handlePasswordChange(e)} onKeyUp={handleValidation} onBlur={(e) => { handleAddclass(e) }} onFocus={(e) => { handleRemoveclass(e) }} name="confirmPassword" placeholder="Password" className="form-control" />
                        <p className="text-danger">{confirmPasswordError}</p>

                      </div>
                      <div className="flex-left terms-block">
                        <input type="checkbox" id="terms-check" onChange={(e) => togglePassword(e)} />
                        <label > Show Password.</label>
                      </div>
                      <p className="text-danger">{error}</p>
                      <div className="mt-4">
                        <button
                          className="btn btn-primary btn-block "
                          type="submit" onClick={e => handleCreate(e)}
                        >
                          CREATE
                        </button>
                      </div>
                      <p className="text-danger">{requirementerror}</p>
                    </div>
                  </div>
                </CardBody>

              </Card>
              <div className="create-password-instruction ins-dsp-none" id="instruction">
                <div className="callouts-left">
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
                  <p className="error" id="err4"> {special ? <span className="material-symbols-outlined">
                    check
                  </span> : <span className="material-symbols-outlined">
                    close
                  </span>} Password must contain a special character or a space</p>
                  <p className="error" id="err3"> {limit ? <span className="material-symbols-outlined">
                    check
                  </span> : <span className="material-symbols-outlined">
                    close
                  </span>} Password must contain at least 8 characters</p>
                </div>
              </div>
              <div className="mt-5 text-center">
                <p>
                  © {new Date().getFullYear()} SPACOVERS.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <SweetAlert show={success}
        custom
        confirmBtnText="Login"
        confirmBtnBsStyle="primary"
        title={"Password set successfully"}
        onConfirm={e => onConfirm()}
      >
      </SweetAlert>
    </>
  );
};

export default CreatePassword;
