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
        // if (!localStorage.getItem("token")) {
        //     history.push("/");
        // }else{
        //   GetPropertyData();
        // }

    }, []);


    // console.log("propertyData",propertyData)

    let imageCloudfront;
    if (config.common && config.common.imageCloudfront) {
        imageCloudfront = config.common.imageCloudfront;
    }
    const goBack = () => {
        history.goBack();
    }

    return (
        <div id="layout-wrapper">
            <div className="dashboard">
                <div className="main-content create_yellowform">
                    <div className="page-content create-content">
                        <div className="container-fluid">
                            <div className="md-container">
                                <div className="form-header">
                                    <h2>CREATE A YELLOW FORM</h2>
                                    <button><span className="material-icons-outlined">close</span></button>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="inner-wrapper">
                                            <div className="left_nav">
                                                <ul>
                                                    <li className="active">
                                                        <span className="material-symbols-outlined me-3">person_2</span>
                                                        <span className="md-txt">Customer Details</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">storefront</span>
                                                        <span className="md-txt">Dealer Details</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">car_tag</span>
                                                        <span className="md-txt">Vehicle Details</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">published_with_changes</span>
                                                        <span className="md-txt">Exchange Details</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">corporate_fare</span>
                                                        <span className="md-txt">Corporate Details</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">location_home</span>
                                                        <span className="md-txt">Consumer Details</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">approval_delegation</span>
                                                        <span className="md-txt">Spl Approval from Tata</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">swap_driving_apps_wheel</span>
                                                        <span className="md-txt">Accessories 18% Margin</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">verified_user</span>
                                                        <span className="md-txt">Extended Warranty</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">construction</span>
                                                        <span className="md-txt">A.M.C/P2P</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">swap_driving_apps</span>
                                                        <span className="md-txt">Fastag</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">money_bag</span>
                                                        <span className="md-txt">Finance Company</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">assured_workload</span>
                                                        <span className="md-txt">Insurance Company</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">share_windows</span>
                                                        <span className="md-txt">Total dealer & Tml Share</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">payments</span>
                                                        <span className="md-txt">Income</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">account_balance_wallet</span>
                                                        <span className="md-txt">Net-Income</span>
                                                    </li>
                                                    <li>
                                                        <span className="material-symbols-outlined me-3">receipt_long</span>
                                                        <span className="md-txt">Reciepts Details</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="form-section">

                                                <div className="row">
                                                    <h4>Customer Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Doct No</label>
                                                            <input id="email" name="name" type="number" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Executive Name</label>
                                                            <input id="email" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Invoice No</label>
                                                            <input id="email" name="name" type="number" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Invoice Date</label>
                                                            <input id="email" name="name" type="date" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Dealer Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Invoice date</label>
                                                            <input id="email" name="name" type="number" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Branch</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Tml Invoice date</label>
                                                            <input id="date" name="name" type="date" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Commercial Invoice</label>
                                                            <input id="number" name="name" type="number" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">No of days Stock in hand</label>
                                                            <input id="number" name="name" type="number" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Invoice number</label>
                                                            <input id="number" name="name" type="number" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Vehicle Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">LOB</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">PPL</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Model</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Chassis Number</label>
                                                            <input id="number" name="name" type="number" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Purchase Price</label>
                                                            <input id="number" name="name" type="number" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Sale Price</label>
                                                            <input id="number" name="name" type="number" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Margin</label>
                                                            <input id="number" name="name" type="number" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Exchange Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Exchange Offer</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">TML Share</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Share</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Not Pass</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Corporate Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Corporate Offer</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">TML Share</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Share</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Not Pass</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Consumer Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Consumer Offer</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">TML Share</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Share</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Not Pass</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Spl Approval from Tata</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Offer</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">TML Share</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer Share</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Not Pass</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">E of Supply</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Accessories 18% Margin</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Accessories</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">FOC</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">NET</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Extended Warranty</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">E.W</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Incentive</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>A.M.C/P2P</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">AMC</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Incentive</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Fastag</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Fastag</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Commission</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Finance Company</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Finance</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Finance amount</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">IN/OUT</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Dealer commission%</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Payout</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Insurance Company</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Insurance</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Insurance amount</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Sub total addition</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Payout</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Total dealer & Tml Share</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Total TML Share</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Total Dealer share</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Income</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Total Income</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Offer not passed to customer</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Other income as for tally</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Offers from dealer</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Net income before tax</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Net-Income</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Tax</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Net income with dealer margin</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Remarks</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr></hr>

                                                <div className="row">
                                                    <h4>Reciepts Details</h4>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Cash</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Bank</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">D.O</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Total</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="form-label form-label">Balance</label>
                                                            <input id="text" name="name" type="text" placeholder="Enter" className="form-control" />
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
                            <div className=" justify-content-center">
                                <button className=" btn-primary" type="button">save</button>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default AddForm;
