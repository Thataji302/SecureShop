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
 import React, { useState, useEffect,useContext } from "react";
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
 
 const ViewAboutus = () => {
     const history = useHistory();
     const [value, setValue] = useState('');
     const [menuCode, setMenuCode] = useState(0);
     const [success, setSuccess] = useState(false);
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
     const [sec1, setSec1] = useState({});
     const [sec2, setSec2] = useState({});
     const [sec3, setSec3] = useState({});
     const handleBack = () => {
         history.push("/frontendsettings")
     }
 
     const {route, setRoute,setCurrentPage,setRowsPerPage,usePrevious, setActiveMenuId,GetTimeActivity} = useContext(contentContext);
 
     const prevRoute = usePrevious(route)
     useEffect(() => {
         if(prevRoute != undefined && prevRoute!=route){
             setCurrentPage(1)
             setRowsPerPage(15)
         }
     }, [prevRoute]);
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
             url: lambda + '/menus?appname=' + appname + '&menuid=100002&token=' + token,
         })
             .then(function (response) {
                 if (response.data.result) {
                     if (response.data.result == "Invalid token or Expired") {
                         setShowSessionPopupup(true)
                     } else {
                         setValue(response.data.result.data[0].team);
                         setMenuCode(response.data.result.data[0].menuid)
                         setSec1(response.data.result.data[0].team[0])
                         setSec2(response.data.result.data[0].team[1])
                         setSec3(response.data.result.data[0].team[2])
                     }
                 }
             });
 
     }
 
   
 
    
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
                                             <h4 className="mb-2 card-title">ABOUT US</h4>
                                             <p className="menu-path">Front End Settings / <b>About us</b></p>
                                         </div>
                                        
 
 
                                     </div>
                                 </div>
                                 <div className="col-lg-3 align-right">
                                     <button onClick={handleBack} className="btn btn-primary" type="button" >BACK</button>
                                 </div>
                             </div>
                             <div className="create-user-block mb_20">
                             {Object.keys(sec1).length > 0 ? 
                                            <>     
                                 <div className="form-block">
                                     <div className="row abt-section-1">
                                         <div className="col-md-8 col-sm-12 col-xs-12">
                                             <div className="row">
                                                 <div className="col-md-6 col-sm-12 col-xs-12">
                                                     <div className="input-field">
                                                         <label className="col-form-label">Title 1</label>
                                                         <input className="form-control" placeholder="Enter Name"  type="text" name="title" value={sec1.title} id="example-text-input" disabled />
                                                     </div>
                                                 </div>
                                                 <div className="col-md-6 col-sm-12 col-xs-12">
                                                     <div className="input-field">
                                                         <label className="col-form-label">Title 2</label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="subtitle" id="example-text-input"  value={sec1.subtitle} disabled/>
                                                     </div>
                                                 </div>
                                                 <div className="col-md-12 col-sm-12 col-xs-12">
                                                     <div className="input-field">
                                                         <label className="col-form-label">Description</label>
                                                         <textarea className="form-control" name="description" rows="4" cols="50"  value={sec1.description} disabled>
                                                            
                                                         </textarea>
                                                     </div>
                                                 </div>
                                             </div>
 
 
                                         </div>
                                         <div className="col-md-4 col-sm-12 col-xs-12 align-right" id="about">
                                             <img src="https://orasimedia.imgix.net/orasi/client/resources/orasiv1/images/about/about.png?auto=compress,format&amp;width=706" className="about-img" />
                                         </div>
                                     </div>
                                     <div className="row abt-section-1">
                                         <div className="col-md-8 col-sm-12 col-xs-12">
                                             <div className="row">
                                                 <div className="col-md-6 col-sm-12 col-xs-12">
                                                     <div className="input-field">
                                                         <label className="col-form-label">Title</label>
                                                         <input className="form-control" placeholder="Enter Name"  type="text" name="title" id="example-text-input"  value={sec2.title} disabled/>
                                                     </div>
                                                 </div>
                                                 <div className="col-md-6 col-sm-12 col-xs-12">
                                                     <div className="input-field">
                                                         <label className="col-form-label">Sub Title</label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="subtitle" id="example-text-input"  value={sec2.subtitle} disabled/>
                                                     </div>
                                                 </div>
                                                 <div className="col-md-12 col-sm-12 col-xs-12">
                                                     <div className="input-field">
                                                         <label className="col-form-label">Description</label>
                                                         <textarea className="form-control" name="description" rows="4" cols="50"  value={sec2.description} disabled>
                                                            
                                                         </textarea>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                         <div className="col-md-1 col-sm-12 col-xs-12"></div>
                                         <div className="col-md-3 col-sm-12 col-xs-12">
                                             <div className="row">
                                                 <div className="col-md-12 col-sm-12 col-xs-12">
                                                     <div className="input-field">
                                                         <label className="col-form-label">Linear
                                                             Channels</label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="linearChannels" id="example-text-input"
                                                         value={sec2.linearChannels} disabled/>
                                                     </div>
                                                 </div>
                                                 <div className="col-md-12 col-sm-12 col-xs-12">
                                                     <div className="input-field">
                                                         <label className="col-form-label">International
                                                             VOD Content</label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="internationalVODContent" id="example-text-input" value={sec2.internationalVODContent} disabled/>
                                                     </div>
                                                 </div>
                                                 <div className="col-md-12 col-sm-12 col-xs-12">
                                                     <div className="input-field">
                                                         <label className="col-form-label">Media
                                                             Categories</label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="mediaCategories" id="example-text-input"  value={sec2.mediaCategories}  disabled/>
                                                     </div>
                                                 </div>
                                             </div>
 
 
 
                                         </div>
                                     </div>
                                     <div className="row abt-section-1">
                                         <div className="col-md-12 col-sm-12 col-xs-12">
                                             <div className="row">
                                                 <div className="col-md-12 col-sm-12 col-xs-12">
                                                     <div className="input-field">
                                                         <label className="col-form-label">Title</label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="title" value={sec3.title} disabled/>
                                                     </div>
                                                 </div>
 
                                                 <div className="col-md-12 col-sm-12 col-xs-12">
                                                     <div className="input-field">
                                                         <label className="col-form-label">Description</label>
                                                         <textarea className="form-control" name="description" rows="2" cols="20"   value={sec3.description} disabled> 
                                                            
                                                         </textarea>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
 
                                         <div className="col-md-12 col-sm-12 col-xs-12">
                                             <div className="row">
                                                 <div className="col-md-4 col-sm-12 col-xs-12">
                                                     <div className="input-field solution">
                                                         <label className="col-form-label"><img src="https://orasimedia.imgix.net/orasi/client/resources/orasiv1/images/about/playlist.png?auto=compress,format&width=422.663" className="icon" /></label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="block1" id="example-text-input"  value={sec3.block1} disabled/>
                                                     </div>
                                                 </div>
                                                 <div className="col-md-4 col-sm-12 col-xs-12">
                                                     <div className="input-field solution">
                                                         <label className="col-form-label"><img src="https://orasimedia.imgix.net/orasi/client/resources/orasiv1/images/about/showcase.png?auto=compress,format&width422.663" className="icon" /></label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="block2" id="example-text-input"  value={sec3.block2} disabled />
                                                     </div>
                                                 </div>
                                                 <div className="col-md-4 col-sm-12 col-xs-12">
                                                     <div className="input-field solution">
                                                         <label className="col-form-label"><img src="https://orasimedia.imgix.net/orasi/client/resources/orasiv1/images/about/sales.png?auto=compress,format&width422.663" className="icon" /></label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="block3" id="example-text-input"  value={sec3.block3} disabled/>
                                                     </div>
                                                 </div>
                                                 <div className="col-md-4 col-sm-12 col-xs-12">
                                                     <div className="input-field solution">
                                                         <label className="col-form-label"><img src="https://orasimedia.imgix.net/orasi/client/resources/orasiv1/images/about/multiscreen.png?auto=compress,format&width422.663" className="icon" /></label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="block4" id="example-text-input"  value={sec3.block4} disabled />
                                                     </div>
                                                 </div>
                                                 <div className="col-md-4 col-sm-12 col-xs-12">
                                                     <div className="input-field solution">
                                                         <label className="col-form-label"><img src="https://orasimedia.imgix.net/orasi/client/resources/orasiv1/images/about/monetization.png?auto=compress,format&width422.663" className="icon" /></label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="block5" id="example-text-input" value={sec3.block5} disabled />
                                                     </div>
                                                 </div>
                                                 <div className="col-md-4 col-sm-12 col-xs-12">
                                                     <div className="input-field solution">
                                                         <label className="col-form-label"><img src="https://orasimedia.imgix.net/orasi/client/resources/orasiv1/images/about/rights.png?auto=compress,format&width422.663" className="icon" /></label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="block6" id="example-text-input"  value={sec3.block6} disabled />
                                                     </div>
                                                 </div>
                                                 <div className="col-md-4 col-sm-12 col-xs-12">
                                                     <div className="input-field solution">
                                                         <label className="col-form-label"><img src="https://orasimedia.imgix.net/orasi/client/resources/orasiv1/images/about/smartsearch.png?auto=compress,format&width422.663" className="icon" /></label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="block7" id="example-text-input" value={sec3.block7} disabled/>
                                                     </div>
                                                 </div>
                                                 <div className="col-md-4 col-sm-12 col-xs-12">
                                                     <div className="input-field solution">
                                                         <label className="col-form-label"><img src="https://orasimedia.imgix.net/orasi/client/resources/orasiv1/images/about/intell.png?auto=compress,format&width422.663" className="icon" /></label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="block8" id="example-text-input" value={sec3.block8} disabled/>
                                                     </div>
                                                 </div>
                                                 <div className="col-md-4 col-sm-12 col-xs-12">
                                                     <div className="input-field solution">
                                                         <label className="col-form-label"><img src="https://orasimedia.imgix.net/orasi/client/resources/orasiv1/images/about/mediamanagement.png?auto=compress,format&width422.663" className="icon" /></label>
                                                         <input className="form-control" placeholder="Enter Name" type="text" name="block9" id="example-text-input"  value={sec3.block9} disabled/>
                                                     </div>
                                                 </div>
                                             </div>
 
 
 
                                         </div>
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
 
 export default ViewAboutus;
 