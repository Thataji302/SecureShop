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
import SweetAlert from 'react-bootstrap-sweetalert';
import { formatCurrency } from '../utils/commonUtils.js';
// import * as Config from "./../../constants/Config";
let { lambda, appname } = window.app
const Branches = (props) => {
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
    const [resultSuccess, setResultSuccess] = useState(false);
    // console.log("props", props.menus);
    // const active = headerNav.findIndex((e) => e.path === pathname);
    // useEffect(() => {


    //     if (localStorage.getItem("searchValueData")) {
    //         let name = localStorage.getItem("searchValueData");
    //         let splitValue = name.split(",")
    //         //   console.log('splitValue', splitValue)
    //         setAddressData(splitValue[0])
    //     }
    //     if (localStorage.getItem("searchData")) {
    //         let data = JSON.parse(localStorage.getItem("searchData"))
    //         // console.log('data', data)
    //         setAddressDataValue(data)
    //     }
    // }, []);
    useEffect(() => {
        if (window.site) {
            setConfig(window.site);

        }

    }, [window.site]);
    useEffect(() => {
        // if (!localStorage.getItem("token")) {
        //     history.push("/");
        // } else if (menuList[1]?.id) {
        //     setActiveId(menuList[1].id)
        // }
        // if (localStorage.getItem("propertyName")) {
        //     const propertyValue = localStorage.getItem("propertyName");
        //     const name = localStorage.getItem("name");
        //     GetPropertyData(name);
        //    // setPropertyNameValue(propertyValue)
        // }
        const type = "branches";
        GetPropertyData(type);
    }, []);
    const GetPropertyData = (type) => {
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        const urlLink = lambda + '/lookups?appname=' + appname + "&type=" + type + (userid ? "&userid=" + userid : "");
        axios({
            method: 'GET',
            url: urlLink,
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
    const editClick = (e, item) => {
         let type = item && item.type;
        let id = item && item.lookupId;
        //localStorage.setItem("item", JSON.stringify(item));
        //history.push("/lookupForm")
        localStorage.removeItem("formType");
         window.location = `/lookupForm?id=${id}&type=${type} `;
    }
    const deleteClick = (e, item) => {
        let type = item && item.type;
       let id = item && item.lookupId;
       let lookupid = id;
        if (lookupid) {
            let payload;
            // let userid = localStorage.getItem("userid")
            payload = {
                "name": item && item.name,
                "phoneNumber": item && item.phoneNumber,
                "address": item && item.address,
                "type": type,
                "status": "Archive",
                "lookupId":lookupid
            };
            const urlLink = lambda + '/lookups?appname=' + appname;
            axios({
                method: 'POST',
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
   }
   function onConfirm1() {
    setResultSuccess(false)
    const type = "branches";
        GetPropertyData(type);
};
    return (

        <div className="dashboard">
            <Header />
            <div className="main-content property_searches">

                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <div className="title-block">
                                            {/* <div className="d-flex">
                                                <h4 className="mb-2 card-title">Property Searches -</h4>
                                                <p><span className="material-symbols-outlined"> cottage</span>
                                                    {propertyNameValue}
                                                   
                                                </p>
                                            </div> */}
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
                                    {savedPropertyData && savedPropertyData?.branches && savedPropertyData?.branches?.length > 0 && savedPropertyData?.branches?.map((eachItem, key) => {
                                        return ( eachItem && eachItem.status == "Active" &&
                                            <div className="row mt-4" key={key}>
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <label className="col-form-label">Branch Name</label>
                                                        <p>{eachItem?.name ? eachItem?.name : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <label className="col-form-label">Phone Number</label>
                                                        <p>{eachItem?.phoneNumber ? eachItem?.phoneNumber : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <label className="col-form-label">Created</label>
                                                        <p>{eachItem?.created ? eachItem?.created : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <label className="col-form-label">Address</label>
                                                        <p>{eachItem?.address ? eachItem?.address : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <label className="col-form-label">Actions</label>
                                                        <button type="button" className="back" onClick={e => editClick(e, eachItem)}><span className="material-symbols-outlined">edit</span>Edit</button>
                                                        <button type="button" className="back" onClick={e => deleteClick(e, eachItem)}><span className="material-symbols-outlined">delete</span>Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        
                                    }
                                    
                                    )
                                
                                }
                                </div>
                                {!savedPropertyData && 
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <div className="new_search error_wrapper">
                                                        <img src={imageCloudfront + "propertyCalculator/images/not-found.png"} height="300px" />
                                                        <p>There are no branches available.</p>
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
                {resultSuccess &&
                <SweetAlert show={resultSuccess}
                    custom
                    confirmBtnText="Ok"
                    confirmBtnBsStyle="primary"
                    title={"Deleted Successfully"}
                    onConfirm={e => onConfirm1()}
                >
                </SweetAlert>}
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

export default Branches;
