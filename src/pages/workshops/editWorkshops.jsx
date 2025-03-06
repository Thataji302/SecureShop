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
import { useParams } from 'react-router-dom';
import tmdbApi from "../../api/tmdbApi";
import SessionPopup from "../SessionPopup"
import axios from 'axios';
import moment from "moment";

import Select from 'react-select';
import Loader from "../../components/loader";
import SweetAlert from 'react-bootstrap-sweetalert';
import { contentContext } from "../../context/contentContext";
import * as Config from "../../constants/Config";
let { lambda, country, appname } = window.app;

const EditWorkShops = () => {
    let { id } = useParams();
    const history = useHistory();
    const [msg, setMsg] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isUserAdd, setIsUserAdd] = useState(false);

    const [nameError, setNameError] = useState('');
    // const [phoneNumberError, setPhoneNumberError] = useState('');
    const [departMentsError, setDepartMentsError] = useState('');
    const [statusError, setStatusError] = useState('');
    const [editWorkShop, seteditWorkShop] = useState({});
    const [success, setSuccess] = useState(false);
    const [UpdateSuccess, setUpdateSuccess] = useState(false);
    const [manager, setManagers] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [existmsg, setExistMsg] = useState(false);
    const [Ismsg, setIsMsg] = useState(false);
    const [checkStatus, setCheckStatus] = useState(false);
    const [invalidContent, setInvalidContent] = useState(false);
    const [BtnLoader, setBtnLoader] = useState(false);
    const [lookup, setLookUp] = useState({});
    const [image, setImg] = useState('');
    const [countries, setCountries] = useState('');
    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, userData, setActiveMenuId, GetTimeActivity } = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);
    // console.log("idddd", id)
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

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setActiveMenuId(200008)
        setRoute("workshops");
        if (id) {
            getWorkShop();

        }
        GetCountries();

        userActivity();
    }, []);

    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = id != undefined ? path[path.length - 2] : path[path.length - 1];;
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": "EDITWORKSHOP",
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

    // const GetCountries = async () => {
    //     try {
    //         console.log(tmdbApi);
    //         const response = await tmdbApi.getLookUp({
    //             "type": ["department"],
    //             "status":"ACTIVE"
    //         });

    //         // console.log(response.result);
    //         if (response.result.data == "Invalid token or Expired") {
    //             setShowSessionPopupup(true)
    //         } else {
    //             setCountries(response.result.data);
    //         }
    //     } catch {
    //         console.log("error");
    //     }
    // };

    const GetCountries = async (e) => {
        try {
            let arrayType = ["country", "videoformat", "language", "territories"];

            const response = await tmdbApi.getLookUp({
                // type: arrayType
                "status":"ACTIVE"
            });
            // console.log(response);
            if (response?.statusCode == 200) {
                let arrayType = ["department"];
                let lookupsData = response?.result.data || []
                // console.log("lookupsData", lookupsData);
                arrayType.map((eachItem) => {
                    let arr1 = []
                    lookupsData.map((item1) => {
                        if (item1.type == eachItem) {
                            arr1.push(item1.name)
                        }
                    });
                    lookup[eachItem] = arr1
                    setLookUp({ ...lookup });
                })
                 console.log('loookup', lookup)
                const departmentObj = prepareObject(lookup.department)
                setCountries(departmentObj)
               

            }

        } catch {
            console.log("error");
        }
    }
    const prepareObject = (item) => {
        GetTimeActivity() 
        const resultArr = item.map((eachItem) => { return { value: eachItem, label: eachItem }; })
        return resultArr
    }

    const getWorkShop = (e) => {
        GetTimeActivity()

        axios.get(lambda + '/workshop?appname=' + appname + '&userId=' + localStorage.getItem('userId') + '&token=' + localStorage.getItem('token') + '&workshopid=' + id)
            .then(function (response) {
                //  console.log("response", response.data.result[0]);
                if (response?.data?.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                }
                else {
                    if (response.data.result.length > 0) {
                        seteditWorkShop(response.data.result[0]);

                    } else {
                        setInvalidContent(true)
                    }
                }
                // getPermissions(response.data && response.data.result && response.data.result[0] && response.data.result[0].type)
            });
    }

    
    
    const onclickInvalid = () => {
        GetTimeActivity()
        setInvalidContent(false)
        history.push('/workshops')
    }


    const handleChange = (e) => {
        console.log('typeeeeeeeeee', e.target.value)
        console.log('nameeeee', e.target.name)
        if (e.target.name === "phonenumber") {
            const numericValue = e.target.value.replace(/\D/g, '');
            seteditWorkShop({ ...editWorkShop, [e.target.name]: numericValue })
        } else {

            seteditWorkShop({ ...editWorkShop, [e.target.name]: e.target.value });
        }

    }
    const returnArray = (arr) => {
        let arr2 = []
        //  console.log(arr);
        arr.map((eachItem) => {
            arr2.push(eachItem.value)
        })
        // console.log(arr2)
        return arr2
    }
    const handleChangeMultiSelect = (selected, key) => {
        let selectedArray = returnArray(selected);

        seteditWorkShop({ ...editWorkShop, [key]: selectedArray });

    }
    function onConfirm() {
        GetTimeActivity()
        setSuccess(false);

        history.push("/workshops")
    };

    const handleAddWorkShop = (e) => {
        GetTimeActivity()
        const isValid = formvalidation();
        if (isValid) {
            createuser();
        }
    }

    function formvalidation() {
        GetTimeActivity()
        let formIsValid = true;


        if (editWorkShop?.name == undefined || editWorkShop?.name?.trim() == "") {
            setNameError("Please enter Name");
            setTimeout(function () { setNameError("") }, 3000);
            formIsValid = false;
        }
        if (editWorkShop?.departments == undefined || editWorkShop?.departments == "") {            setDepartMentsError("Please select type");
            setTimeout(function () { setDepartMentsError("") }, 3000);
            formIsValid = false;
        }
        if (editWorkShop?.status == undefined || editWorkShop?.status?.trim() == "") {
            setStatusError("Please select type");
            setTimeout(function () { setStatusError("") }, 3000);
            formIsValid = false;
        }
        
        return formIsValid;
    }


    const handleSubmit = () => {
        GetTimeActivity()
        setBtnLoader(true)


        // let payload = {}
        const payload = {
            "name": editWorkShop.name?.trim(),
            "phonenumber": editWorkShop.phonenumber,
            "departments": editWorkShop.departments,
            "status": editWorkShop.status
        }

        // if (checkStatus === false) {
        //     delete payload["status"];
        //     delete payload["userType"];
        // }

        axios.post(lambda + '/updateworkshops?appname=' + appname + '&userId=' + localStorage.getItem('userId') + '&token=' + localStorage.getItem('token') + '&workshopid=' + id, payload)
            .then(function (response) {
                if (response) {
                    if (response?.data?.result?.data === "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else if (response.data.result.data === "This ACM assaigned to companies") {
                        setIsMsg(true);
                        setBtnLoader(false);
                    } else {
                        setBtnLoader(false);
                        setUpdateSuccess(true)
                    }
                }

            });
    }


    const handleUpdate = (e) => {
        GetTimeActivity()
        const isValid = formvalidation();
        if (isValid) {
            handleSubmit();
        }
        // console.log("updated")
    }
    const createuser = async () => {
        setBtnLoader(true)
        GetTimeActivity()
        let payload = {}
        payload = {
            "name": editWorkShop.name?.trim(),
            "phonenumber": editWorkShop.phonenumber,
            "departments": editWorkShop.departments,
            "status": editWorkShop.status,
            "createdBy": { userid: userData.userid, username: userData.name }
        }
        // const token = localStorage.getItem("token")
        axios.put(lambda + '/workshops?appname=' + appname + '&userId =' + localStorage.getItem('userId') + '&token=' + localStorage.getItem('token'), payload)
            .then(response => {

                console.log(response.data.result);
                if (response) {
                    console.log("response.result", response)
                    if (response.data.result === "workshop already exists") {
                        setExistMsg(true)
                        setBtnLoader(false);
                    }
                    else if (response?.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                        setBtnLoader(false);
                    }
                    else {
                        setSuccess(true);
                        setBtnLoader(false);
                    }
                }
            })
            .catch(error => {
                console.log('Error' + error);
            });
    };

    const handleBack = (e) => {
        GetTimeActivity()
        if (id) {
            history.push({
                pathname: "/workshops",
                state: { search: true }
            });
        } else {
            history.push("/workshops")
        }
    }

    const CancelClick = () => {
        GetTimeActivity()
        setIsMsg(false);
        history.push("/workshops")
    }


console.log("work",editWorkShop);

    

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
                    title={"workshop Not Found"}
                    onConfirm={e => onclickInvalid()}
                ></SweetAlert>
                {!invalidContent &&
                    <div className="main-content user-management create-user">
                        <div className="page-content">
                            <div className="container-fluid">
                               
                                       <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">

                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">{id === undefined ? "CREATE WORKSHOP" : "EDIT WORKSHOP"}</h4>
                                                <p className="menu-path">WORKSHOPS / <b>{id === undefined ? "Create Workshop" : "Edit Workshop"}</b></p>
                                            </div>
                                            <div>
                                                <a onClick={handleBack} className="btn btn-primary">back</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="create-user-block">
                                    {(Object.keys(editWorkShop).length > 0 ) || (id === undefined)  ?
                                        <>
                                            <div className="form-block">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <label htmlFor="WorkShop Name">WorkShop Name<span className="required">*</span></label>
                                                        <input id="titlename" name="name" type="text" className="form-control" placeholder="Enter Name" onChange={(e) => handleChange(e)} value={editWorkShop && editWorkShop.name} />
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{nameError}</span>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="Phone Number">Phone Number</label>
                                                        <div>
                                                               

                                                                <input className="form-control contact-number" type="tel" name="phonenumber" value={editWorkShop && editWorkShop.phonenumber} placeholder="Enter Phone Number" onChange={(e) => handleChange(e)} maxLength="10" id="example-tel-input" />
                                                                {/* <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{IdcError}</span>
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{phoneError}</span> */}
                                                            </div>
                                                    </div>


                                                </div>
                                                <div className="row mt-4">
                                                    <div className="col-md-6">

                                                        <label for="exampleFormControlTextarea1" name="departments" className="form-label" >Departments<span className="required">*</span></label>
                                                        <Select isMulti={true}
                                                        placeholder={"Select Department"}
                                                        onChange={(e) => handleChangeMultiSelect(e,"departments")}
                                                        options={countries}
                                                        value={editWorkShop && editWorkShop.departments && editWorkShop.departments.map((eachItem) => { return { value: eachItem, label: eachItem } }) }
                                                    />
                                                        {/* <select className="form-select" name="departments" aria-label="Default select example" onChange={(e) => handleChange(e)} value={editWorkShop && editWorkShop.departments}>
                                                            <option value= "" selected>Select </option>
                                                            {countries && countries.length > 0 && countries.map((task, i) => {
                                                                        return (
                                                                            <><option key={i} value={task.name}>{task.name}</option></>
                                                                        )
                                                                    }
                                                                    )}

                                                        </select> */}
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{departMentsError}</span>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label for="exampleFormControlTextarea1" className="form-label">Status<span className="required">*</span></label>
                                                        <select className="form-select" aria-label="Default select example" name="status" onChange={(e) => handleChange(e)} value={editWorkShop && editWorkShop.status}>
                                                            <option value= "" selected>Select status</option>
                                                            <option value="INACTIVE">INACTIVE</option>
                                                            <option value="ACTIVE">ACTIVE</option>
                                                            <option value="ARCHIVE">ARCHIVE</option>

                                                        </select>
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{statusError}</span>
                                                     
                                                    </div>
                                                </div>


                                                {/* <button type="submit" className="btn btn-info rounded-pill px-4 mt-3" onClick={e => id == undefined ? handleAddUser(e) : handleUpdate(e)}>Create</button> */}
                                                <button className="btn btn-primary rounded-pill px-4 mt-3" type="button" onClick={e => id === undefined ? handleAddWorkShop(e) : handleUpdate(e)}>
                                                    {id == undefined ? <>{BtnLoader ? (<img src={image + Config.imgloader + "rotate_right.svg"} className="loading-icon" />) : null} Create</> :
                                                        <>{BtnLoader ? (<img src={image + Config.imgloader + "rotate_right.svg"} className="loading-icon" />) : null} Update </>}</button>


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
                                    title={"Added successfully"}
                                    onConfirm={e => onConfirm()}
                                />
                                <SweetAlert show={existmsg}
                                    custom
                                    confirmBtnText="ok"
                                    confirmBtnBsStyle="primary"
                                    title={"workshop already exists"}
                                    onConfirm={e => setExistMsg(false)}
                                >
                                </SweetAlert>
                                {/* <SweetAlert show={Ismsg}
                                 custom
                                 confirmBtnText="ok"
                                 confirmBtnBsStyle="primary"
                                 title={"User type cannot change as the user assigned as an account manager to the companies"}
                                 onConfirm={e => CancelClick()}
                             >
                             </SweetAlert> */}
                            </div>
                        </div >
                    </div>
                }
            </div>
        </>


    );
};

export default EditWorkShops;
