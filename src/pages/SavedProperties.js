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
import { formatCurrency } from '../utils/commonUtils.js';
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
const propertyName = localStorage.getItem("propertyName");
const SavedProperties = (props) => {
    // const { pathname } = useLocation();
    // const headerRef = useRef(null);
    // const [scroll, setScroll] = useState(false);
    const history = useHistory();
    const [savedPropertyData, setSavedPropertyData] = useState({})
    const [addressData, setAddressData] = useState();
    const [addressDataValue, setAddressDataValue] = useState();
    const [propertyNameValue, setPropertyNameValue] = useState();
    const [activeId, setActiveId] = useState();
    const [config, setConfig] = useState({});
    // console.log("props", props.menus);
    // const active = headerNav.findIndex((e) => e.path === pathname);
    useEffect(() => {


        if (localStorage.getItem("searchValueData")) {
            let name = localStorage.getItem("searchValueData");
            let splitValue = name.split(",")
            //   console.log('splitValue', splitValue)
            setAddressData(splitValue[0])
        }
        if (localStorage.getItem("searchData")) {
            let data = JSON.parse(localStorage.getItem("searchData"))
            // console.log('data', data)
            setAddressDataValue(data)
        }
    }, []);
    useEffect(() => {
        if (window.site) {
            setConfig(window.site);

        }

    }, [window.site]);
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        } else if (menuList[1]?.id) {
            setActiveId(menuList[1].id)
        }
        if (localStorage.getItem("propertyName")) {
            const propertyValue = localStorage.getItem("propertyName");
            const name = localStorage.getItem("name");
            GetPropertyData(name);
            setPropertyNameValue(propertyValue)
        }
    }, []);
    const GetPropertyData = (propertyValue) => {
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userId")
        // console.log('propertyName',propertyValue)
        let payload = { "propertyName": propertyValue };
        const urlLink = lambda + '/getProperties?appname=' + appname + "&token=" + token + "&userid=" + userid;
        axios({
            method: 'POST',
            url: urlLink,
            data: payload
        })
            .then(function (response) {
                if (response.data.result) {
                    setSavedPropertyData(response.data.result && response.data.result.data && response.data.result.data[0])
                }
            });
    }
    const searchClick = () => {
        history.push("/search");
    }
    const savedClick = () => {
        history.push("/dashboard");
    }
    const goBack = () => {
        history.goBack();
    }
    // console.log('?.search', savedPropertyData?.search)
    const onClickMenu = (e, item) => {
        //setMenu(id);
        console.log('handleActiveMenuObj------------>', item)
        setActiveId(item.id)

        history.push(item.route)
    }
    let imageCloudfront;
    if (config.common && config.common.imageCloudfront) {
        imageCloudfront = config.common.imageCloudfront;
    }
    return (

        <div className="dashboard">
            <Header />
            <div className="vertical-menu">

                <div data-simplebar className="h-100">
                    <div id="sidebar-menu">
                        <ul className="metismenu list-unstyled" id="side-menu">
                            {/* <li>
                <a href="#" className={isActive ? "waves-effect active": "waves-effect"} onClick={searchClick}> <span className="material-symbols-outlined icon"> travel_explore </span> <span key="t-chat">Search</span> </a>
            </li>
            <li>
                <a href="#" className="waves-effect " onClick={savedClick}> <span className="material-symbols-outlined icon"> collections_bookmark </span> <span key="t-chat">Properties</span> </a>
            </li>
            <li>
                <a href="#" className="waves-effect"> <span className="material-symbols-outlined icon"> settings </span> <span key="t-chat">Settings</span> </a>
            </li> */}
                            {/* {menuList.map(eachItem => (
                            <li key={eachItem.id}><a href='#' className={`"waves-effect ${eachItem.id === menu ? 'active' : ''}`} onClick={() => onClickMenu(eachItem.id,eachItem.route)}  data-tip={eachItem.labelName}><span className="material-symbols-outlined icon"> {eachItem.name} </span> <span key="t-chat">{eachItem.labelName}</span></a> <Tooltip />  </li>
                        ))} */}
                            {menuList.map((val) => (
                                <li key={val.id}>
                                    <a href='#' className={`${activeId === val.id ? "waves-effect active" : "waves-effect"}`} onClick={(e) => onClickMenu(e, val)} data-tip={val.labelName}><span className="material-symbols-outlined icon"> {val.name} </span> <span key="t-chat">{val.labelName}</span></a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
            <div className="main-content property_searches">

                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <div className="title-block">
                                            <div className="d-flex">
                                                <h4 className="mb-2 card-title">Property Searches -</h4>
                                                <p><span className="material-symbols-outlined"> cottage</span>
                                                    {propertyNameValue}
                                                    {/* , {addressDataValue?.state}, {addressDataValue?.city},{addressDataValue?.route}, {addressDataValue?.postal_code} */}
                                                </p>
                                            </div>
                                            <div className="property_info">
                                                <button type="button" className="back" onClick={goBack}><span className="material-symbols-outlined">chevron_left</span>back</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card mb-3 card-height">
                                <div className="card-body recent_property_values">
                                {savedPropertyData && savedPropertyData?.search && savedPropertyData?.search?.length > 0 && savedPropertyData?.search?.map((eachItem, key) => {
                                                    return (
                                    <div className="row mt-4" key={key}>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Max Bid/Offer $</label>
                                                <p>{eachItem?.max_bid ? formatCurrency(eachItem?.max_bid) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Profit % Required</label>
                                                <p>{Math.round(eachItem && (eachItem?.roc)) + "%"}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Annual ROC % Required</label>
                                                <p>{Math.round(eachItem && (eachItem?.annualized)) + "%"}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Min. Gross Profit Required</label>
                                                <p>{eachItem?.projected_profit ? formatCurrency(eachItem?.projected_profit) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Cost Basis Required</label>
                                                <p>{eachItem?.psf_new ? formatCurrency(eachItem?.psf_new) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Buyer Sales Commission</label>
                                                <p>{eachItem?.buyer_sales_comm_new_calc ? formatCurrency(eachItem?.buyer_sales_comm_new_calc) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Seller Sales Commission</label>
                                                <p>{eachItem?.seller_sales_comm_new_calc ? formatCurrency(eachItem?.seller_sales_comm_new_calc) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Sale Transfer Tax</label>
                                                <p>{eachItem?.sale_transferr_new_calc ? formatCurrency(eachItem?.sale_transferr_new_calc) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Disposition Fee</label>
                                                <p>{eachItem?.dispositionfee_new_calc ? formatCurrency(eachItem?.dispositionfee_new_calc) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Escrow</label>
                                                <p>{eachItem?.escrow_new_calc ? formatCurrency(eachItem?.escrow_new_calc) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Title</label>
                                                <p>{eachItem?.title_new_calc ? formatCurrency(eachItem?.title_new_calc) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Insurance</label>
                                                <p>{eachItem?.insturance_calc ? formatCurrency(eachItem?.insturance_calc) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Hold Prop Taxes</label>
                                                <p>{eachItem?.hold_property_tax_calc ? formatCurrency(eachItem?.hold_property_tax_calc) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Hold Period Utilities</label>
                                                <p>{eachItem?.utility_calc ? formatCurrency(eachItem?.utility_calc) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">HOA Hold</label>
                                                <p>{eachItem?.hoa_hold_calc ? formatCurrency(eachItem?.hoa_hold_calc) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Sr. Debt Interest</label>
                                                <p>{eachItem?.srdebt_intrate_calc ? formatCurrency(eachItem?.srdebt_intrate_calc) : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Total Days</label>
                                                <p>{eachItem?.total_assum_hold ? eachItem?.total_assum_hold : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="col-form-label">Total Costs</label>
                                                <p>{eachItem?.totalCosts ? formatCurrency(eachItem?.totalCosts) : 'N/A'}</p>
                                            </div>
                                        </div>

                                    </div>
                                     )

                                    })}
                                </div>
                                {!savedPropertyData &&
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <div className="new_search error_wrapper">
                                                    <img src={imageCloudfront + "propertyCalculator/images/not-found.png"} height="300px" />
                                                    <p>There are no properties available.</p>
                                                    <button className="button_style" href="#" onClick={goBack}> GO BACK</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                        </div>

                    </div>
                </div>

                <footer className="footer">
                    <div className="container-fluid">
                        <div className="row">

                            <div className="col-sm-12 text-center">
                                <div className="text-sm-center d-none d-sm-block text-center">
                                    All Rights Reserved 2024.
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default SavedProperties;
