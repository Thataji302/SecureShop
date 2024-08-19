/***
 **Module Name: BlockBuyer
 **File Name :  BlockBuyer.js
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
 **Description : contains BlockBuyer details.
 ***/
import React, { useState, useEffect, useContext, useRef } from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Loader from "../../components/loader";

import SweetAlert from "react-bootstrap-sweetalert";
import ReactQuill from 'react-quill';
import Modal from 'react-bootstrap/Modal';
import SessionPopup from "../SessionPopup";
import PlayerInfo from "../../components/player";
import { contentContext } from "../../context/contentContext";
let { appname, lambda } = window.app;

const LandingPage = () => {
    const history = useHistory();
    const ref = useRef();
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [sec1, setSec1] = useState({});
    const [sec2, setSec2] = useState({});
    const [sec3, setSec3] = useState({});
    const [sec4, setSec4] = useState({});
    const [sec5, setSec5] = useState({});
    const [play, setPlay] = useState(false);
    const [playContent, setPlayContent] = useState({});
    const [menuCode, setMenuCode] = useState(0);
    const [fileName, setFileName] = useState("");
    const [showUpload, setShowUpload] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploadsuccess, setUploadSuccess] = useState(false);
    const [fileCategory, setFileCategory] = useState("");
    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious , setActiveMenuId,GetTimeActivity} = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);
    const handleBack = () => {
        history.push("/frontendsettings")
    }
    useEffect(() => {
        setRoute("frontend")
        setActiveMenuId(200007)
        handleMenu();
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

    const handleMenu = () => {
        GetTimeActivity()   
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/menus?appname=' + appname + '&menuid=100001&token=' + token,
        })
            .then(function (response) {
                if (response.data.result) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        console.log(response)

                        setMenuCode(response.data.result.data[0].menuid)
                        setSec1(response.data.result.data[0].team[0])
                        setSec2(response.data.result.data[0].team[1])
                        setSec3(response.data.result.data[0].team[2])
                        setSec4(response.data.result.data[0].team[3])
                        setSec5(response.data.result.data[0].team[4])
                    }
                }
            });

    }


    const handleChange = (e, key) => {
        GetTimeActivity()   
        if (key === 0) {
            setSec1({ ...sec1, [e.target.name]: e.target.value })
        }
        if (key === 2) {
            setSec3({ ...sec3, [e.target.name]: e.target.value })
        }
        if (key === 4) {
            setSec5({ ...sec5, [e.target.name]: e.target.value })
        }

    }
    const handleDescription = (key, value) => {
        // setSec5({...sec5, [key] : value})
        GetTimeActivity()   
        console.log(value, key)
        setSec5((prevContents) => ({
            ...prevContents,
            [key]: value
        }));
    }

    const handleClose = (e) => {
        GetTimeActivity()   
        setShowUpload(false);
        setFileName("");
        ref.current.value = "";

    }
    const handlePlayer = (e, content) => {
        GetTimeActivity()   
        console.log("content", content)

        let source = window.site.common.proxiesCloudFront + content
        setPlayContent(source);
        setPlay(true);
    }

    const handleEditFile = (e, type) => {
        GetTimeActivity()   
        setFileCategory(type);
        setShowUpload(true);
    }

    function onConfirm() {
        GetTimeActivity()   
        setSuccess(false);
    };

    const uploadS3 = async (e, type) => {
        GetTimeActivity()   
        console.log("type---------", type[2]);
        // setIsLoading(true);
        var fileData = new FormData();
        var file = e.target.files[0];
        console.log("file", file);
        var uploadFilePath = "";
        var filename = e.target.files[0].name;
        var s3file = e.target.files[0];
        fileData.append(type[1], s3file);
        var bucket;

        var reader = new FileReader();
        reader.readAsDataURL(s3file);
        reader.onload = function (e) {
            var image = new Image();
            image.src = e.target.result;
            var ObjectID = require("bson-objectid");
            var fileid = new ObjectID().toString();

            let format = file.name.split(".");
            var fileformat = format[format.length - 1]
            const timestamp = Date.now();

            let allowedVideoFiles = ["avi", "divx", "f4v", "flv", "mts", "m2t", "m4v", "mkv", "mov", "mp4", "mpeg", "mpg", "mxf", "r3d", "wmv"]

            let extension;
            if (allowedVideoFiles.includes(fileformat)) {
                extension = "VIDEO"
            }


            if (extension === "VIDEO") {
                bucket = window.site.common.sourceBucket;
            }

            console.log("type", file.type)

            var path

            path = "hotfolder/landingpage/" + fileCategory;



            uploadFilePath = appname + "/" + path + "/" + fileid + "_" + timestamp + "." + fileformat;

            // let imagePath = window.site && window.site.common && window.site.common.resourcesUrl;
            var data = { source_bucket: bucket, sourcepath: uploadFilePath }
            console.log("data", data)
            const token = localStorage.getItem("token")
            axios.post(lambda + '/uploadFiles?appname=' + appname + "&token=" + token + "&userid=" + localStorage.getItem("userId"), data, { type: 'application/json' })
                .then((response) => {
                    if (response.data && response.data.result) {
                        var url = response.data.result;

                        console.log("url", url);
                        axios.put(url, file, {
                            "headers": {
                                "Content-Type": "multipart/form-data",
                                "Accept": "/",
                                "Cache-Control": "no-cache",
                                "Accept-Encoding": "gzip, deflate",
                                "Connection": "keep-alive",
                                "cache-control": "no-cache"
                            }
                        })
                            .then((response) => {
                                if (response && response.status === 200) {

                                    let imageUploadPath = uploadFilePath;
                                    console.log("parth", imageUploadPath);
                                    setShowUpload(false);
                                    setUploadSuccess(true)
                                    if (fileCategory === "howitworks") {
                                        setSec4({ ...sec4, url: imageUploadPath })
                                    } else {
                                        setSec2({ ...sec2, url: imageUploadPath })
                                    }



                                }
                            })
                            .catch((err) => {
                                console.error.bind(err);
                            })
                    }
                })
                .catch((err) => {
                    console.error.bind(err);
                })

        }


    }


    const handleUpdate = () => {
        GetTimeActivity()   

        let arr = [];
        arr.push(sec1)
        arr.push(sec2)
        arr.push(sec3)
        arr.push(sec4)
        arr.push(sec5)

        console.log(arr);
        const token = localStorage.getItem("token")
        axios.put(lambda + '/menus?appname=' + appname + "&menuid=" + menuCode + "&token=" + token + "&userid=" + localStorage.getItem("userId"), {

            "team": arr

        }
        )
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        setSuccess(true)
                    }
                }

            });

    }

    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <div className="main-content create-user edit-content add-client lps">

                    <div className="page-content ">
                        <div className="container-fluid">
                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-9">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <h4 className="mb-2 card-title">LANDING PAGE SETTINGS</h4>
                                            <p className="menu-path">Front End Settings / <b>Landing Page</b></p>
                                        </div>



                                    </div>
                                </div>
                                <div className="col-lg-3 align-right">
                                    <button className="btn btn-primary" type="button" onClick={handleBack}>BACK</button>
                                </div>
                            </div>
                            {Object.keys(sec1).length > 0 ? 
                                            <>     
                            <div className="create-user-block mb_20">

                                <div className="form-block">
                                    <h2 className="form_title">HERO BANNER SECTION</h2>
                                    <div className="banner_section">

                                        <div className="right">
                                            <div className="mb-3 input-field">
                                                <label className="form-label form-label">CAPTION 1</label><input id="email" name="caption1" placeholder="Enter Caption" type="text" className="form-control" aria-invalid="false" onChange={(e) => handleChange(e, 0)} value={sec1.caption1} />
                                            </div>
                                            <div className="mb-3 input-field">
                                                <label className="form-label form-label">CAPTION 2</label><input id="email" name="caption2" placeholder="Enter Caption" type="text" className="form-control" aria-invalid="false" onChange={(e) => handleChange(e, 0)} value={sec1.caption2} />
                                            </div>
                                            <div className="mb-3 input-field">
                                                <label className="form-label form-label">BANNER DESCRIPTION</label>
                                                <textarea id="w3review" name="description" className="form-control awd" placeholder="add website description" onChange={(e) => handleChange(e, 0)} value={sec1.description}></textarea>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className="create-user-block mb_20">
                                <div className="form-block">
                                    <h2 className="form_title">WHY ORASI MEDIA ?</h2>
                                    <div className="thumbnail-block">
                                    <button className="border-btn_sm landscape"
                                        onClick={(e) => handleEditFile(e, "whyorasimedia")}
                                    >
                                        <i className="mdi mdi-pencil font-size-18"></i></button>
                                    <div className="asset-card">
                                        <div className="play-icon">
                                            <span className="material-icons-outlined">play_circle</span>
                                        </div>
                                        <a className="spinner-class"
                                            onClick={(e) => handlePlayer(e, sec2.url)}
                                        >
                                            <img src="https://orasi-dev.imgix.net/orasi/common/images/img-default.jpg" />
                                        </a>
                                        <p style={{ clear: 'both', display: "inline-block", overflow: 'hidden', whiteSpace: 'nowrap' }}>{fileName}</p>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            {play ?

                                <PlayerInfo source={playContent} play={play} setPlay={setPlay} />
                                : null
                            }
                            <div className="create-user-block mb_20">
                                <div className="form-block">
                                    <h2 className="form_title mb_20">SECTION 2</h2>
                                    <div className="mb-3 input-field"><label className="form-label form-label">CAPTION 1</label><input id="email" name="caption1" placeholder="THE GLOBAL MARKETPLACE FOR" type="text" className="form-control" onChange={(e) => handleChange(e, 2)} value={sec3.caption1} /></div>
                                    <div className="mb-3 input-field">
                                        <label className="form-label form-label">CAPTION 2</label>
                                        <input id="email" name="subcaption" placeholder="ENTERTAINMENT CONTENT & LINEAR CHANNELS" type="text" className="form-control" onChange={(e) => handleChange(e, 2)} value={sec3.subcaption} />
                                    </div>
                                    <div className="mb-3 input-field">
                                        <label className="form-label form-label">DESCRIPTION</label>
                                        <textarea id="w3review" name="caption2" className="form-control awd" placeholder="" onChange={(e) => handleChange(e, 2)} value={sec3.caption2}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="create-user-block mb_20">
                                <div className="form-block">
                                    <h2 className="form_title">HOW IT WORKS ?</h2>
                                    {/* <div className="add-block"><span className="material-icons-outlined">add</span>add</div> */}
                                    <div className="thumbnail-block">
                                        <button className="border-btn_sm landscape"
                                            onClick={(e) => handleEditFile(e, "howitworks")}
                                        >
                                            <i className="mdi mdi-pencil font-size-18"></i></button>
                                        <div className="asset-card">
                                            <div className="play-icon">
                                                <span className="material-icons-outlined">play_circle</span>
                                            </div>
                                            <a className="spinner-class"
                                                onClick={(e) => handlePlayer(e, sec4.url)}
                                            >
                                                <img src="https://orasi-dev.imgix.net/orasi/common/images/img-default.jpg" />
                                            </a>
                                            <p style={{ clear: 'both', display: "inline-block", overflow: 'hidden', whiteSpace: 'nowrap' }}>{fileName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="create-user-block">
                                <div className="form-block">
                                    <h2 className="form_title mb_20">BUYER / SELLERS BENEFITS</h2>
                                    <div className="mb-3 input-field"><label className="form-label form-label">CAPTION 1</label><input id="email" name="caption1" placeholder="THE GLOBAL MARKETPLACE FOR" type="text" className="form-control" onChange={(e) => handleChange(e, 4)} value={sec5.caption1} /></div>
                                    <div className="mb-3 input-field">
                                        <label className="form-label form-label">CAPTION 2</label>
                                        <input id="email" name="caption2" placeholder="FOR BUYERS & SELLERS" type="text" className="form-control" onChange={(e) => handleChange(e, 4)} value={sec5.caption2} />
                                    </div>
                                    <div className="mb-3 input-field row">
                                        <div className="col-md-6">
                                            <label className="form-label form-label">SELLER BENEFITS</label>
                                            <ReactQuill theme="snow" value={sec5.sellerBenfits} onChange={(content) => handleDescription('sellerBenfits', content)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label form-label">BUYER BENEFITS</label>
                                            <ReactQuill theme="snow" value={sec5.buyerBenfits} onChange={(content) => handleDescription('buyerBenfits', content)} />
                                        </div>
                                    </div>
                                    <button className="btn btn-primary ml-25 border_button" onClick={handleUpdate} type="button" ><span className="material-symbols-outlined"> save </span>Update</button>
                                </div>

                            </div>


                            </>
                                        : 
                                        <div className="create-user-block">
                                        <div className="form-block">
                                            <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active show" id="home1" role="tabpanel">
                                                    <div className="row"><Loader />
                                                    </div>
                                                </div>
                                                </div>  </div>
                                        </div>
                                                }
                        </div>

                    </div>


                    {showUpload &&
                        <Modal show={true} className="seller-pop new-look-up add-document" >
                            <Modal.Header >
                                <Modal.Title>File</Modal.Title>
                                <button className="close-btn" onClick={handleClose}><span className="material-icons">close</span></button>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-12 documents">
                                        <div className="mb-3 input-field">
                                            {/* <label className="form-label form-label">{fileCategory === "CONTENT_IMAGE" ? "Thumbnail Name" :"File Name"}</label> */}
                                            {/* <input name="filename" placeholder="Enter File Name" type="text" className="form-control" onChange={(e) => setFileName(e.target.value)} value={fileName} /> */}
                                        </div>
                                        <div className="mb-3 input-field btn-gray">

                                            <input type="file" name="upload" accept="video/*" className="udisplay-none" id="upload"
                                                onChange={e => uploadS3(e, ["1920*1080", "Video", "landscape_logo_image"])}
                                                onClick={(e) => { e.target.value = ''; }} ref={ref} />



                                            <span className="material-icons">upload</span>upload document</div>
                                        {/* <p>Only pdf and word document allowed.</p> */}

                                        {/* <a className="btn btn-primary">done</a> */}
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>


                    }

                    <SweetAlert show={success}
                        custom
                        confirmBtnText="ok"
                        confirmBtnBsStyle="primary"
                        title={"Updated successfully"}
                        onConfirm={e => onConfirm()}
                    >
                    </SweetAlert>
                    <SweetAlert show={uploadsuccess}
                        custom
                        confirmBtnText="ok"
                        confirmBtnBsStyle="primary"
                        title={"uploaded successfully"}
                        onConfirm={e => setUploadSuccess(false)}
                    >
                    </SweetAlert>

                    <Footer />
                </div>
            </div>
        </>
    );
};

export default LandingPage;
