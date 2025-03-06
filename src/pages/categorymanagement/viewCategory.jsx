/***
 **Module Name: editCategory
 **File Name :  editCategory.js
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
 **Description : contains editCategory details.
 ***/
 import React, { useState, useEffect, useRef,useContext } from "react";
 import Footer from "../../components/dashboard/footer";
 import Header from "../../components/dashboard/header";
 import Sidebar from "../../components/dashboard/sidebar";
 import { useHistory, Link } from "react-router-dom";
 import SweetAlert from "react-bootstrap-sweetalert";
 import axios from "axios";
 import Modal from 'react-bootstrap/Modal';
 import { useParams } from 'react-router-dom';
 import Loader from "../../components/loader";
 import SessionPopup from "../SessionPopup"
 import moment from "moment";
 import { contentContext } from "../../context/contentContext";
 let { appname, lambda } = window.app;
 
 const ViewCategory = () => {
     const history = useHistory();
     let { id } = useParams();
     const ref = useRef();
     const [add, setAdd] = useState(false);
     const [categoryData, setCategoryData] = useState("");
     const [filedsData, setFiledsData] = useState("");
     const [isDelete, setIsDelete] = useState(false);
     const [item, setItem] = useState("");
     const [activeLoad, setActiveLoad] = useState("");
     const [buttonText, setButtonText] = useState("upload image");
     const [success, setSuccess] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
     
    const {route, currentPageNew,setRoute,setCurrentPage,setRowsPerPage,usePrevious,setActiveMenuId,GetTimeActivity} = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if(prevRoute != undefined && prevRoute!=route){
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);
    // console.log('prevRoute--->',prevRoute)
    // console.log('currentRoute--->',route)
    // console.log('currentPageNew--->',currentPageNew)
     useEffect(() => {
         if (!localStorage.getItem("token")) {
             history.push("/");
         }
         setRoute("category")
         setActiveMenuId(200002)
         if (id) {
             setAdd(false);
             getcategory();
 
         } else {
             setAdd(true);
         }
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
     const getcategory = (e) => {
        const token = localStorage.getItem("token")
         axios({
             method: 'GET',
             url: lambda + '/category?appname=' + appname + '&categoryid=' + id + "&token=" + token,
         })
             .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                 const result = response.data.result.data[0];
                //  console.log("result---------->", result)
                 setCategoryData(result);
                 setFiledsData(result.fields);
                }
             });
     }
     const handleBack = () => {
        GetTimeActivity() 
         history.push({
            pathname: "/categorymanagement",
            state: { search: true }
          });
     }

 

     const handleChangeCheck = (e, index, type) => {
        GetTimeActivity() 
 
         const updatedFileds = [...categoryData.fields];
         const isChecked = e.target.checked;
 
 
         updatedFileds[index][type] = isChecked
 
         setCategoryData({ ...categoryData, fields: updatedFileds })
 
     }
 
 

     function onCancel() {
        GetTimeActivity() 
         setIsDelete(false)
     }
     function onConfirm() {
        GetTimeActivity() 
         setSuccess(false)
     }
    
 
 
    //  console.log("categoryData", categoryData)
     return (
         <>
         {showSessionPopupup && <SessionPopup />}
             <div id="layout-wrapper">
                 <Header />
                 <Sidebar />
                 {isLoading ?
                     <Loader />
                     :
                     <div className="main-content create-user edit-content add-client edit-category view-category">
 
                         <div className="page-content ">
                             <div className="container-fluid">
 
 
 
                                 <div className="row mb-4 breadcrumb">
                                     <div className="col-lg-12">
                                         <div className="d-flex align-items-center">
                                             <div className="flex-grow-1">
                                                 <h4 className="mb-2 card-title">VIEW CATEGORY</h4>
                                             </div>
                                             <div><a className="btn btn-primary" onClick={handleBack}>back</a></div>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="create-user-block content_edit block_buyer">
 
                                 { Object.keys(categoryData).length >0 ? 
                                            <>  
 
                                     <div className="row">
                                         <div className="col-md-3 pe-1">
                                             <div className="form-block">
                                                 <div className="left_block">
                                                     <div className="row">
                                                         <div className="col-md-12">
                                                             <div className="mb-3 input-field">
                                                                 <label className="form-label form-label">CATEGORY NAME</label>
                                                                 <input className="form-control contact-number" type="text" name="name" placeholder="Category Name" id="example-email-input" value={categoryData.name} disabled/>
                                                             </div>
                                                         </div>
                                                         <div className="col-md-12">
                                                             <div className="mb-3 input-field">
                                                                 <label className="form-label form-label">UPLOAD IMAGE</label>
                                                                 {categoryData.image &&
                                                                     <div className="upload-image">
                                                                         <img src={categoryData.image} />
                                                                     </div>
                                                                 }
                                                                
                                                             </div>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                         <div className="col-md-9 ps-1">
                                             <div className="form-block">
                                                 <div className="row">
                                                     {add === true &&
                                                         <div className="col-md-4">
                                                             <div className="mb-3 input-field">
                                                                 <label className="form-label form-label">SELECT METADATA TEMPLATE</label>
                                                                 <select className="form-select" placeholder="Select Type">
                                                                     <option>Music</option>
                                                                     <option>Select</option>
                                                                     <option>Select</option>
                                                                     <option>Select</option>
                                                                 </select>
                                                             </div>
                                                         </div>
                                                     }
                                                     <div className="col-md-8">
                                                     </div>
                                                     <div className="col-md-12">
                                                         <div className="mb-1">
                                                             <label className="form-label form-label">META DATA</label>
                                                         </div>
                                                     </div>
                                                 </div>
                                                 <div className="table-responsive">
                                                     <table className="table table-striped seller_table buyer_table align-middle">
                                                         <thead>
                                                             <tr>
 
                                                                 <th>NAME</th>
                                                                 {/* <th>INPUT TYPE</th> */}
                                                                 <th>SEARCHABLE</th>
                                                                 <th>MANDATORY</th>
                                                                 {/* <th>ACTIONS</th> */}
 
                                                             </tr>
                                                         </thead>
                                                         <tbody>
                                                             {filedsData && filedsData.length > 0 && filedsData.map(function (item, i) {
                                                                 return (
                                                                     <tr key={i}>
                                                                         <td>{item.name}</td>
                                                                         {/* <td>{item.inputtype}</td> */}
                                                                         <td><div className="form-check font-size-16"><input className="form-check-input" type="checkbox" id="checkAll" checked={item.searchable} onChange={(e) => handleChangeCheck(e, i, "searchable")} disabled /><label className="form-check-label" htmlFor="checkAll"  ></label></div></td>
                                                                         <td><div className="form-check font-size-16"><input className="form-check-input" type="checkbox" id="checkAll" checked={item.mandatory} onChange={(e) => handleChangeCheck(e, i, "mandatory")} disabled /><label className="form-check-label" htmlFor="checkAll" ></label></div></td>
                                                                         {/* <td><div className="d-flex" onClick={(e) => handleDeleteFiled(e, item.name)}>
                                                                             <a data-bs-toggle="modal" data-bs-target="#staticBackdrop" className="text-danger action-button"><i className="mdi mdi-delete font-size-18 text-danger"></i>delete</a></div></td> */}
                                                                     </tr>
                                                                 )
                                                             })}
 
 
                                                         </tbody>
                                                     </table>
 
                                                 </div>
                                                 <div className="row">
                                                     <div className="col-md-12">
 
                                                         {/* <button className="btn btn-primary btn-block " type="submit" onClick={handleUpdateCategory} >update</button> */}
 
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
 
 
                                     </>
                                                : <div className="form-block">
                                                <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active show" id="home1" role="tabpanel">
                                                <div className="row"><Loader /></div>
                                                </div>
                                                </div>
                                                </div>}
 
 
 
                                 </div>
 
 
                             </div>
                         </div>
 
 
                         <Footer />
                        
                         <SweetAlert show={success}
                             custom
                             confirmBtnText="ok"
                             confirmBtnBsStyle="primary"
                             title={"Updated Successfully"}
                             onConfirm={e => onConfirm()}
                         >
                         </SweetAlert>
                     </div>
                 }
             </div>
         </>
     );
 };
 
 export default ViewCategory;
 