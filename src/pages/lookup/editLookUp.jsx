/***
**Module Name: edit user
 **File Name :  edituser.js
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
 **Description : contains edit user details.
 ***/
 import React, { useState, useEffect, useContext } from "react";
 import Footer from "../../components/dashboard/footer";
 import Header from "../../components/dashboard/header";
 import Sidebar from "../../components/dashboard/sidebar";
 import { useHistory, Link } from "react-router-dom";
 import { useParams } from 'react-router-dom'
 import moment from "moment";
 import Loader from "../../components/loader";
 import axios from 'axios';
 import * as Config from "../../constants/Config";
 import SweetAlert from 'react-bootstrap-sweetalert';
 import SessionPopup from "../SessionPopup"
 import { updateLookup, addLookup } from "../../utils/reducer";
 import { contentContext } from "../../context/contentContext";
 let { lambda, country, appname } = window.app;
 
 const EditLookUp = () => {
     let { id } = useParams();
     const history = useHistory();
     const [editlookup, setEditLookUp] = useState({});
     const [success, setSuccess] = useState(false);
     const [add, setAdd] = useState(false);
     const [types, setTypes] = useState([]);
     const [lookupErrors, setLookupErrors] = useState({});
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
     const [invalidContent, setInvalidContent] = useState(false);
 
 
     const { route, setRoute,setData, setCurrentPage, setRowsPerPage, usePrevious, userData, setActiveMenuId ,GetTimeActivity} = useContext(contentContext);
     useEffect(() => {
         GetLookUp();
     })
 
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
         const pageName = id != undefined ? path[path.length - 2] :path[path.length - 1];
         var presentTime = moment();
         let payload;
 
         payload = {
             "userid": localStorage.getItem("userId"),
             "pagename": 'EDITLOOKUP',
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
         if (prevRoute != undefined && prevRoute != route) {
             setCurrentPage(1)
             setRowsPerPage(15)
         }
     }, [route]);
     // console.log('currentRoute--->',route)
     const handleBack = (e) => {
         GetTimeActivity();
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
                 console.log("res", response)
                 if (response.data.result == "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
                     if (response.data.result.data.length > 0) {
                         let result = response.data.result.data[0];
                         setEditLookUp({ ...result });
                     } else {
                         setInvalidContent(true)
                     }
                 }
             });
     }
 
     const onclickInvalid = () => {
         setInvalidContent(false)
         history.push('/lookups')
     }
 
     const GetLookUp = async () => {
         GetTimeActivity();
         //  let payload = { type: [type] }
 
         // setIsLoading(true)
 
         const token = localStorage.getItem("token");
         const linkUrl = `${lambda}/lookups?appname=${appname}&token=${token}&userid=${localStorage.getItem("userId")}`;
 
         axios({
             method: 'POST',
             url: linkUrl,
             //data: payload,
         })
             .then(function (response) {
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    const colorData = response.data.result.data.filter((item) => item.type === "color")
                    setData(colorData);
                    const uniqueNames = [...new Set(response?.data?.result?.data?.map(item => item.type))];
 
                    setTypes(uniqueNames); // Update the state with unique names.
                    console.log("uniquenames------>",uniqueNames)
                 //    setIsLoading(false);
                    // setLookupSearch("");
 
                }
             });
     }
 
     const handleChange = (e, keyname) => {
         if (!!lookupErrors[keyname]) {
             let error = Object.assign({}, lookupErrors);
             delete error[keyname];
             setLookupErrors(error);
 
         }
         setEditLookUp({ ...editlookup, [e.target.name]: e.target.value });
     }
 
     const validate = (e) => {
         let formIsValid = true;
         let error = { ...lookupErrors };
         let mandatoryFileds = [{ name: 'Name', key: 'name' }, { name: 'Type', key: 'type' }, { name: 'Status', key: 'status' }]
         if (mandatoryFileds) {
             mandatoryFileds.forEach(function (item) {
 
                 if (
                     (editlookup[item.key]?.trim() === "" ||
                         editlookup[item.key] === undefined ||
                         editlookup[item.key] === "undefined")
                 ) {
                     error[item.key] = item.name + " is required";
                     formIsValid = false;
                 }
 
             });
         }
         console.log("errors", error);
         setLookupErrors(error)
         return formIsValid;
     }
 
     const handleSubmit = (e) => {
         GetTimeActivity();
         if (add === true) {
             const isValid = validate();
             if (isValid) {
                 handleSave();
             }
         } else {
             const isValid = validate();
             if (isValid) {
             handleUpdate();
             }
         }
     }
     const handleSave = (e) => {
         GetTimeActivity();
         let obj = { ...editlookup, createdBy: { userid: userData.userid, username: userData.name } }
         addLookup(obj).then((data) => {
             console.log("getClientcontent data", data);
             if (data.statusCode === 200) {
                 console.log(data.result, "---")
                 if (data.result === "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
                     setSuccess(true)
                 }
             }
         }).catch((error) => {
             console.log(error);
         })
 
     }
 
     const handleUpdate = (e) => {
         GetTimeActivity();
         updateLookup(id, editlookup).then((data) => {
             console.log("getClientcontent data", data);
             if (data.statusCode === 200) {
                 console.log(data.result, "---")
                 if (data.result === "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
                     setSuccess(true)
                 }
             }
         }).catch((error) => {
             console.log(error);
         })
 
   
 
     }
 
     function onConfirm() {
         if (add) {
             history.push("/lookups")
         } else {
             setSuccess(false);
         }
 
     };
 
 
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
                                                 <h4 className="mb-2 card-title">{add === true ? "ADD" : "EDIT"} lookups</h4>
                                                 <p className="menu-path">Lookups / <b>{add === true ? "Add" : "Edit"} Lookups</b></p>
                                             </div>
                                             <div>
                                                 <a onClick={handleBack} className="btn btn-primary">back</a>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
 
 
                                 <div className="create-user-block">
                                 {Object.keys(editlookup).length > 0 || add === true ? 
                                             <>   
                                     <div className="form-block">
                                         <div className="row">
                                             
                                             <div className="col-md-6">
                                                 <div className="col-md-12">
 
                                                     <div className="mb-3 input-field">
                                                         <label className="form-label form-label">NAME <span className="required">*</span></label>
                                                         <input id="email" name="name" type="text" placeholder="Name" className="form-control form-control" aria-invalid="false" value={editlookup.name} onChange={(e) => handleChange(e, "name")}  />
                                                         {lookupErrors.name && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{lookupErrors.name}</span>}
                                                     </div>
                                                 </div>
                                                 <div className="col-md-12">
                                                     <div className="mb-3 input-field">
                                                         <label className="form-label form-label">TYPE<span className="required">*</span></label>
                                                         {add === false ? <select name="type" className="colorselect capitalize form-control form-select" value={editlookup.type} onChange={(e) => handleChange(e, "type")} disabled >
                                                             <option value="">Select Type</option>
                                                             {types.map((type)=>{
                                                                 return(
                                                               <option key={type.id} value={type}>{type}</option>
                                                                 )
                                                             })}
                                                        
 
                                                         </select> : <select name="type" className="colorselect capitalize form-control form-select" value={editlookup.type} onChange={(e) => handleChange(e, "type")} >
                                                         <option value="">Select Type</option>
                                                         {types.map((type)=>{
                                                                 return(
                                                               <option key={type.id} value={type}>{type}</option>
                                                                 )
                                                             })}
                                                             
                                                         
 
                                                         </select>}
 
                                                         {lookupErrors.type && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{lookupErrors.type}</span>}
 
                                                     </div>
                                                 </div>
                                                 { editlookup.type === "subtitlelanguage" && <div className="col-md-12">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">language code<span className="required">*</span></label>
                                                             <input id="email" name="alpha2" placeholder="language code" type="text" className="form-control form-control" disabled aria-invalid="false" value={editlookup.languagecode}  />
                                                             
                                                         </div>
                                                     </div>}
                                                 {editlookup.type === "country" &&
                                                     <><div className="col-md-12">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">ALPAHA2</label>
                                                             <input id="email" name="alpha2" placeholder="Enter Alpha2" type="text" className="form-control form-control" aria-invalid="false" value={editlookup.alpha2} onChange={(e) => handleChange(e)} />
                                                             {lookupErrors.alpha2 && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{lookupErrors.alpha2}</span>}
                                                         </div>
                                                     </div><div className="col-md-12">
                                                             <div className="mb-3 input-field">
                                                                 <label className="form-label form-label">ALPAHA3</label>
                                                                 <input id="email" name="alpha3" placeholder="Enter Alpha3" type="text" className="form-control form-control" aria-invalid="false" value={editlookup.alpha3} onChange={(e) => handleChange(e)} />
                                                                 {lookupErrors.alpha3 && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{lookupErrors.alpha3}</span>}
                                                             </div>
                                                         </div>
                                                         <div className="col-md-12">
                                                             <div className="mb-3 input-field">
                                                                 <label className="form-label form-label">Country Code</label>
                                                                 <input id="email" name="countrycode" placeholder="Enter countrycode" type="text" className="form-control form-control" aria-invalid="false" value={editlookup.countrycode} onChange={(e) => handleChange(e)} />
 
                                                             </div>
                                                         </div>
                                                     </>
                                                 }
                                                 {editlookup.type === "resolution" &&
                                                     <div className="col-md-12">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">quality</label>
                                                             <select name="quality" className="colorselect capitalize form-control form-select" value={editlookup.quality} onChange={(e) => handleChange(e)}>
                                                                 <option value="">Select Quality</option>
                                                                 <option value="4K">4K</option>
                                                                 <option value="HD">HD</option>
 
                                                             </select>
                                                             {lookupErrors.quality && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{lookupErrors.quality}</span>}
 
                                                         </div>
                                                     </div>
                                                 }
 
                                                 <div className="col-md-12">
                                                     <div className="mb-3 input-field">
                                                         <label className="form-label form-label">status<span className="required">*</span></label>
                                                         {add === true ?
                                                             <select name="status" className="colorselect capitalize form-control form-select" value={editlookup.status} onChange={(e) => handleChange(e, "status")}>
 
                                                                 <option value="">Select status</option>
                                                                 <option value="ACTIVE">ACTIVE</option>
                                                                 <option value="INACTIVE">INACTIVE</option>
                                                             </select> :
                                                             <select name="status" className="colorselect capitalize form-control form-select" value={editlookup.status} onChange={(e) => handleChange(e, "status")}>
 
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
 
                                     <div className="row">
                                         <div className="col-md-12">
                                             {add === true ? <button className="btn btn-primary btn-block " type="submit" onClick={handleSubmit}>Save</button> :
                                                 <button className="btn btn-primary btn-block " type="submit" onClick={handleSubmit}>update</button>
                                             }
                                         </div>
                                     </div>
 
                                     </>
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
                         </div>
 
                         <SweetAlert show={success}
                             custom
                             confirmBtnText="ok"
                             confirmBtnBsStyle="primary"
                             title={add === true ? "Saved Successfully" : "Updated Successfully"}
                             onConfirm={e => onConfirm()}
                         >
                         </SweetAlert>
 
                         <Footer />
                     </div>
                 }
 
             </div>
 
         </>
     );
 };
 
 export default EditLookUp;