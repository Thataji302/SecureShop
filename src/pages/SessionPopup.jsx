/***
**Module Name: SessionPopup
 **File Name :  SessionPopup.js
 **Project :    Orasi Media
 **Copyright(c) : X Platform Consulting.
 **Organization : Peafowl Inc
 **author :  Kiran
 **author :  Hari
 **license :
 **version :  1.0.0
 **Created on :
 **Created on: Mar 29 2023
 **Last modified on:  Mar 29 2023
 **Description : contains category page details.
 ***/
import React, { useState, useEffect, useRef, useContext } from "react";
import tmdbApi from "../api/tmdbApi";

import { useHistory } from "react-router";


import * as Config from "./../constants/Config";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useParams } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import SweetAlert from 'react-bootstrap-sweetalert';
import { contentContext } from "../context/contentContext";

const SessionPopup = (props) => {
    const history = useHistory();
    // const [enquire, setEnquire] = useState(true);
    // const [additionalCom, setAdditionalCom] = useState("");
    // const [rightsAvailable, setRightsAvailable] = useState("");
    // const [rightsAvailableDate, setRightsAvailableDate] = useState("");
    // const [videoFormat, setVideoFormat] = useState("");
    // const [dubbingLanguages, setDubbingLanguages] = useState("");
    // const [exclusivity, setExclusivity] = useState("");
    // const [request, setRequest] = useState("");
    // const [queries, setQueries] = useState("");
    // const [showSessionPopupup, setShowSessionPopupup] = useState(false);

    // const [contentformValues, setContentformValues] = useState(props.contentformValues != [] ? props.contentformValues : []);

    const { clientData, wishListData, setWishListData, formValues, setFormValues, setClientData1, GetClientDataFunction, wishlistCount, setwishlistCount, showCategoryData, setShowCategoryData, setInitialCategoriesData1, hideMenu, setHideMenu, isShowMyContent, setIsShowMyContent, pageNumber, setPageNumber, assetTotal, setAssetTotal, perpage, setPerpage, totalPagesArray, setTotalPagesArray, totalPages, setTotalPages, setGrid, setList, setMenuCategoryName,
        selectedOptions, setSelectedOptions, multiSelectFields, setMultiSelectFields,setUserData,setActiveFieldsObj,setSelectedOptionsClientName,setSearchPayload,setShowPopup
    } = useContext(contentContext)


    // const handleCloseEnq = () => {
    //     setEnquire(false)
    // };


    const onConfirm = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("ClientName");
        localStorage.removeItem("ClientType");
        setUserData([])
        setInitialCategoriesData1([])
        setSelectedOptions([])
        setMultiSelectFields({dubbinglanguages:[],typeofrights:[],countryorigin:[], languages :[], typeofrights :[], genre :[], videoquality :[], certificate :[], subtitleslanguages :[], territoriesavailable :[], sport :[], musicgenre :[]})
        setActiveFieldsObj({CookingshowActive:false,seriesActive:false,SportsActive:false,LiveEventActive:false,MusicActive:false})
        setSelectedOptionsClientName([])
        setSearchPayload({})
        setShowPopup(false)
        history.push("/");
       
    }



    return (
        <>

            <Modal className="access-denied" show={true} >

                <div className="modal-body enquiry-form">
                    <div className="container">
                        <button className="close-btn" onClick={e => onConfirm()}><span className="material-icons">close</span></button>
                        <span className="material-icons access-denied-icon">lock_clock</span>
                        <h3>Session Terminated</h3>
                        <p>The current session has been terminated because some one has logged in another window.</p>
                        <div className="popup-footer">
                        <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => onConfirm()}>OK</button>
                        </div>

                    </div>
                </div>

            </Modal>


        </>
    )
}
export default SessionPopup