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

let { lambda, country, appname } = window.app;
var urlParams = location("type");
var id = location("id");
const Purchases = () => {
    const history = useHistory();
    const [propertyData, setPropertyData] = useState({})
    const [config, setConfig] = useState({});
    const [activeId, setActiveId] = useState();
    const [formChange, setFormChange] = useState({});
    const [customerErrors, setCustomerErrors] = useState({});
    const [savedPropertyData, setSavedPropertyData] = useState({})
    const [emailError, setEmailError] = useState('');
    const [branchStatus, setBranchStatus] = useState(false);
    const [nameerror, setNameError] = useState('');
    const [resultSuccess, setResultSuccess] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteData, setDeleteData] = useState('');
    const [dataType, setDataType] = useState('');
    const [modelData, setModelData] = useState(null)
    const [vendorResultData, setVendorResultData] = useState(null)
    const [submitButton, setSubmitButton] = useState(false);
    const [userSuccess, setUserSuccess] = useState(false);
    const [invoiceDateError, setInvoiceDateError] = useState('');
    const [invoiceNumberError, setInvoiceNumberError] = useState('');
    const [vendorNameError, setVendorNameError] = useState('');
    const [chassisNumberError, setChassisNumberError] = useState('');
    useEffect(() => {
        if (window.site) {
            setConfig(window.site);

        }
        // modelTab()
        // vendorTab()
        getVendorData();
        getModelData()

    }, [window.site]);
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        console.log('id', id)
        if (id) {
            getPurchases()
            setBranchStatus(true)
        } else {
            getPurchase()
            setBranchStatus(false)

        }

    }, []);
    //  console.log("data", data);setCommission
    const goBack = () => {
        history.goBack();
    }
    const getPurchases = () => {
        let userId = localStorage.getItem("userid") || localStorage.getItem("userId")
        const urlLink = lambda + '/purchase?appname=' + appname + "&purchaseId=" + id + "&userId=" + userId + "&type=purchase";
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    // localStorage.setItem("previousid", response.data.result)
                    // history.push("./user");
                    // setBranchStatus(false)
                    setFormChange(response.data.result && response.data.result[0])

                }
            });
    }

    const backClick = () => {
        // history.goBack();
        setBranchStatus(false)
        window.location = `/purchases`;
        // getUser()
    }



    // const handleEmailMessage = (e) => {
    //     setError("");
    //     setEmailError("");
    // }
    function formvalidation() {
        let formIsValid = true;
        const regEx = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}(.[a-zA-Z{2,8}])?/g;
        // if (regEx.test(emailId)) {
        //     setEmailError("");
        // } else if (!regEx.test(emailId) && emailId !== "") {
        //     setEmailError("Email is Not Valid");
        //     formIsValid = false;
        // }

        // if (type === "") {
        //   setTypeError("Please Select Type");
        //   formIsValid = false;
        // }

        // if (Corporate === "") {
        //   setCategoryError("Please Select Corporate");
        //   formIsValid = false;
        // }
        if (formChange?.name === "" || formChange?.name === "undefined" || formChange?.name === undefined) {
            setNameError("Please Enter Name");
            formIsValid = false;
        }
        if (formChange?.chassisNumber === "" || formChange?.chassisNumber === "undefined" || formChange?.chassisNumber === undefined) {
            setChassisNumberError("Please Enter Chassis Number");
            formIsValid = false;
        }
        if (formChange?.vendorName === "" || formChange?.vendorName === "undefined" || formChange?.vendorName === undefined) {
            setVendorNameError("Please Enter Vendor Name");
            formIsValid = false;
        }
        if (formChange?.invoiceDate === "" || formChange?.invoiceDate === "undefined" || formChange?.invoiceDate === undefined) {
            setInvoiceDateError("Please Enter Invoice Date");
            formIsValid = false;
        }
        if (formChange?.invoiceNumber === "" || formChange?.invoiceNumber === "undefined" || formChange?.invoiceNumber === undefined) {
            setInvoiceNumberError("Please Enter Invoice Number");
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

    const handleUpdate = (e) => {
        let valid = formvalidation();
        // let id = id;
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        // let companyId = localStorage.getItem("companyId")
        // console.log("id", id)
        if (valid && id) {
            setSubmitButton(true)
            let payload =
            {
                "name": formChange?.name,
                "invoiceDate": formChange?.invoiceDate,
                "invoiceNumber": formChange?.invoiceNumber,
                "chassisNumber": formChange?.chassisNumber,
                "vendorName": formChange?.vendorName,
                "variant": formChange?.variant,
                "vendorName": formChange?.vendorName,


                "type": "purchase",
                "purchaseId": id,
                "userId": userid
            }
            console.log("payload", payload)
            const urlLink = lambda + '/updatePurchase?appname=' + appname + "&purchaseId=" + id + "&type=purchase";
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./user");
                        //  window.location = "/user"
                        // setBranchStatus(false)
                        getPurchase()
                        setSubmitButton(false)
                        setUserSuccess(true)

                    }
                });
        } else if (valid) {
            setSubmitButton(true)
            // formChange["companyId"] = companyId
            formChange["type"] = "purchase"
            formChange["userId"] = userid
            let payload = formChange;
            console.log("payload", payload)
            const urlLink = lambda + '/addPurchase?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./branches");

                        getPurchase()
                        setSubmitButton(false)
                        setUserSuccess(true)
                    }
                });
        }

        // formvalidation()
    }
    const getPurchase = (e) => {
        //  let companyId = localStorage.getItem("companyId")
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        const urlLink = lambda + '/purchase?appname=' + appname + "&type=purchase" + "&userId=" + userid;
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    // localStorage.setItem("previousid", response.data.result)
                    // history.push("./branches");
                    setSavedPropertyData(response.data.result)
                    // getPurchase()
                }
            });
    }

    const editClick = (e, item) => {
        let type = item && item.type;
        let id = item && item.purchaseId;
        //localStorage.setItem("item", JSON.stringify(item));
        //history.push("/lookupForm")
        //localStorage.removeItem("formType");
        window.location = `/purchases?id=${id} `;
    }
    const deleteClick = (e, item) => {
        setDeleteConfirm(true)
        setDeleteData(item)

    }

    function onConfirm1() {
        setResultSuccess(false)
        // const type = "companyUser";
        setUserSuccess(false)
        getPurchase();
        setBranchStatus(false)
    };
    function closePopup() {
        setDeleteConfirm(false)
        history.push("./purchase");
    };

    function onConfirm2() {
        setDeleteConfirm(false)
        let item = deleteData;
        setDataType(item && item.type)
        let type = item && item.type;
        let id = item && item.purchaseId;
        //let lookupid = id;
        if (id) {
            //let payload;
            let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
            //formChange ["status" ] = "Archive"
            let companyId = localStorage.getItem("companyId")
            let payload =
            {
                "name": formChange?.name,
                "invoiceDate": formChange?.invoiceDate,
                "invoiceNumber": formChange?.invoiceNumber,
                "chassisNumber": formChange?.chassisNumber,
                "vendorName": formChange?.vendorName,
                "type": type,
                "purchaseId": id,
                "status": "Archive",
                "userId": userid
            }

            const urlLink = lambda + '/deletePurchase?appname=' + appname + "&purchaseId=" + id + "&userId=" + userid + "&type=" + type;
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
    let type = localStorage.getItem("formType");
    let imageCloudfront;
    if (config.common && config.common.imageCloudfront) {
        imageCloudfront = config.common.imageCloudfront;
    }
    console.log("imageCloudfront", imageCloudfront)
    const addClick = (e, item) => {
        setBranchStatus(true)
        // setName("")
        // setBranchAddress("")
        // setNumber("")
        // setDealerCode("")
    }
    const handleChange = (e) => {
        console.log('typeeeeeeeeee', e.target.value)
        console.log('nameeeee', e.target.name)
        if (!!customerErrors[e.target.name]) {
            let error = Object.assign({}, customerErrors);
            delete error[e.target.name];
            setCustomerErrors(error);

        }
        const { name, value } = e.target;
        if (value === '') {
            console.log('Input cleared');
        }
        setFormChange({
            ...formChange,
            [name]: value
        });


    }
    const modelTab = (e) => {
        const type = "models";
        GetPropertyData(type);
    }
    const vendorTab = (e) => {
        const type = "vendors";
        vendorData(type);
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
                    setModelData(response.data.result && response.data.result.data)
                }
            });
    }


    const getModelData = () => {
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId");
        let companyId = localStorage.getItem("companyid");
        const urlLink = `${lambda}/modelInfo?appname=${appname}&companyid=${companyId}&userid=${userid}`
        fetch(urlLink, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                setModelData(data.result);
            }
        })
        .catch(error => console.error('Error:', error));
    }
    const getVendorData = () => {
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId");
        let companyId = localStorage.getItem("companyid");
        const urlLink = `${lambda}/vendorsInfo?appname=${appname}&companyid=${companyId}&userid=${userid}`
        fetch(urlLink, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                setVendorResultData(data.result);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    const vendorData = (type) => {
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + type + (userid ? "&userid=" + userid : "");
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    setVendorResultData(response.data.result && response.data.result.data)
                }
            });
    }
    console.log("saved", modelData)
    return (
        <>
            <div id="layout-wrapper">
                <div className="dashboard">
                    <Header />
                    <div className="main-content look_ups purchases">

                        <div className="page-content">
                            <div className="container-fluid">
                                {/* <div className="breadcurmb">
                                    <div className="title_block">
                                        <h5>Lookups</h5>
                                    </div>
                                   
                                </div> */}
                                <div className="card">
                                    <div className="card-body">





                                        {!branchStatus && savedPropertyData && savedPropertyData?.length > 0 &&
                                            <div className="breadcurmb">
                                                <div className="title_block">
                                                    <h5>Purchases</h5>
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
                                                                    <th className="align-middle">Invoice Date</th>
                                                                    <th className="align-middle">Invoice Number</th>

                                                                    <th className="align-middle">Model Name</th>
                                                                    <th className="align-middle">Chassis Number</th>
                                                                    <th className="align-middle">Vendor Name</th>
                                                                    <th className="align-middle">Created</th>
                                                                    {/* <th className="align-middle">GST Number</th> */}
                                                                    <th className="align-middle">Action</th>
                                                                   
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {savedPropertyData?.map((eachItem, key) => {
                                                                    return (eachItem && eachItem.status != "Archive" &&
                                                                        <tr key={key}>
                                                                            <td>{moment(eachItem?.invoiceDate).format('DD-MM-YYYY')}</td>
                                                                            <td>{eachItem?.invoiceNumber ? eachItem?.invoiceNumber : 'N/A'}</td>
                                                                            <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                            <td>{eachItem?.chassisNumber ? eachItem?.chassisNumber : 'N/A'}</td>
                                                                            <td>{eachItem?.vendorName ? eachItem?.vendorName : 'N/A'}</td>
                                                                            {/* <td>{eachItem?.status ? eachItem?.status : 'N/A'}</td> */}
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
                                                    : savedPropertyData && savedPropertyData?.length == 0 &&
                                                    <div className="form_section"><div className="empty_page">
                                                        <span><img src="https://d9nwtjplhevo0.cloudfront.net/orasi/admin/resources/orasiv1/images/add-conversation.png" /></span>
                                                        <p>There are no purchases available.<br />Please add purchases.</p>
                                                        <a className="btn btn-primary" onClick={addClick}>ADD</a>
                                                    </div> </div>}
                                            </div>
                                            :

                                            <div className="form_seciton">
                                                <div className="breadcurmb">
                                                    <div className="title_block">
                                                        <h5>add purchases</h5>
                                                    </div>
                                                    <div className="buttons">

                                                        <a href="#" className="back_btn" onClick={backClick} style={{ cursor: 'pointer' }}><span className="material-icons icon"> arrow_back</span>BACK</a>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Invoice Date</label>
                                                            <input type="date" className="form-control" id="name" placeholder="Enter Date" name="invoiceDate" value={formChange?.invoiceDate} onChange={(e) => handleChange(e)} required />
                                                            {invoiceDateError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{invoiceDateError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Invoice Number</label>
                                                            <input type="number" className="form-control" id="companyNumber" placeholder="Enter Number" name="invoiceNumber" value={formChange?.invoiceNumber} onChange={e => handleChange(e)} autoComplete="on" />
                                                            {invoiceNumberError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{invoiceNumberError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Model Name</label>
                                                            {/* <input type="text" className="form-control" id="name" placeholder="Enter Name" name="modelName" value={formChange?.modelName} onChange={(e) => handleChange(e)} autoComplete="on" /> */}
                                                            <select className="form-select" aria-label="Default select example" name="name" value={formChange?.name} onChange={handleChange}>
                                                                <option value="">Select Models </option>
                                                                {modelData && modelData?.length > 0 && modelData?.map((eachItem, key) => {
                                                                    console.log("eachItem", eachItem)
                                                                    return (eachItem && eachItem.status == "Active" &&
                                                                        <option value={eachItem?.name ? eachItem?.name : 'N/A'}>{eachItem?.name ? eachItem?.name : 'N/A'} </option>
                                                                    )

                                                                }

                                                                )
                                                                }
                                                            </select>
                                                            {nameerror != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{nameerror}</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Chassis Number</label>
                                                            <input type="text" className="form-control" id="name" placeholder="Enter Number" name="chassisNumber" value={formChange?.chassisNumber} onChange={(e) => handleChange(e)} autoComplete="on" />
                                                            {chassisNumberError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{chassisNumberError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Fuel Type</label>
                                                            <select className="form-select" aria-label="Default select example" name="fuelType" value={formChange?.fuelType} onChange={handleChange}>
                                                                <option value="">Select Fuel Type </option>
                                                                <option value="Deisel">Deisel</option>
                                                                <option value="Petrol">Petrol</option>
                                                                <option value="Electrical">Electrical</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Variant</label>
                                                            <input type="text" className="form-control" id="variant" placeholder="Enter Variant" name="variant" value={formChange?.variant} onChange={(e) => handleChange(e)} autoComplete="on" />
                                                            
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Vendor Name</label>
                                                            {/* <input type="text" className="form-control" id="name" placeholder="Enter Name" name="vendorName" value={formChange?.vendorName} onChange={(e) => handleChange(e)} autoComplete="on" /> */}
                                                            <select className="form-select" aria-label="Default select example" name="vendorName" value={formChange?.vendorName} onChange={handleChange}>
                                                                <option value="">Select Vendors </option>
                                                                {vendorResultData && vendorResultData?.length > 0 && vendorResultData?.map((eachItem, key) => {
                                                                    console.log("eachItem", eachItem)
                                                                    return (eachItem && eachItem.status == "Active" &&
                                                                        <option value={eachItem?.name ? eachItem?.name : 'N/A'}>{eachItem?.name ? eachItem?.name : 'N/A'} </option>
                                                                    )

                                                                }

                                                                )
                                                                }
                                                            </select>
                                                            {vendorNameError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{vendorNameError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Branch</label>
                                                           
                                                            <select className="form-select" name="branch" value={formChange?.branch} onChange={handleChange}>
                                                                <option value="">Select</option>
                                                                <option value="mainbranch">Main Branch</option>
                                                                <option value="subbranch">Sub Branch</option>
                                                            </select>
                                                            
                                                        </div>
                                                    </div>
                                                    {formChange?.branch == "mainbranch" &&
                                                    <div className="col-md-6">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Main Branches</label>
                                                           
                                                            <select className="form-select" name="mainbranch" value={formChange?.subbranch} onChange={handleChange}>
                                                                <option value="">Select</option>
                                                                <option value="mainbranch">Main Branch</option>
                                                            </select>
                                                            
                                                        </div>
                                                    </div>}

                                                    {formChange?.branch == "subbranch" &&
                                                    <div className="col-md-6">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Sub Branches</label>
                                                           
                                                            <select className="form-select" name="subbranch" value={formChange?.subbranch} onChange={handleChange}>
                                                                <option value="">Select</option>
                                                                <option value="mainbranch">Main Branch</option>
                                                            </select>
                                                            
                                                        </div>
                                                    </div>}

                                                    {/* <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">GST Number</label>
                                                                    <input type="text" className="form-control" id="name" placeholder="Enter Number" name="gst" value={formChange?.gst} onChange={(e) => handleChange(e)} autoComplete="on" />
                                                                </div>
                                                            </div> */}
                                                    <div className="col-md-12 mb-2">
                                                        <button className="update_btn" type="submit" onClick={e => handleUpdate(e)} style={{ cursor: 'pointer' }}>{submitButton ? "Saving..." : "Save"}</button>
                                                    </div>
                                                </div>
                                            </div>}


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
                                title={"Updated Successfully"}
                                onConfirm={e => onConfirm1()}
                            >
                            </SweetAlert>}
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

export default Purchases;
