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
const Retail = () => {
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
const [retailSuccess, setRetailSuccess] = useState(false);
const [deleteConfirm, setDeleteConfirm] = useState(false);
const [deleteData, setDeleteData] = useState('');
const [dataType, setDataType] = useState('');
const [submitButton, setSubmitButton] = useState(false);
const [successMessage, setSuccessMessage] = useState("Update Successfully");

useEffect(() => {
    if (window.site) {
        setConfig(window.site);
    }
}, [window.site]);

useEffect(() => {
    if (!localStorage.getItem("token")) {
        history.push("/");
    }
    if (id) {
        retailClick()
        setBranchStatus(true)
    } else {
        getRetail()
        setBranchStatus(false)
    }
}, []);

const goBack = () => {
    history.goBack();
}

const retailClick = () => {
    let retailId = localStorage.getItem("retailid") || localStorage.getItem("retailId")
    const urlLink = lambda + '/retailInfo?appname=' + appname + "&id=" + id + "&retailId=" + retailId + "&type=companyRetail";
    axios({
        method: 'GET',
        url: urlLink,
    })
    .then(function (response) {
        if (response.data.statusCode === 200) {
            setFormChange(response.data.result && response.data.result[0])
        }
    });
}

const backClick = () => {
    setBranchStatus(false)
    getRetail()
}
const [invoiceError, setInvoiceError] = useState('');
const [customerNameError, setCustomerNameError] = useState('');
const [chassisNoError, setChassisNoError] = useState('');
const [saleValueError, setSaleValueError] = useState('');
const [LOBError, setLOBError] = useState('');
const [parentProductLineError, setParentProductLineError] = useState('');
const [productLineError, setProductLineError] = useState('');
const [productVCError, setProductVCError] = useState('');
const [financierError, setFinancierError] = useState('');
const [commercialInvoiceError, setCommercialInvoiceError] = useState('');
const [TMInvoiceDateError, setTMInvoiceDateError] = useState('');
const [billToAccountError, setBillToAccountError] = useState('');
const [orderDateError, setOrderDateError] = useState('');
const [orderNoError, setOrderNoError] = useState('');
const [totalInvoiceAmountError, setTotalInvoiceAmountError] = useState('');

function formvalidation() {
    let formIsValid = true;

    // Clear previous errors
    setInvoiceError('');
    setCustomerNameError('');
    setChassisNoError('');
    setSaleValueError('');
    setLOBError('');
    setParentProductLineError('');
    setProductLineError('');
    setProductVCError('');
    setFinancierError('');
    setCommercialInvoiceError('');
    setTMInvoiceDateError('');
    setBillToAccountError('');
    setOrderDateError('');
    setOrderNoError('');
    setTotalInvoiceAmountError('');

    console.log('formChange', formChange);

    // Invoice validation
    if (!formChange?.invoice) {
        setInvoiceError("Please Enter Invoice");
        formIsValid = false;
    }

    // Customer Name validation
    if (!formChange?.customerName) {
        setCustomerNameError("Please Enter Customer Name");
        formIsValid = false;
    }

    // Chassis No validation
    if (!formChange?.chassisNo) {
        setChassisNoError("Please Enter Chassis No");
        formIsValid = false;
    }

    // Sale Value validation
    if (!formChange?.saleValue) {
        setSaleValueError("Please Enter Sale Value");
        formIsValid = false;
    }

    // Additional validations (new fields)
    if (!formChange?.LOB) {
        setLOBError("Please Enter LOB");
        formIsValid = false;
    }

    if (!formChange?.parentProductLine) {
        setParentProductLineError("Please Enter Parent Product Line");
        formIsValid = false;
    }

    if (!formChange?.productLine) {
        setProductLineError("Please Enter Product Line");
        formIsValid = false;
    }

    if (!formChange?.productVC) {
        setProductVCError("Please Enter Product VC");
        formIsValid = false;
    }

    if (!formChange?.financier) {
        setFinancierError("Please Enter Financier");
        formIsValid = false;
    }

    if (!formChange?.commercialInvoice) {
        setCommercialInvoiceError("Please Enter Commercial Invoice");
        formIsValid = false;
    }

    if (!formChange?.TMInvoiceDate) {
        setTMInvoiceDateError("Please Enter TM Invoice Date");
        formIsValid = false;
    }

    if (!formChange?.billToAccount) {
        setBillToAccountError("Please Enter Bill to Account");
        formIsValid = false;
    }

    if (!formChange?.orderDate) {
        setOrderDateError("Please Enter Order Date");
        formIsValid = false;
    }

    if (!formChange?.orderNo) {
        setOrderNoError("Please Enter Order No");
        formIsValid = false;
    }

    if (!formChange?.totalInvoiceAmount) {
        setTotalInvoiceAmountError("Please Enter Total Invoice Amount");
        formIsValid = false;
    }

    return formIsValid;
}


const handleUpdate = (e) => {
    let valid = formvalidation();
    
    if (valid) {
        setSubmitButton(true);
        let payload = {
            "invoice": formChange?.invoice || "", // Use formChange value or default to empty string if undefined
            "invoiceDate": formChange?.invoiceDate || "", // Same for invoiceDate
            "customerName": formChange?.customerName || "", // Same for customerName
            "invoiceStatus": formChange?.invoiceStatus || "", // Same for invoiceStatus
            "chassisNo": formChange?.chassisNo || "", // Same for chassisNo
            "saleValue": formChange?.saleValue || "", // Same for saleValue
            
            "LOB": formChange?.LOB || "UVs", // Dynamic value or default to static if not provided
            "parentProductLine": formChange?.parentProductLine || "Punch", // Dynamic value or default to static
            "productLine": formChange?.productLine || "Punch Pure (O)", // Dynamic value or default to static
            "productVC": formChange?.productVC || "54854324AL3R", // Dynamic value or default to static
            "financier": formChange?.financier || "STATE BANK OF INDIA", // Dynamic value or default to static
            "commercialInvoice": formChange?.commercialInvoice || "768710524", // Dynamic value or default to static
            "TMInvoiceDate": formChange?.TMInvoiceDate || "9/13/2024", // Dynamic value or default to static
            "billToAccount": formChange?.billToAccount || "DR.REDDY'S LABORATORIES LTD", // Dynamic value or default to static
            "orderDate": formChange?.orderDate || "12/28/24 19:23", // Dynamic value or default to static
            "orderNo": formChange?.orderNo || "SO-Sankar-2425-000965", // Dynamic value or default to static
            "totalInvoiceAmount": formChange?.totalInvoiceAmount || "Rs.653,380.00", // Dynamic value or default to static
            "invoiceCancelledBy": formChange?.invoiceCancelledBy || "", // Dynamic value or default to empty string
            "IRNCancellationDate": formChange?.IRNCancellationDate || "" // Dynamic value or default to empty string
        };
        

        const urlLink = lambda + '/addRetails?appname=dealerReports'; // Use the correct URL from curl

        // Add headers from curl request
        axios({
            method: 'POST',
            url: urlLink,
            data: payload
        })
        .then(function (response) {
            if (response.data.statusCode === 200) {
                setSuccessMessage("Updated Successfully");
                getRetail();
                setSubmitButton(false);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            setSubmitButton(false);
        });
    }
};


const getRetail = (retailid) => {
    const urlLink = lambda + '/retails?appname=' + appname
    if(retailid){
        urlLink+="&retailId=" + retailid;
    }
    axios({
        method: 'GET',
        url: urlLink,
    })
    .then(function (response) {
        if (response.data.statusCode === 200) {
            setSavedPropertyData(response.data.result)
        }
    });
}

const editClick = (e, item) => {
    let id = item && item.id;
    localStorage.removeItem("formType");
    window.location = `/retail?id=${id} `;
}

const deleteClick = (e, item) => {
    setDeleteConfirm(true)
    setDeleteData(item)
}
function onConfirm1() {
    setResultSuccess(false)
    getRetail();
};
function onUpdate() {
    // setResultSuccess(false)
    setBranchStatus(false)
    setRetailSuccess(false)
    window.location = "/user"
};
function closePopup() {
    setDeleteConfirm(false)
};

function onConfirm2() {
    setDeleteConfirm(false)
    let item = deleteData;
    setDataType(item && item.type)
    let type = item && item.type;
    let id = item && item.userId;
    //let lookupid = id;
    if (id) {
        //let payload;
        // let userid = localStorage.getItem("userid")
        //formChange ["status" ] = "Archive"
        let companyId = localStorage.getItem("companyId")
        let payload =
        {
            "name": formChange?.name,
            "emailId": formChange?.emailId,
            "status": "Archive",
            "phoneNumber": formChange?.phoneNumber,
            "companyId": companyId,
            "type": "companyUser",
            "userId": id,
        }

        const urlLink = lambda + '/delete?appname=' + appname + "&userId=" + id + "&type=" + type;
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
const addClick = () => {
    setBranchStatus(true)
    setFormChange("")
}
const handleChange = (e) => {
    console.log('typeeeeeeeeee', e.target.value)
    console.log('nameeeee', e.target.name)
    formvalidation();
    if (!!customerErrors[e.target.name]) {
        let error = Object.assign({}, customerErrors);
        delete error[e.target.name];
        setCustomerErrors(error);

    }
    const { name, value } = e.target;
    if (value === '') {
        console.log('Input cleared');
    }
    if (name === "phoneNumber") {
        const onlyDigits = e.target.value.replace(/\D/g, "");
        setFormChange({
            ...formChange,
            onlyDigits,
            [name]: value
        });
    }
    setFormChange({
        ...formChange,
        [name]: value
    });
}
return (
    <>
        <div id="layout-wrapper">
            <div className="dashboard">
                <Header />
                <div className="main-content look_ups purchases">

                    <div className="page-content">
                        <div className="container-fluid">
                            <div className="card">
                                <div className="card-body">
                                    {!branchStatus && savedPropertyData && savedPropertyData?.length > 0 &&
                                                <div className="breadcurmb">
                                                    <div className="title_block">
                                                        <h5>Retails</h5>
                                                    </div>
                                                    <div className="buttons">
                                                        <button className=" btn-primary" onClick={addClick}>add</button>
                                                    </div>
                                                </div>}
                                            {!branchStatus ?
                                                <div>
                                                    {savedPropertyData && savedPropertyData?.length > 0 ?
                                                        <div className="table-responsive">
                                                            <table className="table table-striped">
    <thead>
        <tr>
            <th className="align-middle">Invoice</th>
            <th className="align-middle">Invoice Date</th>
            <th className="align-middle">Customer Name</th>
            <th className="align-middle">Invoice Status</th>
            <th className="align-middle">Chassis No</th>
            <th className="align-middle">Sale Value</th>
            <th className="align-middle">LOB</th>
            <th className="align-middle">Parent Product Line</th>
            <th className="align-middle">Product Line</th>
            <th className="align-middle">Product VC</th>
            <th className="align-middle">Financier</th>
            <th className="align-middle">Commercial Invoice</th>
            <th className="align-middle">TM Invoice Date</th>
            <th className="align-middle">Bill To Account</th>
            <th className="align-middle">Order Date</th>
            <th className="align-middle">Order No</th>
            <th className="align-middle">Total Invoice Amount</th>
            <th className="align-middle">Invoice Cancelled By</th>
            <th className="align-middle">IRN Cancellation Date</th>
            <th className="align-middle">Retail ID</th>
            <th className="align-middle">Created</th>
            <th className="align-middle">Status</th>
            <th className="align-middle">Action</th>
        </tr>
    </thead>
    <tbody>
        {savedPropertyData?.map((eachItem, key) => {
            return (
                eachItem && (
                    <tr key={key}>
                        <td>{eachItem?.invoice || 'N/A'}</td>
                        <td>{eachItem?.invoiceDate || 'N/A'}</td>
                        <td>{eachItem?.customerName || 'N/A'}</td>
                        <td>{eachItem?.invoiceStatus || 'N/A'}</td>
                        <td>{eachItem?.chassisNo || 'N/A'}</td>
                        <td>{eachItem?.saleValue || 'N/A'}</td>
                        <td>{eachItem?.LOB || 'N/A'}</td>
                        <td>{eachItem?.parentProductLine || 'N/A'}</td>
                        <td>{eachItem?.productLine || 'N/A'}</td>
                        <td>{eachItem?.productVC || 'N/A'}</td>
                        <td>{eachItem?.financier || 'N/A'}</td>
                        <td>{eachItem?.commercialInvoice || 'N/A'}</td>
                        <td>{eachItem?.TMInvoiceDate || 'N/A'}</td>
                        <td>{eachItem?.billToAccount || 'N/A'}</td>
                        <td>{eachItem?.orderDate || 'N/A'}</td>
                        <td>{eachItem?.orderNo || 'N/A'}</td>
                        <td>{eachItem?.totalInvoiceAmount || 'N/A'}</td>
                        <td>{eachItem?.invoiceCancelledBy || 'N/A'}</td>
                        <td>{eachItem?.IRNCancellationDate || 'N/A'}</td>
                        <td>{eachItem?.retailid || 'N/A'}</td>
                        <td>{moment(eachItem?.created).format('DD-MM-YYYY') || 'N/A'}</td>
                        <td>{eachItem?.status || 'N/A'}</td>
                        <td>
                            <div className="d-flex">
                                <a
                                    className="action-button edit tooltip-container"
                                    onClick={e => editClick(e, eachItem)}
                                >
                                    <span className="material-symbols-outlined">
                                        <span className="tooltip">Edit</span>edit
                                    </span>
                                    edit
                                </a>
                                <a
                                    className="action-button delete tooltip-container"
                                    onClick={e => deleteClick(e, eachItem)}
                                >
                                    <span className="material-symbols-outlined">
                                        <span className="tooltip">Delete</span>delete
                                    </span>
                                    delete
                                </a>
                            </div>
                        </td>
                    </tr>
                )
            );
        })}
    </tbody>
</table>

                                                        </div>
                                                        :
                                                        <div className="form_section"><div className="empty_page">
                                                            <span><img src={imageCloudfront + "propertyCalculator/images/dashboard.png"} /></span>
                                                            <p>There are no retails available.<br />Please add retails.</p>
                                                            <a className="btn btn-primary" onClick={addClick}>ADD</a>
                                                        </div> </div>}
                                                </div>
                                                :

                                                <div className="form_seciton">
    <div className="breadcurmb">
        <div className="title_block">
            <h5>Add Invoice</h5>
        </div>
        <div className="buttons">
            <a href="#" className="back_btn" onClick={backClick} style={{ cursor: 'pointer' }}>
                <span className="material-icons icon">arrow_back</span>BACK
            </a>
        </div>
    </div>
    <div className="row">
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Invoice</label>
            <input type="text" className="form-control" name="invoice" placeholder="Enter Invoice" value={formChange?.invoice} onChange={handleChange} required />
            {invoiceError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{invoiceError}</span>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Invoice Date</label>
            <input type="date" className="form-control" name="invoiceDate" value={formChange?.invoiceDate} onChange={handleChange} required />
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Customer Name</label>
            <input type="text" className="form-control" name="customerName" placeholder="Enter Customer Name" value={formChange?.customerName} onChange={handleChange} required />
            {customerNameError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{customerNameError}</span>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Invoice Status</label>
            <select className="form-select" name="invoiceStatus" value={formChange?.invoiceStatus} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="NEW">NEW</option>
                <option value="CANCELLED">CANCELLED</option>
            </select>
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Chassis No</label>
            <input type="text" className="form-control" name="chassisNo" placeholder="Enter Chassis No" value={formChange?.chassisNo} onChange={handleChange} required />
            {chassisNoError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{chassisNoError}</span>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Sale Value</label>
            <input type="text" className="form-control" name="saleValue" placeholder="Enter Sale Value" value={formChange?.saleValue} onChange={handleChange} required />
            {saleValueError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{saleValueError}</span>}
        </div>
    </div>

    {/* New fields from the payload */}
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">LOB</label>
            <input type="text" className="form-control" name="LOB" placeholder="Enter LOB" value={formChange?.LOB} onChange={handleChange} required />
            {LOBError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{LOBError}</span>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Parent Product Line</label>
            <input type="text" className="form-control" name="parentProductLine" placeholder="Enter Parent Product Line" value={formChange?.parentProductLine} onChange={handleChange} required />
            {parentProductLineError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{parentProductLineError}</span>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Product Line</label>
            <input type="text" className="form-control" name="productLine" placeholder="Enter Product Line" value={formChange?.productLine} onChange={handleChange} required />
            {productLineError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{productLineError}</span>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Product VC</label>
            <input type="text" className="form-control" name="productVC" placeholder="Enter Product VC" value={formChange?.productVC} onChange={handleChange} required />
            {productVCError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{productVCError}</span>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Financier</label>
            <input type="text" className="form-control" name="financier" placeholder="Enter Financier" value={formChange?.financier} onChange={handleChange} required />
            {financierError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{financierError}</span>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Commercial Invoice</label>
            <input type="text" className="form-control" name="commercialInvoice" placeholder="Enter Commercial Invoice" value={formChange?.commercialInvoice} onChange={handleChange} required />
            {commercialInvoiceError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{commercialInvoiceError}</span>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">TM Invoice Date</label>
            <input type="text" className="form-control" name="TMInvoiceDate" placeholder="Enter TM Invoice Date" value={formChange?.TMInvoiceDate} onChange={handleChange} required />
            {TMInvoiceDateError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{TMInvoiceDateError}</span>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Bill to Account</label>
            <input type="text" className="form-control" name="billToAccount" placeholder="Enter Bill to Account" value={formChange?.billToAccount} onChange={handleChange} required />
            {billToAccountError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{billToAccountError}</span>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Order Date</label>
            <input type="text" className="form-control" name="orderDate" placeholder="Enter Order Date" value={formChange?.orderDate} onChange={handleChange} required />
            {orderDateError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{orderDateError}</span>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Order No</label>
            <input type="text" className="form-control" name="orderNo" placeholder="Enter Order No" value={formChange?.orderNo} onChange={handleChange} required />
            {orderNoError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{orderNoError}</span>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="mb-3 input-field">
            <label className="form-label">Total Invoice Amount</label>
            <input type="text" className="form-control" name="totalInvoiceAmount" placeholder="Enter Total Invoice Amount" value={formChange?.totalInvoiceAmount} onChange={handleChange} required />
            {totalInvoiceAmountError !== "" && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{totalInvoiceAmountError}</span>}
        </div>
    </div>


        <div className="col-md-12 mb-2">
            <button className="update_btn" type="submit" onClick={handleUpdate} style={{ cursor: 'pointer' }}>{submitButton ? "Saving..." : "Save"}</button>
        </div>
    </div>
</div>
}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);

};

export default Retail;
