/***
**Module Name: profile
 **File Name :  profile.js
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
 **Description : contains profile page details.
 ***/
 import React, { useState, useEffect } from "react";
 import Header from "../components/header/Header";
 import Sidebar from ".././components/dashboard/sidebar";
 import axios from 'axios';
 import { useHistory } from "react-router-dom";
 import moment from "moment";
 
 let { lambda, appname } = window.app;
 
 const Company = () => {
     const history = useHistory();
     const [companyName, setCompanyName] = useState("");
     const [companyEmailId, setCompanyEmailId] = useState("");
     const [companyNumber, setCompanyNumber] = useState("");
     const [companyAddress, setCompanyAddress] = useState("");
     const [managerName, setManagerName] = useState("");
     const [managerEmail, setManagerEmail] = useState("");
     const [companyResult, setCompanyResult] = useState("");
     
     useEffect(() => {
         if (!localStorage.getItem("token")) {
             history.push("/");
         }
         if(localStorage.getItem("token")){
             getCompany();
         }
     }, []);
 
     const getCompany = () => {
         let userid = localStorage.getItem("userId") || localStorage.getItem("userid");
         const urlLink = `${lambda}/getCompany?appname=${appname}${userid ? "&userid=" + userid : ""}`;
         axios.get(urlLink).then(response => {
             if (response.data.result) {
                 setCompanyName(response.data.result[0]?.companyName || "");
                 setCompanyEmailId(response.data.result[0]?.companyEmailId || "");
                 setCompanyNumber(response.data.result[0]?.phoneNumber || "");
                 setCompanyAddress(response.data.result[0]?.companyAddress || "");
                 setCompanyResult(response.data.result[0]);
             }
         });
     };
 
     const handleUpdate = () => {
         let payload = {
             companyName,
             companyEmailId,
             phoneNumber: companyNumber,
             companyAddress,
             managerName,
             managerEmail
         };
         let urlLink = companyResult?.companyId
             ? `${lambda}/updateCompany?appname=${appname}&companyId=${companyResult.companyId}`
             : `${lambda}/addCompany?appname=${appname}`;
 
         axios.post(urlLink, payload).then(response => {
             if (response.data.statusCode === 200) {
                 localStorage.setItem("companyId", response.data.result.companyId);
                 history.push("./yellowForm");
             }
         });
     };
 
     return (
         <>
             <div id="layout-wrapper">
                 <div className="dashboard">
                     <Header />
                     <div className="main-content company">
                         <div className="page-content">
                             <div className="container-fluid">
                                 <div className="md-container">
                                     <div className="breadcurmb">
                                         <div className="title_block">
                                             <h5>Company</h5>
                                         </div>
                                         <div className="buttons">
                                             <button className="btn-primary" type="button" onClick={() => history.goBack()}>Back</button>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="md-container">
                                     <div className="card-block">
                                         <h3>Company Details</h3>
                                         <div className="form-floating mb-3">
                                             <input type="text" className="form-control" placeholder="Enter Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                             <label>Company Name</label>
                                         </div>
                                         <div className="form-floating mb-3">
                                             <input type="text" className="form-control" placeholder="Enter Company Email" value={companyEmailId} onChange={(e) => setCompanyEmailId(e.target.value)} />
                                             <label>Company Email Id</label>
                                         </div>
                                         <div className="form-floating mb-3">
                                             <input type="text" className="form-control" placeholder="Enter Company Phone Number" value={companyNumber} onChange={(e) => setCompanyNumber(e.target.value.replace(/\D/g, ""))} />
                                             <label>Company Phone Number</label>
                                         </div>
                                         <div className="form-floating mb-3">
                                             <input type="text" className="form-control" placeholder="Enter Company Address" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
                                             <label>Company Address</label>
                                         </div>
                                         <h3>Manager Details</h3>
                                         <div className="form-floating mb-3">
                                             <input type="text" className="form-control" placeholder="Enter Manager Name" value={managerName} onChange={(e) => setManagerName(e.target.value)} />
                                             <label>Manager Name</label>
                                         </div>
                                         <div className="form-floating mb-3">
                                             <input type="text" className="form-control" placeholder="Enter Manager Email Id" value={managerEmail} onChange={(e) => setManagerEmail(e.target.value)} />
                                             <label>Manager Email Id</label>
                                         </div>
                                         <button className="fill_btn" onClick={handleUpdate}>Update</button>
                                     </div>
                                 </div>
                             </div>
                         </div>
                         <footer className="footer">
                             <div className="container-fluid">
                                 <div className="row">
                                     <div className="col-sm-6">
                                         <p className="rights">2024 ALL RIGHTS RESERVED MOTOR SALES</p>
                                     </div>
                                 </div>
                             </div>
                         </footer>
                     </div>
                 </div>
             </div>
         </>
     );
 };
 
 export default Company;
 