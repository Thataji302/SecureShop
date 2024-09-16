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

        <>
        <div id="layout-wrapper">
            <div className="dashboard">
               <div className="main-content create_yellowform">
                    <div className="page-content">
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
                     <li className="active"><a href="#" className="title_btn">Customer Details</a></li>
                       <li><a href="#" className="title_btn">Dealer Details</a></li>
                         <li><a href="#" className="title_btn">Vehicle Details</a></li>
                            <li><a href="#" className="title_btn">Exchange Details</a></li>
                             </ul>

                 </div>
                 <div className="form-section">   
                 <div className="row">   
                 <h4>Customer Details</h4>
                 <div className="col-md-6">
        <div className="input-field">
        <label className="form-label form-label">Doct No</label>
        <input id="email" name="name" type="number" placeholder="Enter" className="form-control"/>
        </div>
        </div>
        <div className="col-md-6">
        <div className="input-field">
        <label className="form-label form-label">Executive Name</label>
        <input id="email" name="name" type="text" placeholder="Enter" className="form-control"/>
        </div>
        </div>
        <div className="col-md-6">
        <div className="input-field">
        <label className="form-label form-label">Invoice No</label>
        <input id="email" name="name" type="number" placeholder="Enter" className="form-control"/>
        </div>
        </div>
        <div className="col-md-6">
        <div className="input-field">
        <label className="form-label form-label">Invoice Date</label>
        <input id="email" name="name" type="date" placeholder="Enter" className="form-control"/>
        </div>
        </div>
               </div>
               <hr></hr>
                 </div>
               </div>
                  </div>
                       </div>
                         </div>
                            </div>
                    </div>
                   
                    <footer className="footer">
                        <div className="container-fluid">
                            <div className="d-flex align-items-center justify-content-center">
                            <button className=" btn-primary" type="button">save</button>
                            </div>
                        </div>
                    </footer>

                </div>

            </div>
        </div>

    </>
        
    );
};

export default AddForm;
