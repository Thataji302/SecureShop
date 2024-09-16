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
    const createClick = () => {
        history.push("/createForm");
    }

    let scrollInterval; // To store the interval for scrolling
    const wrapper = document.querySelector('.table-wrapper');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');

    // Function to scroll left
    function scrollLeft() {
        clearInterval(scrollInterval); // Clear any previous interval
        scrollInterval = setInterval(() => {
            wrapper.scrollLeft -= 5; // Adjust this value for speed of scrolling left
            if (wrapper.scrollLeft <= 0) { // Stop when it reaches the start
                clearInterval(scrollInterval);
            }
        }, 10);
    }

    // // Function to scroll right
    function scrollRight() {
        clearInterval(scrollInterval); // Clear any previous interval
        scrollInterval = setInterval(() => {
            wrapper.scrollLeft += 5; // Adjust this value for speed of scrolling right
            if (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth) { // Stop when it reaches the end
                clearInterval(scrollInterval);
            }
        }, 10);
    }

    // // Stop scrolling
    function stopScroll() {
        clearInterval(scrollInterval);
    }

    // // // Show or hide scroll buttons based on mouse position
    // // wrapper.addEventListener('mousemove', (event) => {
    // //     const mouseX = event.clientX - wrapper.getBoundingClientRect().left; // Mouse position relative to wrapper
    // //     const wrapperWidth = wrapper.clientWidth;
    // //     const threshold = 50; // Pixels from the edges where buttons should appear

    // //     if (mouseX < threshold) {
    // //         scrollLeftBtn.style.opacity = 1;
    // //         scrollLeftBtn.style.pointerEvents = 'auto';
    // //     } else {
    // //         scrollLeftBtn.style.opacity = 0;
    // //         scrollLeftBtn.style.pointerEvents = 'none';
    // //     }

    // //     if (mouseX > wrapperWidth - threshold) {
    // //         scrollRightBtn.style.opacity = 1;
    // //         scrollRightBtn.style.pointerEvents = 'auto';
    // //     } else {
    // //         scrollRightBtn.style.opacity = 0;
    // //         scrollRightBtn.style.pointerEvents = 'none';
    // //     }
    // // });

    // // // Event listeners for buttons
    // // scrollLeftBtn.addEventListener('mouseover', scrollLeft);
    // // scrollLeftBtn.addEventListener('mouseout', stopScroll);
    // // scrollRightBtn.addEventListener('mouseover', scrollRight);
    // // scrollRightBtn.addEventListener('mouseout', stopScroll);
    // function scrollToColumn(colIndex) {
    //     const table = document.getElementById("myTable");
    //     const cell = table.rows[1].cells[colIndex]; // Get the cell of the first data row in the specified column
    //     const tableContainer = document.querySelector(".table-container");

    //     // Calculate the position of the column
    //     const scrollPos = cell.offsetLeft;

    //     // Scroll the table container horizontally
    //     tableContainer.scroll({
    //         left: scrollPos,
    //         behavior: "smooth"
    //     });
    // }


    return (

        <div className="dashboard">
            <Header />
            {/* <div className="topnav">
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
        </div> */}
            <div className="main-content">

                <div className="page-content">
                    <div className="container-fluid">
                        <div className="breadcurmb">
                            <div className="title_block">
                                {/* <h5>Lookups</h5> */}
                            </div>
                            <div className="buttons">

                                <button className=" btn-primary" onClick={createClick}>Create</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-body">
                                        {/* <div>
                                            <button onclick={scrollToColumn(0)}>Scroll to Column 1</button>
                                            <button onclick={scrollToColumn(20)}>Scroll to Column 3</button>
                                            <button onclick={scrollToColumn(30)}>Scroll to Column 5</button>
                                        </div> */}
                                        <div className="table-container">
                                            <button className="scroll-left" onMouseOver={scrollLeft()} onMouseOut={stopScroll()}><span className="material-symbols-outlined">
                                                chevron_left
                                            </span></button>
                                            <div className="table-wrapper">
                                                <table className="table table-bordered" id="myTable">

                                                    <colgroup span="4"></colgroup>
                                                    <colgroup span="6"></colgroup>
                                                    <colgroup span="7"></colgroup>
                                                    <colgroup span="4"></colgroup>
                                                    <colgroup span="4"></colgroup>
                                                    <colgroup span="4"></colgroup>
                                                    <colgroup span="5"></colgroup>
                                                    <colgroup span="3"></colgroup>
                                                    <colgroup span="2"></colgroup>
                                                    <colgroup span="2"></colgroup>
                                                    <colgroup span="2"></colgroup>
                                                    <colgroup span="5"></colgroup>
                                                    <colgroup span="4"></colgroup>
                                                    <colgroup span="2"></colgroup>
                                                    <colgroup span="5"></colgroup>
                                                    <colgroup span="3"></colgroup>
                                                    <colgroup span="5"></colgroup>
                                                    <tr>
                                                        <th colspan="4" scope="colgroup">Customer Details</th>
                                                        <th colspan="6" scope="colgroup">Dealer Details</th>
                                                        <th colspan="7" scope="colgroup">Vehicle Details</th>
                                                        <th colspan="4" scope="colgroup">Exchange Details</th>
                                                        <th colspan="4" scope="colgroup">Corporate Details</th>
                                                        <th colspan="4" scope="colgroup">Consumer Details</th>
                                                        <th colspan="5" scope="colgroup">Spl Approval from Tata</th>
                                                        <th colspan="3" scope="colgroup">Accessories 18% Margin</th>
                                                        <th colspan="2" scope="colgroup">Extended Warranty</th>
                                                        <th colspan="2" scope="colgroup">A.M.C/P2P</th>
                                                        <th colspan="2" scope="colgroup">Fastag</th>
                                                        <th colspan="5" scope="colgroup">Finance Company</th>
                                                        <th colspan="4" scope="colgroup">Insurance Company</th>
                                                        <th colspan="2" scope="colgroup">Total dealer & Tml Share</th>
                                                        <th colspan="5" scope="colgroup">Income</th>
                                                        <th colspan="3" scope="colgroup">Net-Income</th>
                                                        <th colspan="5" scope="colgroup">Reciepts Details</th>
                                                    </tr>
                                                    <tr>
                                                        <th scope="col">Doct No</th>
                                                        <th scope="col">Exe. Name</th>
                                                        <th scope="col">Customer Name</th>
                                                        <th scope="col">Phone Number</th>

                                                        <th scope="col">Dealer Invoice date</th>
                                                        <th scope="col">Branch</th>
                                                        <th scope="col">Tml Invoice date</th>
                                                        <th scope="col">Commercial Invoice</th>
                                                        <th scope="col">No of days Stock in hand</th>
                                                        <th scope="col">Dealer Invoice number</th>

                                                        <th scope="col">LOB</th>
                                                        <th scope="col">PPL</th>
                                                        <th scope="col">Model</th>
                                                        <th scope="col">Chassis Number</th>
                                                        <th scope="col">Purchase Price</th>
                                                        <th scope="col">Sale Price</th>
                                                        <th scope="col">Dealer Margin</th>

                                                        <th scope="col">Exchange Offer</th>
                                                        <th scope="col">TML Share</th>
                                                        <th scope="col">Dealer Share</th>
                                                        <th scope="col">Not Pass</th>

                                                        <th scope="col">Corporate Offer</th>
                                                        <th scope="col">TML Share</th>
                                                        <th scope="col">Dealer Share</th>
                                                        <th scope="col">Not Pass</th>

                                                        <th scope="col">Consumer Offer</th>
                                                        <th scope="col">TML Share</th>
                                                        <th scope="col">Dealer Share</th>
                                                        <th scope="col">Not Pass</th>

                                                        <th scope="col">Offer</th>
                                                        <th scope="col">TML Share</th>
                                                        <th scope="col">Dealer Share</th>
                                                        <th scope="col">Not Pass</th>
                                                        <th scope="col">E of Supply</th>

                                                        <th scope="col">Accessories</th>
                                                        <th scope="col">FOC</th>
                                                        <th scope="col">NET</th>

                                                        <th scope="col">E.W</th>
                                                        <th scope="col">Incentive</th>

                                                        <th scope="col">AMC</th>
                                                        <th scope="col">Incentive</th>

                                                        <th scope="col">Fastag</th>
                                                        <th scope="col">Commission</th>

                                                        <th scope="col">Finance</th>
                                                        <th scope="col">Finance amount</th>
                                                        <th scope="col">IN/OUT</th>
                                                        <th scope="col">Dealer commission%</th>
                                                        <th scope="col">Payout</th>

                                                        <th scope="col">Insurance</th>
                                                        <th scope="col">Insurance amount</th>
                                                        <th scope="col">Sub total addition</th>
                                                        <th scope="col">Payout</th>

                                                        <th scope="col">Total TML Share</th>
                                                        <th scope="col">Total Dealer share</th>

                                                        <th scope="col">Total Income</th>
                                                        <th scope="col">Offer not passed to customer</th>
                                                        <th scope="col">Other income as for tally</th>
                                                        <th scope="col">Offers from dealer</th>
                                                        <th scope="col">Net income before tax</th>

                                                        <th scope="col">Tax</th>
                                                        <th scope="col">Net income with dealer margin</th>
                                                        <th scope="col">Remarks</th>

                                                        <th scope="col">Cash</th>
                                                        <th scope="col">Bank</th>
                                                        <th scope="col">D.O</th>
                                                        <th scope="col">Total</th>
                                                        <th scope="col">Balance</th>

                                                    </tr>

                                                    <tr>
                                                        <td>559</td>
                                                        <td>Tejaswani</td>
                                                        <td>METLA RAJYA LAKSHMI</td>
                                                        <td>9640133459</td>
                                                        <td>9-1-2021</td>
                                                        <td>RJY</td>
                                                        <td>9-1-2021</td>
                                                        <td>ISVRVS2122001013</td>
                                                        <td>5</td>
                                                        <td>ISVRVS2122001013</td>
                                                        <td>NA</td>
                                                        <td>NA</td>
                                                        <td>Harrier XZA+ Dark Edition</td>
                                                        <td>MAT631543MPH79247</td>
                                                        <td>12,048</td>
                                                        <td>13,048</td>
                                                        <td>1000</td>
                                                        <td>1000</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>N/A</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>N/A</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>2 years</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>50</td>
                                                        <td>50</td>
                                                        <td>50</td>
                                                        <td>Tata Capital</td>
                                                        <td>8000</td>
                                                        <td>50</td>
                                                        <td>60</td>
                                                        <td>70</td>
                                                        <td>50</td>
                                                        <td>60</td>
                                                        <td>9000</td>
                                                        <td>60</td>
                                                        <td>70</td>
                                                        <td>50</td>
                                                        <td>5000</td>
                                                        <td>8000</td>
                                                        <td>60</td>
                                                        <td>NA</td>
                                                        <td>6000</td>
                                                        <td>2000</td>
                                                        <td>1000</td>
                                                        <td>90000</td>
                                                        <td>1000</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>

                                                    </tr>
                                                    <tr>
                                                        <td>559</td>
                                                        <td>Tejaswani</td>
                                                        <td>METLA RAJYA LAKSHMI</td>
                                                        <td>9640133459</td>
                                                        <td>9-1-2021</td>
                                                        <td>RJY</td>
                                                        <td>9-1-2021</td>
                                                        <td>ISVRVS2122001013</td>
                                                        <td>5</td>
                                                        <td>ISVRVS2122001013</td>
                                                        <td>NA</td>
                                                        <td>NA</td>
                                                        <td>Harrier XZA+ Dark Edition</td>
                                                        <td>MAT631543MPH79247</td>
                                                        <td>12,048</td>
                                                        <td>13,048</td>
                                                        <td>1000</td>
                                                        <td>1000</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>N/A</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>N/A</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>2 years</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>50</td>
                                                        <td>50</td>
                                                        <td>50</td>
                                                        <td>Tata Capital</td>
                                                        <td>8000</td>
                                                        <td>50</td>
                                                        <td>60</td>
                                                        <td>70</td>
                                                        <td>50</td>
                                                        <td>60</td>
                                                        <td>9000</td>
                                                        <td>60</td>
                                                        <td>70</td>
                                                        <td>50</td>
                                                        <td>5000</td>
                                                        <td>8000</td>
                                                        <td>60</td>
                                                        <td>NA</td>
                                                        <td>6000</td>
                                                        <td>2000</td>
                                                        <td>1000</td>
                                                        <td>90000</td>
                                                        <td>1000</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>

                                                    </tr>
                                                    <tr>
                                                        <td>559</td>
                                                        <td>Tejaswani</td>
                                                        <td>METLA RAJYA LAKSHMI</td>
                                                        <td>9640133459</td>
                                                        <td>9-1-2021</td>
                                                        <td>RJY</td>
                                                        <td>9-1-2021</td>
                                                        <td>ISVRVS2122001013</td>
                                                        <td>5</td>
                                                        <td>ISVRVS2122001013</td>
                                                        <td>NA</td>
                                                        <td>NA</td>
                                                        <td>Harrier XZA+ Dark Edition</td>
                                                        <td>MAT631543MPH79247</td>
                                                        <td>12,048</td>
                                                        <td>13,048</td>
                                                        <td>1000</td>
                                                        <td>1000</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>N/A</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>N/A</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>2 years</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>50</td>
                                                        <td>50</td>
                                                        <td>50</td>
                                                        <td>Tata Capital</td>
                                                        <td>8000</td>
                                                        <td>50</td>
                                                        <td>60</td>
                                                        <td>70</td>
                                                        <td>50</td>
                                                        <td>60</td>
                                                        <td>9000</td>
                                                        <td>60</td>
                                                        <td>70</td>
                                                        <td>50</td>
                                                        <td>5000</td>
                                                        <td>8000</td>
                                                        <td>60</td>
                                                        <td>NA</td>
                                                        <td>6000</td>
                                                        <td>2000</td>
                                                        <td>1000</td>
                                                        <td>90000</td>
                                                        <td>1000</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>

                                                    </tr>
                                                    <tr>
                                                        <td>559</td>
                                                        <td>Tejaswani</td>
                                                        <td>METLA RAJYA LAKSHMI</td>
                                                        <td>9640133459</td>
                                                        <td>9-1-2021</td>
                                                        <td>RJY</td>
                                                        <td>9-1-2021</td>
                                                        <td>ISVRVS2122001013</td>
                                                        <td>5</td>
                                                        <td>ISVRVS2122001013</td>
                                                        <td>NA</td>
                                                        <td>NA</td>
                                                        <td>Harrier XZA+ Dark Edition</td>
                                                        <td>MAT631543MPH79247</td>
                                                        <td>12,048</td>
                                                        <td>13,048</td>
                                                        <td>1000</td>
                                                        <td>1000</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>N/A</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>N/A</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>2 years</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>50</td>
                                                        <td>50</td>
                                                        <td>50</td>
                                                        <td>Tata Capital</td>
                                                        <td>8000</td>
                                                        <td>50</td>
                                                        <td>60</td>
                                                        <td>70</td>
                                                        <td>50</td>
                                                        <td>60</td>
                                                        <td>9000</td>
                                                        <td>60</td>
                                                        <td>70</td>
                                                        <td>50</td>
                                                        <td>5000</td>
                                                        <td>8000</td>
                                                        <td>60</td>
                                                        <td>NA</td>
                                                        <td>6000</td>
                                                        <td>2000</td>
                                                        <td>1000</td>
                                                        <td>90000</td>
                                                        <td>1000</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>
                                                        <td>100</td>

                                                    </tr>
                                                </table>
                                            </div>
                                            <button className="scroll-right" onMouseOver={scrollRight()} onMouseOut={stopScroll()}><span className="material-symbols-outlined">
                                                    chevron_right
                                                    </span></button>
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

export default Dashboard;
