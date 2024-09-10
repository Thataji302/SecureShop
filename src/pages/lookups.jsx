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
import Modal from "react-bootstrap/Modal";
// import * as Config from "./../../constants/Config";
let { lambda, appname } = window.app
const Lookups = (props) => {
    // const { pathname } = useLocation();
    // const headerRef = useRef(null);
    // const [scroll, setScroll] = useState(false);
    const history = useHistory();
    const [propertyData, setPropertyData] = useState({})
    const [config, setConfig] = useState({});
    const [activeId, setActiveId] = useState();
    const [formType, setFormType] = useState();
    const [addPopup, setAddPopup] = useState(false);
    // console.log("props", props.menus);
    // const active = headerNav.findIndex((e) => e.path === pathname);
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
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
        console.log('hiiiiiiiiiiiiiiiiiiiiiiiiii')
       // GetPropertyData();
    }, []);
    const GetPropertyData = () => {
        // const token = localStorage.getItem("token");
        // const userid = localStorage.getItem("userId")
        const urlLink = lambda + '/lookups?appname=' + appname;
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    setPropertyData(response.data.result.data)
                }
            });
    }
    const searchClick = () => {
        history.push("/search");
    }
    const savedClick = () => {
        history.push("/dashboard");
    }
    // console.log("propertyData",propertyData)
    const branchClick = (e) => {
        //  console.log('name',name)
        // let nameValue = name + "," + state + "," + zipCode
        // console.log('nameValue', nameValue)
        // localStorage.setItem("propertyName", nameValue)
        // localStorage.setItem("name", name)
        // localStorage.setItem("propertyZipCode", zipCode)
        history.push("/branches");
    }
    const modelClick = (e) => {
        //  console.log('name',name)
        // let nameValue = name + "," + state + "," + zipCode
        // console.log('nameValue', nameValue)
        // localStorage.setItem("propertyName", nameValue)
        // localStorage.setItem("name", name)
        // localStorage.setItem("propertyZipCode", zipCode)
        history.push("/models");
    }
    const insuranceClick = (e) => {
        //  console.log('name',name)
        // let nameValue = name + "," + state + "," + zipCode
        // console.log('nameValue', nameValue)
        // localStorage.setItem("propertyName", nameValue)
        // localStorage.setItem("name", name)
        // localStorage.setItem("propertyZipCode", zipCode)
        history.push("/insurance");
    }
    const financeClick = (e) => {
        //  console.log('name',name)
        // let nameValue = name + "," + state + "," + zipCode
        // console.log('nameValue', nameValue)
        // localStorage.setItem("propertyName", nameValue)
        // localStorage.setItem("name", name)
        // localStorage.setItem("propertyZipCode", zipCode)
        history.push("/finance");
    }
    const fastagClick = (e) => {
        history.push("/fastag");
    }
    
    let imageCloudfront;
    if (config.common && config.common.imageCloudfront) {
        imageCloudfront = config.common.imageCloudfront;
    }
    const goBack = () => {
        history.goBack();
    }
    const onClickMenu = (e, item) => {
        //setMenu(id);
        console.log('handleActiveMenuObj------------>', item)
        setActiveId(item.id)

        history.push(item.route)
    }
    const addClick = () => {
        //history.goBack();
        setAddPopup(true)
    }
    const handleChange = (e) => {
        setFormType(e.target.value);
    };
    const buttonClick = (e) => {
        localStorage.setItem("formType",formType)
        history.push("/lookupForm");
    };
    const onCancel = () => {
        //history.goBack();
        setAddPopup(false)
    } 
    return (

        <div className="dashboard">
            <Header />
            <div className="topnav">
                <div className="container-fluid">
                    <nav className="navbar navbar-light navbar-expand-lg topnav-menu">

                        <div className="property_info">
                            <button type="button" className="back" onClick={addClick}><span className="material-symbols-outlined">add</span>Add Type</button>
                        </div>
                    </nav>
                </div>
            </div>
            <div className="main-content">
                {addPopup &&
                    <Modal className="access-denied" show={addPopup}>

                        <div className="modal-body enquiry-form">
                            <div className="container">
                                <button className="close-btn" onClick={e => onCancel()}><span className="material-icons">close</span></button>
                                <h3>Lookup Types</h3>
                                <select className="form-select" name="formType" aria-label="Default select example" onChange={(e) => handleChange(e)} value={formType}>
                                    <option value="">Select Type </option>
                                    <option value="branches">Branches </option>
                                    <option value="models">Models</option>
                                    <option value="insurance"> Insurance</option>
                                    <option value="finance"> Finance</option>
                                    <option value="fastag"> Fastag</option>

                                </select>
                                <button type="button" className="back" onClick={buttonClick}><span className="material-symbols-outlined">add</span>ADD</button>
                            </div>
                        </div>

                    </Modal>}
                    <div className="page-content">
                    <div className="container-fluid">
                        {/* <div className="row">
                        <div className="col-lg-12">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <div className="title-block">
                                        <h4 className="mb-2 card-title">Saved Property Searches</h4>
                                        <div className="dropdown d-flex">
                                            <button className=" btn-primary me-2" type="button">ADD CONTENT</button>
                                            <button className=" btn-primary" type="button">IMPORT</button>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                        <div className="recent_searches properties">
                           
                                <div className="row">
                                            <div className="col-md-3" >
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="property_info">
                                                            <div className="info" style={{ cursor: 'pointer' }} onClick={e => branchClick(e)}>
                                                                <div className="card-wrapper" >
                                                                    <div className="icon-box">
                                                                        <span className="material-symbols-outlined"> cottage </span>
                                                                    </div>
                                                                    <div className="card-info" >
                                                                        <h6>Branches</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        
                                </div>
                                <div className="row">
                                            <div className="col-md-3" >
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="property_info">
                                                            <div className="info" style={{ cursor: 'pointer' }} onClick={e => modelClick(e)}>
                                                                <div className="card-wrapper" >
                                                                    <div className="icon-box">
                                                                        <span className="material-symbols-outlined"> cottage </span>
                                                                    </div>
                                                                    <div className="card-info" >
                                                                        <h6>Models</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        
                                </div>
                                <div className="row">
                                            <div className="col-md-3" >
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="property_info">
                                                            <div className="info" style={{ cursor: 'pointer' }} onClick={e => insuranceClick(e)}>
                                                                <div className="card-wrapper" >
                                                                    <div className="icon-box">
                                                                        <span className="material-symbols-outlined"> cottage </span>
                                                                    </div>
                                                                    <div className="card-info" >
                                                                        <h6>Insurance</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        
                                </div>
                                <div className="row">
                                            <div className="col-md-3" >
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="property_info">
                                                            <div className="info" style={{ cursor: 'pointer' }} onClick={e => financeClick(e)}>
                                                                <div className="card-wrapper" >
                                                                    <div className="icon-box">
                                                                        <span className="material-symbols-outlined"> cottage </span>
                                                                    </div>
                                                                    <div className="card-info" >
                                                                        <h6>Finance</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        
                                </div>
                                <div className="row">
                                            <div className="col-md-3" >
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="property_info">
                                                            <div className="info" style={{ cursor: 'pointer' }} onClick={e => fastagClick(e)}>
                                                                <div className="card-wrapper" >
                                                                    <div className="icon-box">
                                                                        <span className="material-symbols-outlined"> cottage </span>
                                                                    </div>
                                                                    <div className="card-info" >
                                                                        <h6>Fastag</h6>
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
                </div>

                <footer className="footer">
                    <div className="container-fluid">
                        <div className="row">

                            <div className="col-sm-12 text-center">
                                <div className="text-sm-center d-none d-sm-block text-center">
                                    2024 ALL RIGHTS RESERVED MOTOR SALES.
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>

        </div>

    );
};

export default Lookups;
