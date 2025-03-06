/***
**Module Name: app Config
 **File Name :  app Config.js
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
 **Description : contains app config details.
 ***/
import React, { useState, useRef, useEffect } from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import tmdbApi from "../../api/tmdbApi";
import { useHistory, Link } from "react-router-dom";
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import Loader from "../../components/loader";
import { JsonEditor } from 'jsoneditor-react';
import SessionPopup from "../SessionPopup"
import 'jsoneditor-react/es/editor.min.css';
let { lambda, appname } = window.app;



const AppConfig = () => {
    let { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [jsonData, setJsonData] = useState(null);
    const editorRef = useRef(null);

    const [serviceconfig, setServiceConfig] = useState(null);
    const serviceRef = useRef(null);

    const [success, setSuccess] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);


    useEffect(() => {
        if (id === "appconfig") {
            fetch(lambda + '/config?appname=' + appname)
                .then(response => response.json())

                .then(data => setJsonData(data.result[0]))
                .catch(error => console.error(error));
        } else {
            fetch(lambda + '/serviceConfig?appname=' + appname)
                .then(response => response.json())
                .then(data => setServiceConfig(data.result.data[0]))
                .catch(error => console.error(error));
        }

    }, [id]);


    useEffect(() => {
        // Update JSONEditor when state variable changes
        if (serviceRef.current && serviceconfig) {
            serviceRef.current.jsonEditor.set(serviceconfig);
        }
    }, [serviceconfig]);

    useEffect(() => {
        // Update JSONEditor when state variable changes
        if (editorRef.current && jsonData) {
            editorRef.current.jsonEditor.set(jsonData);
        }
    }, [jsonData]);


    const handleChange = (newData) => {
        setJsonData(newData);
    };

    const handleChangeService = (newData) => {
        setServiceConfig(newData);
    };


    const handleUpdateApp = () => {
        delete jsonData['_id'];
        const token = localStorage.getItem("token")
        axios({
            method: 'PUT',
            url: lambda + '/appConfig?appname=' + appname + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
            data: jsonData,
        })
            .then(function (response) {
                if (response.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setSuccess(true)
                }

            });
    };


    const handleUpdateService = () => {
        const token = localStorage.getItem("token")
        delete serviceconfig['_id'];
        axios({
            method: 'PUT',
            url: lambda + '/serviceConfig?appname=' + appname + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
            data: serviceconfig,
        })
            .then(function (response) {
                if (response.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setSuccess(true)
                }

            });
    };

    function onConfirm() {
        setSuccess(false);
    };
    // console.log("serviceconfig", serviceconfig);



    return (
        <>
{showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                {isLoading ?
                    <Loader />
                    :
                    <div className="main-content user-management lookups">

                        <div className="page-content">
                            <div className="container-fluid">



                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">

                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">{id === "appconfig" ? "APP CONFIG" : "SERIVCE CONFIG"}</h4>

                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="row table-data">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-body">

                                                {id === "appconfig" ?
                                                    <JsonEditor
                                                        ref={editorRef}
                                                        mode="tree"
                                                        // value={jsonData}
                                                        onChange={handleChange}
                                                    /> : id === "serviceconfig" ?
                                                        <JsonEditor
                                                            ref={serviceRef}
                                                            mode="tree"
                                                            // value={jsonData}
                                                            onChange={handleChangeService}
                                                        /> : null
                                                }



                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-md-12">
                                        {id === "appconfig" ?
                                            <button className="btn btn-primary btn-block " type="submit"
                                                onClick={e => handleUpdateApp(e)}
                                            >update</button> :

                                            <button className="btn btn-primary btn-block " type="submit"
                                                onClick={e => handleUpdateService(e)}
                                            >update</button>
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>

                        <Footer />
                        <SweetAlert show={success}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Updated successfully"}
                            onConfirm={e => onConfirm()}
                        >
                        </SweetAlert>
                    </div>

                }
            </div>
        </>


    );
};

export default AppConfig;
