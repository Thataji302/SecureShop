/***
**Module Name: Footer 
 **File Name :  Footer.js
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
 **Description : contains Footer component details.
 ***/
import React from "react";
import { useHistory  } from "react-router-dom";


// import { Link } from "react-router-dom";


import * as Config from "./../../constants/Config";


const Footer = (props) => {
  const history = useHistory();
 
  const handlemenuclick = async (e,path) => {
    history.push(path);
  }
  return (
    <><footer className="footer">
      <div className="container-fluid">
        <div className="footer-container">
          <ul className="footer-links">
            {/* <li onClick={handleTerms}><a>Terms</a></li>
            <li onClick={handlePrivacy}><a>Privacy</a></li>
            <li onClick={handleContact}><a>Contact Us</a></li> */}
              {props.menus && props.menus.length > 0  && props.menus.map(function (item, i) {
                let pathlink = "/" + item.route;
              return (
                item.type == "footermenu"?
                  <li key={i}><a className="nav-link active" onClick={e => handlemenuclick(e, pathlink)}>{item.menu}</a></li>:""
              
              )
            })}
          </ul>
          <p className="footer-para">  &copy; 2022 Orasi Media.</p>
        </div>
      </div>
    </footer><a href="#" className="back-to-top d-flex align-items-center justify-content-center"><span className="material-symbols-outlined">
      arrow_upward
    </span></a>
    {/* <div id="preloader"></div> */}
    </>
  );
};

export default Footer;
