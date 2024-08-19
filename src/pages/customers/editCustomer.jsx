/***
**Module Name: edit customer
 **File Name :  editcustomer.js
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
 **Description : contains edit customer details.
 ***/
import React, { useState, useEffect, useContext } from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import { useHistory, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import tmdbApi from "../../api/tmdbApi";
import SessionPopup from "../../pages/SessionPopup"
import axios from 'axios';
import moment from "moment";

import Select from 'react-select';
import Loader from "../../components/loader";
import SweetAlert from 'react-bootstrap-sweetalert';
import { contentContext } from "../../context/contentContext";
import * as Config from "../../constants/Config";
let { lambda, country, appname } = window.app;

const EditCustomer = () => {
    let { id } = useParams();
    const history = useHistory();
    const [msg, setMsg] = useState("");
    const [countries, setCountries] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUserAdd, setIsUserAdd] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [IdcError, setIdcError] = useState('');
    const [typeError, setTypeError] = useState('');
    const [managertypeError, setManagerTypeError] = useState('');
    const [editCustomer, setEditCustomer] = useState({});
    const [permission, setPermission] = useState({});
    const [success, setSuccess] = useState(false);
    const [UpdateSuccess, setUpdateSuccess] = useState(false);
    const [manager, setManagers] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [existmsg, setExistMsg] = useState(false);
    const [Ismsg, setIsMsg] = useState(false);
    const [checkStatus, setCheckStatus] = useState(false);
    const [invalidContent, setInvalidContent] = useState(false);
    const [image, setImg] = useState('');
    const [checkBoxVal, setCheckBox] = useState(false);
    const [customerErrors, setCustomerErrors] = useState({});
    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, userData, setActiveMenuId, GetTimeActivity } = useContext(contentContext);
    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);

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
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setActiveMenuId(200004)
        setRoute("wholesaler")
        GetCountries();
        if (id) {
            //  getuser();
            getCustomer();
            // console.log(id);

        }
        //  getManagers();
        //  GetCountries();
        userActivity();
    }, []);

    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = id != undefined ? path[path.length - 2] : path[path.length - 1];;
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

    const GetCountries = async () => {
        try {
            console.log(tmdbApi);
            const response = await tmdbApi.getLookUp({
                "type": ["state"],
                "status": "ACTIVE",
            });

            // console.log(response.result);
            if (response.result.data === "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {
                setCountries(response.result.data);
            }
        } catch {
            console.log("error");
        }
    };


    const getCustomer = (e) => {
        GetTimeActivity()
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/customer?appname=' + appname + '&userid=' + localStorage.getItem("userId") + "&token=" + token + "&customerid=" + id,
        })
            .then(function (response) {
                //  console.log("response", response.data.result[0]);
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                }
                else {
                    console.log(response.data);
                    if (response.data.result.length > 0) {
                        setEditCustomer(response.data.result[0]);

                    } else {
                        setInvalidContent(true)
                    }
                }
            });
    }


    const onclickInvalid = () => {
        GetTimeActivity()
        setInvalidContent(false)
        history.push('/wholesalers')
    }

    const getManagers = (e) => {
        GetTimeActivity()
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/users?appname=' + appname + "&token=" + token + "&type=MANAGER",
        })
            .then(function (response) {
                console.log(response);
                setManagers(response.data.result)
            });
    }



    const getPermissions = (userType) => {
        GetTimeActivity()
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/userPermissions?appname=' + appname + '&type=' + userType + "&token=" + token,
        })
            .then(function (response) {
                console.log("response.data.result.data[0]", response.data.result.data[0])
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setPermission(response.data.result.data[0].permissions)
                }
            });
    }

    const handleChange = (e) => {
        console.log('typeeeeeeeeee', e.target.value)
        console.log('nameeeee', e.target.name)
        if (!!customerErrors[e.target.name]) {
            let error = Object.assign({}, customerErrors);
            delete error[e.target.name];
            setCustomerErrors(error);

        }
        if (e.target.name === "address") {
            if (id) {
                setCheckStatus(true);
            }
            getPermissions(e.target.value);
            setEditCustomer({ ...editCustomer, [e.target.name]: e.target.value });

        } else if (e.target.name === "phonenumber") {
            const numericValue = e.target.value.replace(/\D/g, '');
            setEditCustomer({ ...editCustomer, [e.target.name]: numericValue });
        }

        else if (e.target.name === "status") {
            if (id) {
                setCheckStatus(true);
            }
            setEditCustomer({ ...editCustomer, [e.target.name]: e.target.value });
        } else if (e.target.name === "type") {
            // if(id){
            //     setCheckStatus(true);
            // }
            setEditCustomer({ ...editCustomer, [e.target.name]: e.target.value });
        }
        else if (e.target.name === "customeraddress1") {
            console.log("checkBoxVal", checkBoxVal)

            setEditCustomer({
                ...editCustomer,
                customeraddress: {
                    ...editCustomer.customeraddress,
                    address1: e.target.value,
                },
            });

        }
        else if (e.target.name === "customeraddress2") {
            setEditCustomer({
                ...editCustomer,
                customeraddress: {
                    ...editCustomer.customeraddress,
                    address2: e.target.value,
                },
            });
        }
        else if (e.target.name === "customerstate") {
            setEditCustomer({
                ...editCustomer,
                customeraddress: {
                    ...editCustomer.customeraddress,
                    state: e.target.value,


                },
            });
        }
        else if (e.target.name === "customerpincode") {
            const numericValue = e.target.value.replace(/\D/g, '');
            setEditCustomer({
                ...editCustomer,
                customeraddress: {
                    ...editCustomer.customeraddress,
                    pincode: numericValue,


                },
            });
        }
        else if (e.target.name === "billingaddress1") {
            setEditCustomer({
                ...editCustomer,
                billingaddress: {
                    ...editCustomer.billingaddress,
                    address1: e.target.value,
                },
            });
        }
        else if (e.target.name === "billingaddress2") {
            setEditCustomer({
                ...editCustomer,
                billingaddress: {
                    ...editCustomer.billingaddress,
                    address2: e.target.value,
                },
            });
        }
        else if (e.target.name === "billingstate") {
            setEditCustomer({
                ...editCustomer,
                billingaddress: {
                    ...editCustomer.billingaddress,
                    state: e.target.value,


                },
            });
        }
        else if (e.target.name === "billingpincode") {
            const numericValue = e.target.value.replace(/\D/g, '');
            setEditCustomer({
                ...editCustomer,
                billingaddress: {
                    ...editCustomer.billingaddress,
                    pincode: numericValue,


                },
            });
        }


        else {
            setEditCustomer({ ...editCustomer, [e.target.name]: e.target.value });
        }



    }


    function onConfirm() {
        GetTimeActivity()
        setSuccess(false);
        history.push("/members")
    };

    const handleAddCustomer = (e) => {
        GetTimeActivity()
        const isValid = validate();
        if (isValid) {
            createcustomer();
        }
    }

    function formvalidation() {
        GetTimeActivity()
        let formIsValid = true;
        if (editCustomer.emailid == undefined || editCustomer?.emailid?.trim() == "") {
            setEmailError("Please enter Email");
            setTimeout(function () { setEmailError("") }, 3000);
            formIsValid = false;
        }
        const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
        if (regEx.test(editCustomer.emailid)) {
            setEmailError("");
            setTimeout(function () { setEmailError("") }, 3000)
        } else if (!regEx.test(editCustomer.emailid) && editCustomer.emailid !== "") {
            setEmailError("Please Enter Valid Email");
            setTimeout(function () { setEmailError("") }, 3000)
            formIsValid = false;
        }

        if (editCustomer?.name == undefined || editCustomer?.name?.trim() == "") {
            setNameError("Please enter Name");
            setTimeout(function () { setNameError("") }, 3000);
            formIsValid = false;
        }
        // if (!editCustomer.phone && editCustomer.idc) {

        //     setPhoneError("Enter phone number");
        //     setTimeout(function () { setPhoneError("") }, 3000);
        //     formIsValid = false;
        // }


        // if (editCustomer.phone && !editCustomer.idc) {
        //     setIdcError("Select country code");
        //     setTimeout(function () { setIdcError("") }, 3000);
        //     formIsValid = false;
        // }

        if (editCustomer.type == "") {
            setTypeError("Please select Type");
            setTimeout(function () { setTypeError("") }, 3000);
            formIsValid = false;
        }

        return formIsValid;
    }


    const handleSubmit = () => {
        GetTimeActivity()
        setIsLoading(true)

        const token = localStorage.getItem("token")
        let payload = {}
        payload = {
            "emailid": editCustomer.emailid?.trim(),
            //  "address": editCustomer.customeraddress.address1,
            "name": editCustomer.name?.trim(),
            "idc": editCustomer.idc,
            "phonenumber": editCustomer.phonenumber,
            "customeraddress": {
                "address1": editCustomer?.customeraddress?.address1,
                "address2": editCustomer.customeraddress?.address2,
                "state": editCustomer.customeraddress?.state,
                "pincode": editCustomer.customeraddress?.pincode
            },
            "billingaddress": {
                "address1": editCustomer?.billingaddress?.address1,
                "address2": editCustomer.billingaddress?.address2,
                "state": editCustomer.billingaddress?.state,
                "pincode": editCustomer.billingaddress?.pincode
            },
            //  "manager": editCustomer?.manager ? editCustomer?.manager : "",
            //  "permissions": permission,
            "check": editCustomer.check,
            "status": editCustomer.status,
            "type": editCustomer.type
        }

        if (checkStatus === false) {
            delete payload["status"];
            delete payload["userType"];
        }

        console.log('payload', payload);

        axios({
            method: 'POST',
            //  url: lambda + '/user?appname=' + appname + '&userid=' + id + "&token=" + token,
            url: lambda + '/customers?appname=' + appname + '&userid=' + localStorage.getItem("userId") + "&token=" + token + "&customerid=" + id,
            data: payload,
        })
            .then(function (response) {
                if (response) {
                    if (response.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else if (response.data.result == "This ACM assaigned to companies") {
                        setIsMsg(true);
                        setIsLoading(false);
                    } else {
                        getCustomer()
                        setIsLoading(false);
                        setUpdateSuccess(true)
                    }
                }

            });
    }


    const handleUpdate = (e) => {
        GetTimeActivity()
        const isValid = validate();
        console.log("isValid", isValid);
        if (isValid) {
            handleSubmit();
        }
    }
    console.log("edit", editCustomer);
    const createcustomer = async () => {
        setIsLoading(true)
        GetTimeActivity()
        let payload = {}
        payload = {
            "emailid": editCustomer.emailid?.trim(),
            //  "address": editCustomer.customeraddress.address1,
            "name": editCustomer.name?.trim(),
            "idc": editCustomer.idc,
            "phonenumber": editCustomer.phonenumber,
            "customeraddress": {
                "address1": editCustomer?.customeraddress?.address1,
                "address2": editCustomer.customeraddress?.address2,
                "state": editCustomer.customeraddress?.state,
                "pincode": editCustomer.customeraddress?.pincode
            },
            "billingaddress": {
                "address1": editCustomer?.billingaddress?.address1,
                "address2": editCustomer.billingaddress?.address2,
                "state": editCustomer.billingaddress?.state,
                "pincode": editCustomer.billingaddress?.pincode
            },
            "check": editCustomer.check,
            "status": editCustomer.status,
            "type": editCustomer.type
        }
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userId");
        axios({
            method: 'PUT',
            url: lambda + "/customers?appname=" + appname + "&token=" + token + "&userid=" + userid,
            data: payload,
        })
            .then(function (response) {
                if (response) {
                    console.log("response.result", response)
                    if (response.data.result === "customer already exists") {
                        setExistMsg(true)
                        setIsLoading(false)
                    }
                    else if (response.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                        setIsLoading(false)
                    }
                    else {
                        setIsLoading(false)
                        setSuccess(true);
                    }
                }

            });

    };

    const handleBack = (e) => {
        GetTimeActivity()
        if (id) {
            history.push({
                pathname: "/members",
                state: { search: true }
            });
        } else {
            history.push("/members")
        }
    }
    const validate = (e) => {
        let formIsValid = true;
        let errors = { ...customerErrors }
        if (editCustomer.name === "" || editCustomer.name === undefined) {
            errors["name"] = "Name is required"
            formIsValid = false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // ...
        
        if (editCustomer.emailid === "" || editCustomer.emailid === undefined) {
            errors["emailid"] = "Email Id is required";
            formIsValid = false;
        } else if (!emailRegex.test(editCustomer.emailid)) {
            errors["emailid"] = "Please enter a valid email address";
            formIsValid = false;
        }

        if (editCustomer.status === "" || editCustomer.status === undefined || editCustomer.status === "undefined") {
            errors["status"] = "Status is required"
            formIsValid = false;
        }
        if (editCustomer.type === "" || editCustomer.type === undefined || editCustomer.type === "undefined") {
            errors["type"] = "type is required"
            formIsValid = false;
        }
        if (editCustomer.customeraddress?.address1 === undefined || editCustomer.customeraddress?.address1 === "") {
            errors["customeraddress1"] = "Delivery Address1 is required"
            formIsValid = false;
        }
        if (editCustomer.customeraddress?.address2 === undefined || editCustomer.customeraddress?.address2 === "") {
            errors["customeraddress2"] = "Delivery Address2 is required"
            formIsValid = false;
        }
        if (editCustomer.customeraddress?.state === undefined || editCustomer.customeraddress?.state === "") {
            errors["customerstate"] = "Delivery State is required"
            formIsValid = false;
        }
        if (editCustomer.customeraddress?.pincode === undefined || editCustomer.customeraddress?.pincode === "") {
            errors["customerpincode"] = "Delivery Zipcode is required"
            formIsValid = false;
        }
        if (editCustomer.billingaddress?.address1 === undefined || editCustomer.billingaddress?.address1 === "") {
            errors["billingaddress1"] = "Billing Address1 is required"
            formIsValid = false;
        }
        if (editCustomer.billingaddress?.address2 === undefined || editCustomer.billingaddress?.address2 === "") {
            errors["billingaddress2"] = "Billing Address2 is required"
            formIsValid = false;
        }
        if (editCustomer.billingaddress?.state === undefined || editCustomer.billingaddress?.state === "") {
            errors["billingstate"] = "Billing State is required"
            formIsValid = false;
        }
        if (editCustomer.billingaddress?.pincode === undefined || editCustomer.billingaddress?.pincode === "") {
            errors["billingpincode"] = "Billing Zipcode is required"
            formIsValid = false;
        }


        setCustomerErrors(errors)

        return formIsValid;
    }

    console.log("edit------>", editCustomer)


    const handleCheckBox = (e) => {
        setCheckBox(e.target.checked);
        if (e.target.checked === true) {

            delete customerErrors.billingaddress1;
            delete customerErrors.billingaddress2;
            delete customerErrors.billingstate;
            delete customerErrors.billingpincode;
            setEditCustomer({
                ...editCustomer,
                billingaddress: {
                    ...editCustomer.billingaddress,
                    address1: editCustomer.customeraddress.address1,
                    address2: editCustomer.customeraddress.address2,
                    state: editCustomer.customeraddress.state,
                    pincode: editCustomer.customeraddress.pincode,
                },
                check: true

            });
        } else {

            setEditCustomer({
                ...editCustomer,
                billingaddress: {
                    ...editCustomer.billingaddress,
                    address1: "",
                    address2: "",
                    state: "",
                    pincode: "",
                },
                check: false

            });
        }

    };


    console.log("status", checkBoxVal);

    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <SweetAlert show={invalidContent}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"User Not Found"}
                    onConfirm={e => onclickInvalid()}
                >
                </SweetAlert>
                {!invalidContent &&

                    <div className="main-content user-management create-user">

                        <div className="page-content ">
                            <div className="container-fluid">



                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">

                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">{id == undefined ? "ADD MEMBER" : "EDIT MEMBER"}</h4>
                                                {/* <p className="menu-path"><span>User Management</span> / <b>{id == undefined ? "ADD CUSTOMER" : "EDIT CUSTOMER"}</b></p> */}

                                            </div>
                                            <div>
                                                <a onClick={handleBack} className="btn btn-primary">back</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="create-user-block">
                                    {Object.keys(editCustomer).length > 0 || countries.length > 0 ?

                                        <>
                                            <div className="form-block">
                                                <div className="row">

                                                    <div className="col-md-6">
                                                        <label className="form-label form-label">NAME<span className="required">*</span></label>
                                                        <input id="titlename" name="name" placeholder="Enter Name" type="text" className="form-control form-control" aria-invalid="false" onChange={(e) => handleChange(e)} value={editCustomer && editCustomer.name} />
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.name}</span>

                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label form-label">CONTACT NUMBER</label>

                                                        <div>
                                                            {/* <select name="idc" value={editCustomer && editCustomer.idc} className="colorselect capitalize" onChange={(e) => handleChange(e)}>
                                                                        <option value="">Select</option>
                                                                        {/* <option value="91">IND(+91)</option> */}
                                                            {/*  {countries && countries.length > 0 && countries.map((task, i) => {
                                                                            return (
                                                                                <><option key={i} value={task.alpha3}>{task.alpha3 + task.countrycode}</option></>
                                                                            )
                                                                        }
                                                                        )}
                                                                    </select> */}

                                                            <input className="form-control contact-number" type="tel" name="phonenumber" value={editCustomer && editCustomer.phonenumber} placeholder="Enter Phone Number" onChange={(e) => handleChange(e)} maxLength="10" id="example-tel-input" />
                                                            {/* <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                    }}>{IdcError}</span>
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                    }}>{phoneError}</span> */}
                                                        </div>

                                                    </div>






                                                    <div className="col-md-6 mt-3">
                                                        <label className="form-label form-label">E-MAIL ID<span className="required">*</span></label>
                                                        <input id="email" name="emailid" placeholder="Enter Your Email" type="email" className="form-control form-control" aria-invalid="false" value={editCustomer && editCustomer.emailid} disabled={id !== undefined} onChange={(e) => handleChange(e)} />
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.emailid}</span>

                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="exampleFormControlTextarea1" className="form-label">Type<span className="required">*</span></label>
                                                        <select className="form-select" aria-label="Default select example" name="type" onChange={(e) => handleChange(e)} value={editCustomer && editCustomer.type}>
                                                            <option value="">Select type</option>
                                                            <option value="Wholesaler">Wholesaler</option>
                                                            <option value="Retailer">Retailer</option>

                                                        </select>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.type}</span>
                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="exampleFormControlTextarea1" className="form-label">Status<span className="required">*</span></label>
                                                        <select className="form-select" aria-label="Default select example" name="status" onChange={(e) => handleChange(e)} value={editCustomer && editCustomer.status}>
                                                            <option value="">Select status</option>
                                                            <option value="INACTIVE">INACTIVE</option>
                                                            <option value="ACTIVE">ACTIVE</option>
                                                            <option value="ARCHIVE">ARCHIVE</option>

                                                        </select>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.status}</span>

                                                    </div>
                                                    

                                                    <h5 className="mt-3">Delivery Address</h5>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="customeraddress1" class="form-label">Address 1<span className="required">*</span></label>
                                                        <textarea class="form-control" id="address1" name="customeraddress1" rows="1" onChange={(e) => handleChange(e)} value={editCustomer && editCustomer.customeraddress && editCustomer.customeraddress.address1}></textarea>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.customeraddress1}</span>

                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="customeraddress2" class="form-label">Address 2<span className="required">*</span></label>
                                                        <textarea class="form-control" id="address2" name="customeraddress2" rows="1" onChange={(e) => handleChange(e)} value={editCustomer && editCustomer.customeraddress && editCustomer.customeraddress.address2}></textarea>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.customeraddress2}</span>
                                                    </div>
                                                   

                                                    <div className="col-md-6 mt-3">
                                                        <label for="exampleFormControlTextarea1" class="form-label">State<span className="required">*</span></label>
                                                        <select class="form-select" aria-label="Default select example" name="customerstate" value={editCustomer && editCustomer.customeraddress && editCustomer.customeraddress && editCustomer.customeraddress.state} onChange={(e) => handleChange(e)}>
                                                            <option value="">Select state</option>
                                                            {countries && countries.length > 0 && countries.map((task, i) => {
                                                                return (
                                                                    <><option key={i} value={task.name}>{task.name}</option></>
                                                                )
                                                            }
                                                            )}
                                                        </select>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.customerstate}</span>
                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label htmlFor="customeraddresspincode" class="form-label">Zip Code<span className="required">*</span></label>
                                                        <input type="tel" inputmode="numeric" class="form-control" id="example-tel-input" name="customerpincode" maxLength="6" placeholder="Zip code" onChange={(e) => handleChange(e)} value={editCustomer && editCustomer.customeraddress && editCustomer.customeraddress.pincode} />
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.customerpincode}</span>
                                                    </div>

                                                    <div className="d-flex">
                                                        <h5 className="mt-3">Billing Address</h5>
                                                        <div class="form-check ms-3 mt-3">
                                                            <input class="form-check-input" type="checkbox" id="flexCheckDefault" name="checkboxinput" onClick={(e) => handleCheckBox(e)} checked={editCustomer.check ? editCustomer.check : checkBoxVal} />
                                                            <label class="form-check-label" for="flexCheckDefault">
                                                                Same as delivery address
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="customeraddress1" class="form-label">Address 1<span className="required">*</span></label>
                                                        <textarea class="form-control" id="address1" name="billingaddress1" rows="1" onChange={(e) => handleChange(e)} value={editCustomer && editCustomer.billingaddress && editCustomer.billingaddress.address1} disabled={editCustomer.check}></textarea>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.billingaddress1}</span>

                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="customeraddress2" class="form-label">Address 2<span className="required">*</span></label>
                                                        <textarea class="form-control" id="address2" name="billingaddress2" rows="1" onChange={(e) => handleChange(e)} value={editCustomer && editCustomer.billingaddress && editCustomer.billingaddress.address2} disabled={editCustomer.check}></textarea>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.billingaddress2}</span>
                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label for="exampleFormControlTextarea1" class="form-label">State<span className="required">*</span></label>
                                                        <select name="billingstate" class="form-select" aria-label="Default select example" value={editCustomer && editCustomer.billingaddress && editCustomer.billingaddress.state} onChange={(e) => handleChange(e)} disabled={editCustomer.check}>
                                                            <option value="">Select state</option>
                                                            {countries && countries.length > 0 && countries.map((task, i) => {
                                                                return (
                                                                    <><option key={i} value={task.name}>{task.name}</option></>
                                                                )
                                                            }
                                                            )}
                                                        </select>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.billingstate}</span>
                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label htmlFor="exampleFormControlInput1" class="form-label">Zip Code<span className="required">*</span></label>
                                                        <input name="billingpincode" type="tel" maxLength="6" class="form-control" id="exampleFormControlInput1" placeholder="Zip code" onChange={(e) => handleChange(e)} value={editCustomer && editCustomer.billingaddress && editCustomer.billingaddress.pincode} disabled={editCustomer.check} />
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{customerErrors.billingpincode}</span>
                                                    </div>


                                                </div>

                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 mt-3">
                                                    <button className="btn btn-primary btn-block " type="submit" onClick={e => id == undefined ? handleAddCustomer(e) : handleUpdate(e)}> {id == undefined ? <>{isLoading ? (<img src={image + Config.imgloader + "rotate_right.svg"} className="loading-icon" />) : null} Create</> :
                                                        <>{isLoading ? (<img src={image + Config.imgloader + "rotate_right.svg"} className="loading-icon" />) : null} Update </>}</button>
                                                </div>
                                                {msg ? <span className="errormsg" style={{
                                                    fontWeight: 'bold',
                                                    color: 'green',
                                                }}>{msg}</span> : ""
                                                }
                                            </div>
                                        </> : <div className="form-block">
                                            <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active show" id="home1" role="tabpanel">
                                                    <Loader />
                                                </div>
                                            </div>
                                        </div>
                                    }


                                    <SweetAlert show={UpdateSuccess}
                                        custom
                                        confirmBtnText="ok"
                                        confirmBtnBsStyle="primary"
                                        title={"Updated successfully"}
                                        onConfirm={e => setUpdateSuccess(false)}
                                    ></SweetAlert>
                                    <SweetAlert show={success}
                                        custom
                                        confirmBtnText="ok"
                                        confirmBtnBsStyle="primary"
                                        title={"Added successfully"}
                                        onConfirm={e => onConfirm()}
                                    >
                                    </SweetAlert>
                                    <SweetAlert show={existmsg}
                                        custom
                                        confirmBtnText="ok"
                                        confirmBtnBsStyle="primary"
                                        title={"Customer Already Exist"}
                                        onConfirm={e => setExistMsg(false)}
                                    >
                                    </SweetAlert>


                                </div>


                            </div>
                        </div>



                        <Footer />
                    </div>
                }



            </div>

        </>
    );
};

export default EditCustomer;
