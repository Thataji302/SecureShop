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
 import React, { useState, useEffect ,useContext} from "react";
 import Footer from "../../components/dashboard/footer";
 import Header from "../../components/dashboard/header";
 import Sidebar from "../../components/dashboard/sidebar";
 import { useHistory, Link } from "react-router-dom";
 import SweetAlert from "react-bootstrap-sweetalert";
 import axios from "axios";
 import moment from "moment";
import Loader from "../../components/loader";
 import SessionPopup from "../SessionPopup"
 import ReactQuill from 'react-quill';
 import 'react-quill/dist/quill.snow.css';
 import { contentContext } from "../../context/contentContext";
 let { appname, lambda } = window.app;

 const ViewPrivacy = () => {
     const history = useHistory();
     const [value, setValue] = useState('');
     const [menuCode, setMenuCode] = useState(0);
     const [success, setSuccess] = useState(false);
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
     const {route, setRoute,setCurrentPage,setRowsPerPage,usePrevious, setActiveMenuId,GetTimeActivity} = useContext(contentContext);
 
     const prevRoute = usePrevious(route)
     useEffect(() => {
         if(prevRoute != undefined && prevRoute!=route){
             setCurrentPage(1)
             setRowsPerPage(15)
         }
     }, [prevRoute]);
     const handleBack = () => {
        GetTimeActivity()   
         history.push("/frontendsettings")
     }
 
 
     useEffect(() => {
        setRoute("frontend")
         setActiveMenuId(200007)
         handleMenu();
         userActivity();
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

     const handleMenu = () => {
        GetTimeActivity()   
         const token = localStorage.getItem("token")
         axios({
             method: 'GET',
             url: lambda + '/menus?appname=' + appname + '&menuid=100007&token=' + token,
         })
             .then(function (response) {
                 if (response.data.result) {
                     if (response.data.result == "Invalid token or Expired") {
                         setShowSessionPopupup(true)
                     } else {
                     setValue(response.data.result.data[0].content);
                     setMenuCode(response.data.result.data[0].menuid)
                     }
                 }
             });
 
     }
 
    
    
 
     console.log("value", value)
     return (
         <>
         {showSessionPopupup && <SessionPopup />}
             <div id="layout-wrapper">
                 <Header />
                 <Sidebar />
                 <div className="main-content create-user edit-content add-client lps">
 
                     <div className="page-content ">
                         <div className="container-fluid">
                             <div className="row mb-4 breadcrumb">
                                 <div className="col-lg-9">
                                     <div className="d-flex align-items-center">
                                         <div>
                                             <h4 className="mb-2 card-title">privacy settings</h4>
                                             <p className="menu-path">Front End Settings / <b>privacy settings</b></p>
                                         </div>
                                         
 
 
                                     </div>
                                 </div>
                                 <div className="col-lg-3 align-right">
                                     <button onClick={handleBack} className="btn btn-primary" type="button" >BACK</button>
                                 </div>
                             </div>
                             <div className="create-user-block mb_20">
                             {value.length > 0 ? 
                                            <>   
                                 <div className="form-block">
                                     <div>
                                         <ReactQuill theme="snow" readOnly value={value} onChange={setValue} />
                                        
                                     </div>
 
                                 </div>
                                 </>
                                        : 
                                      
                                        <div className="form-block">
                                            <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active show" id="home1" role="tabpanel">
                                                    <div className="row"><Loader />
                                                    </div>
                                                </div>
                                                </div>  </div>
                                       
                                                }
 
                             </div>
 
                             
 
                         </div>
                     </div>
 
 
                     <Footer />
                   
                 </div>
             </div>
         </>
     );
 };
 
 export default ViewPrivacy;
 