/***
**Module Name: header
 **File Name :  header.js
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
 **Description : contains header details.
 ***/
import React, { useState, useEffect, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import * as Config from "../../constants/Config";
import moment from "moment";
import tmdbApi from "../../api/tmdbApi";

import { contentContext } from "../../context/contentContext";


const Header = ({ fn }) => {

    const history = useHistory();
    const [image, setImg] = useState('');
    const [data, setData] = useState("");
    const [userName, setUserName] = useState([]);
    const [config, setConfig] = useState({});

    const { userData, setUserData, setShowPopup, setSelectedOptions, setMultiSelectFields, setActiveFieldsObj,
        setSelectedOptionsClientName, setSearchPayload, setInitialCategoriesData1, GetTimeActivity } = useContext(contentContext)

    const handleProfile = (e) => {
        GetTimeActivity();
        history.push("/profile");
    }

    useEffect(() => {
        if (window.site) {
            setConfig(window.site);

        }

    }, [window.site]);

    if (config.common && config.common.resourcesUrl) {
        var img = config.common.resourcesUrl;
    }

let imageCloudfront;
if (config.common && config.common.imageCloudfront) {
    imageCloudfront = config.common.imageCloudfront;
}
    const handleLogout = (e) => {
       // GetTimeActivity();
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("ClientName");
        localStorage.removeItem("ClientType");
        localStorage.clear("");
        //signoutsession();
        history.push("/");
        

    }

    // console.log('user edataaa',userData)
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
        // userName = localStorage.getItem("ClientName")?.split(" ");
        setUserName(userData.name?.split(" "));


    }, [userData]);

    const signoutsession = async () => {
        GetTimeActivity();
        try {
            const response = await tmdbApi.SignOutUser({ emailId: userData.emailid });
            console.log(response);

        } catch {
            console.log("error");
        }
    }
    const handleRedirect = () => {
        GetTimeActivity();
        let userArr = userData.permissions

        console.log("userArr", userData)

        const obj = userArr.reduce((acc, item) => {
            if (item.submenus) acc[item.menu] = false;
            return acc;
        }, {});
        // console.log('objjjjjjjj--->',obj)

        let k = userData

        let permissionList = userData && userData.permissions
        let filterdList = permissionList.filter((item) => item.display == true)
        let id = filterdList && filterdList[0] && filterdList[0].menu.split(" ").join("").toLowerCase()

        history.push("/" + id);
    }

    //   let userName=[]
    //   userName = localStorage.getItem("ClientName")?.split(" ");
    const searchClick = () => {
        history.push("/search");
    }
    const savedClick = () => {
        history.push("/dashboard");
    }
    const profile = () => {
        history.push("/profile");
    }
    // const logout = () => {
    //     history.push("/dashboard");
    // }
    return (
        <>

            <header id="page-topbar">
                {/* <div className="navbar-header">
                    <div className="d-flex">
                        <div className="navbar-brand-box">
                            <a onClick={handleRedirect} className="logo">
                                <span className="logo-sm">
                                    {image && <img src={image + Config.imgmiddle + "favicon.png?" + Config.compress} />}
                                </span>
                                <span className="logo-lg"> 
                               
                                    
                                    {image && <img src={image + Config.imgmiddle + "logo-light.png?" + Config.compress} /> }
                                </span>
                            </a>
                        </div>
                    </div>

                    <div className="d-flex profile_section">

                        <div className="dropdown d-inline-block d-lg-none ms-2">
                            <button type="button" className="btn header-item noti-icon waves-effect"
                                id="page-header-search-dropdown" data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">
                                <i className="mdi mdi-magnify"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                                aria-labelledby="page-header-search-dropdown">

                                <form className="p-3">
                                    <div className="form-group m-0">
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="Search ..."
                                                aria-label="Recipient's username" />
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="submit"><i
                                                    className="mdi mdi-magnify"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="dropdown d-inline-block">
                        <label className="form-label">Login: {localStorage.getItem("loginTime")}</label>  
                         
                            <button type="button" className="btn header-item noti-icon waves-effect"
                                id="page-header-notifications-dropdown" data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">
                                <i className="bx bx-bell bx-tada"></i>
                                <span className="badge bg-danger rounded-pill">3</span>
                            </button>
                            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                                aria-labelledby="page-header-notifications-dropdown">
                                <div className="p-3">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h6 className="m-0" key="t-notifications"> Notifications </h6>
                                        </div>
                                        <div className="col-auto">
                                            <a href="#!" className="small" key="t-view-all"> View All</a>
                                        </div>
                                    </div>
                                </div>
                                <div data-simplebar style={{ maxHeight: "230px" }}>
                                    <a className="text-reset notification-item">
                                        <div className="d-flex">
                                            <div className="avatar-xs me-3">
                                                <span className="avatar-title bg-primary rounded-circle font-size-16">
                                                    <i className="bx bx-cart"></i>
                                                </span>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1" key="t-your-order">Your order is placed</h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="mb-1" key="t-grammer">If several languages coalesce the
                                                        grammar</p>
                                                    <p className="mb-0"><i className="mdi mdi-clock-outline"></i> <span
                                                        key="t-min-ago">3 min ago</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    <a className="text-reset notification-item">
                                        <div className="d-flex">
                                            <img src={Config.img + "avatar-3.jpg"}
                                                className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">James Lemire</h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="mb-1" key="t-simplified">It will seem like simplified English.
                                                    </p>
                                                    <p className="mb-0"><i className="mdi mdi-clock-outline"></i> <span
                                                        key="t-hours-ago">1 hours ago</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    <a className="text-reset notification-item">
                                        <div className="d-flex">
                                            <div className="avatar-xs me-3">
                                                <span className="avatar-title bg-success rounded-circle font-size-16">
                                                    <i className="bx bx-badge-check"></i>
                                                </span>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1" key="t-shipped">Your item is shipped</h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="mb-1" key="t-grammer">If several languages coalesce the
                                                        grammar</p>
                                                    <p className="mb-0"><i className="mdi mdi-clock-outline"></i> <span
                                                        key="t-min-ago">3 min ago</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>

                                    <a
                                     href="" 
                                     className="text-reset notification-item">
                                        <div className="d-flex">
                                            <img src={Config.img + "avatar-4.jpg"}
                                                className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">Salena Layfield</h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="mb-1" key="t-occidental">As a skeptical Cambridge friend of
                                                        mine occidental.</p>
                                                    <p className="mb-0"><i className="mdi mdi-clock-outline"></i> <span
                                                        key="t-hours-ago">1 hours ago</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div className="p-2 border-top d-grid">
                                    <a className="btn btn-sm btn-link font-size-14 text-center" href="#">
                                        <i className="mdi mdi-arrow-right-circle me-1"></i> <span key="t-view-more">View
                                            More..</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="dropdown d-inline-block user_profile">
                        <label className="form-label">{userData && userData.type}</label> 
                            <button type="button" className="btn header-item waves-effect" id="page-header-user-dropdown" 
                                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                       <span onClick={GetTimeActivity()} className="user-badge">{userName && userName.length > 1 ?  userName && userName.length > 0 && userName[0]?.slice(0,1)?.toUpperCase() + userName[1]?.slice(0,1)?.toUpperCase()
           : userData && userData.name?.slice(0,2)?.toUpperCase() }</span>
       

                                <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-end">

                                <a className="dropdown-item" onClick={handleProfile}><i className="bx bx-user font-size-16 align-middle me-1"></i>
                                    <span key="t-profile">Profile</span></a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item text-danger" onClick={handleLogout}><i
                                    className="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i> <span
                                        key="t-logout">Logout</span></a>
                            </div>
                        </div>

                    </div>
                </div> */}
                <div className="navbar-header">
                    <div className="d-flex">
                        <div className="navbar-brand-box">
                            <a className="logo logo-dark">
                                <span className="logo-sm">
                                    <img src={imageCloudfront + "propertyCalculator/images/brand-logo.png"} alt="" height="25" />
                                </span>
                                <span className="logo-lg">
                                    <img src={imageCloudfront + "propertyCalculator/images/brand-logo.png"} alt="" height="25" />
                                </span>
                            </a>


                        </div>

                        <button type="button"
                            className="btn btn-sm px-3 font-size-16 d-lg-none header-item waves-effect waves-light"
                            data-bs-toggle="collapse" data-bs-target="#topnav-menu-content">
                            <i className="fa fa-fw fa-bars"></i>
                        </button>


                    </div>
                    <div className="dropdown d-none d-lg-block ms-2 menu">
                        <button type="button" className="btn active header-item waves-effect" onClick={searchClick}>
                            <span>New Search</span>

                        </button>
                        <button type="button" className="btn header-item waves-effect" onClick={savedClick}>
                            <span>Saved Searches</span>

                        </button>
                    </div>
                    <div className="d-flex">
                        <div className="dropdown d-inline-block">
                            <button type="button" className="btn header-item waves-effect" id="page-header-user-dropdown"
                                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img className="rounded-circle header-profile-user" src="assets/img/user_icon.png"
                                    alt="Header Avatar" />
                                <span className="d-none d-xl-inline-block ms-1" key="t-henry">Henry</span>
                                <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-end">
                                <a className="dropdown-item" href="#" onClick={profile}><i className="bx bx-user font-size-16 align-middle me-1"></i>
                                    <span key="t-profile">Profile</span></a>

                                <a className="dropdown-item d-block" href="#"><i
                                    className="bx bx-wrench font-size-16 align-middle me-1"></i> <span
                                        key="t-settings">Settings</span></a>

                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item text-danger" href="#" onClick={handleLogout}><i
                                    className="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i> <span
                                        key="t-logout">Logout</span></a>
                            </div>
                        </div>



                    </div>
                </div>
            </header>


        </>
    );
};

export default Header;
