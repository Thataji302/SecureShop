/***
**Module Name: add/edit client
 **File Name :  editclient.js
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
 **Description : contains add/edit client data.
 ***/
import React, { useState, useEffect ,useContext} from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import tmdbApi from "../../api/tmdbApi";
import SweetAlert from 'react-bootstrap-sweetalert';
import { useHistory, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { contentContext } from "../../context/contentContext";
import Loader from "../../components/loader";

import * as Config from "../../constants/Config";

import moment from "moment";
import SessionPopup from "../SessionPopup"
//  import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
let { lambda, country, appname } = window.app;

const ViewClient = () => {
    const history = useHistory();
    let { id } = useParams();
    const [nda, setNda] = useState(false);
    const [agreement, setAgreement] = useState(false);
    const [show, setShow] = useState(true);
    const [countries, setCountries] = useState('');

    const [error, setError] = useState("");
    const [add, setAdd] = useState(false);
    const [success, setSuccess] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [message, setMessage] = useState(false);
    const [valid, setValid] = useState(true);
    const [folowupcontent, setFollowupContent] = useState([]);
    const [account, setAccount] = useState([]);

    const [company, setCompany] = useState([]);
    const [companyValue, setCompanyValue] = useState({});
    const [editUser, setEditUser] = useState({ companyname: '', email: '' });
    const [companyId, setCompanyId] = useState("");
    const [companyDeatilsList, setCompanyDetailsList] = useState({});
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [invalidContent, setInvalidContent] = useState(false);

    const {route, setRoute,setCurrentPage,setRowsPerPage,usePrevious, setActiveMenuId,setActiveMenuObj,GetTimeActivity} = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if(prevRoute != undefined && prevRoute!=route){
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);
    // console.log('prevRoute--->',prevRoute)
    // console.log('currentRoute--->',route)

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("client")
        setActiveMenuId(300001)
        setActiveMenuObj({
            "Client Management": true,
            "Reports": false
        })
        if (id) {
            setAdd(false);
            getclient();
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
    const GetCountries = async () => {
        try {

            const response = await tmdbApi.getLookUp({
                "type": ["country"],
                "sortBy": "alpha3",
                "projection":"tiny"
            });
            setCountries(response.result.data);
            
        } catch {
            console.log("error");
        }
    };



    useEffect(() => {
        if (id) {
            getFollowup();
        }
    }, [updated]);


    const getclient = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/client?appname=' + appname + '&clientuserid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    if (response.data.result.length > 0) {
                const result = response.data.result[0];
                // const companyObject = {
                //     companyname: result?.companyname,
                //     companyid: result?.companyid
                // }
                setEditUser({ ...result });
                // if (result.companyid) {
                //     handleGetCompanyDetails(result.companyid)
                // }
                    }else{
                        setInvalidContent(true)
                    }
                }



            });
    }


    const onclickInvalid = () => {
        GetTimeActivity() 
        setInvalidContent(false)
        history.push('/clients')
    }



    const getFollowup = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/followup?appname=' + appname + '&clientid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                setFollowupContent(response.data.result.data);

                }
            });
    }




    const handleBack = () => {
        GetTimeActivity() 
        history.push({
            pathname: "/clients",
            state: { search: true }
          });
    }
    let k = editUser && editUser.idc && countries && countries.length>0 && countries.filter(eachItem=>eachItem.alpha3===editUser.idc)
    let Code = k&&k[0]&&k[0].countrycode != undefined ? (k&&k[0]&&k[0].countrycode).toString() : ""
    const idcValue = editUser && (editUser?.idc != "" && editUser?.idc != undefined ) ? editUser.idc +''+ Code : "select";
   
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
                    title={"Clients Not Found"}
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
                                            <h4 className="mb-2 card-title">VIEW CLIENT</h4>
                                            <p className="menu-path">Client Management / <b>View Client</b></p>
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
                                            <>
                                                {/* <li className="nav-item" role="presentation">
                                                 <a className="nav-link" data-bs-toggle="tab" href="#profile1" role="tab" aria-selected="false" tabIndex="-1">
                                                     <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                                                     <span className="d-none d-sm-block">DOCUMENTS</span>
                                                 </a>
                                             </li> */}
                                                <li className="nav-item" role="presentation">
                                                    <a className="nav-link" data-bs-toggle="tab" href="#messages1" role="tab" aria-selected="false" tabIndex="-1">
                                                        <span className="d-block d-sm-none"><i className="far fa-envelope"></i></span>
                                                        <span className="d-none d-sm-block">FOLLOW UP</span>
                                                    </a>
                                                </li></>
                                            : ""}


                                    </ul>
                                    <div className="tab-content p-3 text-muted">
                                        <div className="tab-pane active show" id="home1" role="tabpanel">
                                        {Object.keys(editUser).length > 0 && countries.length >0 ? 
                                            <>
                                            <div className="row">
                                                <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i> basic details</h5>
                                                <div className="col-md-6">
                                                    <div className="input-field">
                                                        <label className="col-form-label">NAME</label>
                                                        <input className="form-control" type="text" name="name" value={editUser.name} id="example-text-input" disabled />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="input-field">
                                                        <label className="col-form-label">EMAIL</label>

                                                        <input className="form-control contact-number" type="email" value={editUser.personalemail} id="example-email-input" disabled />

                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="input-field">
                                                        <label className="col-form-label">contact number</label>
                                                        <div className="country-code">
                                                            <input className="form-control phonenumber" style={{
                                                                width: "25%",
                                                                borderRadius: "5px 0px 0px 5px"}} type="email" value={idcValue} id="example-email-input" disabled />
                                                          

                                                            <input className="form-control numberfiled" type="tel" name="personalphone" value={editUser.personalphone} placeholder="Enter Phone Number" maxLength="10" id="example-tel-input" disabled />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="input-field">
                                                        <label className="col-form-label">Type</label>

                                                        <input className="form-control contact-number" type="email" value={editUser.type} id="example-email-input" disabled />

                                                        
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="input-field">
                                                        <label className="col-form-label">entity</label>

                                                        <input className="form-control contact-number" type="email" value={editUser.entity} id="example-email-input" disabled />


                                                    </div>
                                                </div>


                                                <div className="col-md-6">
                                                    <div className="input-field">
                                                        <label className="col-form-label">Company Name</label>


                                                        <input className="form-control" name="companyname" placeholder="Enter Company Name" type="text" value={editUser.companyname} id="example-text-input" disabled />


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
                                                        {editUser.termsAccptedOn &&
                                                            <div className="col-md-4">
                                                                <label className="col-form-label">Terms Accepted On</label>
                                                                <input className="form-control" placeholder="Enter Name" type="text" value={new Date(editUser.termsAccptedOn).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                    hour: 'numeric',
                                                                    minute: 'numeric',
                                                                })} id="example-text-input" disabled />
                                                            </div>
                                                        }
                                                        {editUser.approvedOn &&
                                                            <div className="col-md-4">
                                                                <label className="col-form-label">Approved On</label>
                                                                <input className="form-control" placeholder="Enter Name" type="text" value={new Date(editUser.approvedOn).toLocaleDateString('en-IN', {
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

                                                        <input className="form-control contact-number" type="email" value={editUser.status} id="example-email-input" disabled />

                                                       

                                                    </div>

                                                </div>




                                            </div>
                                            </>
                                            :  <div className="row"><Loader /></div>}
                                        </div>
                                        <div className="tab-pane" id="profile1" role="tabpanel">
                                            <div className="document-title">
                                                <label >documents</label>
                                                {/* <a href="" className="btn btn-primary mt-0">upload</a> */}
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
                                                              }):""}</p>
                                                                    <p className="comments">{item.followup}</p>
                                                                </div>
                                                            )
                                                        })}

                                                    </div>
                                                    :  <div div className="followups"><div className="no-documents">
                                                    <span className="material-icons-outlined">comment</span>
                                                    <p>No follow-ups were found</p>
                                                </div></div>}

                                            </div>
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

export default ViewClient;
