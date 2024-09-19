/***
**Module Name: Header 
 **File Name :  Header.js
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
 **Description : contains header component details.
 ***/
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import Header from ".././components/header/Header";
import Sidebar from ".././components/dashboard/sidebar";
import axios from 'axios';
// import * as Config from "./../../constants/Config";
let { lambda, appname } = window.app
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
const AddForm = (props) => {
    // const { pathname } = useLocation();
    // const headerRef = useRef(null);
    // const [scroll, setScroll] = useState(false);
    const history = useHistory();
    const [propertyData, setPropertyData] = useState({})
    const [config, setConfig] = useState({});
    const [activeId, setActiveId] = useState();
    const [formChange, setFormChange] = useState({});
    const [customerErrors, setCustomerErrors] = useState({});
    const [savedPropertyData, setSavedPropertyData] = useState({})
    const [modelResultData, setModelResultData] = useState({})
    const [insuranceResultData, setInsuranceResultData] = useState({})
    const [financeResultData, setFinanceResultData] = useState({})
    const [fastagResultData, setFastagResultData] = useState({})
    // console.log("props", props.menus);
    // const active = headerNav.findIndex((e) => e.path === pathname);
    useEffect(() => {
        // if (!localStorage.getItem("token")) {
        //     history.push("/");
        // }
        // else if (menuList[1]?.id) {
        //     setActiveId(menuList[1].id)
        // }

    }, []);
    useEffect(() => {
        if (window.site) {
            setConfig(window.site);

        }

    }, [window.site]);
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        } else {
            branchTab()
            // modelTab()
            // setTimeout(function () {
            //     insuranceTab()
            // }, 5000);
            // setTimeout(function () {
            //     financeTab()
            // }, 5000);
            // setTimeout(function () {
            //     fastagTab()
            // }, 5000);


            // vendorTab()
        }

    }, []);


    // console.log("propertyData",propertyData)

    let imageCloudfront;
    if (config.common && config.common.imageCloudfront) {
        imageCloudfront = config.common.imageCloudfront;
    }
    // const goBack = () => {
    //     history.goBack();
    // }
    const closeClick = () => {
        history.goBack();
    }
    const handleChange = (e) => {
        console.log('typeeeeeeeeee', e.target.value)
        console.log('nameeeee', e.target.name)
        if (!!customerErrors[e.target.name]) {
            let error = Object.assign({}, customerErrors);
            delete error[e.target.name];
            setCustomerErrors(error);

        }
        // if (e.target.name) {
        //     setFormChange({ ...formChange, [e.target.name]: e.target.value });
        // } 
        // else {
        //     setFormChange({ ...formChange, [e.target.name]: e.target.value });
        // }
        const { name, value } = e.target;
        if (value === '') {
            console.log('Input cleared');
        }
        setFormChange({
            ...formChange,
            [name]: value
        });


    }
    const branchTab = (e) => {
        const type = "branches";
        GetPropertyData(type);
    }
    // const modelTab = (e) => {
    //     const type = "models";
    //     modelData(type);
    // }
    // const insuranceTab = (e) => {
    //     const type = "insurance";
    //     insuranceData(type);
    // }
    // const financeTab = (e) => {
    //     const type = "finance";
    //     financeData(type);
    // }
    // const fastagTab = (e) => {
    //     const type = "fastag";
    //     fastagData(type);
    // }
    // const vendorTab = (e) => {
    //     const type = "vendor";
    //     vendorData(type);
    // }
    const GetPropertyData = (type) => {
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + type + (userid ? "&userid=" + userid : "");
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    // let resultArray = []
                    // lookupData.forEach(item => {
                    //     item[type].filter(val => {
                    //         if (val["userid"] == userId) {
                    //             resultArray.push(val)
                    //         }
                    //     })
                    // });
                    // lookupData[0][type] = resultArray
                    // console.log("resultArray ", resultArray)
                    setSavedPropertyData(response.data.result && response.data.result.data && response.data.result.data[0])
                }
            });
    }
    const submitClick = () => {
        console.log("formChange", formChange)
        
        
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        let payload = formChange;
        payload ["userid" ] = userid
        const urlLink = lambda + '/createForm?appname=' + appname;
        axios({
            method: 'POST',
            url: urlLink,
            payload
        })
            .then(function (response) {
                if (response.data.result) {
                    history.push("./yellowForm");
                    //setSavedPropertyData(response.data.result && response.data.result.data && response.data.result.data[0])
                }
            });
    }

    //console.log("saved",savedPropertyData)
    return (
        <div id="layout-wrapper">
            <div className="dashboard">
                <div className="main-content create_yellowform">
                    <div className="page-content create-content">
                        <div className="container-fluid">
                            <div className="md-container">
                                <div className="form-header">
                                    <h2>CREATE A YELLOW FORM</h2>
                                    <button onClick={closeClick}><span className="material-icons-outlined">close</span></button>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="inner-wrapper">
                                            <div className="left_nav">
                                                <ul>
                                                    <li className="active">
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">person_2</span>
                                                            <span className="md-txt">Customer Details</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">storefront</span>
                                                            <span className="md-txt">Dealer Details</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">car_tag</span>
                                                            <span className="md-txt">Vehicle Details</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">published_with_changes</span>
                                                            <span className="md-txt">Exchange Details</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">corporate_fare</span>
                                                            <span className="md-txt">Corporate Details</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">location_home</span>
                                                            <span className="md-txt">Consumer Details</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">approval_delegation</span>
                                                            <span className="md-txt">Spl Approval from Tata</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">swap_driving_apps_wheel</span>
                                                            <span className="md-txt">Accessories 18% Margin</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">verified_user</span>
                                                            <span className="md-txt">Extended Warranty</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">construction</span>
                                                            <span className="md-txt">A.M.C/P2P</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">swap_driving_apps</span>
                                                            <span className="md-txt">Fastag</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">money_bag</span>
                                                            <span className="md-txt">Finance Company</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">assured_workload</span>
                                                            <span className="md-txt">Insurance Company</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">share_windows</span>
                                                            <span className="md-txt">Total dealer & Tml Share</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">payments</span>
                                                            <span className="md-txt">Income</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">account_balance_wallet</span>
                                                            <span className="md-txt">Net-Income</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="material-symbols-outlined me-3">receipt_long</span>
                                                            <span className="md-txt">Reciepts Details</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="form-section">

                                                <div className="row">
                                                    <h4>Customer Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Doct No</label>
                                                            <input id="email" name="docNo" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.docNo} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Executive Name</label>
                                                            <input id="email" name="executiveName" type="text" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.executiveName} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Customer Name</label>
                                                            <input id="email" name="customerName" type="text" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.customerName} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Phone Number</label>
                                                            <input id="email" name="phoneNumber" type="text" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.phoneNumber} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Invoice No</label>
                                                            <input id="email" name="invoiceNumber" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.invoiceNumber} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Invoice Date</label>
                                                            <input id="email" name="invoiceDate" type="date" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.invoiceDate} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Dealer Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Invoice Date</label>
                                                            <input id="email" name="dealerInvoiceDate" type="date" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.dealerInvoiceDate} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Branch</label>
                                                            {/* <input id="text" name="name" type="text" placeholder="Enter" className="form-control" /> */}
                                                            <select className="form-select" aria-label="Default select example" name="branchName" value={formChange?.branchName} onChange={handleChange}>
                                                                <option value="">Select Branch </option>
                                                                {savedPropertyData && savedPropertyData?.branches && savedPropertyData?.branches?.length > 0 && savedPropertyData?.branches?.map((eachItem, key) => {
                                                                    console.log("eachItem", eachItem)
                                                                    return (eachItem && eachItem.status == "Active" &&
                                                                        <option value={eachItem?.name ? eachItem?.name : 'N/A'}>{eachItem?.name ? eachItem?.name : 'N/A'} </option>
                                                                    )

                                                                }

                                                                )
                                                                }
                                                                {/* <option value="Black">Black</option>
                                                            <option value="Yellow"> Yellow</option>
                                                            <option value="White"> White</option>
                                                            <option value="Blue"> Blue</option>
                                                            <option value="Green"> Green</option>
                                                            <option value="Silver"> Silver</option>
                                                            <option value="Maroon"> Maroon</option> */}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Tml Invoice date</label>
                                                            <input id="date" name="tmlInvoiceDate" type="date" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.tmlInvoiceDate} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Commercial Invoice</label>
                                                            <input id="number" name="commercialInvoice" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.commercialInvoice} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">No of days Stock in hand</label>
                                                            <input id="number" name="stock" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.stock} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Invoice number</label>
                                                            <input id="number" name="dealerInvoiceNumber" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.dealerInvoiceNumber} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Vehicle Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">LOB</label>
                                                            <input id="text" name="LOB" type="text" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.LOB} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">PPL</label>
                                                            <input id="text" name="PPl" type="text" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.PPl} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Model</label>
                                                            <input id="text" name="modelName" type="text" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.modelName} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Chassis Number</label>
                                                            <input id="number" name="chassisNumber" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.chassisNumber} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Purchase Price</label>
                                                            <input id="number" name="purchasePrice" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.purchasePrice} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Sale Price</label>
                                                            <input id="number" name="salePrice" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.salePrice} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Margin</label>
                                                            <input id="number" name="dealerMargin" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.dealerMargin} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Exchange Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Exchange Offer</label>
                                                            <input id="text" name="exchangeOffer" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.exchangeOffer} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">TML Share</label>
                                                            <input id="text" name="exchangeTmlShare" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.exchangeTmlShare} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Share</label>
                                                            <input id="text" name="exchangeDealerShare" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.exchangeDealerShare} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Not Pass</label>
                                                            <input id="text" name="exchangeNotPass" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.exchangeNotPass} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Corporate Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Corporate Offer</label>
                                                            <input id="text" name="corporateOffer" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.corporateOffer} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">TML Share</label>
                                                            <input id="text" name="corporateTmlShare" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.corporateTmlShare} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Share</label>
                                                            <input id="text" name="corporateDealerShare" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.corporateDealerShare} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Not Pass</label>
                                                            <input id="text" name="corporateNotPass" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.corporateNotPass} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Consumer Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Consumer Offer</label>
                                                            <input id="text" name="consumerOffer" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.consumerOffer} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">TML Share</label>
                                                            <input id="text" name="consumerTmlShare" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.consumerTmlShare} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Share</label>
                                                            <input id="text" name="consumerDealerShare" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.consumerDealerShare} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Not Pass</label>
                                                            <input id="text" name="consumerNotPass" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.consumerNotPass} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Spl Approval from Tata</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Offer</label>
                                                            <input id="text" name="splOffer" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.splOffer} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">TML Share</label>
                                                            <input id="text" name="splTmlShare" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.splTmlShare} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Share</label>
                                                            <input id="text" name="splDealerShare" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.splDealerShare} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Not Pass</label>
                                                            <input id="text" name="splNotPass" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.splNotPass} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">E of Supply</label>
                                                            <input id="text" name="supply" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.supply} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Accessories 18% Margin</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Accessories</label>
                                                            <input id="text" name="accessories" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.accessories} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">FOC</label>
                                                            <input id="text" name="FOC" type="text" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.FOC} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">NET</label>
                                                            <input id="text" name="NET" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.NET} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Extended Warranty</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">E.W</label>
                                                            <input id="text" name="extendedWarranty" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.extendedWarranty} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Incentive</label>
                                                            <input id="text" name="incentive" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.incentive} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>A.M.C/P2P</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">AMC</label>
                                                            <input id="text" name="AMC" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.AMC} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Incentive</label>
                                                            <input id="text" name="amcIncentive" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.amcIncentive} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Fastag</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Fastag</label>
                                                            <input id="text" name="fastagName" type="text" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.fastagName} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Commission</label>
                                                            <input id="text" name="fastagCommission" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.fastagCommission} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Finance Company</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Finance</label>
                                                            <input id="text" name="financeName" type="text" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.financeName} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Finance amount</label>
                                                            <input id="text" name="financeAmount" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.financeAmount} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">IN/OUT</label>
                                                            <input id="text" name="INOUT" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.INOUT} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer commission%</label>
                                                            <input id="text" name="dealerCommission" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.dealerCommission} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Payout</label>
                                                            <input id="text" name="name" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.financePayout} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Insurance Company</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Insurance</label>
                                                            <input id="text" name="insuranceName" type="text" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.insuranceName} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Insurance amount</label>
                                                            <input id="text" name="insuranceAmount" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.insuranceAmount} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Sub total addition</label>
                                                            <input id="text" name="subTotal" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.subTotal} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Payout</label>
                                                            <input id="text" name="insurancePayout" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.insurancePayout} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Total dealer & Tml Share</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Total TML Share</label>
                                                            <input id="text" name="totalTmlShare" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.totalTmlShare} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Total Dealer share</label>
                                                            <input id="text" name="totalDealerShare" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.totalDealerShare} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Income</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Total Income</label>
                                                            <input id="text" name="totalIncome" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.totalIncome} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Offer not passed to customer</label>
                                                            <input id="text" name="offerNotPassed" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.offerNotPassed} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Other income as for tally</label>
                                                            <input id="text" name="otherIncome" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.otherIncome} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Offers from dealer</label>
                                                            <input id="text" name="offerFromDealer" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.offerFromDealer} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Net income before tax</label>
                                                            <input id="text" name="netIncome" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.netIncome} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Net-Income</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Tax</label>
                                                            <input id="text" name="tax" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.tax} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Net income with dealer margin</label>
                                                            <input id="text" name="netIncomeDealerMargin" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.netIncomeDealerMargin} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Remarks</label>
                                                            <input id="text" name="remarks" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.remarks} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Reciepts Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Cash</label>
                                                            <input id="text" name="cash" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.cash} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Bank</label>
                                                            <input id="text" name="bank" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.bank} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">D.O</label>
                                                            <input id="text" name="DO" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.DO} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Total</label>
                                                            <input id="text" name="total" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.total} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Balance</label>
                                                            <input id="text" name="balance" type="number" placeholder="Enter" className="form-control" onChange={handleChange} value={formChange?.balance} />
                                                        </div>
                                                    </div>
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
                            <div className="d-flex justify-content-center">
                                <button className=" btn-primary" type="button" onClick={submitClick}>save</button>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default AddForm;
