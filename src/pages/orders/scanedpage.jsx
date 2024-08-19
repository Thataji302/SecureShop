/***
 **Module Name: editCategory
 **File Name :  editCategory.js
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
 **Description : contains editCategory details.
 ***/
import React, { useState,useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import tmdbApi from "../../api/tmdbApi";
import { useParams } from 'react-router-dom';
import { contentContext } from "../../context/contentContext";
import Loader from "../../components/loader";
import SessionPopup from "../SessionPopup";
import $ from "jquery";
import moment from "moment";
let { appname, lambda } = window.app;

const Item = () => {
    const history = useHistory();
    let { id } = useParams();
    let { orderstatus } = useParams();
    const [image, setImg] = useState("");
    const [item, setItem] = useState({});
    const [user, setUser] = useState({});
    const [showSessionPopupup, setShowSessionPopupup] = useState(false)
    const [isloading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(false);
    const [flag, setFlag] = useState(false);
    const [messagePage, setMessagePage] = useState(false);
    const { currentUrl,setCurrentUrl } = useContext(contentContext);
    useEffect(() => {

        if (window.site === undefined) {
            setTimeout(() => {
                if (window.site && window.site.common && window.site.common.resourcesUrl) {
                    setImg(window.site.common.resourcesUrl)
                }
            }, 1000);
        }
        if (window.site && window.site.common && window.site.common.resourcesUrl) {
            setImg(window.site.common.resourcesUrl)
        }

    }, [window.site]);

    useEffect(() => {
        console.log("token",localStorage.getItem("token"),localStorage.getItem("userId"))
        if ((localStorage.getItem("token")) && (localStorage.getItem("userId")) ) {
            GetUserData();
        } else {
            const currentUrl = history.location.pathname + history.location.search;
            console.log("currentUrl in scannedpage",currentUrl);
            setCurrentUrl(currentUrl)
            // history.push("/");
            setTimeout(() => {
                history.push("/");
            }, 1000); 
        }

    }, []);
    
    useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    // Disable back button
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

    const GetUserData = () => {
        localStorage.removeItem("redirectUrl")
        setIsLoading(true)
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userId")
        axios({
            method: 'GET',
            url: lambda + '/user?appname=' + appname + "&token=" + token + "&userid=" + userid,
        })
            .then(function (response) {
                console.log("resss", response);
                if (response.data.result == "Invalid token or Expired") {
                   
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                  //  signoutsession();
                  setIsLoading(false)
                    history.push("/");

                } else {
                    let result = response.data.result[0];
                    console.log("oooo", orderstatus, result.type)
                    if (orderstatus === "APPROVED" && (result.type === "CUTTING" || result.type === "ADMIN")) {
                        handleUpdateStatus("CUTTING COMPLETED");
                    } else if (orderstatus === "CUTTING COMPLETED" && (result.type === "SEWING" || result.type === "ADMIN")) {
                        handleUpdateStatus("SEWING COMPLETED");
                    }
                    else if (orderstatus === "SEWING COMPLETED" && (result.type === "DELIVERY" || result.type === "ADMIN")) {
                        handleUpdateStatus("DELIVERY STARTED")
                    } else if (orderstatus === "READY TO PICKUP" && (result.type === "DELIVERY" || result.type === "ADMIN")) {
                        handleUpdateStatus("DELIVERY COMPLETED")
                    } else {
                        setIsLoading(false)
                        setMessagePage("User Not Authorised")
                    }
                }


            });
    }

    // const signoutsession = async () => {

    //     try {
    //       const response = await tmdbApi.SignOutUser({ emailId: userData.emailid });
    //       console.log(response);
    
    //     } catch {
    //       console.log("error");
    //     }
    //   }


    // const getItem = (e) => {
    //     setIsLoading(true)
    //     const token = localStorage.getItem("token");
    //     const userid = localStorage.getItem("userId")
    //     axios({
    //         method: 'GET',
    //         url: lambda + '/order?appname=' + appname + '&orderid=' + id + "&token=" + token + "&userid=" + userid,
    //     })
    //         .then(function (response) {
    //             if (response.data.result == "Invalid token or Expired") {
    //                 setShowSessionPopupup(true)
    //             } else {
    //                 console.log("response", response)
    //                 const result = response.data.result[0];
    //                 if (response.data.result.length > 0) {
    //                     // console.log("result---------->", result)
    //                     setItem(result);

    //                     setIsLoading(false)

    //                 }

    //             }

    //         });

    // }


    const handleUpdateStatus = (status) => {
        setIsLoading(true)
      
        console.log("called");
        axios({
            method: 'post',
            url: lambda + "/scanorder?appname=" + appname + "&token=" + localStorage.getItem("token") + "&userid=" + localStorage.getItem("userId") + '&itemid=' + id + "&statusUpdate=" + status,

        })
            .then(function (response) {
                if (response) {
                    console.log("response.result", response)
                    if (response.data.result === "Unauthorised") {
                        setIsLoading(false)
                        setMessagePage("User Not Authorised")
                    }
                    else {
                        setStatus(status)
                        setFlag(true)
                        setIsLoading(false)  
                    }

                }

            });
    }





    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                {isloading ?
                    <Loader /> :
                    <main>
                        <div className="error-wrapper">
                            <h1> <span className="material-icons-outlined">
                                task_alt
                            </span></h1>
                            {messagePage && messagePage.length > 0
                                ? <h3>{messagePage}</h3> : flag && <h3>{status === "CUTTING STARTED" ? "Cutting" : status === "CUTTING COMPLETED" ? "Cutting" : status === "SEWING STARTED" ? "Sewing" : status === "SEWING COMPLETED" ? "Sewing" : status === "DELIVERY STARTED" ? "Delivery" : status === "DELIVERY COMPLETED" ? "Delivery" : null}  {(status === "CUTTING STARTED" || status === "SEWING STARTED" || status === "DELIVERY STARTED") ? "Started" : "Completed"}  Successfully</h3>
                            }
                            {/* <img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/error404.svg" className="error-img" /> */}

                        </div>
                    </main>
                    // :

                    // <div className="container create-user edit-content add-client edit-category view_item scan_page">

                    //     <div className="page-content ">
                    //         <div className="container-fluid">



                    //             <div className="row mb-4 breadcrumb">
                    //                 <div className="col-lg-12">
                    //                     <div className="d-flex align-items-center">
                    //                         <div className="flex-grow-1">

                    //                         </div>

                    //                     </div>
                    //                 </div>
                    //             </div>
                    //             <div className="create-user-block content_edit block_buyer">
                    //                 <div className="row">
                    //                     <div className="col-md-12 pe-1">
                    //                         <div className="form-block">
                    //                             <div className="left_block">
                    //                                 <div className="order_specification access-denied order_spe_print">
                    //                                     <div className="modal-body enquiry-form">
                    //                                         <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/logo-dark.png" />
                    //                                         <div className="details_block">
                    //                                             <div className="block_left">
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">delaler</label>
                    //                                                     <p>{item.wholesalername}</p>
                    //                                                 </div>
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Size</label>
                    //                                                     <p>{item?.productspecification?.dimensionA + "’" + " " + item?.productspecification?.dimensionA + "”"}</p>
                    //                                                 </div>

                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Color</label>
                    //                                                     <p>{item?.productspecification?.covercolor}</p>
                    //                                                 </div>
                    //                                             </div>
                    //                                             <div className="block_right">
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Radius</label>
                    //                                                     <p>{item?.productspecification?.radius}</p>
                    //                                                 </div>
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Quantity</label>
                    //                                                     <p>{item?.productspecification?.quantity}</p>
                    //                                                 </div>
                    //                                             </div>
                    //                                         </div>
                    //                                         <div className="details_block tie_downs">
                    //                                             <div className="block_left">
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Plastic<br /># of tie downs</label>
                    //                                                     <p>2</p>
                    //                                                 </div>
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Connector</label>
                    //                                                     <p>2</p>
                    //                                                 </div>
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Velcro</label>
                    //                                                     <p>2</p>
                    //                                                 </div>
                    //                                             </div>
                    //                                             <div className="block_right">
                    //                                                 <div className="input-field">
                    //                                                     <h6>{item?.productspecification?.tiedownloaction}</h6>
                    //                                                 </div>
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Cut Flap</label>
                    //                                                     <p>12</p>
                    //                                                 </div>
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Flaps</label>
                    //                                                     <p>12</p>
                    //                                                 </div>
                    //                                             </div>
                    //                                         </div>
                    //                                         <div className="details_block connected">
                    //                                             <div className="block_left">
                    //                                                 <div className="input-field">
                    //                                                     <h6>{item?.productspecification?.skirtoption}</h6>
                    //                                                 </div>
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Tie Downs</label>
                    //                                                     <p>{item?.productspecification?.coverskritlength}</p>
                    //                                                 </div>
                    //                                             </div>
                    //                                             <div className="block_right">
                    //                                                 <div className="input-field">
                    //                                                     <h6>Connected / Seperate</h6>
                    //                                                 </div>
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Cut T/D</label>
                    //                                                     <p>{parseInt(item?.productspecification?.coverskritlength) * 2 + 1}</p>
                    //                                                 </div>
                    //                                             </div>
                    //                                         </div>
                    //                                         <div className="details_block foam_density">
                    //                                             <h6>Foam Density</h6>
                    //                                             <div className="dbl">
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Dbl</label>
                    //                                                     <p>2#</p>
                    //                                                 </div>
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Plastic</label>
                    //                                                     <p>5”- 2.5”</p>
                    //                                                 </div>
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">Webbing</label>
                    //                                                     <p>4-5-4</p>
                    //                                                 </div>
                    //                                                 <div className="input-field">
                    //                                                     <label className="form-label form-label">6”- 4”</label>
                    //                                                     <p>12</p>
                    //                                                 </div>
                    //                                             </div>
                    //                                         </div>
                    //                                         <div className="qr_block">
                    //                                             <img src="https://spacovers.imgix.net/spacoversdev/admin/theme/images/qr-code.png" className="qrImg" id="qrImg" />
                    //                                         </div>
                    //                                         <div className="details_block customer_location">
                    //                                             <div className="input-field">
                    //                                                 <label className="form-label form-label">Customer / Location</label>
                    //                                                 <p>{item && item?.deliveryaddress && (item?.deliveryaddress?.address1 + "," + item.deliveryaddress.address2 + "," + item.deliveryaddress.state + "," + item.deliveryaddress.pincode)}</p>
                    //                                             </div>
                    //                                             <div className="input-field">
                    //                                                 <label className="form-label form-label">Date</label>
                    //                                                 <p>{moment(item?.created).format('MMM-DD-YYYY')}</p>
                    //                                             </div>
                    //                                         </div>
                    //                                         <div className="">
                    //                                             {item.status === "APPROVED" && (userData.type === "CUTTING" || userData.type === "ADMIN") ?
                    //                                                 <button className="btn btn_fill" onClick={(e) => handleUpdate(e, "CUTTINGSTARTED")}>start cutting </button> :
                    //                                                 item.status === "CUTTINGSTARTED" && (userData.type === "CUTTING" || userData.type === "ADMIN") ?
                    //                                                     <button className="btn btn_fill" onClick={(e) => handleUpdate(e, "CUTTINGCOMPLETED")}>complete cutting </button>
                    //                                                     : item.status === "CUTTINGCOMPLETED" && (userData.type === "SEWING" || userData.type === "ADMIN") ?
                    //                                                         <button className="btn btn_fill" onClick={(e) => handleUpdate(e, "SEWINGSTARTED")}>start sewing </button>
                    //                                                         : item.status === "SEWINGSTARTED" && (userData.type === "SEWING" || userData.type === "ADMIN") ?
                    //                                                             <button className="btn btn_fill" onClick={(e) => handleUpdate(e, "SEWINGCOMPLETED")}>Complete Sewing </button>
                    //                                                             : item.status === "SEWINGCOMPLETED" && (userData.type === "ADMIN" || userData.type === "DELIVERY") ?
                    //                                                                 <button className="btn btn_fill" onClick={(e) => handleUpdate(e, "DELIVERYSTARTED")}>Start Delivery </button>
                    //                                                                 : item.status === "DELIVERYSTARTED" && (userData.type === "ADMIN" || userData.type === "DELIVERY") ?
                    //                                                                     <button className="btn btn_fill" onClick={(e) => handleUpdate(e, "DELIVERYCOMPLETED")}>Complete Delivery </button>
                    //                                                                     : null
                    //                                             }
                    //                                         </div>

                    //                                     </div>
                    //                                 </div>
                    //                             </div>
                    //                         </div>

                    //                     </div>


                    //                 </div>




                    //             </div>


                    //         </div>
                    //     </div>
                    // </div>
                }
                {/* <Modal className="access-denied" show={show}>

                    <div className="modal-body enquiry-form">
                        <div className="container">
                            <button className="close-btn" onClick={e => onCancel()}><span className="material-icons">close</span></button>
                            <span className="material-icons-outlined access-denied-icon">
                                task_alt
                            </span>
                            {/* <h3>Delete</h3> */}
                {/* <p>This action cannot be undone.</p>
                            <p>Do you want  {status === "CUTTINGSTARTED" || status === "SEWINGSTARTED" || status === "DELIVERYSTARTED" ? "Start" : "Complete"}  {status === "CUTTINGSTARTED" ? "Cutting" : status === "CUTTINGCOMPLETED" ? "Cutting" : status === "SEWINGSTARTED" ? "Sewing" : status === "SEWINGCOMPLETED" ? "Sewing" : null}</p>
                            <div className="popup-footer">
                                <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => handleUpdateStatus()}>{BtnLoader ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}Yes</button>
                            </div>
                        </div>
                    </div> */}

                {/* </Modal> */}
            </div>
        </>
    );
};

export default Item;
