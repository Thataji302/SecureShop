/***
**Module Name: viewlookup
 **File Name :  viewlookup.js
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
 **Description : contains viewlookup u details.
 ***/
 import React, { useState, useEffect ,useContext} from "react";
 import Footer from "../../components/dashboard/footer";
 import Header from "../../components/dashboard/header";
 import Sidebar from "../../components/dashboard/sidebar";
 import { useHistory, Link } from "react-router-dom";
 import { useParams } from 'react-router-dom'
 import axios from 'axios';
 import moment from "moment";
import Loader from "../../components/loader";
 import * as Config from "../../constants/Config";
 import SweetAlert from 'react-bootstrap-sweetalert';
 import SessionPopup from "../SessionPopup"
 import { updateLookup, addLookup } from "../../utils/reducer";
 import { contentContext } from "../../context/contentContext";
 let { lambda, country, appname } = window.app;
 
 const ViewLookUp = () => {
     let { id } = useParams();
     const history = useHistory();
     const [editlookup, setEditLookUp] = useState({});
     const [success, setSuccess] = useState(false);
     const [add, setAdd] = useState(false);
     const [lookupErrors, setLookupErrors] = useState({});
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
     const [invalidContent, setInvalidContent] = useState(false);
 
 
 const {route, setRoute,setCurrentPage,setRowsPerPage,usePrevious, setActiveMenuId,GetTimeActivity} = useContext(contentContext);
 
 
     useEffect(() => {
         setRoute("lookup")
        setActiveMenuId(200009)
         if (!localStorage.getItem("token")) {
             history.push("/");
         }
         if (id) {
             setAdd(false);
             getLookupData();
 
         } else {
             setAdd(true);
         }
         userActivity();
     }, []);
   
     const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 2];
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": "VIEWLOOKUP",
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
         if(prevRoute != undefined && prevRoute!=route){
             setCurrentPage(1)
             setRowsPerPage(15)
         }
     }, [route]);
     // console.log('currentRoute--->',route)
     const handleBack = (e) => {
         if (add === false) {
             history.push({
                 pathname: "/lookups",
                 state: { search: true }
             });
         } else {
             history.push("/lookups")
         }
     }
     const getLookupData = (e) => {
         const token = localStorage.getItem("token")
         axios({
             method: 'POST',
             url: lambda + '/lookups?appname=' + appname + '&lookupcode=' + id + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
         })
             .then(function (response) {
                 console.log("res",response)
                 if (response.data.result === "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
                    if(response.data.result.data.length > 0){
                     let result = response.data.result.data[0];
                     setEditLookUp({ ...result });
                    }else{
                        setInvalidContent(true)
                    }
                 }
             });
     }
 
     const onclickInvalid = () => {
        setInvalidContent(false)
        history.push('/lookups')
    }
  
 


 
 
     console.log(editlookup)
 
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
                    title={"Lookups Not Found"}
                    onConfirm={e => onclickInvalid()}
                >
                </SweetAlert>
                {!invalidContent &&
                 <div className="main-content user-management create-user edit-lookups">
 
                     <div className="page-content ">
                         <div className="container-fluid">
 
                             <div className="row mb-4 breadcrumb">
                                 <div className="col-lg-12">
                                     <div className="d-flex align-items-center">
 
                                         <div className="flex-grow-1">
                                             <h4 className="mb-2 card-title">VIEW lookups</h4>
                                             <p className="menu-path">Lookups / <b>View Lookups</b></p>
                                         </div>
                                         <div>
                                             <a onClick={handleBack} className="btn btn-primary">back</a>
                                         </div>
                                     </div>
                                 </div>
                             </div>
 
 
                             <div className="create-user-block">
                             {Object.keys(editlookup).length > 0 ? 
                                            <>   
                                 <div className="form-block">
                                     <div className="row">
                                         <div className="col-md-6">
                                             <div className="col-md-12">
 
                                                 <div className="mb-3 input-field">
                                                     <label className="form-label form-label">NAME </label>
                                                     <input id="email" name="name" type="text" placeholder="Name" className="form-control form-control" aria-invalid="false" value={editlookup.name} disabled />
                                                    
                                                 </div>
                                             </div>
                                             <div className="col-md-12">
                                                 <div className="mb-3 input-field">
                                                     <label className="form-label form-label">TYPE</label>
                                                      <select name="type" className="colorselect capitalize form-control" value={editlookup.type} disabled >
                                                         <option value="">Select Type</option>
                                                         <option value="color">Color</option>
                                                             <option value="country">Country</option>
                                                             <option value="department">Department</option>
                                                             <option value="foamdensity">Foam Density</option>
                                                             <option value="language">Language</option>
                                                             <option value="state">State</option>
                                                             <option value="skritoptions">Skrit Options</option>
                                                             <option value="tiedownlocation">Tie Down Locations</option>
                                                             <option value="upgrades">Upgrades</option>
                                                     </select>
 
                                                    
 
                                                 </div>
                                             </div>
                                             { editlookup.type === "subtitlelanguage" && <div className="col-md-12">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">language code</label>
                                                            <input id="email" name="alpha2" placeholder="language code" type="text" className="form-control form-control" disabled aria-invalid="false" value={editlookup.languagecode}  />
                                                            
                                                        </div>
                                                    </div>}
                                             {editlookup.type === "country" &&
                                                 <><div className="col-md-12">
                                                     <div className="mb-3 input-field">
                                                         <label className="form-label form-label">ALPAHA2</label>
                                                         <input id="email" name="alpha2" placeholder="Enter Alpha2" type="text" className="form-control form-control" aria-invalid="false" value={editlookup.alpha2} disabled />
                                                       
                                                     </div>
                                                 </div><div className="col-md-12">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">ALPAHA3</label>
                                                             <input id="email" name="alpha3" placeholder="Enter Alpha3" type="text" className="form-control form-control" aria-invalid="false" value={editlookup.alpha3} disabled />
                                                            
                                                         </div>
                                                     </div>
                                                     <div className="col-md-12">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">Country Code</label>
                                                             <input id="email" name="countrycode" placeholder="Enter countrycode" type="text" className="form-control form-control" aria-invalid="false" value={editlookup.countrycode} disabled />
 
                                                         </div>
                                                     </div>
                                                 </>
                                             }
                                             {editlookup.type === "resolution" &&
                                                 <div className="col-md-12">
                                                     <div className="mb-3 input-field">
                                                         <label className="form-label form-label">quality</label>
                                                         <select name="quality" className="colorselect capitalize form-control" value={editlookup.quality} disabled>
                                                             <option value="">Select Quality</option>
                                                             <option value="4K">4K</option>
                                                             <option value="HD">HD</option>
 
                                                         </select>
                                                        
 
                                                     </div>
                                                 </div>
                                             }
 
                                             <div className="col-md-12">
                                                 <div className="mb-3 input-field">
                                                     <label className="form-label form-label">status</label>
                                                     {add === true ?
                                                         <select name="status" className="colorselect capitalize form-control" value={editlookup.status}  disabled>
 
                                                             <option value="">Select status</option>
                                                             <option value="ACTIVE">ACTIVE</option>
                                                             <option value="INACTIVE">INACTIVE</option>
                                                         </select> :
                                                         <select name="status" className="colorselect capitalize form-control" value={editlookup.status} disabled>
 
                                                             <option value="ACTIVE">ACTIVE</option>
                                                             <option value="INACTIVE">INACTIVE</option>
                                                         </select>
                                                     }
                                                     {lookupErrors.status && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{lookupErrors.status}</span>}
                                                 </div>
                                             </div>
                                         </div>
                                         <div className="col-md-6">
 
                                         </div>
 
                                     </div>
                                 </div>
                                 </>
                                        : 
                                      
                                        <div className="form-block">
                                            <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active show" id="home1" role="tabpanel">
                                                    <Loader />
                                                </div>
                                                </div>  </div>
                                       
                                                }
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
 
 export default ViewLookUp;
 