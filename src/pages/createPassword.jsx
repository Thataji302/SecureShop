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
import { Row, Col, CardBody, Card, Container, Label, FormGroup, Button, Input } from "reactstrap";
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
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios
      .get(`${window.app.lambda}/user?appname=${window.app.appname}&userid=${userId}`)
      .then((response) => {
        if (response.data.result && response.data.result.length > 0) {
          setEmail(response.data.result[0].emailId);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
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
    const value = e.target.value.trim();
    setPassword(value);
    validatePassword(value);
    setErrors((prev) => ({ ...prev, password: "" }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value.trim());
    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
  };

  const handleSubmit = () => {
    let newErrors = {};
    if (!password) newErrors.password = "Please enter password";
    if (!confirmPassword) newErrors.confirmPassword = "Please enter confirm password";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!Object.values(validation).every(Boolean)) newErrors.password = "Password does not meet requirements";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
                  <FormGroup>
                    <Label>Email</Label>
                    <Input type="email" className="form-control" value={email} disabled />
                  </FormGroup>
                  <FormGroup>
                    <Label>New Password</Label>
                    <Input
                      type={passwordShown ? "text" : "password"}
                      className="form-control"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    {errors.password && <p className="text-danger">{errors.password}</p>}
                  </FormGroup>
                  <FormGroup>
                    <Label>Confirm Password</Label>
                    <Input
                      type={passwordShown ? "text" : "password"}
                      className="form-control"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                    {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input type="checkbox" onChange={() => setPasswordShown(!passwordShown)} /> Show Password
                    </Label>
                  </FormGroup>
                  <Button
                    color="primary"
                    block
                    className="mt-4"
                    onClick={handleSubmit}
                    disabled={!Object.values(validation).every(Boolean)}
                  >
                    CREATE
                  </Button>
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
      <SweetAlert
        show={success}
        confirmBtnText="Login"
        confirmBtnBsStyle="primary"
        title="Password set successfully"
        onConfirm={() => history.push("/")}
      />
    </div>
  );
};

export default CreatePassword;

 