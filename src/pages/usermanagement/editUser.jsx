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
import SessionPopup from "../../pages/SessionPopup"
import axios from 'axios';
import moment from "moment";

import Select from 'react-select';
import Loader from "../../components/loader";
import SweetAlert from 'react-bootstrap-sweetalert';
import { contentContext } from "../../context/contentContext";
import * as Config from "../../constants/Config";
let { lambda, country, appname } = window.app;

const EditUser = () => {
    let { id } = useParams();
    const history = useHistory();
    const [msg, setMsg] = useState("");
    const [countries, setCountries] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUserAdd, setIsUserAdd] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [itemError, setItemError] = useState('')
    const [IdcError, setIdcError] = useState('');
    const [value, setValue] = useState([])
    const [typeError, setTypeError] = useState('');
    const [departmentError, setDepartmentError] = useState('');
    const [workshopError, setWorkshopError] = useState('');
    const [editUser, setEditUser] = useState({ name: '', phone: '', type: '', status: '' });
    const [permission, setPermission] = useState({});
    const [success, setSuccess] = useState(false);
    const [UpdateSuccess, setUpdateSuccess] = useState(false);
    const [manager, setManagers] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [existmsg, setExistMsg] = useState(false);
    const [Ismsg, setIsMsg] = useState(false);
    const [checkStatus, setCheckStatus] = useState(false);
    const [user, setUser] = useState("");

    const [invalidContent, setInvalidContent] = useState(false);
    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, userData, setActiveMenuId, GetTimeActivity } = useContext(contentContext);

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
        setActiveMenuId(200007)
        setRoute("user")
        if (id) {
            getuser();

        }
        GetCountries();
        getWorkshop();
        userActivity();
    }, []);

    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = id != undefined ? path[path.length - 2] : path[path.length - 1];;
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": " EDITUSER",
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
                "type": ["department"],
                "status": "ACTIVE"

            });

            // console.log(response.result);
            if (response.result.data == "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {
                setCountries(response.result.data);
            }
        } catch {
            console.log("error");
        }
    };

    const getuser = (e) => {
        GetTimeActivity()
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/user?appname=' + appname + '&userid=' + id + "&token=" + token,
        })
            .then(function (response) {
                //  console.log("response", response.data.result[0]);
                if (response.data.result === "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                }
                else {
                    if (response.data.result.length > 0) {
                        setEditUser(response.data.result[0]);
                        if (response.data.result[0] && response.data.result[0].permissions) {
                            setPermission(response.data.result[0].permissions)
                        }
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
        history.push('/users')
    }
    function filterDataByStatus(data, status) {
        return data.filter((item) => item.status === status);
    }
    const getWorkshop = () => {
        setIsLoading(true);
        axios
            .post(
                lambda +
                '/workshops?appname=' +
                appname +
                '&userid=' +
                localStorage.getItem('userId') +
                '&token=' +
                localStorage.getItem('token')
            )
            .then((response) => {
                console.log(response.data.result.data);
                const allWorkshops = response.data.result.data;
                const activeWorkshops = filterDataByStatus(allWorkshops, 'ACTIVE');
                setValue(activeWorkshops); // Store the workshop data in state
                setIsLoading(false);
            })
            .catch((error) => {
                console.log('Error' + error);
                setIsLoading(false);
            });
    };



    const getPermissions = (userType) => {
        GetTimeActivity()
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/userPermissions?appname=' + appname + '&type=' + userType + "&token=" + token,
        })
            .then(function (response) {
                console.log("response.data.result.data[0]", response.data.result.data[0])
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setPermission(response.data.result.data[0].permissions)
                }
            });
    }


    const handleChange = (e) => {
        // console.log("department---->", e.target.value)

        if (e.target.name === "type") {
            if (id) {
                setCheckStatus(true);
            }
            getPermissions(e.target.value);
            setEditUser({ ...editUser, [e.target.name]: e.target.value });

        } else if (e.target.name === "phone") {
            const numericValue = e.target.value.replace(/\D/g, '');
            setEditUser({ ...editUser, [e.target.name]: numericValue })

        } else if (e.target.name === "workshops") {
            for (let key in value) {

                if (value.hasOwnProperty(key) && value[key].name === e.target.value) {
                    setEditUser({ ...editUser, [e.target.name]: { workshopname: value[key].name, workshopid: value[key].workshopid } })
                }

            }

        } else if (e.target.name === "status") {
            if (id) {
                setCheckStatus(true);
            }
            setEditUser({ ...editUser, [e.target.name]: e.target.value });
        } else if (e.target.name === "feeperitem") {
            const numericValue = e.target.value.replace(/\D/g, '');
            setEditUser({ ...editUser, [e.target.name]: numericValue });
        }
        else {
            setEditUser({ ...editUser, [e.target.name]: e.target.value });
        }



    }

    const handleChangeMultiSelect = (selected, key) => {
        setEditUser({ ...editUser, [key]: selected });

    }
    function onConfirm() {
        GetTimeActivity()
        setSuccess(false);
        history.push("/users")
    };

    const handleAddUser = (e) => {
        console.log("add userr called")
        GetTimeActivity()

        const isValid = formvalidation();
        console.log("isValid---->", isValid)
        if (isValid) {
            createuser();
            console.log("createUser---->")
        }
    }

    function formvalidation() {
        console.log("validation called")
        GetTimeActivity()
        let formIsValid = true;
       
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
        if (!editUser?.name || editUser?.name?.trim() == "") {
            setNameError("Please enter Name");
            setTimeout(function () { setNameError("") }, 3000);
            formIsValid = false;
        }
        if ((editUser?.feeperitem == undefined || editUser?.feeperitem?.trim() == "")&&editUser.type==="SEWING") {
            setItemError("Please enter Fee Per Item");
            setTimeout(function () { setItemError("") }, 3000);
            formIsValid = false;
        }
      

        if (!editUser.type||editUser.type == "") {
            setTypeError("Please select Type");
            setTimeout(function () { setTypeError("") }, 3000);
            formIsValid = false;
        }
        if (!editUser.workshops  || editUser?.workshops == "") {
            setWorkshopError("Please select Workshops");
            setTimeout(function () { setWorkshopError("") }, 3000);
            formIsValid = false;
        }
      

        console.log("validation called")

        return formIsValid;
    }


    const handleSubmit = () => {
        GetTimeActivity()
        setIsLoading(true)

        const token = localStorage.getItem("token")
        let payload = {}
        payload = {
            "emailid": editUser.emailid?.trim(),
            "userType": editUser.type,
            "name": editUser.name?.trim(),
            "idc": editUser.idc,
            "phone": editUser.phone,
            "department": editUser.department,
            "workshops": editUser.workshops,
            "permissions": permission,
            "status": editUser.status,
            "feeperitem": editUser.feeperitem
        }

        if (checkStatus === false) {
            delete payload["status"];
            delete payload["userType"];
        }

        axios({
            method: 'POST',
            url: lambda + '/user?appname=' + appname + '&userid=' + id + "&token=" + token,
            data: payload,
        })
            .then(function (response) {
                if (response) {
                    if (response?.result === "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else if (response.data.result == "This ACM assaigned to companies") {
                        setIsMsg(true);
                        setIsLoading(false);
                    } else {
                        setIsLoading(false);
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
    }
    const createuser = async () => {
        setIsLoading(true)
        GetTimeActivity()
        let payload = {}
        payload = {
            "emailid": editUser.emailid?.trim(),
            "userType": editUser.type,
            "name": editUser.name?.trim(),
            "idc": editUser.idc,
            "phone": editUser.phone,
            "department": editUser.department,
            "workshops": editUser.workshops,
            "permissions": permission,
            "status": "PENDING REGISTRATION",
            "feeperitem": editUser.feeperitem,
            "createdBy": { userid: userData.userid, username: userData.name }
        }
        const token = localStorage.getItem("token")
        axios({
            method: 'PUT',
            url: lambda + "/user?appname=" + appname + "&token=" + token,
            data: payload,
        })
            .then(function (response) {
                if (response) {
                    console.log("response.result", response)
                    if (response.data.result === "User already exists") {
                        setIsLoading(false)
                        setExistMsg(true)
                    }
                    else if (response.result === "Invalid token or Expired") {
                        setIsLoading(false)
                        setShowSessionPopupup(true)
                    }
                    else {
                        setUser(response.data.result)
                        setIsLoading(false)
                        setSuccess(true);
                    }
                }

            });

    };

    const handleBack = (e) => {
        GetTimeActivity()
        if (id) {
            history.push({
                pathname: "/users",
                state: { search: true }
            });
        } else {
            history.push("/users")
        }
    }

    const CancelClick = () => {
        GetTimeActivity()
        setIsMsg(false);
        history.push("/users")
    }
    console.log("edit---->", editUser)


    const handleSelectAll = (e, updatedType, menuItemIndex, submenuIndex) => {
        const checked = e.target.checked;
        // console.log('menuItemIndex',menuItemIndex)
        // console.log('submenuIndex',submenuIndex)
        setPermission(prevState => {
            if (submenuIndex === undefined) {
                return prevState.map((menuItem, i) => {
                    if (i === menuItemIndex) {
                        const updatedDashboard = Object.keys(menuItem.dashboard).reduce((obj, key) => {
                            obj[key] = { ...menuItem.dashboard[key], [updatedType]: checked };
                            return obj;
                        }, {});
                        return { ...menuItem, [updatedType]: checked, dashboard: updatedDashboard };
                    }
                    return menuItem;
                });
            } else if (submenuIndex === "submenus") {
                return prevState.map((menuItem, i) => {
                    if (i === menuItemIndex) {
                        // console.log('menuItem.submenus',menuItem.submenus)
                        const updatedSubmenus = menuItem.submenus.map((submenu, j) => {

                            const kk = Object.keys(submenu.dashboard).reduce((obj, key) => {
                                obj[key] = { ...submenu.dashboard[key], [updatedType]: checked };
                                return obj
                            }, {});

                            return { ...submenu, [updatedType]: checked, dashboard: kk };

                        });
                        return { ...menuItem, [updatedType]: checked, submenus: updatedSubmenus };

                    }
                    return menuItem;
                });
            }

            else {

                return prevState.map((menuItem, i) => {
                    if (i === menuItemIndex) {
                        const updatedSubmenus = menuItem.submenus.map((submenu, j) => {
                            if (j === submenuIndex) {

                                const kk = Object.keys(submenu.dashboard).reduce((obj, key) => {
                                    obj[key] = { ...submenu.dashboard[key], [updatedType]: checked };
                                    return obj
                                }, {});

                                return { ...submenu, [updatedType]: checked, dashboard: kk };
                            }
                            return submenu;
                        });
                        return { ...menuItem, submenus: updatedSubmenus };
                    }
                    return menuItem;
                });
            }
        });
        // console.log('permissionss',permission)
    };

    const handleChangeEachItem = (e, index, subIndex, type, typeOfItem, updatedType, subSubIndex) => {
        const updatedPermission = [...permission];
        const isChecked = e.target.checked;
        // console.log('typeeee',type)
        // console.log('index',index)
        // console.log('subIndex',subIndex)
        // console.log('updatedPermission',updatedPermission)
        // console.log('typeOfItem',typeOfItem)
        if (typeOfItem === 'dashboard') {
            updatedPermission[index].dashboard[type][updatedType] = isChecked;
        } else if (typeOfItem === 'submenus') {
            updatedPermission[index].submenus[subSubIndex].dashboard[type][updatedType] = isChecked;
            if (isChecked && updatedPermission[index].dashboard) {
                Object.keys(updatedPermission[index].dashboard).forEach(key => {
                    updatedPermission[index].dashboard[key][updatedType] = true;
                });
            }
        }

        setPermission(updatedPermission);
    };


    console.log("status", editUser);

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
                    title={"User Not Found"}
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
                                                <h4 className="mb-2 card-title">{id == undefined ? "ADD USER" : "EDIT USER"}</h4>
                                                <p className="menu-path"><span>User Management</span> / <b>{id == undefined ? "ADD USER" : "EDIT USER"}</b></p>

                                            </div>
                                            <div>
                                                <a onClick={handleBack} className="btn btn-primary">back</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="create-user-block">
                                    {Object.keys(editUser).length > 0 && countries.length > 0 ?
                                        <>
                                            <div className="form-block">

                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="col-md-12">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">NAME<span className="required">*</span></label>
                                                                <input id="titlename" name="name" placeholder="Enter Name" type="text" className="form-control form-control" aria-invalid="false" onChange={(e) => handleChange(e)} value={editUser && editUser.name} />
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{nameError}</span>
                                                            </div>

                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">USER TYPE<span className="required">*</span></label>
                                                                <select className="colorselect capitalize form-control form-select" name="type" onChange={(e) => handleChange(e)} value={editUser && editUser.type}>
                                                                    <option value="">Select Type</option>
                                                                    <option value="ADMIN">Admin</option>
                                                                    <option value="CUTTING">Cutting</option>
                                                                    <option value="DELIVERY">Delivery</option>
                                                                    <option value="SUPERVISIOR">Supervisior</option>
                                                                    <option value="SEWING">Sewing</option>
                                                                </select>
                                                                {/* <span className="material-icons dropdown-icon">expand_more</span> */}
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{typeError}</span>
                                                            </div>

                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">E-MAIL ID<span className="required">*</span></label>
                                                                <input id="email" name="emailid" placeholder="Enter Your Email" type="email" className="form-control form-control" aria-invalid="false" value={editUser && editUser.emailid} disabled={id !== undefined} onChange={(e) => handleChange(e)} />
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{emailError}</span>
                                                            </div>

                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">WORKSHOPS<span className="required">*</span></label>
                                                                <select className="colorselect capitalize form-control form-select" name="workshops" onChange={(e) => handleChange(e)} value={editUser && editUser.workshops && editUser.workshops.workshopname}>
                                                                    <option value="">Select Type</option>
                                                                    {value.map((workshop) => (
                                                                        <option key={workshop.id} value={workshop.name}>
                                                                            {workshop.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{workshopError}</span>
                                                            </div>

                                                        </div>
                                                        {/* <div className="col-md-12">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">DEPARTMENT<span className="required">*</span></label>
                                                                <select className="colorselect capitalize form-control form-select" name="department" onChange={(e) => handleChange(e)} value={editUser && editUser.department}>
                                                                    <option value="">Select Type</option>
                                                                    <option value="cutting">cutting</option>
                                                            <option value="sewing">sewing</option>
                                                                    {countries && countries.length > 0 && countries.map((task, i) => {
                                                                        return (
                                                                            <><option key={i} value={task.name}>{task.name}</option></>
                                                                        )
                                                                    }
                                                                    )}
                                                                </select>
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{departmentError}</span>
                                                            </div>


                                                        </div> */}
                                                        <div className="col-md-12">
                                                            <div className="mb-3 input-field">
                                                                <div>
                                                                    <label className="form-label form-label">
                                                                        Fee Per Item($){editUser.type === "SEWING" && <span className="required">*</span>}
                                                                    </label>
                                                                    <input
                                                                        id="titlename"
                                                                        name="feeperitem"
                                                                        placeholder="Enter Number"
                                                                        type="tel"
                                                                        className="form-control form-control"
                                                                        aria-invalid="false"
                                                                        onChange={(e) => handleChange(e)}
                                                                        value={editUser && editUser.feeperitem}
                                                                    />
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                    }}>{itemError}</span>
                                                                </div>




                                                            </div>

                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">CONTACT NUMBER</label>

                                                                <div>
                                                                    {/* <select name="idc" value={editUser && editUser.idc} className="colorselect capitalize" onChange={(e) => handleChange(e)}>
                                                                <option value="">Select</option>
                                                                {/* <option value="91">IND(+91)</option> */}
                                                                    {/* {countries && countries.length > 0 && countries.map((task, i) => {
                                                                    return (
                                                                        <><option key={i} value={task.alpha3}>{task.alpha3 + task.countrycode}</option></>
                                                                    )
                                                                }
                                                                )}
                                                            </select> */}

                                                                    <input className="form-control contact-number" type="tel" name="phone" value={editUser && editUser.phone} placeholder="Enter Phone Number" onChange={(e) => handleChange(e)} maxLength="10" id="example-tel-input" />
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                    }}>{IdcError}</span>
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                    }}>{phoneError}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* <div className="col-md-12">
                                                    <div className="mb-3 input-field">
                                                        <label className="form-label form-label">MANAGER
                                                        </label>

                                                        <select id="example-email-input" value={editUser.manager} onChange={(e) => handleChange(e)} name="manager" className="form-control form-select">
                                                            <option value="">Select Manager</option>

                                                            {manager && manager.length > 0 && manager.map((task, i) => {

                                                                return (
                                                                    <option key={i} value={task.userid}>{task.name}</option>
                                                                );
                                                            }
                                                            )}
                                                        </select>
                                                    </div>

                                                </div> */}


                                                        {id !== undefined && editUser && editUser.status !== "PENDING REGISTRATION" ?
                                                            <div className="col-md-12">
                                                                <div className="mb-3 input-field">
                                                                    <label className="form-label form-label">STATUS<span className="required">*</span></label>
                                                                    <select className="colorselect capitalize form-control form-select" name="status" onChange={(e) => handleChange(e)} value={editUser && editUser.status}>
                                                                        {/* <option value="">Select Type</option> */}

                                                                        <option value="INACTIVE">Inactive</option>
                                                                        <option value="ACTIVE">Active</option>
                                                                        <option value="ARCHIVE">Archive</option>
                                                                    </select>
                                                                    {/* <span className="material-icons dropdown-icon">expand_more</span> */}
                                                                </div>
                                                            </div> : null
                                                        }
                                                    </div>
                                                    {permission?.length > 0 &&
                                                        <div className="col-md-6 permission-block">
                                                            <div className="permission-title"><span className="material-icons-outlined"> vpn_lock</span>PERMISSIONS</div>
                                                            <div className="table-responsive">
                                                                <table className="table align-middle table-nowrap table-check">
                                                                    <thead>
                                                                        <tr>

                                                                            <th className="align-middle">MENU</th>
                                                                            <th className="align-middle"><div className="d-flex">Display</div></th>
                                                                            <th className="align-middle"><div className="d-flex">Enable</div></th>

                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {permission && permission.length > 0 && permission.map(function (item, i) {
                                                                            {/* {Object.keys(permission).map((item, i) => { */ }
                                                                            // console.log("item", item)
                                                                            // console.log('item.dashboard',item.dashboard)
                                                                            return (

                                                                                <><tr className="menu-titles" key={i}>
                                                                                    <td className="align-middle"><div className="d-flex align-items-center"><span className="material-icons-outlined">menu_open</span>{item.menu}</div></td>
                                                                                    <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline"
                                                                                        checked={item.display}
                                                                                        onClick={(e) => item.dashboard !== undefined ? handleSelectAll(e, "display", i) : handleSelectAll(e, "display", i, "submenus")}
                                                                                    /></td>
                                                                                    <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={item.enable}

                                                                                        onClick={(e) => item.dashboard !== undefined ? handleSelectAll(e, "enable", i) : handleSelectAll(e, "enable", i, "submenus")}

                                                                                    /></td>
                                                                                </tr>

                                                                                    {item.dashboard && Object.keys(item.dashboard).map((eachKey, j) => {
                                                                                        let eachItem = item.dashboard[eachKey]
                                                                                        //  console.log("eachKey", eachItem, item.menu);
                                                                                        let fmenu = item && item.menu;


                                                                                        return (
                                                                                            <tr key={j}>
                                                                                                <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>{fmenu === "Frontend Settings" ? eachItem.menuname : eachKey}</div></td>


                                                                                                <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={eachItem.display}
                                                                                                    onClick={(e) => handleChangeEachItem(e, i, j, eachKey, "dashboard", "display")}
                                                                                                /></td>
                                                                                                <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={eachItem.enable}
                                                                                                    onClick={(e) => handleChangeEachItem(e, i, j, eachKey, "dashboard", "enable")}
                                                                                                /></td>
                                                                                            </tr>



                                                                                        )
                                                                                    })}

                                                                                    {item.submenus && item.submenus.length > 0 && item.submenus.map((menuItem, k) => {

                                                                                        //  console.log("menuItem", menuItem.menu);
                                                                                        // console.log("kkkkkkkkkkkkkkk", k);

                                                                                        return (

                                                                                            <><tr key={k}>
                                                                                                <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>{menuItem.menu}</div></td>
                                                                                                <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={menuItem.display}
                                                                                                    onClick={(e) => handleSelectAll(e, "display", i, k)}
                                                                                                /></td>
                                                                                                <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={menuItem.enable}
                                                                                                    onClick={(e) => handleSelectAll(e, "enable", i, k)}

                                                                                                /></td>
                                                                                            </tr><>
                                                                                                    {menuItem.dashboard && Object.keys(menuItem.dashboard).map((eachSubKey, m) => {
                                                                                                        let eachSubItem = menuItem.dashboard[eachSubKey];
                                                                                                        // console.log("eachSubItem", eachSubItem);
                                                                                                        return (
                                                                                                            <tr className="arrow-right" key={m}>
                                                                                                                <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">arrow_right</span>{eachSubKey}</div></td>
                                                                                                                <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={eachSubItem.display} onClick={(e) => handleChangeEachItem(e, i, m, eachSubKey, "submenus", "display", k)} />{eachSubItem.display} </td>
                                                                                                                <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={eachSubItem.enable} onClick={(e) => handleChangeEachItem(e, i, m, eachSubKey, "submenus", "enable", k)} />{eachSubItem.enable} </td>
                                                                                                            </tr>

                                                                                                        );
                                                                                                    })}</></>

                                                                                        )
                                                                                    })}



                                                                                </>

                                                                            )
                                                                        })}

                                                                    </tbody>


                                                                </table>
                                                            </div>
                                                        </div>}
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12">
                                                    {/* <button className="btn btn-primary btn-block " type="submit" onClick={e => id == undefined ? handleAddUser(e) : handleUpdate(e)}>{isLoading ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}{id == undefined ? "Create" : "update"}</button> */}
                                                    {id ? <button className="btn btn-primary btn-block " type="submit" onClick={(e) => handleUpdate(e)}>{isLoading ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}update</button> : <button className="btn btn-primary btn-block " type="submit" onClick={(e) => handleAddUser(e)}>{isLoading ? (<img src="https://spacovers.imgix.net/spacoversdev/common/images/rotate_right.svg" className="loading-icon" />) : null}Create</button>}
                                                </div>
                                                {msg ? <span className="errormsg" style={{
                                                    fontWeight: 'bold',
                                                    color: 'green',
                                                }}>{msg}</span> : ""
                                                }
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
                                    <SweetAlert show={Ismsg}
                                        custom
                                        confirmBtnText="ok"
                                        confirmBtnBsStyle="primary"
                                        title={"User type cannot change as the user assigned as an account manager to the companies"}
                                        onConfirm={e => CancelClick()}
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

export default EditUser;
