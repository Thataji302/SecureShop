/***
**Module Name: Company details
 **File Name :  Company.js
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
 **Description : contains compant tables details.
 ***/
 import React, { useState, useEffect,useContext } from "react";


 import Footer from "../../../components/dashboard/footer";
 import Header from "../../../components/dashboard/header";
 import Sidebar from "../../../components/dashboard/sidebar";
 import tmdbApi from "../../../api/tmdbApi";
 import { useHistory, Link } from "react-router-dom";
 import { useParams } from 'react-router-dom';
 import moment from "moment";
 import axios from 'axios';
 import { contentContext } from "../../../context/contentContext";
 let { lambda, appname } = window.app;
 
 
 
 const ViewTitleAnalysis = (props) => {
     const history = useHistory();
     const [TitleAnalysisData, setTitleAnalysisData] = useState("");
    
     const {route, setRoute,setCurrentPage,setRowsPerPage,usePrevious, setActiveMenuId,setActiveMenuObj,GetTimeActivity} = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if(prevRoute != undefined && prevRoute!=route){
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);

     useEffect(() => {
         if (!localStorage.getItem("token")) {
             history.push("/");
         }
         setRoute("titleanalysis")
         setActiveMenuId(300059)
         setActiveMenuObj({
             "Client Management": false,
             "Reports": true
         })
         setTitleAnalysisData(props.data)
     }, []);
 
 
    //  console.log("dataaaaaaaa--------->",TitleAnalysisData);
   
     const handleBack = (e) => {
        GetTimeActivity()   
        props.setClick(false);
     }
 
     return (
         <>
 
             <div id="layout-wrapper">
              
 
                 <div className="main-content user-management viwe-client-search view_email_logs">
 
                     <div className="page-content">
                         <div className="container-fluid">
 
 
 
                             <div className="row mb-4 breadcrumb">
                                 <div className="col-lg-12">
                                     <div className="d-flex align-items-center">
                                         <div className="flex-grow-1">
                                             <h4 className="mb-2 card-title">View TITLE ANALYSIS REPORT</h4>
                                             <p className="menu-path">Reports / <b>View TITLE ANALYSIS REPORT</b></p>
                                         </div>
                                         <div>
                                             <a onClick={handleBack} className="btn btn-primary">back</a>
                                         </div>
 
                                     </div>
                                 </div>
                             </div>
 
                           
                             <div className="row table-data">
                                 <div className="col-12">
                                     <div className="card">
                                         <div className="card-body">
                                         <div className="row mb-2">
                                                 <div className="col-sm-12">
                                                 <div className="d-flex align-items-center justify-content-center">
                                                 {/* <p className="menu-path">Client Name<b>{searchData.clientname}</b></p>
                                                 <p className="lg-badge badge">{type ? type : searchData.type}</p> */}
                                                 </div>
                                                 </div>
 
                                                 {/* <div className="col-sm-6">
                                                    
                                                 </div> */}
                                             </div>
 
                                                <div className="table-responsive">
                                                 <table className="table align-middle table-nowrap table-check">
                                                    
                                                     <tbody>
                                                     { TitleAnalysisData?.clientname &&     <tr>
                                                         <td className="align-middle">Client Name</td>
                                                             <td className="align-middle">{TitleAnalysisData && TitleAnalysisData.clientname}</td>
                                                             </tr>}
                                                             { TitleAnalysisData?.clientemailid &&                  <tr>
                                                         <td className="align-middle">Client Email</td>
                                                             <td className="align-middle">{TitleAnalysisData && TitleAnalysisData.clientemailid}</td>
                                                             </tr>}
                                                             {TitleAnalysisData && TitleAnalysisData.clientData && TitleAnalysisData.clientData[0] && TitleAnalysisData.clientData[0].name !== undefined  &&
                                                            <tr>
                                                                <td className="align-middle">Client Name</td>
                                                                <td className="align-middle">{TitleAnalysisData && TitleAnalysisData.clientData && TitleAnalysisData.clientData[0]&& TitleAnalysisData.clientData[0].name}</td>
                                                            </tr>}
                                                        {TitleAnalysisData && TitleAnalysisData.clientData && TitleAnalysisData.clientData[0]&& TitleAnalysisData.clientData[0].companyname && TitleAnalysisData.clientData[0].companyname[0]!== undefined &&
                                                            <tr>
                                                                 {/* row =>row && row.clientData &&  row.clientData[0] &&  row?.clientData[0]?.companyname &&  row?.clientData[0]?.companyname[0] ?  row?.clientData[0]?.companyname[0] : "" */}
                                                                <td className="align-middle">Company Name</td>
                                                                <td className="align-middle">{TitleAnalysisData && TitleAnalysisData.clientData && TitleAnalysisData.clientData[0]&& TitleAnalysisData.clientData[0].companyname && TitleAnalysisData.clientData[0].companyname[0]}</td>
                                                            </tr>
                                                        }
                                                       { TitleAnalysisData?.name &&               <tr>
                                                         <td className="align-middle">Recommend Person Name</td>
                                                             <td className="align-middle">{TitleAnalysisData && TitleAnalysisData.name}</td>
                                                             </tr>}
                                                         { TitleAnalysisData?.emailid &&             <tr>
                                                         <td className="align-middle">Recommend Person Email</td>
                                                             <td className="align-middle">{TitleAnalysisData && TitleAnalysisData.emailid}</td>
                                                             </tr>}
                                                          { TitleAnalysisData?.message &&            <tr>
                                                         <td className="align-middle">Message</td>
                                                             <td className="align-middle">{TitleAnalysisData && TitleAnalysisData.message}</td>
                                                             </tr>}
                                                         { TitleAnalysisData?.created &&             <tr>
                                                         <td className="align-middle">Recommended On</td>
                                                             <td className="align-middle">
                                                                 {new Date(TitleAnalysisData && moment(TitleAnalysisData.created)).toLocaleDateString('en-IN', {
                                                                     day: 'numeric',
                                                                     month: 'short',
                                                                     year: 'numeric',
                                                                     hour: 'numeric',
                                                                     minute: 'numeric',
                                                                 })}
                                                                
                                                                
                                                              </td> 
                                                              </tr>}
                                                       
 
                                                  
                                                     </tbody>
                                                     
                                                 </table>
                                             </div>
 
                                         </div>
                                     </div>
                                 </div>
                             </div>
 
                         </div>
                     </div>
 
 
 
                     
                 </div>
             </div>
         </>
     );
 };
 
 export default ViewTitleAnalysis;
 