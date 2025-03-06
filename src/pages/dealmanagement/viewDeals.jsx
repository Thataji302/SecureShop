/***
**Module Name: viewDeals
 **File Name :  viewDeals.js
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
 **Description : contains viewDeals table details.
 ***/
 import React, { useState, useEffect,useContext } from "react";


 import Footer from "../../components/dashboard/footer";
 import Header from "../../components/dashboard/header";
 import Sidebar from "../../components/dashboard/sidebar";
 import tmdbApi from "../../api/tmdbApi";
 import { useHistory, Link } from "react-router-dom";
 import { useParams } from 'react-router-dom';
 import axios from 'axios';
 import SessionPopup from "../SessionPopup"
 import SweetAlert from 'react-bootstrap-sweetalert';
 import moment from "moment";
 import Loader from "../../components/loader"
 import { contentContext } from "../../context/contentContext";
 let { lambda, appname } = window.app;
 
 
 const ViewDeals = () => {
     const history = useHistory();
     let { id } = useParams();
     const [image, setImg] = useState('');
     const [allDealsData, setAllDealsData] = useState({});
     const [contentData, setContentData] = useState({});
     const [followUp, setFollowUp] = useState("");
     const [success, setSuccess] = useState(false);
     const [followUpData, setFollowUpData] = useState({});
     const [isLoading, setIsLoading] = useState(false);
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
     const [invalidDeal, setInvalidDeal] = useState(false);

     const {route, setRoute,setCurrentPage,setRowsPerPage,usePrevious,setActiveMenuId,GetTimeActivity} = useContext(contentContext);

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
         setRoute("deal")
         GetAllDeals();
         setActiveMenuId(200003)
         userActivity();
     }, []);

     const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = id != undefined ? path[path.length - 2] :path[path.length - 1];;
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
 
     useEffect(() => {
         if (id) {
             getFollowup();
         }
     }, [success]);
 
     useEffect(() => {
 
         if (window.site === undefined) {
             setTimeout(() => {
                 if (window.site && window.site.common && window.site.common.resourcesUrl) {
                     setImg(window.site.common.resourcesUrl)
                 }
             }, 1000);
         }
         if (window.site && window.site.common && window.site.common.resourcesUrl) {
             setImg(window.site.common.resourcesUrl)
         }
 
     }, [window.site]);
 
     const onclickInvalid = () => {
        GetTimeActivity() 
        setInvalidDeal(false)
        history.push('/dealmanagement')
    }

     const GetAllDeals = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
         axios({
             method: 'POST',
             url: lambda + '/clientenquiry?appname=' + appname + '&enquiryid=' + id + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
         })
             .then(function (response) {
                //  console.log(response.data.result);
                 if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else if(response.data.result.data.length > 0){

                 setAllDealsData(response.data.result.data[0]);
                 setContentData(response.data.result.data[0].content);
                }
                else{
                    setInvalidDeal(true)
                
            }
             });
     }
 
     const getFollowup = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
         axios({
             method: 'GET',
             url: lambda + '/enquiryFollowup?appname=' + appname + '&enquiryid=' + id + "&token=" + token,
         })
             .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                 setFollowUpData(response.data.result.data)
                }
 
             });
     }

 
     const handleBack = () => {
        GetTimeActivity() 
        history.push({
            pathname: "/dealmanagement",
            state: { search: true }
          });
     }
 
     function onConfirm() {
        GetTimeActivity() 
         setSuccess(false);
 
     };
 
    //  console.log("values----->", allDealsData.status);
     return (
         <>
         {showSessionPopupup && <SessionPopup />}
             <div id="layout-wrapper">
                 <Header />
                 <Sidebar />
                 <SweetAlert show={success}
                             custom
                             confirmBtnText="ok"
                             confirmBtnBsStyle="primary"
                             title={"Updated Successfully"}
                             onConfirm={e => onConfirm()}
                         >
                         </SweetAlert>
                         <SweetAlert show={invalidDeal}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Deal Not Found"}
                            onConfirm={e => onclickInvalid()}
                        >
                </SweetAlert>
                    { !invalidDeal &&
                     <div className="main-content user-management add-client view-deals">
 
                         <div className="page-content ">
                             <div className="container-fluid">
 
 
 
                                 <div className="row mb-4 breadcrumb">
                                     <div className="col-lg-12">
                                         <div className="d-flex align-items-center">
                                             <div className="flex-grow-1">
                                                 <h4 className="mb-2 card-title">VIEW DEAL</h4>
                                                 <p className="menu-path">Deal Management / <b>View Deal</b></p>
                                             </div>
                                             <div>
                                                 <a onClick={handleBack} className="btn btn-primary">back</a>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="create-user-block">
 
                                     <div className="form-block">
                                         <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                             <li className="nav-item" role="presentation">
                                                 <a className="nav-link active" data-bs-toggle="tab" href="#home1" role="tab" aria-selected="true">
                                                     <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                     <span className="d-none d-sm-block">DETAILS</span>
                                                 </a>
                                             </li>
 
 
                                             {/* <li className="nav-item" role="presentation">
                                                  <a className="nav-link" data-bs-toggle="tab" href="#profile1" role="tab" aria-selected="false" tabIndex="-1">
                                                      <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                                                      <span className="d-none d-sm-block">DOCUMENTS</span>
                                                  </a>
                                              </li> */}
                                             <li className="nav-item" role="presentation">
                                                 <a className="nav-link" data-bs-toggle="tab" href="#messages1" role="tab" aria-selected="false" tabIndex="-1">
                                                     <span className="d-block d-sm-none"><i className="far fa-envelope"></i></span>
                                                     <span className="d-none d-sm-block">FOLLOW UP</span>
                                                 </a>
                                             </li>
 
 
 
                                         </ul>
                                         <div className="tab-content p-3 text-muted">
                                             <div className="tab-pane active show" id="home1" role="tabpanel">
                                             {Object.keys(allDealsData).length > 0 ? 
                                            <>      
                                             <div className="row">
                                            <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i> Buyer details</h5>
                                            <div className="col-md-4">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">Buyer Name</label>

                                                    <input id="email" name="buyer" placeholder="buyer" type="text" className="form-control" value={allDealsData && allDealsData.clientname} disabled
                                                            
                                                            />
                                                   
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="input-field">
                                                    <label htmlFor="example-text-input" className="col-form-label">Company Name</label>
                                                    <input className="form-control contact-number" type="text" name="title" value={allDealsData?.companyname} disabled placeholder="company name" id="example-email-input" />

                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                            {allDealsData?.accountmanager != undefined &&
                                                <div className="input-field">
                                                    <label htmlFor="example-text-input" className="col-form-label">Account Manager</label>
                                                    <input className="form-control contact-number" type="text" name="title" value={allDealsData?.accountmanager} disabled  placeholder="Account manager" id="example-email-input" />

                                                </div>}
                                            </div>
                                            {/* <div className="col-md-4">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">company Name</label>

                                                    <input id="email" name="buyer" placeholder="buyer" type="text" className="form-control" value={allDealsData && allDealsData.companyname} disabled
                                                            
                                                            />
                                                   
                                                </div>
                                            </div> */}

                                        </div>
                                                 <div className="row table-data">
                                                     <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i> titles Enquired</h5>
                                                     <div className="table-responsive">
                                                         <table className="table align-middle table-nowrap table-check">
                                                             <thead className="table-light">
                                                                 <tr>
                                                                 <th className="align-middle">S.NO</th>
                                                                 <th className="align-middle">THUMBNAIL</th>
                                                            <th className="align-middle">TITLE</th>
                                                            <th className="align-middle">CATEGORY</th>
                                                            <th className="align-middle">ADDITIONAL COMMENTS</th>
                                                            
                                                                 </tr>
                                                             </thead>
 
                                                             <tbody>
                                                                 {contentData && contentData.length > 0 && contentData.map(function (item, i) {
                                                                     let picName = item.mediaType === 'video' ? 'videoclip-defaulr' : item.mediaType === 'audio' ? 'musicfile-default' : item.mediaType === 'pdf' ? 'pdf-default' : item.mediaType === 'doc' ? 'doc-defaulr' : 'img-default'
                                                                     let defaultImg = `https://orasi-dev.imgix.net/orasi/common/images/${picName}.jpg`;
 
                                                                     let imgUrl = (item.portraitimage !="" && item.portraitimage != undefined)?  image + item.portraitimage :
                                                                     ( item.landscapeimage !="" && item.landscapeimage != undefined )? image + item.landscapeimage  : defaultImg
                                                                     let clientUrl = window.site.client.siteUrl;
 
                                                                     return (
                                                                         <tr key={i}>
                                                                            <td>{i+1}</td>
                                                                             <td><div className="d-flex justify-content-start"><a href={clientUrl + "/moreinfo/" + item.contentid + "&showoffline=true"} target="_blank"><img src={imgUrl + "?auto=compress,format&width=40"} /></a> </div></td>
                                                                             <td>{item.title}</td>

                                                                             <td><div className="text-elipsis">{item && item.category.length > 1 ? item.category.join(", ") : item.category}</div></td>

                                                                             <td><div className="text-elipsis">{item.comments}</div></td>
 
 
                                                                         </tr>
 
                                                                     )
                                                                 })}
                                                             </tbody>
                                                         </table>
                                                     </div>
 
                                                 </div>
 
                                                 <div className="row">
                                                     <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i> enquiry details</h5>
                                                     <div className="col-md-4">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">Required Rights</label>
                                                             <input id="email" name="rightsavaliable"  type="text" className="form-control" value={allDealsData.rightsAvailable && allDealsData.rightsAvailable.length > 0 ? allDealsData.rightsAvailable.join(", ") : allDealsData.rightsAvailable} disabled />
                                                         </div>
                                                     </div>
                                                     <div className="col-md-4">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">rights available From Date</label>
                                                             <input id="email" name="rightavailableto"  type="text" className="form-control" value={allDealsData && allDealsData.requiredfromdate && moment(allDealsData && allDealsData.requiredfromdate).format("DD-MMM-YYYY")}disabled />
                                                         </div>
                                                     </div>
                                                     <div className="col-md-4">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">rights available to Date</label>
                                                             <input id="email" name="rightavailableto"  type="text" className="form-control"
                                                             value={allDealsData && allDealsData.requiredtodate && moment(allDealsData && allDealsData.requiredtodate).format("DD-MMM-YYYY")} disabled />
                                                         </div>
                                                     </div>
                                                     <div className="col-md-4">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">video format</label>
                                                             <input id="email" name="foreigntitle"  type="text" className="form-control" 
                                                              value={allDealsData.videoformatsrequired && allDealsData.videoformatsrequired.length > 0 ? allDealsData.videoformatsrequired.join(", ") : allDealsData.videoformatsrequired } disabled />
                                                         </div>
                                                     </div>
                                                     <div className="col-md-4 ">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">dubbing languages</label>
                                                             <input id="email" name="foreigntitle" type="text" className="form-control" value=
                                                             {allDealsData.dubbinglanguagesrequired && allDealsData.dubbinglanguagesrequired.length > 0 ? allDealsData.dubbinglanguagesrequired.join(", ") : allDealsData.dubbinglanguagesrequired} 
                                                             disabled />
                                                         </div>
                                                     </div>
 
                                                     <div className="col-md-4">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">exclusivity</label>
                                                             <input id="email" name="foreigntitle" type="text" className="form-control" value={allDealsData.exclusive} disabled />
                                                         </div>
                                                     </div>
                                                     <div className="col-md-4">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">Regions Required</label>
                                                             <input id="email" name="foreigntitle"  type="text" className="form-control" value={allDealsData.regionsrequired && allDealsData.regionsrequired.length > 0 ? allDealsData.regionsrequired.join(", ") : allDealsData.regionsrequired} 
                                                             disabled />
                                                         </div>
                                                     </div>
                                                     <div className="col-md-4 ">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">Request</label>
                                                             <textarea id="email" name="analytics"  type="text" className="form-control" value={allDealsData.request} disabled />
                                                         </div>
                                                     </div>
 
                                                     <div className="col-md-4 ">
                                                         <div className="mb-3 input-field">
                                                             <label className="form-label form-label">Queries</label>
                                                             <textarea id="email" name="analytics" type="text" className="form-control" value={allDealsData.queries} disabled />
                                                         </div>
                                                     </div>
 
                                                 </div>
  
                                                 <div className="row status">
                                                
                                                    <div className="col-md-4 justify-content-between ps-0">
                                                    <div className="input-field d-flex align-items-center">
                                                        <label className="col-form-label">next followup Date</label>
                                                        <input id="email" name="followupdate" placeholder="Next Followup Date" type="text"
                                                         value={allDealsData && allDealsData.followupdate && moment(allDealsData && allDealsData.followupdate).format("DD-MMM-YYYY")}
                                                      
                                                        
                                                        className="form-control" disabled />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 justify-content-between ps-0">
                                                        </div>
 
                                                     <div className="col-md-3 justify-content-between ps-0 status-block">
 
                                                         <div className="input-field d-flex align-items-center">
 
                                                             <label className="col-form-label">Status</label>
                                                             <input className="form-control" name="status" value={allDealsData.status} disabled />
                                                                
                                                             
 
 
                                                         </div>
 
                                                     </div>
 
 
                                                     {/* <div className="col-md-9 justify-content-end d-flex align-items-center">
                                                         {followUp && followUp.length > 0 ?
                                                             <a className="btn btn-primary" onClick={handleUpdate}>UPDATE</a> :
                                                             <a className="btn btn-primary" style={{ "opacity": 0.5 }}>UPDATE</a>
                                                         }
 
                                                     </div> */}
 
                                                 </div>
                                                 </>
                                            :  <div className="row"><Loader /></div>}
                                             </div>
 
                                             <div className="tab-pane" id="messages1" role="tabpanel">
                                                 <div className="mb-3 row">
 
                                                     {followUpData && followUpData.length > 0 ?
                                                         <div className="col-md-12">
                                                             <label >FOLLOW UP</label>
                                                             {followUpData && followUpData.length > 0 && followUpData.map(function (item, i) {

                                                                
                                                                 return (
                                                                     <div className="comments-block" key={i}>
                                                                         <div className="d-flex align-item-center justify-content-between">  <div> <label>Created on:</label> <p className="time">{item.created ? new Date(item.created).toLocaleDateString('en-IN', {
                                                                             day: 'numeric',
                                                                             month: 'short',
                                                                             year: 'numeric',
                                                                             // hour: 'numeric',
                                                                             // minute: 'numeric',
                                                                         }) : ""}</p>
                                                                         </div>
                                                                             <div>
                                                                                 <label>Followup Date :</label><p className="time followup-date">{item.followupdate ? new Date(item.followupdate).toLocaleDateString('en-IN', {
                                                                                     day: 'numeric',
                                                                                     month: 'short',
                                                                                     year: 'numeric',
                                                                                     // hour: 'numeric',
                                                                                     // minute: 'numeric',
                                                                                 }) : ""}</p>
                                                                             </div>
                                                                         </div>
                                                                         <p className="comments">{item.followup}</p>

                                                                     </div>
                                                                 )
                                                             })}
 
                                                         </div> :  <div div className="followups"><div className="no-documents">
                                            <span className="material-icons-outlined">comment</span>
                                            <p>No follow-ups were found</p>
                                        </div></div>}
 
                                                 </div>
                                             </div>
                                         </div>
 
                                     </div>
 
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
 
 export default ViewDeals;
 