/***
 **Module Name: BlockBuyer
 **File Name :  BlockBuyer.js
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
 **Description : contains BlockBuyer details.
 ***/
import React, { useState, useEffect, useContext } from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import { useHistory, Link } from "react-router-dom";
import { contentContext } from "../../context/contentContext";

import moment from "moment";
import axios from 'axios';
let { lambda, country, appname } = window.app;

const FrontendSettings = () => {
    const history = useHistory();

    const { userData, setSelectedOptions, setMultiSelectFields, setActiveFieldsObj, setSelectedOptionsClientName, setSearchPayload, route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, setActiveMenuId ,GetTimeActivity} = useContext(contentContext);


    useEffect(() => {
        setRoute("frontend")
        setActiveMenuId(200007)
        userActivity();
        setSelectedOptions([])
        setMultiSelectFields({ dubbinglanguages: [], typeofrights: [], countryorigin: [], languages: [], typeofrights: [], genre: [], videoquality: [], certificate: [], subtitleslanguages: [], territoriesavailable: [], sport: [], musicgenre: [] })
        setActiveFieldsObj({ CookingshowActive: false, seriesActive: false, SportsActive: false, LiveEventActive: false, MusicActive: false })
        setSelectedOptionsClientName([])
        setSearchPayload({})
    }, []);

    
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 1];
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": pageName,
            "pageurl": window.location.href,
            "starttime": presentTime,
            "useragent": JSON.parse(localStorage.getItem("loc"))

        };


   const previousId = localStorage.getItem("previousid");
const urlLink = lambda + '/useractivity?appname=' + appname + (previousId ? "&previousid=" + previousId : "");


        axios({
            method: 'POST',
            url: urlLink,
            data: payload
        })
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    localStorage.setItem("previousid", response.data.result)
                }
            });
    }


    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [route]);

    const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Frontend Settings")
    const subValDashboard = validateObj && validateObj[0] && validateObj[0].dashboard
   
    const handleClickMenu = (e, item) => {
        GetTimeActivity()   
        console.log("item", item)

        let id = item.menuname.split(" ").join("").toLowerCase()
        console.log("id", id)
        if (item.edit == true) {
            history.push("/" + id);
        }
    }
    const handleViewClickMenu = (e, item) => {
        GetTimeActivity()   
        let id = item.menuname.split(" ").join("").toLowerCase()
        console.log("id", id)
        if (id === "terms") {
            history.push("/" + "view" + id);
        }
        if (id === "privacypolicy") {
            history.push("/" + "view" + id);
        }
        if (id === "team") {
            history.push("/" + "view" + id);
        }
        if (id === "aboutus") {
            history.push("/" + "view" + id);
        }
        if (id === "advancedsearch") {
            history.push("/" + "view" + id);
        }
        if (id === "landingpage") {
            history.push("/" + "view" + id);
        }
    }
    const handleLandingPage = () => {
        history.push("/landingpage")
    }
    const handleAdvanceSearch = () => {
        history.push("/advancedsearch")
    }

    const handlePrivacy = () => {
        history.push("/privacy")
    }
    const handleTerms = () => {
        history.push("/terms")
    }
    return (
        <>
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <div className="main-content create-user edit-content add-client">

                    <div className="page-content ">
                        <div className="container-fluid">



                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center">
                                        <h4 className="mb-2 card-title">FRONTEND SETTINGS</h4>
                                        {/* <button className="btn btn-primary ml-25" type="button" >ADD PAGES</button> */}

                                    </div>
                                </div>
                            </div>
                            <div className="create-user-block">

                                <div className="form-block">

                                    <div className="frontend_settings">
                                        {subValDashboard && Object.keys(subValDashboard).map((eachItem) => {
                                            let eachValue = subValDashboard[eachItem]
                                            console.log('eachiivalues', eachValue)
                                            return (
                                                <div className="page_item" key={eachValue.submenuid}>
                                                    <h2>{eachValue.menuname}</h2>
                                                    <div className="d-flex">
                                                        <a onClick={(e) => handleViewClickMenu(e, eachValue)} className="text-danger action-button"><i className="mdi mdi-eye font-size-18"></i>View</a>
                                                        {eachValue && eachValue.display === true &&
                                                            <a onClick={(e) => handleClickMenu(e, eachValue)} className={`${eachValue && eachValue.enable === false ? 'pe-none' : ''} text-danger action-button`}><i className="mdi mdi-cog-outline font-size-18"></i>Manage</a>}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {/* <div className="page_item">
                                            <h2>LANDING PAGE</h2>
                                            <a onClick={handleLandingPage} className="text-success action-button"><i className="mdi mdi-cog-outline font-size-18"></i>EDIT</a>
                                        </div>
                                        <div className="page_item">
                                            <h2>ADVANCED SEARCH </h2>
                                            <a onClick={handleAdvanceSearch} className="text-success action-button"><i className="mdi mdi-cog-outline font-size-18"></i>EDIT</a>
                                        </div>
                                        <div className="page_item">
                                            <h2>ABOUT US</h2>
                                            <a href="javascript:void(0);" className="text-success action-button"><i className="mdi mdi-cog-outline font-size-18"></i>EDIT</a>
                                        </div>
                                        <div className="page_item">
                                            <h2>TEAM</h2>
                                            <a href="javascript:void(0);" className="text-success action-button"><i className="mdi mdi-cog-outline font-size-18"></i>EDIT</a>
                                        </div>
                                        <div className="page_item">
                                            <h2>PRIVACY POLICY</h2>
                                            <a onClick={handlePrivacy} className="text-success action-button"><i className="mdi mdi-cog-outline font-size-18"></i>EDIT</a>
                                        </div>
                                        <div className="page_item">
                                            <h2>TERMS</h2>
                                            <a onClick={handleTerms} className="text-success action-button"><i className="mdi mdi-cog-outline font-size-18"></i>EDIT</a>
                                        </div> */}
                                    </div>

                                </div>

                            </div>


                        </div>
                    </div>


                    <Footer />
                </div>
            </div>
        </>
    );
};

export default FrontendSettings;
