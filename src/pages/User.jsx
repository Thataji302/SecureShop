/***
**Module Name: profile
 **File Name :  profile.js
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
 **Description : contains profile page details.
 ***/
import React, { useState, useEffect } from "react";
// import Footer from "../components/dashboard/footer";
import Header from "../components/header/Header";
import Sidebar from ".././components/dashboard/sidebar";
import tmdbApi from "../api/tmdbApi";
import SweetAlert from 'react-bootstrap-sweetalert';
import SessionPopup from "./SessionPopup"
import { useHistory, Link } from "react-router-dom";
import * as Config from "../constants/Config";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import axios from 'axios';
import { removeSpecialCharecters, location } from '././../utils/commonUtils';

let { lambda, country, appname } = window.app;
var urlParams = location("type");
var id = location("id");
const User = () => {
    const history = useHistory();
    const [propertyData, setPropertyData] = useState({})
    const [config, setConfig] = useState({});
    const [activeId, setActiveId] = useState();
    const [formChange, setFormChange] = useState({});
    const [customerErrors, setCustomerErrors] = useState({});
    const [savedPropertyData, setSavedPropertyData] = useState({})
    const [emailError, setEmailError] = useState('');
    const [branchStatus, setBranchStatus] = useState(false);
    const [nameerror, setNameError] = useState('');
    const [resultSuccess, setResultSuccess] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteData, setDeleteData] = useState('');
    const [dataType, setDataType] = useState('');
    useEffect(() => {
        if (window.site) {
            setConfig(window.site);

        }

    }, [window.site]);
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        // console.log('urlParams', urlParams)
        if (id) {
            userClick()
            setBranchStatus(true)
        } else {
            getUser()
            setBranchStatus(false)
        }

    }, []);
    //  console.log("data", data);setCommission
    const goBack = () => {
        history.goBack();
    }
    const userClick = () => {
        const urlLink = lambda + '/userInfo?appname=' + appname + "&userId=" + id + "&type=companyUser";
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    // localStorage.setItem("previousid", response.data.result)
                    // history.push("./user");
                    // setBranchStatus(false)
                    setFormChange(response.data.result && response.data.result[0])

                }
            });
    }

    const backClick = () => {
        // history.goBack();
        setBranchStatus(false)
        getUser()
    }



    // const handleEmailMessage = (e) => {
    //     setError("");
    //     setEmailError("");
    // }
    function formvalidation() {
        let formIsValid = true;
        const regEx = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}(.[a-zA-Z{2,8}])?/g;
        // if (regEx.test(emailId)) {
        //     setEmailError("");
        // } else if (!regEx.test(emailId) && emailId !== "") {
        //     setEmailError("Email is Not Valid");
        //     formIsValid = false;
        // }

        // if (type === "") {
        //   setTypeError("Please Select Type");
        //   formIsValid = false;
        // }

        // if (Corporate === "") {
        //   setCategoryError("Please Select Corporate");
        //   formIsValid = false;
        // }
        if (formChange?.name === "") {
            setNameError("Please Enter Name");
            formIsValid = false;
        }
        // if (emailid === "") {
        //     setEmailError("Please Enter Email");
        //     formIsValid = false;
        // }
        // if (Corporate === "COMPANY" && companyName === "") {
        //   setCompanyError("Please Enter Company Name");
        //   formIsValid = false;
        // }

        return formIsValid;


    }

    const handleUpdate = (e) => {
        let valid = formvalidation();
        // let id = id;
        // let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        let companyId = localStorage.getItem("companyId")
        // console.log("id", id)
        if (valid && id) {
            let payload =
            {
                "name": formChange?.name,
                "emailId": formChange?.emailId,
                "status": formChange?.status,
                "phoneNumber": formChange?.phoneNumber,
                "companyId": companyId,
                "type": "companyUser",
                "userId": id,
            }
            console.log("payload", payload)
            const urlLink = lambda + '/updateUser?appname=' + appname + "&userId=" + id + "&type=companyUser";
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./user");
                        window.location = "/user"
                        setBranchStatus(false)
                        getUser()

                    }
                });
        } else if (valid) {
            formChange["companyId"] = companyId
            formChange["type"] = "companyUser"
            let payload = formChange;
            console.log("payload", payload)
            const urlLink = lambda + '/addUser?appname=' + appname;
            axios({
                method: 'POST',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./branches");
                        setBranchStatus(false)
                        getUser()
                    }
                });
        }

        // formvalidation()
    }
    const getUser = (e) => {
        let companyId = localStorage.getItem("companyId")
        const urlLink = lambda + '/userInfo?appname=' + appname + "&type=companyUser";
        axios({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    // localStorage.setItem("previousid", response.data.result)
                    // history.push("./branches");
                    setSavedPropertyData(response.data.result)
                    // getUser()
                }
            });
    }

    const editClick = (e, item) => {
        let type = item && item.type;
        let id = item && item.userId;
        //localStorage.setItem("item", JSON.stringify(item));
        //history.push("/lookupForm")
        localStorage.removeItem("formType");
        window.location = `/user?id=${id} `;
    }
    const deleteClick = (e, item) => {
        setDeleteConfirm(true)
        setDeleteData(item)

    }

    function onConfirm1() {
        setResultSuccess(false)
        // const type = "companyUser";
        getUser();
    };
    function closePopup() {
        setDeleteConfirm(false)
    };

    function onConfirm2() {
        setDeleteConfirm(false)
        let item = deleteData;
        setDataType(item && item.type)
        let type = item && item.type;
        let id = item && item.userId;
        //let lookupid = id;
        if (id) {
            //let payload;
            // let userid = localStorage.getItem("userid")
            //formChange ["status" ] = "Archive"
            let companyId = localStorage.getItem("companyId")
            let payload =
            {
                "name": formChange?.name,
                "emailId": formChange?.emailId,
                "status": "Archive",
                "phoneNumber": formChange?.phoneNumber,
                "companyId": companyId,
                "type": "companyUser",
                "userId": id,
            }

            const urlLink = lambda + '/delete?appname=' + appname + "&userId=" + id + "&type=" + type;
            axios({
                method: 'DELETE',
                url: urlLink,
                data: payload
            })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        // localStorage.setItem("previousid", response.data.result)
                        // history.push("./fastag");
                        setResultSuccess(true)
                    }
                });
        }
        // const type = "branches";
        // GetPropertyData(type);
    };
    let type = localStorage.getItem("formType");
    let imageCloudfront;
    if (config.common && config.common.imageCloudfront) {
        imageCloudfront = config.common.imageCloudfront;
    }
    console.log("imageCloudfront", imageCloudfront)
    const addClick = (e, item) => {
        setBranchStatus(true)
        // setName("")
        // setBranchAddress("")
        // setNumber("")
        // setDealerCode("")
    }
    const handleChange = (e) => {
        console.log('typeeeeeeeeee', e.target.value)
        console.log('nameeeee', e.target.name)
        if (!!customerErrors[e.target.name]) {
            let error = Object.assign({}, customerErrors);
            delete error[e.target.name];
            setCustomerErrors(error);

        }
        const { name, value } = e.target;
        if (value === '') {
            console.log('Input cleared');
        }
        setFormChange({
            ...formChange,
            [name]: value
        });


    }
    return (
        <>
            <div id="layout-wrapper">
                <div className="dashboard">
                    <Header />
                    <div className="main-content look_ups">

                        <div className="page-content">
                            <div className="container-fluid">
                                {/* <div className="breadcurmb">
                                    <div className="title_block">
                                        <h5>Lookups</h5>
                                    </div>
                                   
                                </div> */}
                                <div className="card">
                                    <div className="card-body">



                                        <div className="tab-content pt-15 text-muted">
                                            <div className="tab-pane active branches" id="ENTITY" role="tabpanel">
                                                {!branchStatus && savedPropertyData && savedPropertyData?.length > 0 &&
                                                    <div className="breadcurmb">
                                                        <div className="title_block">
                                                            <h5>Users</h5>
                                                        </div>
                                                        <div className="buttons">

                                                            <button className=" btn-primary" onClick={addClick}>add</button>
                                                        </div>
                                                    </div>}
                                                {!branchStatus ?
                                                    <div>
                                                        {savedPropertyData && savedPropertyData?.length > 0 ?
                                                            <div className="table-responsive">
                                                                <table className="table table-striped ">
                                                                    <thead>
                                                                        <tr>

                                                                            {/* <th className="align-middle">S No</th> */}
                                                                            <th className="align-middle">Name</th>
                                                                            <th className="align-middle">Email Id</th>
                                                                            <th className="align-middle">Phone Number</th>
                                                                            <th className="align-middle">Status</th>
                                                                            <th className="align-middle">Created</th>
                                                                            <th className="align-middle">Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {savedPropertyData?.map((eachItem, key) => {
                                                                            return (eachItem && eachItem.status != "Archive" ?
                                                                                <tr key={key}>
                                                                                    <td>{eachItem?.name ? eachItem?.name : 'N/A'}</td>
                                                                                    <td>{eachItem?.emailId ? eachItem?.emailId : 'N/A'}</td>
                                                                                    <td>{eachItem?.phoneNumber ? eachItem?.phoneNumber : 'N/A'}</td>
                                                                                    <td>{eachItem?.status ? eachItem?.status : 'N/A'}</td>
                                                                                    <td>{moment(eachItem?.created).format('DD-MM-YYYY')}</td>

                                                                                    <td><div className="d-flex">
                                                                                        <a className="action-button edit tooltip-container" onClick={e => editClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Edit</span>edit</span></a>
                                                                                        <a className="action-button delete tooltip-container" onClick={e => deleteClick(e, eachItem)}><span className="material-icons"><span className="tooltip">Delete</span>delete</span></a></div></td>
                                                                                </tr>
                                                                                : <div className="form_section"><div className="empty_page">
                                                                                    <span><img src="https://d9nwtjplhevo0.cloudfront.net/orasi/admin/resources/orasiv1/images/add-conversation.png" /></span>
                                                                                    <p>There are no users available.<br />Please add users.</p>
                                                                                    <a className="btn btn-primary" onClick={addClick}>ADD</a>
                                                                                </div> </div>)

                                                                        }

                                                                        )
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            :
                                                            <div className="form_section"><div className="empty_page">
                                                                <span><img src="https://d9nwtjplhevo0.cloudfront.net/orasi/admin/resources/orasiv1/images/add-conversation.png" /></span>
                                                                <p>There are no users available.<br />Please add users.</p>
                                                                <a className="btn btn-primary" onClick={addClick}>ADD</a>
                                                            </div> </div>}
                                                    </div>
                                                    :

                                                    <div className="form_seciton">
                                                        <div className="breadcurmb">
                                                            <div className="title_block">
                                                                <h5>add user</h5>
                                                            </div>
                                                            <div className="buttons">

                                                                <a href="#" className="back_btn" onClick={backClick} style={{ cursor: 'pointer' }}><span className="material-icons icon"> arrow_back</span>BACK</a>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">User Name</label>
                                                                    <input type="text" className="form-control" id="name" placeholder="Enter Name" name="name" value={formChange?.name} onChange={(e) => handleChange(e)} required /> {nameerror != "" ?
                                                                        <span className="errormsg" style={{
                                                                            fontWeight: 'bold',
                                                                            color: 'red',
                                                                        }}>{nameerror}</span> : ""
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Phone Number</label>
                                                                    <input type="number" className="form-control" id="companyNumber" placeholder="Enter Number" name="phoneNumber" value={formChange?.phoneNumber} onChange={e => handleChange(e)} autoComplete="on" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Email Id</label>
                                                                    <input type="text" className="form-control" id="name" placeholder="Enter Email" name="emailId" value={formChange?.emailId} onChange={(e) => handleChange(e)} autoComplete="on" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">Status</label>
                                                                    {/* <input type="text" className="form-control" id="name" placeholder="Enter Status" name="status" value={formChange?.status} onChange={(e) => handleChange(e)} autoComplete="on" /> */}
                                                                    <select className="form-select" aria-label="Default select example" name="status" value={formChange?.status} onChange={handleChange}>
                                                                        <option value="">Select Status </option>
                                                                        <option value="Active">Active</option>
                                                                        <option value="Inactive"> Inactive</option>

                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12 mb-2">
                                                                <button className="update_btn" type="submit" onClick={e => handleUpdate(e)} style={{ cursor: 'pointer' }}>save</button>
                                                            </div>
                                                        </div>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>




                            </div>
                        </div>
                        {resultSuccess &&
                            <SweetAlert show={resultSuccess}
                                custom
                                confirmBtnText="Ok"
                                confirmBtnBsStyle="primary"
                                title={"Deleted Successfully"}
                                onConfirm={e => onConfirm1()}
                            >
                            </SweetAlert>}
                        {/* {resultSuccess &&
                            <SweetAlert show={resultSuccess}
                                custom
                                confirmBtnText="Ok"
                                confirmBtnBsStyle="primary"
                                title={"Deleted Successfully"}
                                onConfirm={e => onConfirm1()}
                            >
                            </SweetAlert>} */}
                        {/* {deleteConfirm &&
                            <SweetAlert show={deleteConfirm}
                                custom
                                confirmBtnText="Ok"
                                confirmBtnBsStyle="primary"
                                title={"Are you sure want to delete?"}
                                onConfirm={e => onConfirm2()}
                            >
                            </SweetAlert>} */}
                        <footer className="footer">
                            <div className="container-fluid">
                                <div className="row">

                                    <div className="col-sm-12 text-center">
                                        <div className="text-sm-center d-none d-sm-block text-center">
                                            2024 ALL RIGHTS RESERVED.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </footer>
                        {/* {deleteConfirm &&
                        <div className="modal delete_popup">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                   
                                    <div className="modal-body">
                                    <button className="close-btn" onClick={e => closePopup()}><span className="material-icons">close</span></button>
                                    <span className="material-icons access-denied-icon">delete_outline</span>
                                    <h3>Delete</h3>
                                    <p>This action cannot be undone.</p>
                                    <p>Are you sure you want to delete?</p>
                                    <div className="popup-footer">
                                    <button className="fill_btn" onClick={e => onConfirm2()}>Yes, Delete</button>
                                    </div>
                                  </div>

                                </div>
                            </div>
                        </div>} */}
                        {deleteConfirm &&
                            <Modal className="access-denied delete_popup" show={deleteConfirm}>

                                <div className="modal-body">
                                    <div className="container">
                                        <button className="close-btn" onClick={e => closePopup()}><span className="material-icons">close</span></button>
                                        <span className="material-icons access-denied-icon">delete_outline</span>
                                        <h3>Delete</h3>
                                        <p>This action cannot be undone.</p>
                                        <p>Are you sure you want to delete ?</p>
                                        <div className="popup-footer">
                                            <button className="fill_btn " onClick={e => onConfirm2()}> Yes, Delete</button>
                                        </div>
                                    </div>
                                </div>

                            </Modal>}
                    </div>

                </div>
            </div>

        </>
    );
};

export default User;
