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
const Dashboard = (props) => {
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
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        else if (menuList[1]?.id) {
            setActiveId(menuList[1].id)
        }

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
        GetPropertyData();
        // }

    }, []);
    const GetPropertyData = () => {
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userId")
        const urlLink = lambda + '/getProperties?appname=' + appname + "&token=" + token + "&userid=" + userid;
        axios({
            method: 'POST',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    setPropertyData(response.data.result)
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
    const savedProperties = (e, name, state, zipCode) => {
        //  console.log('name',name)
        let nameValue = name + "," + state + "," + zipCode
        console.log('nameValue', nameValue)
        localStorage.setItem("propertyName", nameValue)
        localStorage.setItem("name", name)
        // localStorage.setItem("propertyZipCode", zipCode)
        history.push("/properties");
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
            <div className="main-content">

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
                            {propertyData && propertyData?.data && propertyData?.data?.length > 0 ?
                                <div className="row">
                                    {propertyData && propertyData?.data && propertyData?.data?.map((eachItem, key) => {
                                        return (
                                            <div className="col-md-3" key={key}>
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="property_info">
                                                            <div className="info">
                                                                <div className="card-wrapper" >
                                                                    <div className="icon-box">
                                                                        <span className="material-symbols-outlined"> cottage </span>
                                                                    </div>
                                                                    <div className="card-info" onClick={e => savedProperties(e, eachItem?.propertyName, eachItem?.state, eachItem?.postal_code)}>
                                                                        {/* <p className="calendar_month"><span className="material-symbols-outlined">calendar_month</span>15 Oct, 19</p> */}
                                                                        <p>{eachItem?.propertyName}, {eachItem?.state}, {eachItem?.postal_code}</p>
                                                                        <h6>{eachItem && eachItem?.search && eachItem?.search?.length + " " + "Offers"}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div> :
                                // <div className="error-wrapper">
                                //     <img src={imageCloudfront + "propertyCalculator/images/notfound.svg"} height="300px" />
                                //     <p>There are no properties available.</p>
                                //     <button className="button_style" href="#" onClick={goBack}> GO BACK</button>
                                // </div>
                            !propertyData &&
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

export default Dashboard;
