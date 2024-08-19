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
 import SessionPopup from "../SessionPopup"
 import axios from "axios";
 import moment from "moment";
 import { contentContext } from "../../context/contentContext";
 let { appname, lambda } = window.app;
 
 const ViewAdvancedSettings = () => {
     const history = useHistory();
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
     const [Data, setData] = useState([]);
     const [categoryData, setCategoryData] = useState([]);
     const [categoryName, setCategoryName] = useState([]);
     const [categoryId, setCategoryId] = useState([]);
     const [showMsg, setShowMsg] = useState("");
     const [activeName, setActiveName] = useState("");
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
         getCategory();
         handleCategory();
     }, []);
 
 
 
     const getCategory = async () => {
 
        GetTimeActivity()   
         const token = localStorage.getItem("token")
         axios({
             method: 'GET',
             url: lambda + '/category?appname=' + appname + "&token=" + token,
         })
             .then(function (response) {
                 if (response.data.result == "Invalid token or Expired") {
                     setShowSessionPopupup(true)
                 } else {
 
                     setData(response.data.result.data);
 
                 }
             });
     }
 
     const handleCategory = (e, name, categoryid) => {
        GetTimeActivity()   
         setCategoryName(name);
         setCategoryId(categoryid);
         const token = localStorage.getItem("token")
         const catid = categoryid === "" || categoryid === undefined ? "100001" : categoryid
         axios.get(lambda + '/advancedSearchSettings?appname=' + appname + "&categoryid=" + catid + "&token=" + token,
         )
             .then(function (response) {
                 console.log("res", response);
                 if (response.data.statusCode === 200) {
                     if (response.data.result == "Invalid token or Expired") {
                         setShowSessionPopupup(true)
                     } else {
                         setCategoryData(response.data.result.data)
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
                 <div className="main-content create-user edit-content add-client lps asp">
 
                     <div className="page-content ">
                         <div className="container-fluid">
                             <div className="row mb-4 breadcrumb">
                                 <div className="col-lg-9">
                                     <div className="d-flex align-items-center">
                                         <div>
                                             <h4 className="mb-2 card-title">Advanced Search SETTINGS</h4>
                                             <p className="menu-path">Front End Settings / <b>Advanced Search Settings</b></p>
                                         </div>
                                         {/* <button className="btn btn-primary ml-25 border_button" type="button" ><span className="material-symbols-outlined"> save </span>SAVE</button> */}
 
 
                                     </div>
                                 </div>
                                 <div className="col-lg-3 align-right">
                                     <button onClick={handleBack} className="btn btn-primary" type="button" >BACK</button>
                                 </div>
                             </div>
                             <div className="create-user-block mb_20">
 
                                 <div className="form-block">
                                     <h2 className="form_title">CATEGORY</h2>
 
 
 
                                     <div className="row">
                                         <div className="col-md-3">
                                             <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                 {Data && Data.length > 0 && Data.map(function (item, i) {
 
                                                     return (
                                                         <a onClick={(e) => handleCategory(e, item.name, item.categoryid)} className={item.categoryid === 100001 ? "nav-link active" : "nav-link"} id={"v-pills-" + `${item.name}` + "-tab"} data-bs-toggle="pill" href={"#v-pills-" + `${item.name}`} role="tab" aria-controls={"v-pills-" + `${item.name}`} aria-selected="true">{item.name}</a>
 
                                                     )
                                                 })}
                                             </div>
                                         </div>
                                         <div className="col-md-8">
                                             <div className="tab-content text-muted mt-4 mt-md-0" id="v-pills-tabContent">
 
                                                 <div style={{ display: "contents" }} className="tab-pane fade show active" id={"v-pills-" + `${categoryName}`} role="tabpanel" aria-labelledby={"v-pills-" + `${categoryName}` + "-tab"}>
                                                     <div className="permission-block">
 
                                                         <div className="table-responsive">
                                                             <table className="table align-middle table-nowrap table-check">
                                                                 <thead>
                                                                     <tr>
 
                                                                         <th className="align-middle">Searchable</th>
                                                                         <th className="align-middle"><div className="d-flex">OFF/ON</div></th>
 
                                                                     </tr>
                                                                 </thead>
                                                                 <tbody>
                                                                     {categoryData && categoryData.length > 0 && categoryData.map(function (item, i) {
                                                                         // console.log("item",item);
 
                                                                         return (
 
                                                                             <tr>
                                                                                 <td className="align-middle"><div className="d-flex align-items-center"><span className="material-icons">fiber_manual_record</span>{item.display}</div></td>
                                                                                 <td className="align-middle"><div className="input-field switch-buttons d-flex align-items-center"><label className="switch"><input type="checkbox" checked={item.searchable}
                                                                                    disabled
 
                                                                                 /><span className="slider round"></span></label>
                                                                                     {item.name === activeName && showMsg != "" ?
                                                                                         <span className="successmsg" style={{
                                                                                             fontWeight: 'bold',
                                                                                             color: 'green',
                                                                                             marginLeft:"44px"
                                                                                         }}>{showMsg}</span> : ""
                                                                                     }
                                                                                 </div>
                                                                                
                                                                                 </td>
                                                                                
                                                                             </tr>
                                                                         )
                                                                     })}
 
 
                                                                 </tbody>
 
 
                                                             </table>
                                                         </div>
                                                     </div>
                                                 </div>
 
 
                                             </div>
                                           
                                         </div>
                                         <div className="col-md-1">
 
                                         </div>
 
                                     </div>
 
 
 
 
                                 </div>
 
                             </div>
 
 
 
                         </div>
                     </div>
 
 
                     <Footer />
                 </div>
             </div>
         </>
     );
 };
 
 export default ViewAdvancedSettings;
 