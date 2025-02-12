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
 import { Row, Col, CardBody, Card, Container, Label } from "reactstrap";
 import SweetAlert from "react-bootstrap-sweetalert";
 import axios from "axios";
 import { useHistory } from "react-router-dom";
 import * as Config from "../constants/Config";
 import tmdbApi from "../api/tmdbApi";
 import "../../src/assets/css/style.css";
 
 const CreatePassword = () => {
   const history = useHistory();
   const params = new URLSearchParams(window.location.search);
   const userId = params.get("id");
 
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [passwordShown, setPasswordShown] = useState(false);
   const [validation, setValidation] = useState({
     lower: false,
     upper: false,
     number: false,
     special: false,
     limit: false,
   });
   const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
   const [success, setSuccess] = useState(false);
   
   useEffect(() => {
     axios
       .get(`${window.app.lambda}/user?appname=${window.app.appname}&userid=${userId}`)
       .then((response) => setEmail(response.data.result[0].emailid));
   }, [userId]);
 
   const validatePassword = (value) => {
     setValidation({
       lower: /[a-z]/.test(value),
       upper: /[A-Z]/.test(value),
       number: /[0-9]/.test(value),
       special: /[#?!@$%^&*-]/.test(value),
       limit: value.length >= 8,
     });
   };
 
   const handlePasswordChange = (e) => {
     const value = e.target.value;
     setPassword(value);
     validatePassword(value);
     setErrors((prev) => ({ ...prev, password: "" }));
   };
 
   const handleConfirmPasswordChange = (e) => {
     setConfirmPassword(e.target.value);
     setErrors((prev) => ({ ...prev, confirmPassword: "" }));
   };
 
   const handleSubmit = () => {
     if (!password) return setErrors({ password: "Please enter password" });
     if (!confirmPassword) return setErrors({ confirmPassword: "Please enter confirm password" });
     if (password !== confirmPassword) return setErrors({ confirmPassword: "Passwords do not match" });
     if (!Object.values(validation).every(Boolean)) return setErrors({ password: "Password does not meet requirements" });
     
     tmdbApi
       .CreatePassword({ emailid: email, password })
       .then((response) => {
         if (response.statusCode === 200) setSuccess(true);
       })
       .catch(() => setErrors({ password: "Failed to set password" }));
   };
 
   return (
     <div className="account-pages my-5 pt-sm-5 Orasi-signup">
       <Container>
         <button className="close-btn" onClick={() => history.push("/")}>
           <span className="material-icons">close</span>
         </button>
         <Row className="justify-content-center">
           <Col className="col-6 content col-xl-5">
             <img src={`${window.site?.common?.resourcesUrl}${Config.imgmiddle}logo-light.png`} alt="Logo" />
             <Card className="overflow-hidden">
               <CardBody className="pt-0">
                 <div className="p-2">
                   <h1>Create Password</h1>
                   <p>Get your admin account now</p>
                   <Label>Email</Label>
                   <input type="email" className="form-control" value={email} disabled />
                   <Label>New Password</Label>
                   <input type={passwordShown ? "text" : "password"} className="form-control" value={password} onChange={handlePasswordChange} />
                   <p className="text-danger">{errors.password}</p>
                   <Label>Confirm Password</Label>
                   <input type={passwordShown ? "text" : "password"} className="form-control" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                   <p className="text-danger">{errors.confirmPassword}</p>
                   <input type="checkbox" onChange={() => setPasswordShown(!passwordShown)} /> Show Password
                   <button className="btn btn-primary btn-block mt-4" onClick={handleSubmit}>CREATE</button>
                 </div>
               </CardBody>
             </Card>
             <div className="password-instructions">
               {Object.entries(validation).map(([key, isValid]) => (
                 <p key={key} className={isValid ? "valid" : "invalid"}>
                   {isValid ? "✔" : "✖"} {key.replace(/\b[a-z]/g, (char) => char.toUpperCase())} Requirement
                 </p>
               ))}
             </div>
             <p className="text-center mt-5">© {new Date().getFullYear()} SPACOVERS.</p>
           </Col>
         </Row>
       </Container>
       <SweetAlert show={success} confirmBtnText="Login" confirmBtnBsStyle="primary" title="Password set successfully" onConfirm={() => history.push("/")} />
     </div>
   );
 };
 
 export default CreatePassword;
 