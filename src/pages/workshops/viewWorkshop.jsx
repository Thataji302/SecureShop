/***
**Module Name: workshops
 **File Name :  workshops.js
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
 **Description : contains workshop details.
 ***/

import React, { useState, useEffect, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { contentContext } from "../../context/contentContext";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import SweetAlert from 'react-bootstrap-sweetalert';
import Loader from "../../components/loader";
import SessionPopup from "../SessionPopup";
import tmdbApi from "../../api/tmdbApi";
import moment from "moment";
let { lambda, appname } = window.app;



const ViewWorkShop = () => {
    let { id } = useParams();
    const history = useHistory();
    const [editUser, setEditUser] = useState({});
    const [invalidContent, setInvalidContent] = useState(false);
    const [countries, setCountries] = useState('');
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, userData, setActiveMenuId, GetTimeActivity } = useContext(contentContext);
    console.log("id", id);
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("workshops");
        // getManagers();
        setActiveMenuId(200008)
        if (id) {
            getuser();
        }
         GetCountries();
        userActivity();
    }, []);
    const getuser = (e) => {
        GetTimeActivity()

        axios.get(lambda + '/workshop?appname=' + appname + '&userId=' + localStorage.getItem('userId') + '&token=' + localStorage.getItem('token') + '&workshopid=' + id)
            .then(function (response) {
                //  console.log("response", response.data.result[0]);
                if (response?.data?.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                }
                else {
                    if (response.data.result.length > 0) {
                        setEditUser(response.data.result[0]);

                    } else {
                        setInvalidContent(true)
                    }
                }
                // getPermissions(response.data && response.data.result && response.data.result[0] && response.data.result[0].type)
            });
    }
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        // const pageName = id != undefined ? path[path.length - 2] : path[path.length - 1];;
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": "VIEWWORKSHOP",
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
    const handleBack = (e) => {
        GetTimeActivity()
        if (id) {
            history.push({
                pathname: "/workshops",
                state: { search: true }
            });
        } else {
            history.push("/workshops")
        }
    }
    const GetCountries = async () => {
        try {
            console.log(tmdbApi);
            const response = await tmdbApi.getLookUp({
                "type": ["country"],
                "sortBy": "alpha3",
                "projection": "tiny"
            });

            // console.log(response.result);
            if (response.result.data == "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {
                setCountries(response.result.data);
            }
        } catch {
            console.log("error");
        }
    };
    const onclickInvalid = () => {
        GetTimeActivity()
        setInvalidContent(false)
        history.push('/workshops')
    }

    return (

        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <SweetAlert show={invalidContent}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Workshop Not Found"}
                    onConfirm={e => onclickInvalid()}
                ></SweetAlert>
                {!invalidContent &&

                    <div className="main-content user-management create-user">
                        <div className="page-content">
                            <div className="container-fluid">
                            <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">

                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">VIEW WORKSHOP</h4>
                                                <p className="menu-path">WORKSHOPS / <b>View Workshop</b></p>
                                            </div>
                                            <div>
                                                <a onClick={handleBack} className="btn btn-primary">back</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="create-user-block">
                                    {Object.keys(editUser).length > 0 ?
                                        <div className="form-block">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label htmlFor="WorkShop Name">WorkShop Name</label>
                                                    <input id="titlename" name="name" type="text" className="form-control" placeholder="Enter Name" value={editUser && editUser.name} disabled />

                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="Phone Number">Phone Number</label>
                                                    <div >
                                                        {/* <select name="idc" value={editUser && editUser.idc} className="colorselect capitalize" disabled>
                                                            <option value="">Select</option>
                                                            {/* <option value="91">IND(+91)</option> */}
                                                          {/*   {countries && countries.length > 0 && countries.map((task, i) => {
                                                                return (
                                                                    <><option key={i} value={task.alpha3}>{task.alpha3 + task.countrycode}</option></>
                                                                )
                                                            }
                                                            )}
                                                        </select> */}

                                                        <input className="form-control contact-number" type="tel" name="phonenumber" value={editUser && editUser.phonenumber} placeholder="Enter Phone Number" maxLength="10" id="example-tel-input" disabled />
                                                        {/* <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{IdcError}</span>
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{phoneError}</span> */}
                                                    </div>
                                                </div>


                                            </div>
                                            <div className="row mt-4">
                                                <div className="col-md-6">

                                                    <label for="exampleFormControlTextarea1" name="departments" className="form-label" >Departments</label>
                                                    <input id="titlename" name="name" type="text" className="form-control" placeholder="Department" value={editUser && editUser.departments} disabled />

                                                    {/* <select className="form-select" name="departments" aria-label="Default select example" value={editUser && editUser.departments
                                                    } disabled>
                                                        <option selected>Select </option>
                                                        <option value="sewing">sewing</option>
                                                        <option value="cutting"> cutting</option>
                                                        <option value="supervisor">supervisor</option>

                                                    </select> */}

                                                </div>
                                                <div className="col-md-6">
                                                    <label for="exampleFormControlTextarea1" className="form-label">Status</label>
                                                    <select className="form-select" aria-label="Default select example" name="status" value={editUser && editUser.status} disabled>
                                                        <option selected>Select status</option>
                                                        <option value="INACTIVE">INACTIVE</option>
                                                        <option value="ACTIVE">ACTIVE</option>
                                                        <option value="ARCHIVE">ARCHIVE</option>

                                                    </select>

                                                    {/* <select className="colorselect capitalize form-control form-select" name="status" onChange={(e) => handleChange(e)} value={editUser && editUser.status}> */}
                                                    {/* <select className="colorselect capitalize form-control form-select" name="status" onChange={(e) => handleChange(e)} value={editUser && editUser.status}> */}
                                                </div>
                                            </div>


                                            {/* <button type="submit" className="btn btn-info rounded-pill px-4 mt-3" onClick={e => id == undefined ? handleAddUser(e) : handleUpdate(e)}>Create</button> */}



                                        </div>
                                        :

                                        <div className="form-block">
                                            <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active show" id="home1" role="tabpanel">
                                                    <Loader />
                                                </div>
                                            </div>
                                        </div>

                                    }
                                </div>

                            </div>
                        </div >
                    </div>
                }
            </div>
        </>

    );
}

export default ViewWorkShop;
