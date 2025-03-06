/***
**Module Name: content upload
 **File Name :  contentupload.js
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
 **Description : contains import content details.
 ***/
import React, { useState, useEffect,useContext } from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import { useHistory, Link, Redirect } from "react-router-dom";
import * as XLSX from 'xlsx';
import tmdbApi from "../../api/tmdbApi";
import moment from "moment";
import axios from 'axios';
import * as Config from "../../constants/Config";
import Modal from 'react-bootstrap/Modal';
import SweetAlert from 'react-bootstrap-sweetalert';
import SessionPopup from "../SessionPopup"
import ContentCheck from './contentCheck';
import { contentContext } from "../../context/contentContext";

let { lambda, country, appname } = window.app;


const ContentUpload = () => {
    const history = useHistory();
    const [assets, setAssets] = useState([]);
    const [fileName, setFileName] = useState("");
    const [flag, setFlag] = useState(false);
    const [success, setSuccess] = useState(false);
    const [data, setData] = useState({});
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheet, selectSheet] = useState("");
    const [showSelectSheetError, setshowSelectSheetError] = useState(false);
    const [workbook, setWorkbook] = useState({});
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [contentloader, setContentLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [filelength, setFileLength] = useState(false);
    const [filesize, setFileSize] = useState(false);
    const [fileextension, setFileExtension] = useState("");
    const [extensionPopup, setFileExtensionPopup] = useState(false);
    const [showError, setShowError] = useState(false);



    const {route, setRoute,setCurrentPage,currentPageNew,setRowsPerPage,usePrevious, setActiveMenuId,contentsearch,pay,GetTimeActivity} = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if(prevRoute != undefined && prevRoute!=route){
            console.log('usee ffect prevrouteee')
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);

    useEffect(() => {
        setRoute("content")
        setActiveMenuId(200001)
        userActivity();
        }, []);
        const userActivity = () => {
            let path = window.location.pathname.split("/");
            const pageName = path[path.length - 1];
            var presentTime = moment();
            let payload;
    
            payload = {
                "userid": localStorage.getItem("userId"),
                "pagename": pageName,
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
        // console.log('currentPageNewcurrentPageNew',currentPageNew)
      console.log('payloadd',pay)
    console.log('content search',contentsearch)
    const readUploadFile = (e) => {
        GetTimeActivity()
        e.preventDefault();
        setFileName(e.target.files);
       let x = e.target.files[0].name
       let extension = x.split(".")
console.log("extension[extension.length - 1]",extension[extension.length - 1])
       if((extension[extension.length - 1] === "xlsx") || (extension[extension.length - 1] === "xls")){
        setShowError(true)
       }else{
        setFileExtensionPopup(true);
        setFileName("");
       }
       setFileExtension(extension[extension.length - 1]);
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                let workbook = XLSX.read(data, { type: "array" });

                setWorkbook(workbook);
                setSheetNames(workbook.SheetNames)
                const filedata = new Uint8Array(e.target.result);
                const fileSize = data.byteLength / 1024; // Size in KB
               // console.log(`File Size: ${fileSize.toFixed(2)} KB`);
                setFileSize(fileSize.toFixed(2))

                if (workbook.SheetNames.length == 1) {
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet, { raw: false });
                   // console.log("json", json.length)
                    setFileLength(json.length);
                   
                        setAssets(JSON.stringify(json, null, 1).trim())
                    
                }


            };

            reader.readAsArrayBuffer(e.target.files[0]);

        }
        //setFlag(true);
    }

    function onConfirm() {
        GetTimeActivity()
        setShowPopup(false)
    };

    function onConfirm1() {
        GetTimeActivity()
        setFileExtensionPopup(false)
    };


    useEffect(() => {

        if (selectedSheet) {
            const worksheet = workbook.Sheets[selectedSheet];
            const json = XLSX.utils.sheet_to_json(worksheet);
            setFileLength(json.length);
            setAssets(JSON.stringify(json, null, 1).trim())
            
        }

    }, [selectedSheet]);


    // console.log("jsondata", fileName);


    const DataImport = async () => {
        GetTimeActivity()
        const startTime = performance.now();
        setIsLoading(true);
        console.log("jsondata", assets);
        try {
            const response = await tmdbApi.mapImport({
                "contents": JSON.parse(assets),
            });
            console.log(response);

            if (response.statusCode === 200) {
                if (response.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setSuccess(true);
                    setData(response.result.data)
                }
            }

        } catch {
            console.log("error");
            setShowPopup(true);
        }
        setIsLoading(false);
    };



    const MapData = async () => {
        GetTimeActivity()
        console.log("jsondata", assets);
        if (sheetNames.length > 1 && !selectedSheet) {
            setshowSelectSheetError(true);
        } else {
            setshowSelectSheetError(false);
            history.push("/contentmap", { fileName: fileName && fileName[0].name, assets: JSON.parse(assets) });
        }
    };



    function handleBack() {
        GetTimeActivity()
        history.push("/contentmanagement");
    }
    // function onConfirm() {
    //     setSuccess(false);
    //     history.push("/contentmanagement");
    // };

    return (
        <>


            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                {isLoading ?

                    //     <div className="orasi-preloader">
                    //     <img src="https://orasi-dev.imgix.net/orasi/common/images/preloader.png" />
                    // </div>
                    <>
                        {/* //     <div className="orasi-preloader">
                        //     <img src="https://orasi-dev.imgix.net/orasi/common/images/preloader.png" />
                        // </div> */}
                        <div className="orasi-preloader">
                            <h1>Importing . . . </h1><div className="progress-bar">
                                <div className="progress-fill"></div>
                            </div>
                        </div>
                    </>

                    : contentloader ? <div className="orasi-preloader">
                        <img src="https://orasi-dev.imgix.net/orasi/common/images/preloader.png" />
                    </div> :
                        <div className="main-content user-management create-user import-content">
                            {success ? <ContentCheck data={data} /> :
                                <div className="page-content ">
                                    <div className="container-fluid">



                                        <div className="row mb-4 breadcrumb">
                                            <div className="col-lg-12">
                                                <div className="d-flex align-items-center">

                                                    <div className="flex-grow-1">
                                                        <h4 className="mb-2 card-title">IMPORT  CONTENT</h4>
                                                        {/* <p className="menu-path">Select categories / <b>Import Content</b></p> */}

                                                    </div>
                                                    <div>
                                                        <a onClick={handleBack} className="btn btn-primary">back</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="create-user-block">
                                           
                                            <div className="upload-block">

                                                <div>
                                                    {fileName?.[0]?.name ? "" :
                                                        <div className="btn btn-gray jr-btn un-btn">

                                                            <input
                                                                type="file"
                                                                name="upload"
                                                                className="udisplay-none"
                                                                id="upload"
                                                                accept=".xlsx,.xls"
                                                                onChange={readUploadFile}
                                                            />

                                                            {/* {flag === true ? 
                                        <Redirect to="/contentcatelog" />
                                       : <h2></h2>} */}
                                                            <img src={Config.img + "upload-icon.png?" + Config.compress} />

                                                           

                                                        </div>
                                                      
                                                    }
                                                    {sheetNames?.length > 1 && <div className="label-block" style={{ width: "100%" }}>
                                                        <p>SELECT A SHEET</p>
                                                        <select className="form-select" onChange={(e) => { selectSheet(e.target.value); setshowSelectSheetError(false) }} defaultValue='' id="floatingSelectGrid" aria-label="Floating label select example">
                                                            <option value="">search sheet</option>
                                                            {sheetNames?.map((eachItem) => {
                                                                return (
                                                                    <option value={eachItem}>{eachItem}</option>
                                                                )
                                                            }
                                                            )}
                                                        </select>
                                                        {showSelectSheetError && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>Select a sheet to import</span>}
                                                    </div>}
                                                    {fileName?.[0]?.name ? "" :
                                                        <><h5>{fileName && fileName[0]?.name ? fileName && fileName[0]?.name : "Click the Icon to select the file"}</h5><p>Only Excel(.xls) Files Allowed</p></>
                                                    }

                                                </div>



                                                <div className="d-flex">

                                                    <h5>{fileName && fileName[0]?.name}</h5>
                                                    {/* {fileName && (fileextension !== "xlsx" || fileextension !== "xlx") ? "" :<p>Hii</p>} */}

                                                   
                                                    {fileName && filesize < 1 ? <img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" /> : null}
                                                   
                                                    { filesize >= 2000 ?
                                                            <>
                                                                <p className="import-length-msg">The import file size is too big. Please import a file size of less than 2MB</p>
                                                            </>:(fileName && filelength === 0)  || (fileName && filesize === 0) ? <>
                                                        <p className="import-length-msg">There is no content to import </p>
                                                    </> 
                                                    
                                                    :(showError && filelength > 400) ?
                                                        <>
                                                            <p className="import-length-msg">Import file contains morethan 400 titles. Please import the file less than 400 titles</p>
                                                        </>
                                                        : 
                                                            
                                                            <> {fileName?.[0]?.name &&  filelength >= 1  && <button type="button" className="btn-rounded" onClick={(fileName && fileName[0]?.name) ? DataImport : null}><span className="material-icons">upload</span>Upload
                                                            </button>}{fileName?.[0]?.name && filelength >= 1  && <button type="button" className="btn-rounded" onClick={(fileName && fileName[0]?.name) ? MapData : null}><span className="material-icons-outlined">settings_ethernet</span>Map & Upload
                                                            </button>}</>
                                                    }

                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>

                            }
                            <SweetAlert show={showPopup}
                                custom
                                confirmBtnText="ok"
                                confirmBtnBsStyle="primary"
                                title={"Something went wrong. Please verify file and re-upload the file"}
                                onConfirm={e => onConfirm()}
                            >
                            </SweetAlert>
                            <SweetAlert show={extensionPopup}
                                custom
                                confirmBtnText="ok"
                                confirmBtnBsStyle="primary"
                                title={"Please upload excel files only"}
                                onConfirm={e => onConfirm1()}
                            >
                            </SweetAlert>



                            <Footer />

                        </div>
                }
            </div>

        </>
    );
};

export default ContentUpload;
