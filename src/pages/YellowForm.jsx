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
     //   GetPropertyData();
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
            <div className="topnav">
                <div className="container-fluid">
                    <nav className="navbar navbar-light navbar-expand-lg topnav-menu">

                        <div className="collapse navbar-collapse" id="topnav-menu-content">
                            <ul className="navbar-nav">

                                <li className="nav-item">
                                    <a className="nav-link active" href="#" id="topnav-dashboard" role="button">Yellow Form</a>
                                   </li>

                                   <li className="nav-item">
                                    <a className="nav-link" href="#" id="topnav-dashboard" role="button">N.R.M</a>
                                   </li>

                                   <li className="nav-item">
                                    <a className="nav-link" href="#" id="topnav-dashboard" role="button">Monthly Sale</a>
                                   </li>

                                   <li className="nav-item">
                                    <a className="nav-link" href="#" id="topnav-dashboard" role="button">Finance & Insurance Payout %</a>
                                   </li>

                                   <li className="nav-item">
                                    <a className="nav-link" href="#" id="topnav-dashboard" role="button">Claims summary Sheet</a>
                                   </li>

                                   <li className="nav-item">
                                    <a className="nav-link" href="#" id="topnav-dashboard" role="button">Offers</a>
                                   </li>
                                   <li className="nav-item">
                                    <a className="nav-link" href="#" id="topnav-dashboard" role="button">Summary</a>
                                   </li>
                                   <li className="nav-item">
                                    <a className="nav-link" href="#" id="topnav-dashboard" role="button">Master Price  AMC EW</a>
                                   </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
            <div className="main-content">

           
                <div className="container-fluid">
                     <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                   
                                    <div className="table-responsive">
                                        <table className="table align-middle table-nowrap mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    
                                                    <th className="align-middle">S No</th>
                                                    <th className="align-middle">Doct No</th>
                                                    <th className="align-middle">Exe. No</th>
                                                    <th className="align-middle">Invoice No</th>
                                                    <th className="align-middle">Inv Date</th>
                                                    <th className="align-middle">Customer Name</th>
                                                    <th className="align-middle">Ph Number</th>
                                                    <th className="align-middle">Branch</th>
                                                    <th className="align-middle">LOB</th>
                                                    <th className="align-middle">PPL</th>
                                                    <th className="align-middle">Model</th>
                                                    <th className="align-middle">Chassis No</th>
                                                    <th className="align-middle">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                
<tr>
<td>1</td>
<td>559</td>
<td>Tejaswani</td>
<td>ISVRVS2122001013</td>
<td>9-1-2021</td>
<td>METLA  RAJYA LAKSHMI</td>
<td>9640133459</td>
<td>RJY</td>
<td>UVs</td>
<td>Harrier</td>
<td>Harrier XZA+ Dark Edition</td>
<td>MAT631543MPH79247</td>
<td><div className="d-flex"><a className=" text-danger action-button"><i className="mdi mdi-pencil font-size-18"></i></a><a className=" text-success action-button"><i className="mdi mdi-delete font-size-18"></i></a></div></td>
</tr>

<tr>
<td>1</td>
<td>559</td>
<td>Tejaswani</td>
<td>ISVRVS2122001013</td>
<td>9-1-2021</td>
<td>METLA  RAJYA LAKSHMI</td>
<td>9640133459</td>
<td>RJY</td>
<td>UVs</td>
<td>Harrier</td>
<td>Harrier XZA+ Dark Edition</td>
<td>MAT631543MPH79247</td>
<td><div className="d-flex"><a className=" text-danger action-button"><i className="mdi mdi-pencil font-size-18"></i></a><a className=" text-success action-button"><i className="mdi mdi-delete font-size-18"></i></a></div></td>
</tr>
                                       
<tr>
<td>1</td>
<td>559</td>
<td>Tejaswani</td>
<td>ISVRVS2122001013</td>
<td>9-1-2021</td>
<td>METLA  RAJYA LAKSHMI</td>
<td>9640133459</td>
<td>RJY</td>
<td>UVs</td>
<td>Harrier</td>
<td>Harrier XZA+ Dark Edition</td>
<td>MAT631543MPH79247</td>
<td><div className="d-flex"><a className=" text-danger action-button"><i className="mdi mdi-pencil font-size-18"></i></a><a className=" text-success action-button"><i className="mdi mdi-delete font-size-18"></i></a></div></td>
</tr>

<tr>
<td>1</td>
<td>559</td>
<td>Tejaswani</td>
<td>ISVRVS2122001013</td>
<td>9-1-2021</td>
<td>METLA  RAJYA LAKSHMI</td>
<td>9640133459</td>
<td>RJY</td>
<td>UVs</td>
<td>Harrier</td>
<td>Harrier XZA+ Dark Edition</td>
<td>MAT631543MPH79247</td>
<td><div className="d-flex"><a className=" text-danger action-button"><i className="mdi mdi-pencil font-size-18"></i></a><a className=" text-success action-button"><i className="mdi mdi-delete font-size-18"></i></a></div></td>
</tr>

<tr>
<td>1</td>
<td>559</td>
<td>Tejaswani</td>
<td>ISVRVS2122001013</td>
<td>9-1-2021</td>
<td>METLA  RAJYA LAKSHMI</td>
<td>9640133459</td>
<td>RJY</td>
<td>UVs</td>
<td>Harrier</td>
<td>Harrier XZA+ Dark Edition</td>
<td>MAT631543MPH79247</td>
<td><div className="d-flex"><a className=" text-danger action-button"><i className="mdi mdi-pencil font-size-18"></i></a><a className=" text-success action-button"><i className="mdi mdi-delete font-size-18"></i></a></div></td>
</tr>

<tr>
<td>1</td>
<td>559</td>
<td>Tejaswani</td>
<td>ISVRVS2122001013</td>
<td>9-1-2021</td>
<td>METLA  RAJYA LAKSHMI</td>
<td>9640133459</td>
<td>RJY</td>
<td>UVs</td>
<td>Harrier</td>
<td>Harrier XZA+ Dark Edition</td>
<td>MAT631543MPH79247</td>
<td><div className="d-flex"><a className=" text-danger action-button"><i className="mdi mdi-pencil font-size-18"></i></a><a className=" text-success action-button"><i className="mdi mdi-delete font-size-18"></i></a></div></td>
</tr>

<tr>
<td>1</td>
<td>559</td>
<td>Tejaswani</td>
<td>ISVRVS2122001013</td>
<td>9-1-2021</td>
<td>METLA  RAJYA LAKSHMI</td>
<td>9640133459</td>
<td>RJY</td>
<td>UVs</td>
<td>Harrier</td>
<td>Harrier XZA+ Dark Edition</td>
<td>MAT631543MPH79247</td>
<td><div className="d-flex"><a className=" text-danger action-button"><i className="mdi mdi-pencil font-size-18"></i></a><a className=" text-success action-button"><i className="mdi mdi-delete font-size-18"></i></a></div></td>
</tr>

<tr>
<td>1</td>
<td>559</td>
<td>Tejaswani</td>
<td>ISVRVS2122001013</td>
<td>9-1-2021</td>
<td>METLA  RAJYA LAKSHMI</td>
<td>9640133459</td>
<td>RJY</td>
<td>UVs</td>
<td>Harrier</td>
<td>Harrier XZA+ Dark Edition</td>
<td>MAT631543MPH79247</td>
<td><div className="d-flex"><a className=" text-danger action-button"><i className="mdi mdi-pencil font-size-18"></i></a><a className=" text-success action-button"><i className="mdi mdi-delete font-size-18"></i></a></div></td>
</tr>

<tr>
<td>1</td>
<td>559</td>
<td>Tejaswani</td>
<td>ISVRVS2122001013</td>
<td>9-1-2021</td>
<td>METLA  RAJYA LAKSHMI</td>
<td>9640133459</td>
<td>RJY</td>
<td>UVs</td>
<td>Harrier</td>
<td>Harrier XZA+ Dark Edition</td>
<td>MAT631543MPH79247</td>
<td><div className="d-flex"><a className=" text-danger action-button"><i className="mdi mdi-pencil font-size-18"></i></a><a className=" text-success action-button"><i className="mdi mdi-delete font-size-18"></i></a></div></td>
</tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                  
                    
                </div> 
             m,jkkbb
            
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

export default Dashboard;
