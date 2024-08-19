/*
Module Name :      Loader
File Name   :      loader.jsx
Project     :      OrasiMedaia.com
Copyright (c)      peafowl.inc
author      :     chandrasekhar
author      :
license     :
version     :      0.0.12 // written by  for present.
Created on  :      4th January 2023
Last modified on:  12th January 2023
Description :      
Organisation:      Peafowl inc.
*/

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
let { appname } = window.app;




const Loader = () => {
    const history = useHistory();
    const [image, setImg] = useState('');

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

    return (

        <>
           <div className="table-preloader">
                <div className="orasi-preloader spa_Preloader">
                   {/* <img src="https://orasi-dev.imgix.net/orasi/common/images/preloader.png" /> */}
                   <img src="https://spacovers.imgix.net/spacoversdev/common/images/preloader.png" />
                </div>
                </div>
                
          

        </>
    );
};


export default Loader;



