/***
**Module Name: add/edit company 
 **File Name :  updatecompany.js
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
 **Description : contains add or edit company details.
 ***/
import React, { useState, useEffect, useContext } from "react";
import Footer from "../../../components/dashboard/footer";
import Header from "../../../components/dashboard/header";
import Sidebar from "../../../components/dashboard/sidebar";
import SweetAlert from 'react-bootstrap-sweetalert';
import { useHistory, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import SessionPopup from "../../SessionPopup"
import axios from "axios";
import moment from "moment";
import Loader from "../../../components/loader";

import * as Config from "../../../constants/Config";
import tmdbApi from "../../../api/tmdbApi";
import { getListSubheaderUtilityClass } from "@mui/material";
import { contentContext } from "../../../context/contentContext";
let { lambda, country, appname } = window.app



const ViewCompany = () => {
    const history = useHistory();
    let { id } = useParams();
    const [nda, setNda] = useState(false);
    const [agreement, setAgreement] = useState(false);
    const [show, setShow] = useState(true);

    const [add, setAdd] = useState(false);
    const [countries, setCountries] = useState('');

    //  const [folowupcontent, setFollowupContent] = useState([]);
    const [user, setUser] = useState([]);
    const [account, setAccount] = useState([]);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [folowupcontent, setFollowupContent] = useState([]);
    const [editUser, setEditUser] = useState({ companyname: '', companytype: '', contenttype: '', address: '', region: '', city: '', country: '', zipcode: '', legalname: '', legalnumber: '', legalemail: '', accountname: '', accountemail: '', accountnumber: '', technicalname: '', technicalemail: '', technicalnumber: '', ctoname: '', ctoemail: '', ctonumber: '', ceoname: '', ceoemail: '', ceonumber: '', acquisitionsname: '', acquisitionsemail: '', acquisitionsnumber: '', syndicationname: '', syndicationemail: '', syndicationnumber: '', commission: '', commissiontype: '', accountmanager: '', status: 'INACTIVE', followup: '' });
    const [invalidContent, setInvalidContent] = useState(false);

    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, setActiveMenuId, setActiveMenuObj ,GetTimeActivity} = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);

    const GetCountries = async () => {
        try {
            console.log(tmdbApi);
            const response = await tmdbApi.getLookUp({
                "type": ["country"],
                 "sortBy": "alpha3",
                "projection":"tiny"
            });

            if (response.result.data == "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {
                setCountries(response.result.data);
            }
        } catch {
            console.log("error");
        }
    };
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("company")
        setActiveMenuId(300002)
        setActiveMenuObj({
            "Client Management": true,
            "Reports": false
        })
        if (id) {
            setAdd(false);
            getclient();
            getUsers();
            getFollowup();
        } else {
            setAdd(true);
        }
        GetCountries();
        userActivity();
    }, []);
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 2];
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
    const getUsers = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/companyUsers?appname=' + appname + '&companyid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setUser(response.data.result.data);
                }
            });
    }

    const getclient = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/company?appname=' + appname + '&companyid=' + id + "&token=" + token,
        })
            .then(function (response) {
           
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    if (response.data.result.length > 0) {
                        setEditUser(response.data.result[0]);
                        if (response.data.result[0].entity === "INDIVIDUAL") {
                            setShow(true);
                        }
                    } else {
                        setInvalidContent(true)
                    }
                }

            });
    }

    const onclickInvalid = () => {
        GetTimeActivity() 
        setInvalidContent(false)
        history.push('/company')
    }

    const getFollowup = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/followup?appname=' + appname + '&companyid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setFollowupContent(response.data.result.data);
                }


            });
    }


const countryCodeFun = (alphaValue)=>{
    let k =  countries && countries.length>0 && countries.filter(eachItem=>eachItem.alpha3===alphaValue)
    let Code = k&&k[0]&&k[0].countrycode != undefined ? (k&&k[0]&&k[0].countrycode).toString() : ""
    const idcValue = (alphaValue != "" && alphaValue != undefined ) ? alphaValue +''+ Code : "select";
    return idcValue
}




    const handleBack = () => {
        GetTimeActivity() 
        history.push({
            pathname: "/company",
            state: { search: true }
        });
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
                    title={"Company Not Found"}
                    onConfirm={e => onclickInvalid()}
                >
                </SweetAlert>
                {!invalidContent &&
                    <div className="main-content create-user edit-content add-client">

                        <div className="page-content ">
                            <div className="container-fluid">



                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">VIEW COMPANY</h4>
                                                <p className="menu-path">Company Management / <b>View Company</b></p>
                                            </div>
                                            <div>
                                                <a onClick={handleBack} className="btn btn-primary">back</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="create-user-block">

                                    <div className="form-block">
                                        <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link active" data-bs-toggle="tab" href="#home1" role="tab" aria-selected="true">
                                                    <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                    <span className="d-none d-sm-block">DETAILS</span>
                                                </a>
                                            </li>
                                            {add === false ?
                                                <><li className="nav-item" role="presentation">
                                                    <a className="nav-link" data-bs-toggle="tab" href="#profile1" role="tab" aria-selected="false" tabIndex="-1">
                                                        <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                                                        <span className="d-none d-sm-block">DOCUMENTS</span>
                                                    </a>
                                                </li>
                                                    <li className="nav-item" role="presentation">
                                                        <a className="nav-link" data-bs-toggle="tab" href="#messages1" role="tab" aria-selected="false" tabIndex="-1">
                                                            <span className="d-block d-sm-none"><i className="far fa-envelope"></i></span>
                                                            <span className="d-none d-sm-block">FOLLOW UP</span>
                                                        </a>
                                                    </li>
                                                    <li className="nav-item" role="presentation">
                                                        <a className="nav-link" data-bs-toggle="tab" href="#users" role="tab" aria-selected="false" tabIndex="-1">
                                                            <span className="d-block d-sm-none"><i className="far fa-envelope"></i></span>
                                                            <span className="d-none d-sm-block">USERS</span>
                                                        </a>
                                                    </li>
                                                </>
                                                : ""}


                                        </ul>
                                        <div className="tab-content p-3 text-muted">
                                            <div className="tab-pane active show" id="home1" role="tabpanel">
                                            {Object.keys(editUser).length > 0 && countries.length >0 ? 
                                                <>
                                                <div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>company</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Company Name</label>
                                                            <input className="form-control" type="text" name="companyname" value={editUser.companyname} disabled id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Company Email</label>

                                                            <input className="form-control" placeholder="Enter Company Email" type="text" name="emailid" value={editUser.emailid} id="example-text-input" disabled />



                                                        </div>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Company phone</label>
                                                            <div className="country-code">
                                                            <input className="form-control phonenumber" style={{
                                                                    width: "40%",
                                                                    borderRadius: "5px 0px 0px 5px"
                                                                }} type="email" value={countryCodeFun(editUser?.idc)} id="example-email-input" disabled />

                                                            
                                                             <input className="form-control numberfiled" type="tel" name="personalphone" value={editUser.phone} maxLength="10" id="example-tel-input" disabled />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Company type</label>
                                                            <input className="form-control" type="text" name="companyname" value={editUser.companytype} disabled id="example-text-input" />

                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">content type</label>
                                                            <input className="form-control" type="text" name="companyname" value={editUser.contenttype} disabled id="example-text-input" />

                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">address</label>
                                                            <input className="form-control contact-number" name="address" type="text" disabled value={editUser.address} id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">region</label>
                                                            <input className="form-control contact-number" name="region" type="text" disabled value={editUser.region} id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">city</label>
                                                            <input className="form-control contact-number" name="city" type="text" disabled value={editUser.city} id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">country</label>


                                                            <input className="form-control numberfiled" type="tel" name="personalphone" value={editUser.country} maxLength="10" id="example-tel-input" disabled />

                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">zipcode</label>
                                                            <input className="form-control contact-number" type="text" disabled name="zipcode" value={editUser.zipcode} id="example-email-input" />
                                                        </div>
                                                    </div>
                                                </div>



                                                <div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>legal contact</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">legal contact name</label>
                                                            <input className="form-control" type="text" name="legalname" disabled value={editUser.legalname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">legal contact email</label>
                                                            <input className="form-control contact-number" type="email" name="legalemail" disabled value={editUser.legalemail} id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">legal contact number</label>
                                                            <div className="country-code">
                                                                <input className="form-control phonenumber" style={{
                                                                    width: "40%",
                                                                    borderRadius: "5px 0px 0px 5px"
                                                                }} type="email" value={countryCodeFun(editUser?.legalcontactnumberidc)} id="example-email-input" disabled />


                                                                <input className="form-control numberfiled" type="tel" name="legalcontactnumber" value={editUser.legalcontactnumber} maxLength="10" id="example-tel-input" disabled />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Accounting Contact</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">account contact name</label>
                                                            <input className="form-control" type="text" name="accountname" disabled value={editUser.accountname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">account contact email</label>
                                                            <input className="form-control contact-number" type="email" name="accountemail" disabled value={editUser.accountemail} id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">account contact number</label>
                                                            <div className="country-code">

                                                                <input className="form-control phonenumber" style={{
                                                                    width: "40%",
                                                                    borderRadius: "5px 0px 0px 5px"
                                                                }} type="email" value={countryCodeFun(editUser?.accountcontactnumberidc)} id="example-email-input" disabled />


                                                                <input className="form-control numberfiled" type="tel" name="accountcontactnumber" value={editUser.accountcontactnumber} maxLength="10" id="example-tel-input" disabled />


                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Technical Contact</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">technical contact name</label>
                                                            <input className="form-control" type="text" name="technicalname" disabled value={editUser.technicalname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">technical contact email</label>
                                                            <input className="form-control contact-number" type="email" name="technicalemail" disabled value={editUser.technicalemail} id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">technical contact number</label>
                                                            <div className="country-code">

                                                                <input className="form-control phonenumber" style={{
                                                                    width: "40%",
                                                                    borderRadius: "5px 0px 0px 5px"
                                                                }} type="email" value={countryCodeFun(editUser?.technicalcontactnumberidc)} id="example-email-input" disabled />


                                                                <input className="form-control numberfiled" type="tel" name="technicalcontactnumber" value={editUser.technicalcontactnumber} maxLength="10" id="example-tel-input" disabled />

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>CTO</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">cto name</label>
                                                            <input className="form-control" type="text" name="ctoname" disabled value={editUser.ctoname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">cto email</label>
                                                            <input className="form-control contact-number" type="email" name="ctoemail" disabled value={editUser.ctoemail} id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">CTO Number</label>
                                                            <div className="country-code">



                                                                <input className="form-control phonenumber" style={{
                                                                    width: "40%",
                                                                    borderRadius: "5px 0px 0px 5px"
                                                                }} type="email" value={countryCodeFun(editUser?.ctonumberidc)} id="example-email-input" disabled />


                                                                <input className="form-control numberfiled" type="tel" name="ctonumber" value={editUser.ctonumber} maxLength="10" id="example-tel-input" disabled />

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>CEO</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">ceo name</label>
                                                            <input className="form-control" type="text" name="ceoname" disabled value={editUser.ceoname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">ceo email</label>
                                                            <input className="form-control contact-number" type="email" name="ceoemail" disabled value={editUser.ceoemail} id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">ceo number</label>
                                                            <div className="country-code">
                                                                <input className="form-control phonenumber" style={{
                                                                    width: "40%",
                                                                    borderRadius: "5px 0px 0px 5px"
                                                                }} type="email" value={countryCodeFun(editUser?.ceonumberidc)} id="example-email-input" disabled />


                                                                <input className="form-control numberfiled" type="tel" name="ceonumber" value={editUser.ceonumber} maxLength="10" id="example-tel-input" disabled />

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Head of Acquisitions</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Head of Acquisitions Name</label>
                                                            <input className="form-control" type="text" name="acquisitionsname" disabled value={editUser.acquisitionsname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Head of Acquisitions Emai</label>
                                                            <input className="form-control contact-number" type="email" name="acquisitionsemail" disabled value={editUser.acquisitionsemail} id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Head of Acquisitions Number</label>
                                                            <div className="country-code">

                                                                <input className="form-control phonenumber" style={{
                                                                    width: "40%",
                                                                    borderRadius: "5px 0px 0px 5px"
                                                                }} type="email" value={countryCodeFun(editUser?.acquisitionsnumberidc)} id="example-email-input" disabled />


                                                                <input className="form-control numberfiled" type="tel" name="acquisitionsnumber" value={editUser.acquisitionsnumber} maxLength="10" id="example-tel-input" disabled />



                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Head of Syndication</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Head of Syndication Name</label>
                                                            <input className="form-control" type="text" name="syndicationname" disabled value={editUser.syndicationname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Head of Syndication Email</label>
                                                            <input className="form-control contact-number" type="email" name="syndicationemail" disabled value={editUser.syndicationemail} id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Head of Syndication Number</label>
                                                            <div className="country-code">

                                                                <input className="form-control phonenumber" style={{
                                                                    width: "40%",
                                                                    borderRadius: "5px 0px 0px 5px"
                                                                }} type="email" value={countryCodeFun(editUser?.syndicationnumberidc)} id="example-email-input" disabled />


                                                                <input className="form-control numberfiled" type="tel" name="syndicationnumber" value={editUser.syndicationnumber} maxLength="10" id="example-tel-input" disabled />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Commission</h5>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="col-form-label">commission</label>
                                                            <input className="form-control contact-number" type="number" name="commission" disabled value={editUser.commission} id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="col-form-label">commission type</label>
                                                            <input className="form-control" type="text" name="commissiontype" disabled value={editUser.commissiontype} id="example-text-input" />

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row-separte">
                                                    <div className="row inner-separate">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Account Manager</h5>
                                                        <div className="col-md-12">
                                                            <div className="input-field">
                                                                <label className="col-form-label">account manager</label>
                                                                <input className="form-control" type="text" name="accountmanager" disabled value={editUser.accountmanager} id="example-text-input" />


                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row inner-separate">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Signed</h5>
                                                        <div className="col-md-12 switch-buttons-block">
                                                            <div className="input-field switch-buttons  pe-none d-flex align-items-center">
                                                                <label className="col-form-label">NDA</label>
                                                                <label className="switch disable"><input type="checkbox" className="disable pe-none" checked={editUser.signednda} disabled /><span className="slider round"></span></label>
                                                            </div>


                                                            <div className="input-field switch-buttons pe-none d-flex align-items-center">
                                                                <label className="col-form-label">Agreement</label>
                                                                <label className="switch disable"><input type="checkbox"  checked={editUser.agreement} className="disable pe-none" disabled /><span className="slider round"></span></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="row comment-section created">
                                                        {editUser.created &&
                                                            <div className="col-md-4">
                                                                <label className="col-form-label">Created On</label>
                                                                <input className="form-control" placeholder="Enter Name" type="text" value={new Date(editUser.created).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                    hour: 'numeric',
                                                                    minute: 'numeric',
                                                                })} id="example-text-input" disabled />
                                                            </div>
                                                        }
                                                        {editUser.activatedOn &&
                                                            <div className="col-md-4">
                                                                <label className="col-form-label">Actived On</label>
                                                                <input className="form-control" placeholder="Enter Name" type="text" value={new Date(editUser.activatedOn).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                    hour: 'numeric',
                                                                    minute: 'numeric',
                                                                })} id="example-text-input" disabled />
                                                            </div>
                                                        }

                                                    </div>

                                                <div className="row status">

                                                    <div className="col-md-3 justify-content-between ps-0">

                                                        <div className="input-field d-flex align-items-center">

                                                            <label className="col-form-label">Status</label>

                                                            <input className="form-control" type="text" name="status" disabled value={editUser.status} id="example-text-input" />



                                                        </div>

                                                    </div>

                                                    <div className="col-md-3 justify-content-between ps-0">
                                                    </div>


                                                </div>
                                                </>
                                                :  <div className="row"><Loader /></div>}
                                            </div>
                                            <div className="tab-pane" id="profile1" role="tabpanel">
                                               
                                                <div className="row mb-3 document-list">
                                                  
                                                    <div div className="followups"><div className="no-documents">
                                                        <span className="material-icons-outlined">description</span>
                                                        <p>No document has been found yet !</p>
                                                    </div></div>
                                                  
                                                </div>


                                            </div>
                                            <div className="tab-pane" id="messages1" role="tabpanel">
                                                <div className="mb-3 row">

                                                    {folowupcontent && folowupcontent.length > 0 ?
                                                        <div className="col-md-12">
                                                            <label >FOLLOW UP</label>
                                                            {folowupcontent && folowupcontent.length > 0 && folowupcontent.map(function (item, i) {

                                                                return (
                                                                    <div className="comments-block" key={i}>
                                                                        <p className="time">{item.created ? new Date(item.created).toLocaleDateString('en-IN', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric',
                                                                            hour: 'numeric',
                                                                            minute: 'numeric',
                                                                        }) : ""}</p>
                                                                        <p className="comments">{item.followup}</p>
                                                                    </div>
                                                                )
                                                            })}

                                                        </div> : <div div className="followups"><div className="no-documents">
                                                            <span className="material-icons-outlined">comment</span>
                                                            <p>No follow-ups were found</p>
                                                        </div></div>}



                                                </div>
                                            </div>
                                            <div className="tab-pane" id="users" role="tabpanel">
                                                {user && user.length > 0 ?
                                                    <table className="table align-middle table-nowrap table-check">
                                                        <thead className="table-light">
                                                            <tr>

                                                                <th className="align-middle">NAME</th>
                                                                <th className="align-middle">Email</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {user && user.length > 0 && user.map(function (item, i) {
                                                                return (
                                                                    <tr key={i}>
                                                                        <td>{item.name}</td>
                                                                        <td>{item.personalemail}</td>
                                                                    </tr>
                                                                )
                                                            })}

                                                        </tbody>

                                                    </table>
                                                    : <div div className="followups"><div className="no-documents">
                                                        <span className="material-icons-outlined"><span className="material-icons-outlined">people</span></span>
                                                        <p>No users were found</p>
                                                    </div></div>}
                                            </div>
                                        </div>

                                    </div>

                                </div>


                            </div>
                        </div>

                        <Footer />
                    </div>
                }



            </div>
        </>
    );
};

export default ViewCompany;
