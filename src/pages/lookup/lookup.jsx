
/***
**Module Name: lookup
 **File Name :  lookup.js
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
 **Description : contains lookup table details.
 ***/
 import React, { useState, useEffect, useContext } from "react";


 import Footer from "../../components/dashboard/footer";
 import Header from "../../components/dashboard/header";
 import Sidebar from "../../components/dashboard/sidebar";
 import tmdbApi from "../../api/tmdbApi";
 import moment from "moment";
 import Modal from 'react-bootstrap/Modal';
 import { useHistory, Link, useLocation } from "react-router-dom";
 import axios from 'axios';
 import SweetAlert from 'react-bootstrap-sweetalert';
 import * as Config from "../../constants/Config";
 import TableLoader from "../../components/tableLoader";
 import { contentContext } from "../../context/contentContext";
 import SessionPopup from "../SessionPopup"
 import { updateLookup, addLookup } from "../../utils/reducer";
 import DataTable from 'react-data-table-component';
 import Loader from "../../components/loader";

 
 let { lambda, appname } = window.app;
 
 
 
 const LookUp = () => {
     const history = useHistory();
     const { state } = useLocation();
     const { search } = state || {};
     const [lookup, setLookUp] = useState("");
     const [activeBtn, setActiveBtn] = useState("color")
     const [activeButton, setActiveButton] = useState("grid");
 
     // const [data, setData] = useState([]);
 
     const [dummy, setDummy] = useState([]);
     const [types, setTypes] = useState([]);
     const [visibleItems, setVisibleItems] = useState(20);
     const [removeLoad, setRemoveLoad] = useState(false)
     // const [lookUpType, setlookUpType] = useState("");
     const [success, setSuccess] = useState(false);
     const [num, setNum] = useState();
 
     const [addPopup, setAddPopup] = useState(false);
     const [btnLoader, setBtnLoader] = useState(false)
     const [flag, setFlag] = useState(false);
     // const [isLoading, setIsLoading] = useState(false);
 
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
     const [editlookup, setEditLookUp] = useState({});
     const [lookupErrors, setLookupErrors] = useState({});
     const [lookupId, setLookupId] = useState("");
     const [add, setAdd] = useState(false);
     const [existmsg, setExistMsg] = useState(false);
     const [lookupsearch, setLookupSearch] = useState("");
     const [totallookup, setTotalLookup] = useState(0);
     // const [route, setRoute] = useState("lookup");
 
     let count = 0;
 
     const { searchedFlag, setSearchedFlag, isLoading, setIsLoading, userData, sortTableAlpha, arrow, setSelectedOptions, data, setData, rowsPerPage, setRowsPerPage, currentPageNew, setCurrentPage, lookUpType, setlookUpType, route, setRoute, usePrevious, sortedColumn, setSortedColumn, sortDirection, setSortDirection, setActiveMenuId, GetTimeActivity } = useContext(contentContext);
 
 
 
 
 
     const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Lookups")
     const subValDashboard = validateObj && validateObj[0] && validateObj[0].dashboard
 
 
 
     const prevRoute = usePrevious(route)
     
     useEffect(() => {
         if (prevRoute != undefined && prevRoute != route) {
             setCurrentPage(1)
             setRowsPerPage(15)
             setLookupSearch("")
             setSearchedFlag(false)
         }
     }, [prevRoute]);
     useEffect(() => {
         if (rowsPerPage != undefined) {
             handlePerRowsChange(rowsPerPage)
         }
     }, [rowsPerPage]);
 
     const handlePageChange = (page) => {
         setCurrentPage(page);
     };
 
     const handlePerRowsChange = (newPerPage) => {
         setRowsPerPage(newPerPage);
     };
 
     const columns = [
 
         {
             name: 'Name',
             selector: row => row?.name ?? "",
             sortable: true,
         },
         {
             name: 'Type',
             selector: row => row?.type ?? "",
             sortable: true,
         },
         {
             name: 'Status',
             // cell: (props) => <img src={props.image} width={60} alt='Image' />,
             selector: row => row?.status ?? "",
             sortable: true,
 
         },
 
         {
             name: <>{(subValDashboard && subValDashboard.view && subValDashboard.view.display === true) || (subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true) ? 'Actions' : null}</>,
             // cell: (props) => <button onClick={(e) => handleButtonClick(e, props)}>Action</button>,
             cell: (props) =>
                 // {
                 subValDashboard && subValDashboard.view && subValDashboard.edit && (subValDashboard.view.display === true || subValDashboard.edit.display === true) &&
 
                 <div className="d-flex">
                     {subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
 
                         <a onClick={e => handleViewLookup(e, props.lookupcode)} className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}><i className="mdi mdi-eye font-size-18"></i></a>}
                     {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true &&
                         <a onClick={e => handleEditLookup(e, props.lookupcode)} className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`}><i className="mdi mdi-pencil font-size-18"></i></a>
 
                     }
                 </div>
             // }
             ,
             ignoreRowClick: true,
             allowOverflow: true,
             button: true,
         },
     ];
 
 
     useEffect(() => {
         setRoute("lookup")
         setActiveMenuId(200005)
         if (!localStorage.getItem("token")) {
             history.push("/");
         }
 
         //  GetLookUp();
         setSelectedOptions([])
         userActivity()
     }, []);
 
     useEffect(() => {
 
             GetLookUp();
    
     }, []);
 
     const userActivity = () => {
         let path = window.location.pathname.split("/");
         const pageName = path[path.length - 1];
         var presentTime = moment();
         let payload;
 
         payload = {
             "userid": localStorage.getItem("userId"),
             "pagename": 'LOOKUP',
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
 
     const GetLookUp = async () => {
         GetTimeActivity();
         //  let payload = { type: [type] }
 
         setIsLoading(true)
 
         const token = localStorage.getItem("token");
         const linkUrl = `${lambda}/lookups?appname=${appname}&token=${token}&userid=${localStorage.getItem("userId")}`;
 
         axios({
             method: 'POST',
             url: linkUrl,
             //data: payload,
         })
             .then(function (response) {
                 if (response?.data?.result === "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
                     const colorData = response.data.result.data.filter((item) => item.type === "color")
                     setData(colorData);

                     const uniqueNames = [...new Set(response?.data?.result?.data?.map(item => item.type))];
                     const sortedArray = [...uniqueNames].sort((a, b) => a?.localeCompare(b))
                      console.log("sortedArray",sortedArray);
                     setTypes(sortedArray); // Update the state with unique names.
                     setIsLoading(false);
                     // setLookupSearch("");
 
                 }
             });
     }
     const GetLookUp2 = async (item) => {
         GetTimeActivity();
         setIsLoading(true)
         let payload = item === "all-type" || item === "" ? {} : { type: [item] }
         const token = localStorage.getItem("token");
         const userId = localStorage.getItem("userId");
        // const searchParam = lookupsearch ? `&search=${lookupsearch}` : "";
         const linkUrl = `${lambda}/lookups?appname=${appname}${lookupsearch}&token=${token}&userid=${userId}`;
 
         axios({
             method: 'POST',
             url: linkUrl,
             data:payload
         })
             .then(function (response) {
                 if (response?.data?.result === "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
                    let result = response.data.result.data
                     setData(response.data.result.data);
                     setTotalLookup(result.length)
                     setIsLoading(false)
                     setLookupSearch("");
                 }
             });
     }
 
     const handleLookUpType = async (e) => {
         GetTimeActivity()
         setlookUpType(e.target.value);
         const value = e.target.value
         setCurrentPage(1)
         setRowsPerPage(15)
         GetLookUp2(value)
 
     }
 
 
 
     const handleSearch = (e, flagggg) => {
         GetTimeActivity();
         setIsLoading(true);
         if (flagggg === "click") {
            setSearchedFlag(true);
        }
         if (lookupsearch.trim()===""||lookupsearch.length <= 0) {
            setData([])
            setIsLoading(false);
         } else {
            
             const token = localStorage.getItem("token")
             setIsLoading(true)
            
             axios.post(lambda + '/lookups?appname=' + appname + "&search=" + lookupsearch + "&token=" + token + "&userid=" + localStorage.getItem("userId"), {
                 
             })
                 .then(function (response) {


                     if (response?.data?.result === "Invalid token or Expired") {
                         setShowSessionPopupup(true)
                     } else {
                         if (activeBtn === 'color') {
                             setActiveBtn("");
                         }
                         setData(response.data.result.data);
                         setLookUp(response.data.result);
                         setIsLoading(false)
                     }
                 });
         }
     };
 
     const handleChangeSearch = (e) => {
         GetTimeActivity()
         setLookupSearch(e.target.value);
     }
 
     const handleAddLookUp = (e) => {
         setEditLookUp({...editlookup , type:activeBtn})
         setAdd(true);
         GetTimeActivity();
         setAddPopup(true);
         //history.push("/addlookup");
     }
     const handleEditLookup = (e, id) => {
         setAdd(false);
         setAddPopup(true);
         setLookupId(id)
         GetTimeActivity();
 
         const token = localStorage.getItem("token")
         axios({
             method: 'POST',
             url: lambda + '/lookups?appname=' + appname + '&lookupcode=' + id + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
         })
             .then(function (response) {
                 console.log("res", response)
                 if (response?.data?.result === "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
                     if (response.data.result.data.length > 0) {
                         let result = response.data.result.data[0];
                         setEditLookUp({ ...result });
 
                     }
                 }
             });
 
 
 
         // history.push("/editlookup/" + id);
     }
 
     const handleInactive = (e, id, status) => {
         setIsLoading(true)
         GetTimeActivity();
         let obj;
         if (status === "active") {
             obj = {
                 status: "ACTIVE"
             }
         } else {
             obj = {
                 status: "INACTIVE"
             }
         }
         const token = localStorage.getItem("token")
         axios({
             method: 'POST',
             url: lambda + '/updatelookups?appname=' + appname + '&lookupcode=' + id + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
             data: obj
         })
             .then(function (response) {
                 console.log("res", response)
                 if (response?.data?.result === "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
                    if(lookupsearch){
                        handleSearch()
                    }else{
                        GetLookUp2(activeBtn)
                        
                    }

                    setIsLoading(false)
                    
                 }
             });

}
 
     const handleViewLookup = (e, id) => {
         GetTimeActivity();
         history.push("/viewlookup/" + id);
     }
 
     const handleKeypress = (e) => {
         //it triggers by pressing the enter key
         GetTimeActivity();
         if ((e.key === "Enter")) {
             setTimeout(function () {
                 handleSearch();
                 //  GetLookUp();
 
             }, 1000);
         }
     };
 
     const clearSearch = () => {
         setlookUpType("all-type")
         GetTimeActivity()
         setSearchedFlag(false)
         setActiveBtn("color")
         setLookupSearch("");
         GetLookUp();
         setCurrentPage(1);
         setRowsPerPage(15);
     }
     const customNoRecords = () => {
         return (
 
             <div className="empty-state-body empty-record"  >
                 <div className="empty-state__message">
                     <span className="material-icons">summarize</span>
                     <p className="form-check font-size-16">No lookups were found for the searched keyword</p>
                 </div> </div>
         )
     }
 
     const handleClick = (e, type) => {
         setActiveBtn(type)
         GetLookUp2(type)
     }
     const handleLoadMore = () => {
         if (visibleItems >= data.length) {
             setRemoveLoad(true)
         }
         setVisibleItems(prevVisibleItems => prevVisibleItems + 20);
     };
     const handleToggle = (button) => {
         if (button === "grid") {
             setActiveButton("grid")
         } else if (button === "list") {
             setActiveButton('list')
         }
 
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
         let mandatoryFileds
         if(add === true){
            mandatoryFileds = [{ name: 'Name', key: 'name' }]
         }else{
            mandatoryFileds = [{ name: 'Name', key: 'name' }, { name: 'Type', key: 'type' }, { name: 'Status', key: 'status' }]
         }
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
         setBtnLoader(true)
         GetTimeActivity();
         let obj = { ...editlookup,status:"ACTIVE",type:activeBtn, createdBy: { userid: userData.userid, username: userData.name } }
         addLookup(obj).then((data) => {
             console.log("getClientcontent data", data);
             if(data.result==="Lookup already exists"){
                setExistMsg(true)
                setBtnLoader(false)
             }else if (data.statusCode === 200) {
                 console.log(data.result, "---")
                 if (data?.result === "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
                     setBtnLoader(false)
                     setAddPopup(false);
                     setEditLookUp({})
                     setSuccess(true)
                     GetLookUp2(activeBtn)
                 }
             }
         }).catch((error) => {
             console.log(error);
         })
 
     }
 
     const handleUpdate = (e) => {
         setBtnLoader(true)
         GetTimeActivity();
         updateLookup(lookupId, editlookup).then((data) => {
             console.log("getClientcontent data", data);
             if (data.statusCode == 200) {
                 console.log(data.result, "---")
                 if (data.result === "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
                     setBtnLoader(false)
                     setAddPopup(false)
                     setEditLookUp({})
                     setSuccess(true);
                     GetLookUp2(activeBtn)
                 }
             }
         }).catch((error) => {
             console.log(error);
         })
 
     }
     function onConfirm() {
         setSuccess(false);
 
 
     };
     console.log("total",totallookup,visibleItems)
     return (
 
         <>
             {showSessionPopupup && <SessionPopup />}
             <div id="layout-wrapper">
                 <Header />
                 <Sidebar />
                 {activeButton === "grid" ? (
                     <>
                         {isLoading ?
                             <Loader /> :
                             <div className="main-content user-management lookups">
 
                                 <div className="page-content">
                                     <div className="container-fluid">
 
 
 
                                         <div className="row mb-4 breadcrumb">
                                             <div className="col-lg-12">
                                                 <div className="d-flex align-items-center">
 
                                                     <div className="d-flex align-items-center flex-grow-1 page-title-sec">
                                                         <h6 className="mb-2 card-title">lookups</h6>
                                                         {subValDashboard && subValDashboard.Add && subValDashboard.Add.display === true &&
 
                                                             <button onClick={handleAddLookUp} className="btn btn-info btn-primary ms-3 rounded-4 px-3  py-2 btn-sm" disabled={subValDashboard && subValDashboard.Add && subValDashboard.Add.enable === false}><span>+&nbsp;</span>CREATE</button>
 
                                                         }
                                                     </div>
                                                     <div className="page-actions">
                                                         <div className="mt-4 mt-sm-0 float-sm-end d-sm-flex align-items-center">
 
                                                             <div className="search-box me-2">
                                                                 <div className="position-relative">
                                                                     <input type="text" className="form-control border-0" value={lookupsearch} onChange={(e) => handleChangeSearch(e)} onKeyPress={handleKeypress} placeholder="Search by Name" />
                                                                     <button className="fill_btn" onClick={(e) => handleSearch(e, "click")}><span className="material-icons search-icon">search</span></button>
                                                                 </div>
                                                                 <div className="position-relative">
                                                                     <button className="fill_btn" onClick={(e) => clearSearch(e)}><span className="material-icons-outlined">sync</span>Reset</button>
                                                                 </div>
                                                             </div>
 
                                                         </div>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
 
                                         <div className="row table-data">
                                             <div className="col-12">
                                                 <div className="card">
                                                     <div className="card-body">
                                                         <div className="lookup_sort">
                                                             {types.map((type, index) => (
                                                                 <button key={index} className={`btn btn-info btn-primary rounded-4 ${activeBtn === type ? 'outline-button-active' : 'outline-button'}`} onClick={(e) => handleClick(e, type)} disabled={searchedFlag}>
                                                                     {type}
                                                                 </button>
                                                             )
                                                             )}
                                                         </div>
                                                         <div className="row sort_body">
                                                             {data && data.length > 0 ? (data.slice(0, visibleItems).map((item, index) => {
                                                                 return (
                                                                     < div className="col-md-3" >
                                                                         <div className="btn-group">
                                                                             <>
                                                                                 <button key={index} type="button" className={item.status === "INACTIVE" || item.status === "ARCHIVE" ? "btn btn-secondary dropdown-toggle disable" : "btn btn-secondary dropdown-toggle"} data-bs-toggle="dropdown" aria-expanded="false" >
                                                                                     {item.name}<span className="material-icons-outlined">expand_more</span>
                                                                                 </button>
 
                                                                                 <ul className="dropdown-menu dropdown-menu-end">
                                                                                     <li><button className="dropdown-item" type="button" onClick={(e) => handleEditLookup(e, item.lookupcode)}><i className="mdi mdi-pencil font-size-18"></i>edit</button></li>
                                                                                     <li>{item.status === "ACTIVE" ? <button onClick={(e) => handleInactive(e, item.lookupcode, "inactive")} className="dropdown-item" type="button"><i className="mdi mdi-toggle-switch-off font-size-18"></i>INACTIVE</button> : <button onClick={(e) => handleInactive(e, item.lookupcode, "active")} className="dropdown-item" type="button"><i className="mdi mdi-toggle-switch font-size-18"></i>ACTIVE</button>}</li>
 
 
                                                                                 </ul>
 
                                                                             </>
                                                                         </div>
 
                                                                     </div>
 
                                                                 )
                                                             })) : (<div className="empty-state-body empty-record"  >
                                                                 <div className="empty-state__message">
                                                                     <span className="material-icons">summarize</span>
                                                                     <p className="form-check font-size-16">No lookups were found for the searched keyword</p>
                                                                 </div>
                                                             </div>)}
                                                             <div>
                                                                 {(data && data.length > 20 && totallookup > visibleItems) &&
                                                                     <div className="load_more"> <button onClick={handleLoadMore}>LoadMore</button></div>
                                                                 }
                                                             </div>
                                                         </div>
 
 
                                                     </div>
 
                                                 </div>
                                             </div>
                                         </div>
 
 
                                     </div>
                                 </div>
 
                                 <Modal className="access-denied order_specification lookuppopup" show={addPopup}>
 
                                     <div className="modal-body enquiry-form">
                                         <button className="close-btn" onClick={e => (setAddPopup(false), setEditLookUp({}),setLookupErrors({}))}><span className="material-icons">close</span></button>
 
                                             <div className="container-fluid">
 
                                                 <div className="row mb-4 breadcrumb">
                                                     <div className="col-lg-12">
                                                         <div className="d-flex align-items-center">
 
                                                             <div className="flex-grow-1">
                                                             {add ? <h6 className="mb-2 card-title">CREATE a lookup for category: {editlookup.type}</h6>:<h6 className="mb-2 card-title">Edit Lookup</h6>}


                                                              
                                                             </div>
                                                             <div>
 
                                                             </div>
                                                         </div>
                                                     </div>
                                                 </div>
 
 
                                                 <div className="create-user-block">
                                                     {Object.keys(editlookup).length > 0 || add === true ?
                                                         <>
                                                             <div className="form-block">
                                                                 <div className="row">
 
                                                                     <div className="col-md-12">
 
                                                                         <div className="mb-3 input-field">
                                                                             <label className="form-label form-label">NAME <span className="required">*</span></label>
                                                                             <input id="email" name="name" type="text" placeholder="Name" className="form-control form-control" aria-invalid="false" value={editlookup.name} onChange={(e) => handleChange(e, "name")} />
                                                                             {lookupErrors.name && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{lookupErrors.name}</span>}
                                                                         </div>
                                                                     </div>
                                                                     <div className="col-md-12">
                                                                        
                                                                             {add === false ?
                                                                              <div className="mb-3 input-field">
                                                                              <label className="form-label form-label">TYPE<span className="required">*</span></label>
                                                                              <select name="type" className="colorselect capitalize form-control form-select" value={editlookup.type} onChange={(e) => handleChange(e, "type")} disabled >
                                                                                 <option value="">Select Type</option>
                                                                                 {types.map((type) => {
                                                                                     return (
                                                                                         <option key={type.id} value={type}>{type}</option>
                                                                                     )
                                                                                 })}
 
 
                                                                             </select> 
                                                                             </div>:""}
 
                                                                             {lookupErrors.type && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{lookupErrors.type}</span>}
 
                                                                        
                                                                     </div>
                                                                     {editlookup.type === "subtitlelanguage" && <div className="col-md-12">
                                                                         <div className="mb-3 input-field">
                                                                             <label className="form-label form-label">language code<span className="required">*</span></label>
                                                                             <input id="email" name="alpha2" placeholder="language code" type="text" className="form-control form-control" disabled aria-invalid="false" value={editlookup.languagecode} />
 
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
                                                                        
                                                                             {add === true ?
                                                                                 " " :
                                                                                 <div className="mb-3 input-field">
                                                                                 <label className="form-label form-label">status<span className="required">*</span></label>
                                                                                 <select name="status" className="colorselect capitalize form-control form-select" value={editlookup.status} onChange={(e) => handleChange(e, "status")}>
 
                                                                                     <option value="ACTIVE">ACTIVE</option>
                                                                                     <option value="INACTIVE">INACTIVE</option>
                                                                                 </select>
                                                                                  </div>
                                                                             }
                                                                             {lookupErrors.status && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{lookupErrors.status}</span>}
                                                                        
                                                                     </div>
 
 
 
                                                                 </div>
                                                             </div>
 
                                                             <div className="row">
                                                                 <div className="col-md-12">
                                                                     {add === true ? <button className="btn btn-primary btn-block " type="submit"
                                                                         onClick={handleSubmit}
                                                                     >{btnLoader ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}Save</button> :
                                                                         <button className="btn btn-primary btn-block " type="submit"
                                                                             onClick={handleSubmit}
                                                                         >{btnLoader ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}update</button>
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
                                 </Modal>
                                 <Footer />
                                 <SweetAlert show={success}
                                     custom
                                     confirmBtnText="ok"
                                     confirmBtnBsStyle="primary"
                                     title={add === true ? "Saved Successfully" : "Updated Successfully"}
                                     onConfirm={e => onConfirm()}
                                 >
                                 </SweetAlert>
                                 <SweetAlert show={existmsg}
                                    custom
                                    confirmBtnText="ok"
                                    confirmBtnBsStyle="primary"
                                    title={"lookup already exists"}
                                    onConfirm={e => setExistMsg(false)}
                                ></SweetAlert>
                             </div>}</>
                 ) : (
 
 
                     <div className="main-content user-management lookups">
 
                         <div className="page-content">
                             <div className="container-fluid">
 
 
 
                                 <div className="row mb-4 breadcrumb">
                                     <div className="col-lg-12">
                                         <div className="d-flex align-items-center">
 
                                             <div className="flex-grow-1">
                                                 <h4 className="mb-2 card-title">lookups</h4>
 
                                             </div>
 
                                             {subValDashboard && subValDashboard.Add && subValDashboard.Add.display === true &&
                                                 <div>
                                                     <button onClick={handleAddLookUp} className="btn btn-primary" disabled={subValDashboard && subValDashboard.Add && subValDashboard.Add.enable === false}>add lookup</button>
                                                 </div>
 
                                             }
                                             <ul className="nav nav-pills product-view-nav justify-content-end mt-3 mt-sm-0">
                                                 <li className="nav-item">
                                                     <a className={`nav-link${activeButton === 'grid' ? ' active' : ''}`} onClick={() => { handleToggle('grid') }} href="#"><i className="bx bx-grid-alt"></i></a>
                                                 </li>
                                                 <li className="nav-item">
                                                     <a className={`nav-link ${activeButton === 'list' ? 'active' : ''}`} onClick={() => handleToggle('list')} href="#"><i className="bx bx-list-ul"></i></a>
                                                 </li>
                                             </ul>
 
                                         </div>
                                     </div>
                                 </div>
 
                                 <div className="row table-data">
                                     <div className="col-12">
                                         <div className="card">
                                             <div className="card-body">
                                                 <div className="row mb-2">
                                                     <div className="col-sm-4">
                                                         <select name="Type-search" value={lookUpType} id="dropdown" className="custom-select custom-select-sm form-control form-control-sm form-select form-select-sm" onChange={e => handleLookUpType(e)}>
                                                             <option value="all-type">All Types</option>
                                                             <option value="color">Color</option>
                                                             <option value="country">Country</option>
                                                             <option value="department">Department</option>
                                                             <option value="foamdensity">Foam Density</option>
                                                             <option value="language">Language</option>
                                                             <option value="skritoptions">Skrit Options</option>
                                                             <option value="tiedownlocation">Tie Down Locations</option>
                                                             <option value="upgrades">Upgrades</option>
                                                             {/* <option value="resolution">Resolution</option>
                                                        <option value="sports">Sports</option>
                                                        <option value="subtitlelanguage">Subtitle Language</option>
                                                        <option value="territories">Territories</option>
                                                        <option value="videoformat">Video Format</option> */}
 
                                                         </select>
                                                     </div>
                                                     <div className="col-sm-8">
                                                         <div className="search-box mb-2 d-inline-block">
                                                             <div className="position-relative">
                                                                 <input type="text" className="form-control" value={lookupsearch} onChange={(e) => handleChange(e)} onKeyPress={handleKeypress} placeholder="Search by LookUp Name" />
                                                                 <button className="fill_btn" ><span className="material-icons search-icon">search</span></button>
                                                             </div>
                                                             <div className="dataTables_length" id="datatable_length">
                                                                 <button className="fill_btn" onClick={clearSearch}><span className="material-icons-outlined">sync</span>Reset</button>
                                                             </div>
 
                                                         </div>
                                                         <div className="text-sm-end">
 
                                                         </div>
                                                     </div>
                                                 </div>
 
 
                                                 {/* < DataTable 
                                                     // title=""
 
                                                     columns={columns}
                                                     // className="table align-middle table-nowrap table-check"
                                                     keyField='_id'
                                                     data={data}
                                                     direction="auto"
                                                     highlightOnHover
                                                     // sortedColumn={sortedColumn}
                                                     // sortDirection={sortDirection}
                                                     fixedHeaderScrollHeight="300px"
                                                     pagination
                                                     responsive
                                                     persistTableHead
                                                     // selectableRowsVisibleOnly
                                                     striped
                                                     // selectableRowsHighlight
                                                     // selectableRows
                                                     subHeaderAlign="right"
                                                     defaultSortField="name"
                                                     subHeaderWra
                                                     noDataComponent={customNoRecords()}
                                                     paginationTotalRows={data.length}
                                                     onChangeRowsPerPage={handlePerRowsChange}
                                                     onChangePage={handlePageChange}
                                                     paginationPerPage={rowsPerPage}
 
                                                     paginationDefaultPage={currentPageNew}
                                                     paginationRowsPerPageOptions={[15, 25, 50, 75, 100]}
                                                     paginationComponentOptions={{
                                                         rowsPerPageText: 'Per page:',
                                                         rangeSeparatorText: 'of',
                                                         noRowsPerPage: false,
                                                         selectAllRowsItem: false,
                                                         selectAllRowsItemText: 'All',
                                                     }}
 
                                                     progressPending={isLoading}
                                                     progressComponent={<TableLoader />}
                                                 />
  */}
                                             </div>
 
                                         </div>
                                     </div>
                                 </div>
 
 
                             </div>
                         </div>
 
                         <Footer />
 
                     </div>
 
 
 
 
                 )}
 
 
             </div >
 
 
         </>
         //       <>
         //    
         //   </>
     );
 };
 
 export default LookUp;