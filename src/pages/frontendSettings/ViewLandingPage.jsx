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
 import React, { useState, useEffect, useContext, useRef } from "react";
 import Footer from "../../components/dashboard/footer";
 import Header from "../../components/dashboard/header";
 import Sidebar from "../../components/dashboard/sidebar";
 import { useHistory } from "react-router-dom";
 import axios from "axios";
 import moment from "moment";
import Loader from "../../components/loader";
 import SweetAlert from "react-bootstrap-sweetalert";
 import ReactQuill from 'react-quill';
 import Modal from 'react-bootstrap/Modal';
 import SessionPopup from "../SessionPopup";
 import PlayerInfo from "../../components/player";
 import { contentContext } from "../../context/contentContext";
 let { appname, lambda } = window.app;
 
 const ViewLandingPage = () => {
     const history = useHistory();
     const ref = useRef();
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
     const [sec1, setSec1] = useState({});
     const [sec2, setSec2] = useState({});
     const [sec3, setSec3] = useState({});
     const [sec4, setSec4] = useState({});
     const [sec5, setSec5] = useState({});
     const [play, setPlay] = useState(false);
     const [playContent, setPlayContent] = useState({});
     const [menuCode, setMenuCode] = useState(0);
     const [fileName, setFileName] = useState("");
     const [showUpload, setShowUpload] = useState(false);
     const [success, setSuccess] = useState(false);
     const [uploadsuccess, setUploadSuccess] = useState(false);
     const [fileCategory, setFileCategory] = useState("");
     const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious , setActiveMenuId,GetTimeActivity} = useContext(contentContext);
 
     const prevRoute = usePrevious(route)
     useEffect(() => {
         if (prevRoute != undefined && prevRoute != route) {
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
             url: lambda + '/menus?appname=' + appname + '&menuid=100001&token=' + token,
         })
             .then(function (response) {
                 if (response.data.result) {
                     if (response.data.result == "Invalid token or Expired") {
                         setShowSessionPopupup(true)
                     } else {
                         console.log(response)
 
                         setMenuCode(response.data.result.data[0].menuid)
                         setSec1(response.data.result.data[0].team[0])
                         setSec2(response.data.result.data[0].team[1])
                         setSec3(response.data.result.data[0].team[2])
                         setSec4(response.data.result.data[0].team[3])
                         setSec5(response.data.result.data[0].team[4])
                     }
                 }
             });
 
     }
 
 


 
     const handleClose = (e) => {
         setShowUpload(false);
         setFileName("");
         ref.current.value = "";
 
     }
     const handlePlayer = (e, content) => {
         GetTimeActivity()   
         let source = window.site.common.proxiesCloudFront + content
         setPlayContent(source);
         setPlay(true);
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
                                             <h4 className="mb-2 card-title">LANDING PAGE SETTINGS</h4>
                                             <p className="menu-path">Front End Settings / <b>Landing Page</b></p>
                                         </div>
 
 
 
                                     </div>
                                 </div>
                                 <div className="col-lg-3 align-right">
                                     <button className="btn btn-primary" type="button" onClick={handleBack}>BACK</button>
                                 </div>
                             </div>
                             {Object.keys(sec1).length > 0 ? 
                                            <>     
                             <div className="create-user-block mb_20">
 
                                 <div className="form-block">
                                     <h2 className="form_title">HERO BANNER SECTION</h2>
                                     <div className="banner_section">
 
                                         <div className="right">
                                             <div className="mb-3 input-field">
                                                 <label className="form-label form-label">CAPTION 1</label><input id="email" name="caption1" placeholder="Enter Caption" type="text" className="form-control" aria-invalid="false"  value={sec1.caption1}  disabled/>
                                             </div>
                                             <div className="mb-3 input-field">
                                                 <label className="form-label form-label">CAPTION 2</label><input id="email" name="caption2" placeholder="Enter Caption" type="text" className="form-control" aria-invalid="false"  value={sec1.caption2} disabled/>
                                             </div>
                                             <div className="mb-3 input-field">
                                                 <label className="form-label form-label">BANNER DESCRIPTION</label>
                                                 <textarea id="w3review" name="description" className="form-control awd" placeholder="add website description"  value={sec1.description}disabled></textarea>
                                             </div>
                                         </div>
                                     </div>
 
                                 </div>
 
                             </div>
                             <div className="create-user-block mb_20">
                                 <div className="form-block">
                                     <h2 className="form_title">WHY ORASI MEDIA ?</h2>
                                     <div className="thumbnail-block">
                                    
                                     <div className="asset-card">
                                         <div className="play-icon">
                                             <span className="material-icons-outlined">play_circle</span>
                                         </div>
                                         <a className="spinner-class"
                                             onClick={(e) => handlePlayer(e, sec2.url)}
                                         >
                                             <img src="https://orasi-dev.imgix.net/orasi/common/images/img-default.jpg" />
                                         </a>
                                         <p style={{ clear: 'both', display: "inline-block", overflow: 'hidden', whiteSpace: 'nowrap' }}>{fileName}</p>
                                     </div>
                                     </div>
                                 </div>
                             </div>
                             {play ?
 
                                 <PlayerInfo source={playContent} play={play} setPlay={setPlay} />
                                 : null
                             }
                             <div className="create-user-block mb_20">
                                 <div className="form-block">
                                     <h2 className="form_title mb_20">SECTION 2</h2>
                                     <div className="mb-3 input-field"><label className="form-label form-label">CAPTION 1</label><input id="email" name="caption1" placeholder="THE GLOBAL MARKETPLACE FOR" type="text" className="form-control" value={sec3.caption1} disabled/></div>
                                     <div className="mb-3 input-field">
                                         <label className="form-label form-label">CAPTION 2</label>
                                         <input id="email" name="subcaption" placeholder="ENTERTAINMENT CONTENT & LINEAR CHANNELS" type="text" className="form-control"  value={sec3.subcaption} disabled/>
                                     </div>
                                     <div className="mb-3 input-field">
                                         <label className="form-label form-label">DESCRIPTION</label>
                                         <textarea id="w3review" name="caption2" className="form-control awd" placeholder=""  value={sec3.caption2} disabled></textarea>
                                     </div>
                                 </div>
                             </div>
                             <div className="create-user-block mb_20">
                                 <div className="form-block">
                                     <h2 className="form_title">HOW IT WORKS ?</h2>
                                     {/* <div className="add-block"><span className="material-icons-outlined">add</span>add</div> */}
                                     <div className="thumbnail-block">
                                         
                                         <div className="asset-card">
                                             <div className="play-icon">
                                                 <span className="material-icons-outlined">play_circle</span>
                                             </div>
                                             <a className="spinner-class"
                                                 onClick={(e) => handlePlayer(e, sec4.url)}
                                             >
                                                 <img src="https://orasi-dev.imgix.net/orasi/common/images/img-default.jpg" />
                                             </a>
                                             <p style={{ clear: 'both', display: "inline-block", overflow: 'hidden', whiteSpace: 'nowrap' }}>{fileName}</p>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                             <div className="create-user-block">
                                 <div className="form-block">
                                     <h2 className="form_title mb_20">BUYER / SELLERS BENEFITS</h2>
                                     <div className="mb-3 input-field"><label className="form-label form-label">CAPTION 1</label><input id="email" name="caption1" placeholder="THE GLOBAL MARKETPLACE FOR" type="text" className="form-control"  value={sec5.caption1} disabled /></div>
                                     <div className="mb-3 input-field">
                                         <label className="form-label form-label">CAPTION 2</label>
                                         <input id="email" name="caption2" placeholder="FOR BUYERS & SELLERS" type="text" className="form-control" value={sec5.caption2} disabled/>
                                     </div>
                                     <div className="mb-3 input-field row">
                                         <div className="col-md-6">
                                             <label className="form-label form-label">SELLER BENEFITS</label>
                                             <ReactQuill theme="snow" readOnly value={sec5.sellerBenfits} />
                                         </div>
                                         <div className="col-md-6">
                                             <label className="form-label form-label">BUYER BENEFITS</label>
                                             <ReactQuill theme="snow" readOnly value={sec5.buyerBenfits}  />
                                         </div>
                                     </div>
                                   
                                 </div>
 
                             </div>
 
                             </>
                                        : 
                                        <div className="create-user-block">
                                        <div className="form-block">
                                            <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active show" id="home1" role="tabpanel">
                                                    <div className="row"><Loader />
                                                    </div>
                                                </div>
                                                </div>  </div>
                                        </div>
                                                }
 
                         </div>
 
                     </div>
 
 
                  =
 
                    
                   
 
                     <Footer />
                 </div>
             </div>
         </>
     );
 };
 
 export default ViewLandingPage;
 