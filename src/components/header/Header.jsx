/***
**Module Name: Header 
 **File Name :  Header.js
 **Project :    Orasi Media
 **Copyright(c) : X Platform Consulting.
 **Organization : Peafowl Inc
 **author :  chandrasekhar
 **author :  Hari
 **license :
 **version :  1.0.0
 **Created on :
 **Created on: Dec 27 2022
 **Last modified on: Dec 27 2022
 **Description : contains header component details.
 ***/
import React, { useEffect, useRef, useState, useContext } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import * as Config from "./../../constants/Config";
import tmdbApi from "../../api/tmdbApi";

import { contentContext } from "../../context/contentContext";
// const headerNav = [
//   {
//     display: "Yellow Form",
//     path: `/yellowForm`,
//   },
//   {
//     display: "Lokkups",
//     path: `/lookups`,
//   },
//   {
//     display: "Reports",
//     path: `/reports`,
//   },
//   {
//     display: "Users",
//     path: `/user`,
//   },
// ];
const menuList = [
  {
      id: '1',
      labelName: 'Yellow Form',
      route: "yellowForm"
  },
  {
      id: '2',
      labelName: 'Lookups',
      route: "lookups"
  },
  {
      id: '3',
      labelName: 'Reports',
      //route: "reports"
  },
  {
      id: '4',
      labelName: 'Users',
      //route: "user"
  },

]

const Header = (props) => {
  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const [scroll, setScroll] = useState(false);
  const history = useHistory();
  const [userName, setUserName] = useState([]);
  const [config, setConfig] = useState({});
  const [activeId, setActiveId] = useState();

  const { userData, setUserData, setShowPopup, setSelectedOptions, setMultiSelectFields, setActiveFieldsObj,
    setSelectedOptionsClientName, setSearchPayload, setInitialCategoriesData1, GetTimeActivity } = useContext(contentContext)

  //console.log("props", props.menus);
  // const active = headerNav.findIndex((e) => e.path === pathname);
  let token = localStorage.getItem("token")
  useEffect(() => {
    if (!localStorage.getItem("token")) {
        history.push("/");
    } 
    else if(menuList[0]?.id){
       setActiveId(menuList[0].id)
    }

}, []);
  //console.log('token', token)
  useEffect(() => {
    // const shrinkHeader = () => {
    //   if (
    //     document.body.scrollTop > 100 ||
    //     document.documentElement.scrollTop > 100
    //   ) {
    //     headerRef.current.classNameList.add("shrink");
    //   } else {
    //     headerRef.current.classNameList.remove("shrink");
    //   }
    // };

    // window.addEventListener("scroll", shrinkHeader);

    // return () => {
    //   window.removeEventListener("scroll", shrinkHeader);
    // };
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 50);
    });
  }, []);
  useEffect(() => {
    if (window.site) {
      setConfig(window.site);

    }

  }, [window.site]);

  useEffect(() => {
    // userName = localStorage.getItem("ClientName")?.split(" ");
    // console.log("userData",userData)
    setUserName(userData?.name?.split(" "));


  }, [userData]);
  // if (config.common && config.common.resourcesUrl) {
  //     var img = config.common.resourcesUrl;
  // }

  let imageCloudfront;
  if (config.common && config.common.imageCloudfront) {
    imageCloudfront = config.common.imageCloudfront;
  }
  // const handleAbout = async () => {
  //   history.push("./aboutus");
  // }
  // const handleHome = async () => {
  //   history.push("/");
  // }
  // const handleContactus = async () => {
  //   history.push("./contactus");
  // }
  const handlemenuclick = async (e, path, id) => {
    if (id === 100005) {
      window.open(
        'https://deas.hitlab.com/?ref=ORASI',
        '_blank'
      );
    } else {
      history.push(path);
    }
  }
  const handleSignup = async () => {
    history.push("./signup");
  }
  const handleSignin = async () => {
    history.push("./login");
  }
  const handleLogout = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // localStorage.removeItem("ClientName");
    // localStorage.removeItem("ClientType");
    // signoutsession();
    setUserData([])
    history.push("/");
    localStorage.clear("");


  }


  const searchClick = () => {
    history.push("/search");
  }
  const savedClick = () => {
    history.push("/dashboard");
  }
  const profile = () => {
    history.push("/profile");
  }
  const company = () => {
    history.push("/company");
  }
  const onClickMenu = (e, item) => {
    //setMenu(id);
    console.log('handleActiveMenuObj------------>',item)
     setActiveId(item.id)
     
     history.push(item.route)
}
  return (
    <header id="page-topbar" >
      <div className="navbar-header">

        <div className="d-flex">

          <div className="navbar-brand-box">
            <a href="" className="logo logo-dark">
              <span className="logo-sm">
                <img className="w-100" src={imageCloudfront + "propertyCalculator/images/brand-logo.png"} alt="" height="25" />
              </span>
              <span className="logo-lg">
                <img className="w-100" src={imageCloudfront + "propertyCalculator/images/brand-logo.png"} alt="" height="25" />
              </span>
            </a>


          </div>

          <button type="button"
            className="btn btn-sm px-3 font-size-16 d-lg-none header-item waves-effect waves-light"
            data-bs-toggle="collapse" data-bs-target="#topnav-menu-content">
            <i className="fa fa-fw fa-bars"></i>
          </button>
          {token &&
          <div className="dropdown d-none d-lg-block ms-2 menu">
          {menuList.map((val) => (
         
            <button key={val.id} href='#' className={`${activeId === val.id ? "btn header-item waves-effect active" : "btn header-item waves-effect"}`} onClick={(e) => onClickMenu(e, val)}  data-tip={val.labelName}><span key="t-chat">{val.labelName}</span></button> 
        ))}
                        {/* <button type="button" className="btn active header-item waves-effect" >
                            <span>New Search</span>

                        </button>
                        <button type="button" className="btn header-item waves-effect" >
                            <span>Saved Searches</span>

                        </button> */}
                    </div>}

        </div>

        <div className="d-flex">
          {!token ?
            <div className="d-flex align-items-center">
              <a className="register btn-outline" href="#" onClick={handleSignin}>Sign In</a>
              <a className="register ms-2" href="#" onClick={handleSignup}>Sign Up</a></div> :
            <div className="dropdown d-inline-block">
              <button type="button" className="btn header-item waves-effect" id="page-header-user-dropdown"
                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img className="rounded-circle header-profile-user" src={imageCloudfront + "propertyCalculator/images/user_icon.png"}
                  alt="Header Avatar" />
                <span className="d-none d-xl-inline-block ms-1" key="t-henry">{userName && userName.length > 1 ? userName && userName.length > 0 && userName[0]?.slice(0, 1)?.toUpperCase() + userName[1]?.slice(0, 1)?.toUpperCase()
                  : userData && userData.name?.slice(0, 2)?.toUpperCase()}</span>
                <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
              </button>
              <div className="dropdown-menu dropdown-menu-end">
                <a className="dropdown-item" href="#" onClick={profile}><i className="bx bx-user font-size-16 align-middle me-1"></i>
                  <span key="t-profile">Profile</span></a>

                <a className="dropdown-item d-block" href="#" onClick={company}><i
                  className="bx bx-wrench font-size-16 align-middle me-1"></i> <span
                    key="t-settings">Company</span></a>

                <div className="dropdown-divider"></div>
                <a className="dropdown-item text-danger" href="#" onClick={handleLogout}><i
                  className="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i> <span
                    key="t-logout">Logout</span></a>
              </div>
            </div>}

            

        </div>
      </div>
    </header>
  );
};

export default Header;
