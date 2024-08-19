/***
**Module Name: footer
**File Name : footer
**Project : Orasi Media
**Copyright(c) : X Platform Consulting.
**Organization : Peafowl Inc
**author : chandrasekhar
**author : Hari
**license :
**version : 1.0.0
**Created on :
**Created on: Dec 29 2022
**Last modified on: Dec 29 2022
**Description : contains Footer details.
***/
import React, { useState, useEffect } from "react";


const Footer = () => {

return (
<>


    <footer className="footer">
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12">
                <p className="footer-para">  &copy; 2023 SPACOVERS.</p>
                </div>
                {/* <div className="col-sm-6">
                    <div className="text-sm-end d-none d-sm-block">
                        Design & Develop By Orasi Media
                    </div>
                </div> */}
            </div>
        </div>
    </footer>


</>
);
};

export default Footer;