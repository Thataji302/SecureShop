/***
**Module Name: not found
 **File Name :  notfound.js
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
 **Description : contains page not found details.
 ***/
import React, { useState, useContext,useEffect } from "react";
import * as Config from "../constants/Config";
import { useHistory, Link } from "react-router-dom";

import { contentContext } from "../context/contentContext";


const NotFound = () => {
    const { userData } = useContext(contentContext);
    const history = useHistory();
    // const handleBack = () => {
    //     history.push('/')
    // }
    const handleBack = () => {
        let userArr = userData.permissions

        console.log("userArr",userData)

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

    return (
        <>

            <main>
                <div className="error-wrapper">
                    <h1>Error!</h1>
                    <h3>There is nothing here</h3>
                    <img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/error404.svg" className="error-img" />
                        <button className="btn btn-primary mt-3" onClick={handleBack}>BACK TO HOME</button>
                </div>
            </main>



        </>
    );
};

export default NotFound;
