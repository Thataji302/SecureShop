/***
**Module Name: Team
 **File Name :  Team.js
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

 ***/
 import React, { useState, useEffect,useContext } from "react";
 import Footer from "../../components/dashboard/footer";
 import Header from "../../components/dashboard/header";
 import Sidebar from "../../components/dashboard/sidebar";
 import { useHistory, Link } from "react-router-dom";
 import { useParams } from 'react-router-dom'
 import Modal from 'react-bootstrap/Modal';
 import Loader from "../../components/loader";
 import SweetAlert from 'react-bootstrap-sweetalert';
 import axios from "axios";
 import SessionPopup from "../SessionPopup"
 import ReactQuill from 'react-quill';
 import { contentContext } from "../../context/contentContext";
 import moment from "moment";
 
 import * as Config from "../../constants/Config";
 let { lambda, country, appname } = window.app;

 const ViewTeam = () => {
     let { id } = useParams();
     const history = useHistory();
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
     const [value, setValue] = useState('');
     const [teamData, setTeamData] = useState([]);
     const [formValuesData, setFormValuesData] = useState({});
     const [showupBoard, setShowupBoard] = useState(false);
     const [menuCode, setMenuCode] = useState(0);
     const [success, setSuccess] = useState(false);
     const [errors, setErrors] = useState({});
     const [isdelete, setDelete] = useState(false);
 
     let { appname, lambda } = window.app;
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
             url: lambda + '/menus?appname=' + appname + '&menuid=100003&token=' + token,
         })
             .then(function (response) {
                 if (response && response.data && response.data.result) {
                     if (response.data.result == "Invalid token or Expired") {
                         setShowSessionPopupup(true)
                     } else {
                         let data = response && response.data && response.data.result && response.data.result.data && response.data.result.data[0] && response.data.result.data[0].team
                         setMenuCode(response.data.result.data[0].menuid)
                         setTeamData(data)
                     }
                 }
             });
 
     }
  
 
     const handleBack = () => {
        GetTimeActivity()   
         history.push("/frontendsettings")
     }
 
    
 
     const validateMandatoryFields = () => {
        GetTimeActivity()   
         let error = { ...errors }
         let k = [{ name: 'Title', key: 'title' },
         { name: 'Description', key: 'descriptioncontent' },
         { name: 'Designation', key: 'designation' }
         ];
         let flag = true;
         if (flag) {
             k.forEach(function (item) {
                 // console.log(' k flag 11111')
                 if (formValuesData[item.key] == "" || formValuesData[item.key] == undefined || formValuesData[item.key] == "undefined") {
                     // console.log(' k flag 22222222')
                     error[item.key] = item.name + " is required";
                     flag = false;
                 }
 
             });
         }
         setErrors(error)
         return flag
     }
  
     const submitMember = (e,teamid) => {
        GetTimeActivity()   
         console.log('on click');
         console.log("teamid",teamid)
         let obj = [...teamData]
         const isValid = validateMandatoryFields();
         if (isValid) {
             console.log('is valid---->');
             const catType = formValuesData.type == "board" ? "THE BOARD" : "SALES TEAM"
             const token = localStorage.getItem("token")
             axios.put(lambda + '/menus?appname=' + appname + "&menuid=" + menuCode + "&token=" + token + "&category=" + catType + "&teamid=" + teamid + "&userid=" + localStorage.getItem("userId"),
             formValuesData
 
             
             )
                 .then(function (response) {
                     if (response.data.statusCode === 200) {
                         if (response.data.result == "Invalid token or Expired") {
                             setShowSessionPopupup(true)
                         } else {
                             setSuccess(true)
                             setShowupBoard(false)
                             setFormValuesData({})
                             handleMenu();
                         }
                     }
 
                 });
 
 
         }
     }
 
     
 
     return (
         <>
             {showSessionPopupup && <SessionPopup />}
             <div id="layout-wrapper">
                 <Header />
                 <Sidebar />
 
                 <div className="main-content create-user edit-content add-client lps team-members">
 
                     <div className="page-content ">
                         <div className="container-fluid">
                             <div className="row mb-4 breadcrumb">
                                 <div className="col-lg-9">
                                     <div className="d-flex align-items-center">
                                         <div>
                                             <h4 className="mb-2 card-title">TEAM SETTINGS</h4>
                                             <p className="menu-path">Front End Settings /<b>Team Settings</b></p>
                                         </div>
                                        
 
                                     </div>
                                 </div>
                                 <div className="col-lg-3 align-right">
                                     <button className="btn btn-primary" onClick={handleBack} type="button" >BACK</button>
                                 </div>
                             </div>
 
                             <div className="create-user-block mb_20">
                             {teamData.length > 0 ? 
                                            <>     
                                 <div className="form-block">
 
                                     <div className="tm">
 
                                         {teamData && teamData.length > 0 ? teamData.map((eachItem) => {
                                             let typeOfMembers = eachItem.members
 
                                             return (
                                                 <>
                                                     <div className="row">
                                                         <div className="team-title">
                                                             <h2 className="form_title">{eachItem.category}</h2>
                                                            
                                                         </div>
                                                         {typeOfMembers.length > 0 ? typeOfMembers.map((eachMember, j) => {
                                                             console.log("typeOfMembers",typeOfMembers)                                                            
                                                             return (
                                                                 <>
                                                                     {eachItem.category == "THE BOARD" ? (<div className="col-md-6" key={j}>
                                                                         <div className="card">
 
 
                                                                       
                                                                            
                                                                             <div className="row">
                                                                                 <div className="col-md-5">
                                                                                     <div className="user_image">
                                                                                         <div className="file_upload">
                                                                                             <div className="upload_file">
                                                                                                 <img src={`${eachMember.profileimage}?auto=compress,format`} alt="image-1" />
                                                                                             </div>
                                                                                            
                                                                                         </div>
 
 
                                                                                     </div>
                                                                                     <div className="user_form">
                                                                                         <div className="mb-3 input-field">
                                                                                             <label className="form-label form-label">NAME</label><input id="email" name="name" placeholder="Name" type="text" value={eachMember.title} disabled className="form-control" aria-invalid="false" />
                                                                                         </div>
                                                                                         <div className="mb-0 input-field">
                                                                                             <label className="form-label form-label">Designation</label><input id="email" name="name" placeholder="Designation" type="text" disabled value={eachMember.designation} className="form-control" aria-invalid="false" />
                                                                                         </div>
 
 
 
                                                                                     </div>
                                                                                 </div>
 
                                                                                 <div className="col-md-7">
                                                                                     <div className="edit-info black-gradient">
 
                                                                                     </div>
                                                                                     <div className="mb-0 input-field">
                                                                                         <label className="form-label form-label">Description</label><textarea id="Description" name="Description" value={eachMember.descriptioncontent.replace(/<[^>]*>/g, '')} disabled placeholder="Description" type="text" className="form-control"></textarea>
                                                                                     </div>
                                                                                     
                                                                                    <div className="mb-3 input-field">
                                                                                            <label className="form-label form-label">phone</label><input id="email" name="phone" placeholder="phone" type="text" value={eachMember.phone} disabled className="form-control" aria-invalid="false" />
                                                                                        </div>
                                                                                        <div className="mb-0 input-field">
                                                                                            <label className="form-label form-label">email id</label><input id="email" name="email" placeholder="email id" type="text" disabled value={eachMember.email} className="form-control" aria-invalid="false" />
                                                                                        </div>
                                                                                  
                                                                                 </div>
                                                                              
                                                                             </div>
 
                                                                         </div>
                                                                     </div>) :
                                                                         (<div className="col-md-3" key={j}>
                                                                             <div className="card">
                                                                            
                                                                                
                                                                                
                                                                                 <div className="user_image">
                                                                                     <div className="file_upload">
                                                                                         <div className="upload_file">
                                                                                             <img src={`${eachMember.profileimage}?auto=compress,format`} alt="image-1" />
                                                                                         </div>
                                                                                     </div>
 
                                                                                 </div>
                                                                                 <div className="user_form">
                                                                                     <div className="mb-3 input-field">
                                                                                         <label className="form-label form-label">NAME</label><input id="email" name="name" placeholder="Name" type="text" value={eachMember.title} className="form-control" aria-invalid="false" disabled />
                                                                                     </div>
                                                                                     <div className="mb-0 input-field">
                                                                                         <label className="form-label form-label">Designation</label><input id="email" name="name" placeholder="Designation" type="text" value={eachMember.designation} className="form-control" aria-invalid="false" disabled />
                                                                                     </div>
                                                                                     <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">phone</label><input id="email" name="phone" placeholder="phone" type="text" value={eachMember.phone} className="form-control" aria-invalid="false" disabled />
                                                                                    </div>
                                                                                    <div className="mb-0 input-field">
                                                                                        <label className="form-label form-label">email id</label><input id="email" name="email" placeholder="email id" type="text" value={eachMember.email} className="form-control" aria-invalid="false" disabled />
                                                                                    </div>
                                                                                     <div className="mb-0 input-field">
                                                                                         <label className="form-label form-label">Description</label><textarea id="email" name="name" placeholder="Description" type="text" value={eachMember.about} disabled className="form-control" aria-invalid="false" ></textarea>
                                                                                     </div>
                                                                                  
                                                                                 </div>
 
                                                                             </div>
 
                                                                         </div>)
 
 
 
                                                                     }
                                                                 </>
 
                                                             )
                                                         }) : null}
 
 
                                                     </div>
 
 
                                                 </>
 
                                             )
                                         }) : null}
                                     
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
 
 export default ViewTeam;
 