/***
**Module Name: sidebar
 **File Name :  sidebar.js
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
 **Description : contains sidebar details.
 ***/
import React, { useState, useEffect, useContext } from "react";
import {Tooltip} from 'react-tooltip'
import { useHistory, Link } from "react-router-dom";
import moment from "moment";
import { contentContext } from "../../context/contentContext";

const menuList = [
    {
        id: '1',
        name: 'travel_explore',
        labelName: 'Search',
        route: "search"
    },
    {
        id: '2',
        name: 'collections_bookmark',
        labelName: 'Properties',
        route: "dashboard"
    },
    {
        id: '3',
        name: 'settings',
        labelName: 'Groups',
       // route: "dashboard"
    },
    // {
    //     id: '10',
    //     name: 'settings',
    //     labelName: 'Playlist'
    // },

]
const Sidebar = () => {

    const [manage, setManage] = useState(false);
    const [report, setReport] = useState(false);
    const [settings, setSettings] = useState(false);
    const [auction, setAuction] = useState(false);
    const [activeId, setActiveId] = useState();
    // const [activeMenuObj, setActiveMenuObj] = useState({});isActiveId: userMenuList[0].id,
    const history = useHistory();


    const { isLoading, setIsLoading, userData, setUserData, activeMenuObj, setActiveMenuObj, activeMenuId, GetTimeActivity, setActiveMenuId } = useContext(contentContext)

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        } 
        else if(menuList[0]?.id){
           setActiveId(menuList[0].id)
        }

    }, []);

    const handleMenu = (e, item) => {
        if (!isLoading) {
            // console.log('handleMenu-------------->',item.menuid)
            setActiveMenuId(item.menuid)
            let id = item.menu.split(" ").join("").toLowerCase()
            GetTimeActivity()

            if (id == "servicesconfig") {
                history.push("/settings/serviceconfig");
            } else if (id == "appconfig") {
                history.push("/settings/" + id);
            }
            else {
                history.push("/" + id);
            }

        }
    }


    const handleActiveMenuObj = (e, name) => {
        GetTimeActivity()
        // console.log('handleActiveMenuObj------------>',name)
        setActiveMenuObj({ ...activeMenuObj, [name]: !activeMenuObj[name] })
    }
    const onClickMenu = (e, item) => {
        //setMenu(id);
        console.log('handleActiveMenuObj------------>',item)
         setActiveId(item.id)
         
         history.push(item.route)
    }
    const searchClick = () => {
        history.push("/search");
    }
    const savedClick = () => {
        history.push("/dashboard");
    }
    console.log('activeId------------>',activeId)
    return (
        <>

            {/* <div className="vertical-menu">

                <div data-simplebar className="h-100">

                    <div id="sidebar-menu">
                        <ul className="metismenu list-unstyled" id="side-menu">
                                {userData && userData.permissions && userData.permissions.length > 0 ? userData.permissions.map((eachItem) => {
                                    let isDisplay = eachItem.display
                                    let isEnable = eachItem.enable
                                    return (

                                        <>
                                            {isDisplay == true &&

                                                
                                                <li key={eachItem.menuid} 
                                                className={`${eachItem.menuid === activeMenuId ? 'active':''} ${isLoading?'pe-none':''}`}
                                                onClick={(e) => eachItem.submenus == undefined ? handleMenu(e, eachItem) : handleActiveMenuObj(e, eachItem.menu)}>
                                                      <a className={`${eachItem.submenus ? 'has-arrow' : ''} waves-effect`}>
                                                        <i className="material-symbols-outlined"> {eachItem.icon} </i>
                                                        <span key="t-dashboards">{eachItem.menu}</span>
                                                    </a>
                                                    {eachItem.submenus && eachItem.submenus.length > 0 &&
                                                        <ul className={activeMenuObj[eachItem.menu] ? "sub-menu mm-show active" : "sub-menu mm-collapse"} aria-expanded="false">
                                                            {eachItem.submenus.map((eachSubmenu) => <li key={eachSubmenu.menuid} className={`${eachSubmenu.menuid === activeMenuId ? 'active':''} ${isLoading?'pe-none':''}`} onClick={(e) => handleMenu(e, eachSubmenu)}><a >{eachSubmenu.menu}</a></li>)}

                                                        </ul>

                                                    }


                                                </li>
                                            }
                                        </>
                                    )
                                }) : null}
                        </ul>
                    </div>
                    <p className="activity_time">Action: {localStorage.getItem("timeActivity")}</p>

                </div>
            </div> */}
            <div className="vertical-menu">

                <div data-simplebar className="h-100">
                    <div id="sidebar-menu">
                        <ul className="metismenu list-unstyled" id="side-menu">
                            {/* <li>
                                <a href="#" className={isActive ? "waves-effect active": "waves-effect"} onClick={searchClick}> <span className="material-symbols-outlined icon"> travel_explore </span> <span key="t-chat">Search</span> </a>
                            </li>
                            <li>
                                <a href="#" className="waves-effect " onClick={savedClick}> <span className="material-symbols-outlined icon"> collections_bookmark </span> <span key="t-chat">Properties</span> </a>
                            </li>
                            <li>
                                <a href="#" className="waves-effect"> <span className="material-symbols-outlined icon"> settings </span> <span key="t-chat">Settings</span> </a>
                            </li> */}
                            {/* {menuList.map(eachItem => (
                                            <li key={eachItem.id}><a href='#' className={`"waves-effect ${eachItem.id === menu ? 'active' : ''}`} onClick={() => onClickMenu(eachItem.id,eachItem.route)}  data-tip={eachItem.labelName}><span className="material-symbols-outlined icon"> {eachItem.name} </span> <span key="t-chat">{eachItem.labelName}</span></a> <Tooltip />  </li>
                                        ))} */}
                                        {menuList.map((val) => (
          <li key={val.id}>
            <a href='#' className={`${activeId === val.id ? "waves-effect active" : "waves-effect"}`} onClick={(e) => onClickMenu(e, val)}  data-tip={val.labelName}><span className="material-symbols-outlined icon"> {val.name} </span> <span key="t-chat">{val.labelName}</span></a> 
          </li>
        ))}
                        </ul>
                    </div>

                </div>
            </div>

        </>
    );
};

export default Sidebar;
