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
import moment from "moment";

import axios from 'axios';
import Loader from "../../components/loader";
import SessionPopup from "../SessionPopup"
import SweetAlert from 'react-bootstrap-sweetalert';
import { contentContext } from "../../context/contentContext";

import * as Config from "../../constants/Config";
let { lambda, country, appname } = window.app;

const ViewUser = () => {
    let { id } = useParams();
    const history = useHistory();
    const [msg, setMsg] = useState("");
    const [countries, setCountries] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUserAdd, setIsUserAdd] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [typeError, setTypeError] = useState('');
    const [editUser, setEditUser] = useState({ name: '', phone: '', type: '', status: '', idc: 'IND' });
    const [permission, setPermission] = useState({});
    const [success, setSuccess] = useState(false);
    const [manager, setManagers] = useState({});
    const [invalidContent, setInvalidContent] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, setActiveMenuId ,GetTimeActivity} = useContext(contentContext);

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
        setRoute("user")
     //   getManagers();
        setActiveMenuId(200007)
        if (id) {
            getuser();
        }
        GetCountries();
        userActivity();
    }, []);
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 2];
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": "VIEWUSER",
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
            if (response.result.data === "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {
                setCountries(response.result.data);
            }
        } catch {
            console.log("error");
        }
    };

    const getManagers = (e) => {
        GetTimeActivity()   
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/users?appname=' + appname + "&token=" + token + "&type=MANAGER",
        })
            .then(function (response) {
                console.log(response);
                setManagers(response.data.result)
            });
    }


    const getuser = (e) => {
        GetTimeActivity()   
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/user?appname=' + appname + '&userid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
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
        setInvalidContent(false)
        history.push('/users')
    }


    function onConfirm() {
        GetTimeActivity()   
        setSuccess(false);
    };



    const handleBack = (e) => {
        GetTimeActivity()   
        history.push({
            pathname: "/users",
            state: { search: true }
        });
    }




    const handleSelectAll = (e, updatedType, menuItemIndex, submenuIndex) => {
        const checked = e.target.checked;
        GetTimeActivity()   
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
        GetTimeActivity()   
        const updatedPermission = [...permission];
        const isChecked = e.target.checked;
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


    //  console.log("status", editUser);

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

                {isLoading ?
                    <Loader />
                    :

                    <> {!invalidContent &&
                        <div className="main-content user-management create-user">

                            <div className="page-content ">
                                <div className="container-fluid">



                                    <div className="row mb-4 breadcrumb">
                                        <div className="col-lg-12">
                                            <div className="d-flex align-items-center">

                                                <div className="flex-grow-1">
                                                    <h4 className="mb-2 card-title">VIEW USER</h4>
                                                    <p className="menu-path"><span >User Management</span> / <b>View User</b></p>

                                                </div>
                                                <div>
                                                    <a onClick={handleBack} className="btn btn-primary">back</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="create-user-block">
                                    {Object.keys(editUser).length > 0? 
                                            <>   
                                        <div className="form-block">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="col-md-12">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">NAME</label>
                                                            <input id="titlename" name="name" type="text" className="form-control form-control" aria-invalid="false" value={editUser.name && editUser.name} disabled />

                                                        </div>

                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">USER TYPE</label>
                                                            <input id="titlename" name="name" type="text" className="form-control form-control" value={editUser.name && editUser.type} disabled />

                                                        </div>

                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">E-MAIL ID</label>
                                                            <input id="email" name="email" placeholder="Enter Your Email" type="email" className="form-control form-control" aria-invalid="false" value={editUser && editUser.emailid} disabled />

                                                        </div>

                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">WORKSHOPS</label>
                                                            <input id="email" name="workshops" placeholder="Enter Your Workshops" type="text" className="form-control form-control" aria-invalid="false" value={editUser && editUser.workshops && editUser.workshops.workshopname} disabled />

                                                        </div>

                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">DEPARTMENT</label>
                                                            <input id="email" name="department" placeholder="Enter Your Department" type="text" className="form-control form-control" aria-invalid="false" value={editUser && editUser.department} disabled />

                                                        </div>

                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">CONTACT NUMBER</label>

                                                            <div className="country-code">

                                                            {/* <select name="idc" value={editUser && editUser.idc} disabled className="colorselect capitalize phonenumber">
                                                                <option value="">Select</option>
                                                                {/* <option value="91">IND(+91)</option> */}
                                                               {/*  {countries && countries.length > 0 && countries.map((task, i) => {
                                                                    return (
                                                                        <><option key={i} value={task.alpha3}>{task.alpha3 + task.countrycode}</option></>
                                                                    )
                                                                }
                                                                )}
                                                            </select> */}
                                                                {/* <input className="form-control phonenumber" style={{
                                                                    width: "25%",
                                                                    borderRadius: "5px 0px 0px 5px"
                                                                }} type="email" value={editUser.idc ? editUser.idc : ""} id="example-email-input" disabled /> */}


                                                                <input className="form-control numberfiled" type="tel" name="personalphone" value={editUser.phone} placeholder="Enter Phone Number" maxLength="10" id="example-tel-input" disabled />



                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className="col-md-12">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">MANAGER</label>

                                                            <select id="example-email-input" value={editUser.manager} disabled name="manager" className="form-control">
                                                                <option value="">select manager</option>

                                                                {manager && manager.length > 0 && manager.map((task, i) => {

                                                                    return (
                                                                        <option key={i} value={task.userid}>{task.name}</option>
                                                                    );
                                                                }
                                                                )}</select>
                                                        </div>

                                                    </div> */}

                                                    {id !== undefined && editUser.status !== "PENDING REGISTRATION" ?
                                                        <div className="col-md-12">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">STATUS</label>

                                                                <input id="titlename" name="name" type="text" className="form-control form-control" value={editUser.name && editUser.status} disabled />

                                                            </div>
                                                        </div> : null
                                                    }
                                                </div>
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
                                                                                onClick={(e) => item.dashboard !== undefined ? handleSelectAll(e, "display", i) : handleSelectAll(e, "display", i, "submenus")} disabled
                                                                            /></td>
                                                                            <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={item.enable}

                                                                                onClick={(e) => item.dashboard !== undefined ? handleSelectAll(e, "enable", i) : handleSelectAll(e, "enable", i, "submenus")} disabled

                                                                            /></td>
                                                                        </tr>

                                                                            {item.dashboard && Object.keys(item.dashboard).map((eachKey, j) => {
                                                                                let eachItem = item.dashboard[eachKey]
                                                                                // console.log("eachKey", eachItem);
                                                                                let fmenu = item && item.menu;
                                                                                return (

                                                                                    <tr key={j}>
                                                                                        <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>{fmenu === "Frontend Settings" ? eachItem.menuname : eachKey}</div></td>


                                                                                        <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={eachItem.display}
                                                                                            onClick={(e) => handleChangeEachItem(e, i, j, eachKey, "dashboard", "display")} disabled
                                                                                        /></td>
                                                                                        <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={eachItem.enable}
                                                                                            onClick={(e) => handleChangeEachItem(e, i, j, eachKey, "dashboard", "enable")} disabled
                                                                                        /></td>
                                                                                    </tr>


                                                                                )
                                                                            })}

                                                                            {item.submenus && item.submenus.length > 0 && item.submenus.map((menuItem, k) => {

                                                                                // console.log("menuItem", menuItem);
                                                                                // console.log("kkkkkkkkkkkkkkk", k);

                                                                                return (

                                                                                    <><tr key={k}>
                                                                                        <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">chevron_right</span>{menuItem.menu}</div></td>
                                                                                        <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={menuItem.display}
                                                                                            onClick={(e) => handleSelectAll(e, "display", i, k)} disabled
                                                                                        /></td>
                                                                                        <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={menuItem.enable}
                                                                                            onClick={(e) => handleSelectAll(e, "enable", i, k)} disabled

                                                                                        /></td>
                                                                                    </tr><>
                                                                                            {menuItem.dashboard && Object.keys(menuItem.dashboard).map((eachSubKey, m) => {
                                                                                                let eachSubItem = menuItem.dashboard[eachSubKey];
                                                                                                // console.log("eachSubItem", eachSubItem);
                                                                                                return (
                                                                                                    <tr className="arrow-right" key={m}>
                                                                                                        <td className="align-middle"><div className="d-flex align-items-center"><span className="material-symbols-outlined">arrow_right</span>{eachSubKey}</div></td>
                                                                                                        <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={eachSubItem.display} onClick={(e) => handleChangeEachItem(e, i, m, eachSubKey, "submenus", "display", k)} disabled />{eachSubItem.display} </td>
                                                                                                        <td className="align-middle"><input type="checkbox" className="form-check-input" id="customControlInline" checked={eachSubItem.enable} onClick={(e) => handleChangeEachItem(e, i, m, eachSubKey, "submenus", "enable", k)} disabled />{eachSubItem.enable} </td>
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
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12">
                                               
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
                                        <SweetAlert show={success}
                                            custom
                                            confirmBtnText="ok"
                                            confirmBtnBsStyle="primary"
                                            title={"Login Link sent successfully"}
                                            onConfirm={e => onConfirm()}
                                        >
                                        </SweetAlert>
                                    </div>


                                </div>
                            </div>



                            <Footer />
                        </div>
                    }</>
                }


            </div>

        </>
    );
};

export default ViewUser;
