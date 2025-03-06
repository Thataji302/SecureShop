/***
**Module Name: Team
 **File Name :  Team.js
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

 ***/
import React, { useState, useEffect, useRef, useContext } from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import { useHistory, Link } from "react-router-dom";
import { useParams } from 'react-router-dom'
import moment from "moment";
import Loader from "../../components/loader";

import Modal from 'react-bootstrap/Modal';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from "axios";
import SessionPopup from "../SessionPopup";
import ReactQuill from 'react-quill';
import { contentContext } from "../../context/contentContext";

import * as Config from "../../constants/Config";

const Team = () => {
    let { id } = useParams();
    const ref = useRef();
    const history = useHistory();
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [value, setValue] = useState('');
    const [teamData, setTeamData] = useState([]);
    const [formValuesData, setFormValuesData] = useState({});
    const [showupBoard, setShowupBoard] = useState(false);
    const [menuCode, setMenuCode] = useState(0);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isdelete, setDelete] = useState(false);
    const [fileExceed, setFileExceed] = useState(false);
    const [item, setItem] = useState(false);

    let { appname, lambda } = window.app;
    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, setActiveMenuId ,GetTimeActivity} = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);

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
            url: lambda + '/menus?appname=' + appname + '&menuid=100003&token=' + token,
        })
            .then(function (response) {
                if (response && response.data && response.data.result) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        let data = response && response.data && response.data.result && response.data.result.data && response.data.result.data[0] && response.data.result.data[0].team
                        setMenuCode(response.data.result.data[0].menuid)
                        setTeamData(data)
                    }
                }
            });

    }

    const handleUpdate = () => {
        const token = localStorage.getItem("token")
        axios.put(lambda + '/menus?appname=' + appname + "&menuid=" + menuCode + "&token=" + token + "&userid=" + localStorage.getItem("userId"), {

            "content": value

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

    function onCancel() {
        GetTimeActivity()   
        setDelete(false)
    }
    const handleDelete = (e) => {
        GetTimeActivity()   
        const token = localStorage.getItem("token")
        setIsLoading(true)
        const catType = formValuesData.type == "board" ? "THE BOARD" : "SALES TEAM"
        axios({
            method: 'DELETE',
            url: lambda + '/menus?appname=' + appname + "&menuid=" + menuCode + "&token=" + token + "&category=" + catType + "&teamid=" + formValuesData?.teamid + "&userid=" + localStorage.getItem("userId")
        })
            .then(function (response) {
                if (response) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        console.log('adsfasdfadsf 2222222222222')
                        setFormValuesData({})
                        handleMenu();
                        setIsLoading(false)
                        setDelete(false);
                    }
                }
            })
            .catch((err) => {
                console.log('error',err)
                setIsLoading(false)
            });

    }



    const handleBack = () => {
        GetTimeActivity()   
        history.push("/frontendsettings")
    }

    const handleClosePopup = () => {
        GetTimeActivity()   
        setShowupBoard(false)
        setFileExceed(false)
        setIsLoading(false)
    }
    const handleFormData = (e) => {
        GetTimeActivity()   
        if (!!errors[e.target.name]) {
            let error = Object.assign({}, errors);
            delete error[e.target.name];
            setErrors(error);
        }

        let name = e.target.name
        let value = e.target.value
        setFormValuesData({ ...formValuesData, [name]: value,'type':'sales' })
    }
    const handleDescription = (value) => {
        GetTimeActivity()   
        setFormValuesData({ ...formValuesData, descriptioncontent: value })
    }
    const removeSpecialCharecters = (filename) => {
        GetTimeActivity()   
        let timeStamp = new Date().getTime();
        let tmpFile = filename
            .substring(0, filename.lastIndexOf("."))
            .replace(/[^a-zA-Z 0-9]/g, "");
        tmpFile = tmpFile.replaceAll(" ", "");
        let tmpExtension = filename.substring(filename.lastIndexOf("."));
        let tmpNewFileName = tmpFile + timeStamp + tmpExtension;
        // console.log("tmpNewFileName", tmpNewFileName)
        // return encodeURIComponent(tmpNewFileName);
        return tmpNewFileName;
    };
    const uploadS3 = async (e, type) => {
        GetTimeActivity()   
        setFileExceed(false)
        var fileData = new FormData();
        var file = e.target.files[0];
        console.log("file", file);
        let filetype = file.type.split("/");
        console.log("filetype", filetype[0])
        if (filetype[0] != "image") {
            setFileExceed(true)
        } else {
            let format = file.name.split(".");
            var uploadFilePath = "";
            var filename = e.target.files[0].name;
            var s3file = e.target.files[0];
            fileData.append(type[1], s3file);
            var bucket;

            var reader = new FileReader();
            reader.readAsDataURL(s3file);
            reader.onload = function (e) {
                var image = new Image();
                var fileformat = format[format.length - 1]
                const timestamp = Date.now();
                image.src = e.target.result;
                let width;
                let height;
                image.onload = function () {
                    height = this.height;
                    width = this.width;
                    if (width == 150 && height === 150) {
                        bucket = window.site.common.resourceBucket;


                        uploadFilePath = "orasi" + "/" + "team" + "/" + removeSpecialCharecters(format[0]) + "_" + timestamp + "." + fileformat;

                        console.log("uploadFilePath", uploadFilePath)
                        let imagePath = window.site && window.site.common && window.site.common.resourcesUrl;
                        var data = { source_bucket: bucket, sourcepath: uploadFilePath }
                        const token = localStorage.getItem("token")
                        const userid = localStorage.getItem("userId")
                        console.log("imagepath", imagePath);


                        axios.post(lambda + '/uploadFiles?appname=' + appname + "&token=" + token + "&userid=" + userid, data, { type: 'application/json' })
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
                                                setFormValuesData({ ...formValuesData, profileimage: imagePath + uploadFilePath })


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

                    } else {
                        setFileExceed(true)
                    }
                }
            }



        }
    }
    const handleBoardEachItem = () => {
        GetTimeActivity()   
        return (
            <>{formValuesData.type == "board" ? (<div className="row"><div className="col-md-12">
                <div className="card">


                    <div className="row">
                        <div className="col-md-5">
                            <div className="user_image">
                            <button className="btn btn-primary btn-block btn-sm sales-upld-btn" type="submit">
                                        <input type="file" name="upload" accept="image/png, image/jpeg , image/*" className="udisplay-none" id="upload"
                                            onChange={e => uploadS3(e, ["1920*1080", "Image", "profileimage"])} onClick={(e) => { e.target.value = ''; }} ref={ref}

                                        /><span className="material-icons-outlined">add_photo_alternate</span>
                                    </button>
                                <div className="file_upload">
                                    

                                    <div className="upload_file">

                                        {formValuesData.profileimage != undefined ? (<img src={`${formValuesData.profileimage}?auto=compress,format`} alt="image-1" />) : (
                                            <img src="https://orasi-dev.imgix.net/orasi/team/default-team.png?auto=compress,format" alt="image-1" />
                                        )}

                                    </div>
                                    {/* <input className="custom-file-input" type="file" name="image" onChange={(e) => handleFormData(e)} /> */}
                                </div>


                            </div>
                            {fileExceed && <p className={fileExceed ? "uploaderror" : ""}><span style={{ color: "red", fontSize: "16px" }}>*</span>Image doesn't meet the requirements</p>}
                            <p><span style={{ color: "red", fontSize: "16px" }}>*</span>Image Specifications: 150px X150px. Should be in jpg or png formats.</p>
                            <div className="user_form">
                                <div className="mb-3 input-field">
                                    <label className="form-label form-label">NAME<span style={{ color: "red", fontSize: "16px" }}>*</span></label><input id="email" name="title" onChange={(e) => handleFormData(e)} placeholder="Name" type="text" value={formValuesData.title} className="form-control" aria-invalid="false" />
                                    {errors.title && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.title}</span>}
                                </div>
                                <div className="mb-0 input-field">
                                    <label className="form-label form-label">Designation<span style={{ color: "red", fontSize: "16px" }}>*</span></label><input id="designation" name="designation" onChange={(e) => handleFormData(e)} placeholder="Designation" type="text" value={formValuesData.designation} className="form-control" aria-invalid="false" />
                                    {errors.designation && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.designation}</span>}
                                </div>



                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="edit-info black-gradient">

                            </div>
                            {/* <div className="mb-0 input-field">
                           <label className="form-label form-label">Description</label><textarea id="Description" name="Description" value={formValuesData.about} disabled placeholder="Description" type="text" className="form-control"></textarea>
                       </div> */}
                            <div className="mb-0 input-field">
                                <label className="form-label form-label">Description<span style={{ color: "red", fontSize: "16px" }}>*</span></label>
                                {/* <ReactQuill theme="snow" value={description} onChange={setDescription} /> */}
                                <ReactQuill theme="snow" value={formValuesData.descriptioncontent} onChange={handleDescription} />
                                {errors.descriptioncontent && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.descriptioncontent}</span>}
                            </div>
                            <div className="mb-3 input-field">
                                    <label className="form-label form-label">phone</label><input id="email" name="phone" onChange={(e) => handleFormData(e)} placeholder="phone" type="text" value={formValuesData.phone} className="form-control" aria-invalid="false" />
                                    {errors.phone && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.phone}</span>}
                                </div>
                                <div className="mb-0 input-field">
                                    <label className="form-label form-label">email id</label><input id="designation" name="email" onChange={(e) => handleFormData(e)} placeholder="email id" type="text" value={formValuesData.email} className="form-control" aria-invalid="false" />
                                    {errors.email && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.email}</span>}
                                </div>
                        </div>
                        <div className="col-md-12">   <button className="btn btn-primary btn-block btn-sm float-end" onClick={(e) => submitMember(e, formValuesData.teamid)}><i className="mdi font-size-18" ></i>{isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}Update</button>
                        </div>
                    </div>

                </div>
            </div></div>) : (
                <div className="row">
                    <div className="col-md-12" >
                        <div className="card">
                            {/* <button className="border-btn_sm portrait"><i className="mdi mdi-delete font-size-18"></i></button> onChange-sales */}
                            <div className="user_image">
                            <button className="btn btn-primary btn-block btn-sm sales-upld-btn" type="submit">
                                        <input type="file" name="upload" accept="image/png, image/jpeg , image/*" className="udisplay-none" id="upload"
                                            onChange={e => uploadS3(e, ["1920*1080", "Image", "profileimage"])} onClick={(e) => { e.target.value = ''; }} ref={ref}

                                        /><span className="material-icons-outlined">add_photo_alternate</span>
                                    </button>
                                <div className="file_upload">
                                   
                                    <div className="upload_file">
                                    {formValuesData && formValuesData.profileimage === undefined ?<img src="https://orasi-dev.imgix.net/orasi/team/default-team.png?auto=compress,format" alt="image-1" /> :
                                        <img src={`${formValuesData.profileimage}?auto=compress,format`} alt="image-1" />}
                                    </div>
                                    {/* <input className="custom-file-input" type="file" /> */}
                                </div>

                            </div>
                            {fileExceed && <p className={fileExceed ? "uploaderror" : ""}><span style={{ color: "red", fontSize: "16px" }}>*</span>Image doesn't meet the requirements</p>}
                            <p><span style={{ color: "red", fontSize: "16px" }}>*</span>Image Specifications: 150px X150px. Should be in jpg or png formats.</p>
                            <div className="user_form">
                                <div className="mb-3 input-field">
                                    <label className="form-label form-label">NAME<span className="required" style={{position:"inherit;"}}>*</span></label><input id="email" name="title" placeholder="Name" type="text" onChange={(e) => handleFormData(e)} value={formValuesData.title} className="form-control" aria-invalid="false" />
                                    {errors.title && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.title}</span>}
                                </div>
                              
                                <div className="mb-0 input-field">
                                    <label className="form-label form-label">Designation<span className="required" style={{position:"inherit;"}}>*</span></label><input id="email" name="designation" placeholder="Designation" type="text" value={formValuesData.designation} className="form-control" onChange={(e) => handleFormData(e)} aria-invalid="false" />
                                    {errors.designation && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.designation}</span>}
                                </div>
                               
                                <div className="mb-3 input-field">
                                    <label className="form-label form-label">phone</label><input id="email" name="phone" placeholder="phone" type="text" onChange={(e) => handleFormData(e)} value={formValuesData.phone} className="form-control" aria-invalid="false" />
                                    {errors.phone && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.phone}</span>}
                                </div>
                               
                                <div className="mb-0 input-field">
                                    <label className="form-label form-label">email id</label><input id="email" name="email" placeholder="email id" type="text" value={formValuesData.email} className="form-control" onChange={(e) => handleFormData(e)} aria-invalid="false" />
                                    {errors.email && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.email}</span>}
                                </div>
                               
                                <div className="mb-0 input-field">
                                    <label className="form-label form-label">Description<span className="required" style={{position:"inherit;"}}>*</span></label><textarea id="email" name="about" placeholder="Description" type="text" value={formValuesData.about} className="form-control" aria-invalid="false" onChange={(e) => handleFormData(e)} ></textarea>
                                    {errors.about && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.about}</span>}
                                </div>
                                
                                
                                <div className="col-md-12"> <button className="btn btn-primary btn-block btn-sm float-end" onClick={(e) => submitMember(e, formValuesData.teamid)}><i className="mdi font-size-18"></i>{isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}{formValuesData.teamid === undefined ? "Add" : "Update"}</button>
                                </div>
                            </div>

                        </div>

                    </div></div>)}</>

        )
    }
    const validateMandatoryFields = () => {
        GetTimeActivity()   
        let error = { ...errors }
        console.log("form", formValuesData.type)
        let k;
        if (formValuesData.type === "THE BOARD") {

            k = [{ name: 'Name', key: 'title' },
            { name: 'Description', key: 'descriptioncontent' },
            { name: 'Designation', key: 'designation' },
            // { name: 'Phone', key: 'phone' },
            // { name: 'Email', key: 'email' }
            ];
        } else {
            k = [{ name: 'Name', key: 'title' },
            { name: 'Description', key: 'about' },
            { name: 'Designation', key: 'designation' },
            // { name: 'Phone', key: 'phone' },
            // { name: 'Email', key: 'email' }
            ];
        }
        let flag = true;
        if (flag) {
            k.forEach(function (item) {
                // console.log(' k flag 11111')
                if (formValuesData[item.key] == "" || formValuesData[item.key] == undefined || formValuesData[item.key] == "undefined") {
                    // console.log(' k flag 22222222')
                    error[item.key] = item.name + " is required";
                    flag = false;
                }

            });
        }
        setErrors(error)
        return flag
    }
    // let obj = [{...teamData,kira:"asdfadsfasd"}]
    // console.log(",,,,,,,,,,,,,,objobjobj",obj)
    //  "menuid": menuCode,
    //     "category": catType,
    //     "teamid": formValuesData.teamid,
    //     "members": formValuesData
    const submitMember = (e, teamid) => {
        
        GetTimeActivity()   
        const isValid = validateMandatoryFields();
        if (isValid) {
            setIsLoading(true)
            console.log('is valid---->');
            const catType = formValuesData.type == "board" ? "THE BOARD" : "SALES TEAM"
            const token = localStorage.getItem("token")
            let urlLink;
            if (formValuesData.teamid) {
                urlLink = lambda + '/menus?appname=' + appname + "&menuid=" + menuCode + "&token=" + token + "&category=" + catType + "&teamid=" + teamid + "&userid=" + localStorage.getItem("userId")
            } else {
                urlLink = lambda + '/menus?appname=' + appname + "&menuid=" + menuCode + "&token=" + token + "&category=" + catType + "&userid=" + localStorage.getItem("userId")
            }
            axios.put(urlLink,
                formValuesData


            )
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        if (response.data.result == "Invalid token or Expired") {
                            setShowSessionPopupup(true)
                        } else {
                            setSuccess(true)
                            setShowupBoard(false)
                            setFormValuesData({})
                            handleMenu();
                            setIsLoading(false)
                        }
                    }

                });


        }
    }

    console.log("formValuesData", formValuesData);

    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />

                <div className="main-content create-user edit-content add-client lps team-members">

                    <div className="page-content ">
                        <div className="container-fluid">
                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-9">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <h4 className="mb-2 card-title">TEAM SETTINGS</h4>
                                            <p className="menu-path">Front End Settings /<b>Team Settings</b></p>
                                        </div>
                                        {/* <button className="btn btn-primary ml-25 border_button" type="button" ><span className="material-symbols-outlined"> save </span>SAVE</button>
                                        <button className="btn btn-primary ml-15 icon_button" type="button" ><span className="material-symbols-outlined"> cloud_upload </span>SAVE & PUBLISH</button> */}

                                    </div>
                                </div>
                                <div className="col-lg-3 align-right">
                                    <button className="btn btn-primary" onClick={handleBack} type="button" >BACK</button>
                                </div>
                            </div>

                            <div className="create-user-block mb_20">
                            {teamData.length > 0 ? 
                                            <>     
                                <div className="form-block">

                                    <div className="tm">

                                        {teamData && teamData.length > 0 ? teamData.map((eachItem) => {
                                            let typeOfMembers = eachItem.members

                                            return (
                                                <>
                                                    <div className="row">
                                                        <div className="team-title">
                                                            <h2 className="form_title">{eachItem.category}</h2>
                                                            {eachItem.category != "THE BOARD" ? <button className="btn btn-primary btn-block btn-sm float-end" onClick={(e) => { setFormValuesData({}); setErrors({}); setShowupBoard(true) }} type="button">ADD</button> : null}
                                                        </div>
                                                        {typeOfMembers.length > 0 ? typeOfMembers.map((eachMember, j) => {
                                                            // console.log("profileimage",eachMember.profileimage);
                                                            return (
                                                                <>
                                                                    {eachItem.category == "THE BOARD" ? (<div className="col-md-6" key={j}>
                                                                        <div className="card">


                                                                            {/* <button className="border-btn_sm portrait team-edit-btn" onClick={(e) => { setFormValuesData(eachMember); setShowupBoard(true) } */}
                                                                            <button className="border-btn_sm portrait" onClick={(e) => { setFormValuesData(eachMember); setShowupBoard(true);setErrors({})  }

                                                                            }><span className="material-symbols-outlined font-size-18">edit</span></button>
                                                                            {/* <button className="border-btn_sm portrait" onClick={(e)=>handleDeleteFile(e,eachMember)}>
                                                                            <span className="material-symbols-outlined font-size-18">delete</span></button> */}
                                                                            {/* <button className="border-btn_sm portrait" style={{zIndex:"999"}}><i className="mdi mdi-pencil font-size-18"></i></button> */}
                                                                            <div className="row">
                                                                                <div className="col-md-5">
                                                                                    <div className="user_image">
                                                                                        <div className="file_upload">
                                                                                            <div className="upload_file">
                                                                                               {(eachMember.profileimage === undefined) || (eachMember.profileimage === "undefined") ? <img src="https://orasi-dev.imgix.net/orasi/team/default-team.png?auto=compress,format" alt="image-1" />: <img src={`${eachMember.profileimage}?auto=compress,format`} alt="image-1" />} 
                                                                                            </div>
                                                                                            {/* <input className="custom-file-input" type="file" /> */}
                                                                                        </div>


                                                                                    </div>
                                                                                    <div className="user_form">
                                                                                        <div className="mb-3 input-field">
                                                                                            <label className="form-label form-label">NAME</label><input id="email" name="name" placeholder="Name" type="text" value={eachMember.title} disabled className="form-control" aria-invalid="false" />
                                                                                        </div>
                                                                                        <div className="mb-0 input-field">
                                                                                            <label className="form-label form-label">Designation</label><input id="email" name="name" placeholder="Designation" type="text" disabled value={eachMember.designation} className="form-control" aria-invalid="false" />
                                                                                        </div>



                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-md-7">
                                                                                    <div className="edit-info black-gradient">

                                                                                    </div>
                                                                                    <div className="mb-0 input-field">
                                                                                        <label className="form-label form-label">Description</label><textarea id="Description" name="Description" value={eachMember.descriptioncontent.replace(/<[^>]*>/g, '')} disabled placeholder="Description" type="text" className="form-control mb-3"></textarea>
                                                                                    </div>

                                                                                    <div className="mb-3 input-field">
                                                                                            <label className="form-label form-label">phone</label><input id="email" name="phone" placeholder="phone" type="text" value={eachMember.phone} disabled className="form-control" aria-invalid="false" />
                                                                                        </div>
                                                                                        <div className="mb-0 input-field">
                                                                                            <label className="form-label form-label">email id</label><input id="email" name="email" placeholder="email id" type="text" disabled value={eachMember.email} className="form-control" aria-invalid="false" />
                                                                                        </div>
                                                                                    
                                                                                    {/* <div className="mb-0 input-field">
                                                                                        <label className="form-label form-label">Description</label>
                                                                                        <ReactQuill theme="snow" value={eachMember.descriptioncontent} readOnly={true} />

                                                                                    </div> */}
                                                                                </div>
                                                                                {/* <div className="col-md-12">   <button className="btn btn-primary btn-block btn-sm float-end" onClick={(e) => {
                                        setFormValuesData(eachMember); setShowupBoard(true)
                                      
                                    }

                                    }><i className="mdi mdi-pencil font-size-18"></i>Edit</button>
                                                                                </div> */}
                                                                            </div>

                                                                        </div>
                                                                    </div>) :
                                                                        (<div className="col-md-3" key={j}>
                                                                            <div className="card">
                                                                                {/* <button className="border-btn_sm portrait team-edit-btn" onClick={(e) => { setFormValuesData(eachMember); setShowupBoard(true) } */}
                                                                                <button className="border-btn_sm portrait team-edit-btn" onClick={(e) => { setFormValuesData(eachMember); setErrors({}); setShowupBoard(true) }

                                                                                }><span className="material-symbols-outlined font-size-18">edit</span></button>
                                                                                <button className="border-btn_sm portrait"  onClick={(e)=>{setFormValuesData(eachMember); setErrors({});    setDelete(true)}}><span className="material-symbols-outlined font-size-18">delete</span></button>
                                                                                <div className="user_image">
                                                                                    <div className="file_upload">
                                                                                        <div className="upload_file">
                                                                                        {(eachMember.profileimage === undefined) || (eachMember.profileimage === "undefined") ? <img src="https://orasi-dev.imgix.net/orasi/team/default-team.png?auto=compress,format" alt="image-1" />:  <img src={`${eachMember.profileimage}?auto=compress,format`} alt="image-1" />}
                                                                                        </div>
                                                                                        {/* <input className="custom-file-input" type="file" /> */}
                                                                                    </div>

                                                                                </div>
                                                                                <div className="user_form">
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">NAME</label><input id="email" name="name" placeholder="Name" type="text" value={eachMember.title} className="form-control" aria-invalid="false" disabled />
                                                                                    </div>
                                                                                    <div className="mb-0 input-field">
                                                                                        <label className="form-label form-label">Designation</label><input id="email" name="name" placeholder="Designation" type="text" value={eachMember.designation} className="form-control" aria-invalid="false" disabled />
                                                                                    </div>
                                                                                    <div className="mb-3 input-field">
                                                                                        <label className="form-label form-label">phone</label><input id="email" name="phone" placeholder="phone" type="text" value={eachMember.phone} className="form-control" aria-invalid="false" disabled />
                                                                                    </div>
                                                                                    <div className="mb-0 input-field">
                                                                                        <label className="form-label form-label">email id</label><input id="email" name="email" placeholder="email id" type="text" value={eachMember.email} className="form-control" aria-invalid="false" disabled />
                                                                                    </div>
                                                                                    <div className="mb-0 input-field">
                                                                                        <label className="form-label form-label">Description</label><textarea id="email" name="name" placeholder="Description" type="text" value={eachMember.about} disabled className="form-control" aria-invalid="false" ></textarea>
                                                                                    </div>
                                                                                    {/* <div className="col-md-12"> <button className="btn btn-primary btn-block btn-sm float-end" onClick={(e) => { setFormValuesData(eachMember); setShowupBoard(true) }}><i className="mdi mdi-pencil font-size-18"></i>Edit</button>
                                                                                    </div> */}
                                                                                </div>

                                                                            </div>

                                                                        </div>)



                                                                    }
                                                                </>

                                                            )
                                                        }) : null}


                                                    </div>


                                                </>

                                            )
                                        }) : null}
                                        {/* <div className="row">
                                <div className="team-title">
                                 <h2 className="form_title">BOARD MEMBERS</h2>
                                 <button className="btn btn-primary" type="button">ADD</button>
                                 </div>
                                         <div className="col-md-6">
                                            <div className="card">
                                            <button className="border-btn_sm portrait"><i className="mdi mdi-delete font-size-18"></i></button>
                                            <div className="row">
                                            <div className="col-md-5">
                                                 <div className="user_image">
                                                     <div className="file_upload">
                                                         <div className="upload_file">
                                                             <img src="../assets/img/user.png" alt="image-1" />
                                                         </div>
                                                         <input className="custom-file-input" type="file" />
                                                     </div>
                                                    
                                                 </div>
                                                 <div className="user_form">
                                                     <div className="mb-3 input-field">
                                                         <label className="form-label form-label">NAME</label><input id="email" name="name" placeholder="Name" type="text" className="form-control" aria-invalid="false" />
                                                     </div>
                                                     <div className="mb-0 input-field">
                                                         <label className="form-label form-label">Designation</label><input id="email" name="name" placeholder="Designation" type="text" className="form-control" aria-invalid="false" />
                                                     </div>
                                                     
                                                 </div>
                                                 </div>
 
                                        <div className="col-md-7">
                                           <div className="mb-0 input-field">
                                                         <label className="form-label form-label">Description</label><textarea id="Description" name="Description" placeholder="Description" type="text" className="form-control"></textarea>
                                                     </div>
                                                     </div>
 
                                                 </div>
                                             </div>
                                         </div>
                                         <div className="col-md-6">
                                            <div className="card">
                                            <button className="border-btn_sm portrait"><i className="mdi mdi-delete font-size-18"></i></button>
                                            <div className="row">
                                            <div className="col-md-5">
                                                 <div className="user_image">
                                                     <div className="file_upload">
                                                         <div className="upload_file">
                                                             <img src="../assets/img/user.png" alt="image-1" />
                                                         </div>
                                                         <input className="custom-file-input" type="file" />
                                                     </div>
                                                    
                                                 </div>
                                                 <div className="user_form">
                                                     <div className="mb-3 input-field">
                                                         <label className="form-label form-label">NAME</label><input id="email" name="name" placeholder="Name" type="text" className="form-control" aria-invalid="false" />
                                                     </div>
                                                     <div className="mb-0 input-field">
                                                         <label className="form-label form-label">Designation</label><input id="email" name="name" placeholder="Designation" type="text" className="form-control" aria-invalid="false" />
                                                     </div>
                                                     
                                                 </div>
                                                 </div>
 
                                        <div className="col-md-7">
                                           <div className="mb-0 input-field">
                                                         <label className="form-label form-label">Description</label><textarea id="Description" name="Description" placeholder="Description" type="text" className="form-control"></textarea>
                                                     </div>
                                                     </div>
 
                                                 </div>
                                             </div>
                                         </div>
                                 </div>        */}

                                        {/* <div className="row">
                                 <div className="team-title">
                                 <h2 className="form_title">SALES TEAM</h2>
                                 <button className="btn btn-primary" type="button">ADD</button>
                                 </div>
                                         <div className="col-md-3">
                                             <div className="card">
                                             <button className="border-btn_sm portrait"><i className="mdi mdi-delete font-size-18"></i></button>
                                                 <div className="user_image">
                                                     <div className="file_upload">
                                                         <div className="upload_file">
                                                         <img src="../assets/img/user.png" alt="image-1" />
                                                         </div>
                                                         <input className="custom-file-input" type="file" />
                                                     </div>
                                                     
                                                 </div>
                                                 <div className="user_form">
                                                     <div className="mb-3 input-field">
                                                         <label className="form-label form-label">NAME</label><input id="email" name="name" placeholder="Name" type="text" className="form-control" aria-invalid="false" />
                                                     </div>
                                                     <div className="mb-0 input-field">
                                                         <label className="form-label form-label">Designation</label><input id="email" name="name" placeholder="Designation" type="text" className="form-control" aria-invalid="false" />
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                         <div className="col-md-3">
                                             <div className="card">
                                             <button className="border-btn_sm portrait"><i className="mdi mdi-delete font-size-18"></i></button>
                                                 <div className="user_image">
                                                     <div className="file_upload">
                                                         <div className="upload_file">
                                                         <img src="../assets/img/user.png" alt="image-1" />
                                                         </div>
                                                         <input className="custom-file-input" type="file" />
                                                     </div>
                                                     
                                                 </div>
                                                 <div className="user_form">
                                                     <div className="mb-3 input-field">
                                                         <label className="form-label form-label">NAME</label><input id="email" name="name" placeholder="Name" type="text" className="form-control" aria-invalid="false" />
                                                     </div>
                                                     <div className="mb-0 input-field">
                                                         <label className="form-label form-label">Designation</label><input id="email" name="name" placeholder="Designation" type="text" className="form-control" aria-invalid="false" />
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                         <div className="col-md-3">
                                             <div className="card">
                                             <button className="border-btn_sm portrait"><i className="mdi mdi-delete font-size-18"></i></button>
                                                 <div className="user_image">
                                                     <div className="file_upload">
                                                         <div className="upload_file">
                                                         <img src="../assets/img/user.png" alt="image-1" />
                                                         </div>
                                                         <input className="custom-file-input" type="file" />
                                                     </div>
                                                     
                                                 </div>
                                                 <div className="user_form">
                                                     <div className="mb-3 input-field">
                                                         <label className="form-label form-label">NAME</label><input id="email" name="name" placeholder="Name" type="text" className="form-control" aria-invalid="false" />
                                                     </div>
                                                     <div className="mb-0 input-field">
                                                         <label className="form-label form-label">Designation</label><input id="email" name="name" placeholder="Designation" type="text" className="form-control" aria-invalid="false" />
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                         <div className="col-md-3">
                                             <div className="card">
                                             <button className="border-btn_sm portrait"><i className="mdi mdi-delete font-size-18"></i></button>
                                                 <div className="user_image">
                                                     <div className="file_upload">
                                                         <div className="upload_file">
                                                         <img src="../assets/img/user.png" alt="image-1" />
                                                         </div>
                                                         <input className="custom-file-input" type="file" />
                                                     </div>
                                                     
                                                 </div>
                                                 <div className="user_form">
                                                     <div className="mb-3 input-field">
                                                         <label className="form-label form-label">NAME</label><input id="email" name="name" placeholder="Name" type="text" className="form-control" aria-invalid="false" />
                                                     </div>
                                                     <div className="mb-0 input-field">
                                                         <label className="form-label form-label">Designation</label><input id="email" name="name" placeholder="Designation" type="text" className="form-control" aria-invalid="false" />
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                         </div> */}
                                    </div>
                                </div>
                                </>
                                        : 
                                      
                                        <div className="form-block">
                                            <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active show" id="home1" role="tabpanel">
                                                    <div className="row"><Loader />
                                                    </div>
                                                </div>
                                                </div>  </div>
                                       
                                                }
                            </div>




                        </div>
                    </div>


                    <Footer />
                    <Modal className={`${formValuesData && formValuesData.type == "board" ? '': 'sales-pop'} tm-pop seller-pop`} show={showupBoard} onHide={handleClosePopup}>
                        <Modal.Header closeButton>
                            <Modal.Title>{formValuesData.teamid === undefined ? (<p>ADD {formValuesData && formValuesData.type}</p>) :
                                (<p>UPDATE {formValuesData && formValuesData.type} </p>)
                            }</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="tm">{handleBoardEachItem()}</Modal.Body>

                    </Modal>
                    <Modal className="access-denied" show={isdelete}>

                        <div className="modal-body enquiry-form">
                            <div className="container">
                                <button className="close-btn" onClick={e => onCancel()}><span className="material-icons">close</span></button>
                                <span className="material-icons access-denied-icon">delete_outline</span>
                                <h3>Delete</h3>
                                <p>This action cannot be undone.</p>
                                <p>Are you sure you want to delete?</p>
                                <div className="popup-footer">
                                    <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => handleDelete()}>{isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}Yes, Delete</button>
                                </div>
                            </div>
                        </div>

                    </Modal>
                </div>


            </div>

        </>
    );
};

export default Team;
