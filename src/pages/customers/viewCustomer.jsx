/***
**Module Name: view customer
 **File Name :  viewcustomer.js
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
 **Description : contains view customer details.
 ***/
 import React, { useState, useEffect, useContext } from "react";
 import Footer from "../../components/dashboard/footer";
 import Header from "../../components/dashboard/header";
 import Sidebar from "../../components/dashboard/sidebar";
 import { useHistory, Link } from "react-router-dom";
 import { useParams } from 'react-router-dom';
 import tmdbApi from "../../api/tmdbApi";
 import SessionPopup from "../../pages/SessionPopup"
 import axios from 'axios';
 import moment from "moment";
 
 import Select from 'react-select';
 import Loader from "../../components/loader";
 import SweetAlert from 'react-bootstrap-sweetalert';
 import { contentContext } from "../../context/contentContext";
 import * as Config from "../../constants/Config";
 let { lambda, country, appname } = window.app;
 
 const ViewCustomer = () => {
     let { id } = useParams();
     const history = useHistory();
     const [msg, setMsg] = useState("");
     const [countries, setCountries] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const [isUserAdd, setIsUserAdd] = useState(false);
     const [emailError, setEmailError] = useState('');
     const [nameError, setNameError] = useState('');
     const [phoneError, setPhoneError] = useState('');
     const [IdcError, setIdcError] = useState('');
     const [typeError, setTypeError] = useState('');
     const [managertypeError, setManagerTypeError] = useState('');
     
     const [editCustomer, setEditCustomer] = useState({ });
     const [permission, setPermission] = useState({});
     const [success, setSuccess] = useState(false);
     const [UpdateSuccess, setUpdateSuccess] = useState(false);
     const [manager, setManagers] = useState({});
     const [selectAll, setSelectAll] = useState(false);
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
     const [existmsg, setExistMsg] = useState(false);
     const [Ismsg, setIsMsg] = useState(false);
     const [checkStatus, setCheckStatus] = useState(false);
     const [invalidContent, setInvalidContent] = useState(false);
     const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, userData, setActiveMenuId ,GetTimeActivity} = useContext(contentContext);
 
     const prevRoute = usePrevious(route)
     useEffect(() => {
         if (prevRoute != undefined && prevRoute != route) {
             setCurrentPage(1)
             setRowsPerPage(15)
         }
     }, [prevRoute]);
 
 
     useEffect(() => {
         if (!localStorage.getItem("token")) {
             history.push("/");
         }
         setActiveMenuId(200004)
         setRoute("wholesaler")
         if (id) {
            //  getuser();
            getCustomer();
            // console.log(id);
 
         }
        //  getManagers();
        //  GetCountries();
        //  userActivity();
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
 
     const GetCountries = async () => {
         try {
             console.log(tmdbApi);
             const response = await tmdbApi.getLookUp({
                 "type": ["country"],
                 "sortBy": "alpha3",
                 "projection":"tiny"
             });
 
             // console.log(response.result);
             if (response?.result?.data === "Invalid token or Expired") {
                 setShowSessionPopupup(true)
             } else {
                 setCountries(response.result.data);
             }
         } catch {
             console.log("error");
         }
     };
 


     const getCustomer = (e) => {
        GetTimeActivity()
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/customer?appname=' + appname + '&userid=' + localStorage.getItem("userId") + "&token=" + token + "&customerid=" + id,
        })
            .then(function (response) {
                //  console.log("response", response.data.result[0]);
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                }
                else {
                    console.log(response.data);
                    if (response.data.result.length > 0) {
                        setEditCustomer(response.data.result[0]);
                       
                    } else {
                        setInvalidContent(true)
                    }
                }
            });
    }

 
     const onclickInvalid = () => {
         GetTimeActivity()   
         setInvalidContent(false)
         history.push('/wholesalers')
     }
 

   
     function onConfirm() {
         GetTimeActivity()   
         setSuccess(false);
         history.push("/wholesalers")
     };


 
 
 
 
 
 
     const handleBack = (e) => {
         GetTimeActivity()   
         if (id) {
             history.push({
                 pathname: "/wholesalers",
                 state: { search: true }
             });
         } else {
             history.push("/wholesalers")
         }
     }
 
 
 
 
 

 
 
     //  console.log("status", editUser.emailid);
 
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
                     title={"customer Not Found"}
                     onConfirm={e => onclickInvalid()}
                 >
                 </SweetAlert>
                 {!invalidContent &&
 
                     <div className="main-content user-management create-user">
 
                         <div className="page-content ">
                             <div className="container-fluid">
 
 
 
                                 <div className="row mb-4 breadcrumb">
                                     <div className="col-lg-12">
                                         <div className="d-flex align-items-center">
 
                                             <div className="flex-grow-1">
                                                 <h4 className="mb-2 card-title">VIEW WHOLESALER</h4>
                                                 {/* <p className="menu-path"><span>Customer Management</span> / <b>VIEW CUSTOMER</b></p> */}
 
                                             </div>
                                             <div>
                                                 <a onClick={handleBack} className="btn btn-primary">back</a>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
 
 
                                 <div className="create-user-block">
                                 {Object.keys(editCustomer).length > 0 || countries.length >0 ?
                                        <>     
                                            <div className="form-block">
                                                <div className="row">
                                                    <div className="col mt-3">
                                                        <div className="row">
                                                    
                                                            <div className="col-md-6">
                                                                <label className="form-label form-label">NAME<span className="required">*</span></label>
                                                                <input id="titlename" name="name" placeholder="Enter Name" type="text" className="form-control form-control" aria-invalid="false" value={editCustomer && editCustomer.name} disabled/>
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                    }}>{nameError}</span>

                                                            </div>
                                                            <div className="col-md-6">
                                                                <label className="form-label form-label">CONTACT NUMBER</label>
                                                                
                                                               
                                                                    
                                                                       
                                                                    

                                                                    <input className="form-control contact-number" type="tel" name="phonenumber" value={editCustomer && editCustomer.phonenumber} placeholder="Enter Phone Number"  maxLength="10" id="example-tel-input" disabled/>
                                                                    
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                    }}>{phoneError}</span>
                                                            
                                                    
            
                                                        
            
            
                                                        
                                                            </div>
                                                        </div>
                                                    
                                                    
                                                    </div>
                                                
                                                </div>
                                                <div className="row">
                                                        <div className="col-md-6 mt-3">
                                                            <label className="form-label form-label">E-MAIL ID<span className="required">*</span></label>
                                                                <input id="email" name="emailid" placeholder="Enter Your Email" type="email" className="form-control form-control" aria-invalid="false" value={editCustomer && editCustomer.emailid} disabled={id !== undefined}/>
                                                                        <span className="errormsg" style={{
                                                                                fontWeight: 'bold',
                                                                                color: 'red',
                                                                            }}>{emailError}</span>
                                                        </div>
                                                        <div className="col-md-6 mt-3">
                                                        <label for="exampleFormControlTextarea1" className="form-label">Status<span className="required">*</span></label>
                                                        <select className="form-select" aria-label="Default select example" name="status" value={editCustomer && editCustomer.status} disabled>
                                                            <option selected>Select status</option>
                                                            <option value="INACTIVE">INACTIVE</option>
                                                            <option value="ACTIVE">ACTIVE</option>
                                                            <option value="ARCHIVE">ARCHIVE</option>

                                                        </select>
                                                       
                                                     
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                        <h5>Customer Address</h5>
                                                        <div className="col-md-6">
                                                                <label for="customeraddress1" className="form-label">Address 1</label>
                                                                <textarea className="form-control" id="address1" name="customeraddress1" rows="1"  value={editCustomer && editCustomer.customeraddress && editCustomer.customeraddress.address1} disabled></textarea>

                                                        </div>
                                                        <div className="col-md-6">
                                                                <label for="customeraddress2" className="form-label">Address 2</label>
                                                                <textarea className="form-control" id="address2" name="customeraddress2" rows="1"  value={editCustomer && editCustomer.customeraddress && editCustomer.customeraddress.address2} disabled></textarea>

                                                        </div>
                                                </div>
                                                <div className="row mt-3">
                                                        <div className="col-md-6">
                                                                <label for="exampleFormControlTextarea1" className="form-label">State</label>
                                                                <input type="text" className="form-control" name="customerstate" value={editCustomer && editCustomer.customeraddress && editCustomer.customeraddress.state} disabled/>
                                                                   
                                                               
                                                        </div>
                                                        <div className="col-md-6">
                                                                <label htmlFor="customeraddresspincode" className="form-label">Zip Code</label>
                                                                <input type="text" className="form-control" id="customerpincode"  placeholder=""  value={editCustomer&& editCustomer.customeraddress && editCustomer.customeraddress.pincode} disabled/>
                                                        </div>
                                                </div>
                                                <div className="row mt-3">
                                                        <div className="d-flex">
                                                            <h5>Billing Address</h5>
                                                            <div className="form-check ms-3">
                                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" name="checkboxinput" disabled/>
                                                                <label className="form-check-label" for="flexCheckDefault">
                                                                Same as customer address
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                                <label for="customeraddress1" className="form-label">Address 1</label>
                                                                <textarea className="form-control" id="address1" name="billingaddress1" rows="1"  value={editCustomer && editCustomer.billingaddress && editCustomer.billingaddress.address1} disabled></textarea>

                                                        </div>
                                                        <div className="col-md-6">
                                                                <label for="customeraddress2" className="form-label">Address 2</label>
                                                                <textarea className="form-control" id="address2" name="billingaddress2" rows="1"   value={editCustomer && editCustomer.billingaddress && editCustomer.billingaddress.address2}disabled></textarea>

                                                        </div>
                                                </div>
                                                <div className="row mt-3">
                                                        <div className="col-md-6">
                                                                <label for="exampleFormControlTextarea1" className="form-label">State</label>
                                                                <input name="state" className="form-select" aria-label="Default select example" value={editCustomer && editCustomer.billingaddress &&editCustomer.billingaddress.state} disabled/>
                                                              
                                                                
                                                        </div>
                                                        <div className="col-md-6">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label">Zip Code</label>
                                                                <input name="billingpincode" type="text" className="form-control" id="exampleFormControlInput1" placeholder=""  value={editCustomer&& editCustomer.billingaddress && editCustomer.billingaddress.pincode} disabled/>
                                                        </div>
                                                </div>
                                              
                                                
                                               
                                            </div>
        
                                           
                                     </>: <div className="form-block">
                                <div className="tab-content p-3 text-muted">
                                    <div className="tab-pane active show" id="home1" role="tabpanel">
                                       <Loader />
                                    </div>
                                </div>
                            </div>
                        }

                                        
                                                 
                                     <SweetAlert show={UpdateSuccess}
                                         custom
                                         confirmBtnText="ok"
                                         confirmBtnBsStyle="primary"
                                         title={"Updated successfully"}
                                         onConfirm={e => setUpdateSuccess(false)}
                                     ></SweetAlert>
                                     <SweetAlert show={success}
                                         custom
                                         confirmBtnText="ok"
                                         confirmBtnBsStyle="primary"
                                         title={"Login Link sent successfully"}
                                         onConfirm={e => onConfirm()}
                                     >
                                     </SweetAlert>
                                     <SweetAlert show={existmsg}
                                         custom
                                         confirmBtnText="ok"
                                         confirmBtnBsStyle="primary"
                                         title={"User Already Exist"}
                                         onConfirm={e => setExistMsg(false)}
                                     >
                                     </SweetAlert>
                                    
                                       
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
 
 export default ViewCustomer;
 