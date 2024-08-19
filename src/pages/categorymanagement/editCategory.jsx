/***
 **Module Name: editCategory
 **File Name :  editCategory.js
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
 **Description : contains editCategory details.
 ***/
import React, { useState, useEffect, useRef, useContext } from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import { useHistory, Link } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import Loader from "../../components/loader";
import SessionPopup from "../SessionPopup"
import moment from "moment";
import { contentContext } from "../../context/contentContext";
let { appname, lambda } = window.app;

const EditCategory = () => {
    const history = useHistory();
    let { id } = useParams();
    const ref = useRef();
    const [add, setAdd] = useState(false);
    const [categoryData, setCategoryData] = useState("");
    const [filedsData, setFiledsData] = useState("");
    const [isDelete, setIsDelete] = useState(false);
    const [item, setItem] = useState("");
    const [activeLoad, setActiveLoad] = useState("");
    const [buttonText, setButtonText] = useState("upload image");
    const [success, setSuccess] = useState(false);
    const [imgSuccess, setImgSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [invalidCat, setInvalidCat] = useState(false);
    const [nameError, setNameError] = useState("");
    const [imageError, setImageError] = useState("");
    const [addSuccess, setAddSuccess] = useState(false);
    const [catNameExist, setCatNameExist] = useState(false);
    const [checkCatName, setCheckCatName] = useState(false);
    const {route, currentPageNew,setRoute,setCurrentPage,setRowsPerPage,usePrevious,setActiveMenuId,GetTimeActivity} = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);
    // console.log('prevRoute--->',prevRoute)
    // console.log('currentRoute--->',route)
    // console.log('currentPageNew--->',currentPageNew)
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("category")
        setActiveMenuId(200002)
        if (id) {
            setAdd(false);
            getcategory();

        } else {
            setAdd(true);
            getCategoryFileds();
        }
        userActivity();

    }, []);
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = id != undefined ? path[path.length - 2] :path[path.length - 1];;
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
    const getCategoryFileds = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/categoryfields?appname=' + appname + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    const result = response.data.result.data[0];
                    if (response.data.result.data.length > 0) {
                        console.log("result---------->", result)
                        setCategoryData(result);
                        setFiledsData(result.fields);
                    } else {
                        setInvalidCat(true)
                    }
                }
            });

    }
    const getcategory = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/category?appname=' + appname + '&categoryid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    const result = response.data.result.data[0];
                    if (response.data.result.data.length > 0) {


                        // console.log("result---------->", result)
                        setCategoryData(result);
                        setFiledsData(result.fields);
                    } else {
                        setInvalidCat(true)
                    }
                }
            });
    }
    const handleBack = () => {
        GetTimeActivity() 
        history.push({
            pathname: "/categorymanagement",
            state: { search: true }
        });
    }

    const removeSpecialCharecters = (filename) => {
        GetTimeActivity() 
        let timeStamp = new Date().getTime();
        let tmpFile = filename
            .substring(0, filename.lastIndexOf("."))
            .replace(/[^a-zA-Z 0-9]/g, "");
        tmpFile = tmpFile.replaceAll(" ", "");
        let tmpExtension = filename.substring(filename.lastIndexOf("."));
        let tmpNewFileName = tmpFile + tmpExtension;
        // console.log("tmpNewFileName", tmpNewFileName)
        // return encodeURIComponent(tmpNewFileName);
        return tmpNewFileName;
    };


    const uploadS3 = async (e, type) => {
        GetTimeActivity() 
        setImageError("")
        setActiveLoad(true);
        setButtonText("uploading...")
        var fileData = new FormData();
        var file = e.target.files[0];
        // console.log("file", file);
        var uploadFilePath = "";
        var filename = e.target.files[0].name;

        // console.log("filename", filename);

        var s3file = e.target.files[0];
        // fileData.append(type[1], s3file);
        var bucket;

        var reader = new FileReader();
        reader.readAsDataURL(s3file);
        reader.onload = function (e) {
            var image = new Image();
            let format = file.name.split(".");
            // console.log("format", format);
            var fileformat = format[format.length - 1]
            image.src = e.target.result;
            const timestamp = Date.now();

            bucket = window.site.common.resourceBucket;


            uploadFilePath = "orasi/client/resources/orasiv1/images/categories/" + removeSpecialCharecters(format[0]) + "_" + timestamp + "." + fileformat;

            // console.log("uploadFilePath", uploadFilePath);

            let imagePath = window.site && window.site.common && window.site.common.resourcesUrl;
            var data = { source_bucket: bucket, sourcepath: uploadFilePath }
            const token = localStorage.getItem("token")
            const userid = localStorage.getItem("userid")
            axios.post(lambda + '/uploadFiles?appname=' + appname + "&token=" + token + "&userid=" + userid, data, { type: 'application/json' })
                .then((response) => {
                    if (response.data && response.data.result) {
                        var url = response.data.result;

                        // console.log("url", url);
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

                                    setCategoryData({ ...categoryData, image: imagePath + uploadFilePath })
                                    if(add === true){
                                    setImgSuccess(true);
                                    }
                                    setActiveLoad(false);
                                    setButtonText("upload image")
                                    if (add === false) {
                                        let payload = {
                                            "name": categoryData.name,
                                            "image": imagePath + uploadFilePath,
                                            "fields": categoryData.fields
                                        };
                                        console.log("payload", payload);
                                        if(checkCatName === false){
                                            delete payload["name"];
                                        }
                                        axios.put(lambda + '/category?appname=' + appname + '&categoryid=' + id,
                                            payload,

                                        )
                                            .then(function (response) {
                                                if (response.data.statusCode === 200) {
                                                    // getcategory();
                                                    setImgSuccess(true);
                                                    // setIsLoading(false);
                                                }
                                            })
                                            .catch((err) => {
                                                // setIsLoading(false);

                                            })
                                    }
                                }
                            })
                            .catch((err) => {
                                console.error.bind(err);
                                setActiveLoad(false);

                            })
                    }
                })
                .catch((err) => {
                    console.error.bind(err);
                    setActiveLoad(false);
                })

        }


    }

    const handleChange = (e) => {
        GetTimeActivity() 
        if (e.target.name === "name") {
            if(add === false){
                setCheckCatName(true)
            }
            setNameError("")
            setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
        } else {
            setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
        }
    }

    const handleChangeCheck = (e, index, type) => {
        GetTimeActivity() 
     
        const updatedFileds = [...categoryData.fields];
        const isChecked = e.target.checked;


        updatedFileds[index][type] = isChecked
        let addDepends = true; 

        const newData = updatedFileds.map(item => {
            if (item.name === "releasedate" || item.name === "releaseyear") {
                if (!item.mandatory) {
                    addDepends = false; 
                }
                delete item.depends; 
            }
            return item;
        });
        const isReleasedateMandatory = newData.find(item => item.name === "releasedate")?.mandatory;
        const isReleaseyearMandatory = newData.find(item => item.name === "releaseyear")?.mandatory;
        
        // If either one is not mandatory, set addDepends to false
        if (!isReleasedateMandatory || !isReleaseyearMandatory) {
          addDepends = false;
        }
        if (addDepends) {
            newData.forEach(item => {
                if (item.name === "releasedate" || item.name === "releaseyear") {
                    item.depends = item.name === "releasedate" ? "releaseyear" : "releasedate";
                }
            });
        }
      
        setCategoryData({ ...categoryData, fields: newData })

    }

    const handleDeleteFiled = (e, name) => {
        setIsDelete(true);
        setItem(name);
    }

    const handleDelete = (e, name) => {
        GetTimeActivity() 
        if (add === false) {
            const token = localStorage.getItem("token")
            const userid = localStorage.getItem("userid")
            axios({
                method: 'PUT',
                url: lambda + '/category?appname=' + appname + '&categoryid=' + id + '&fieldname=' + item + "&token=" + token + "&userid=" + userid,
            })
                .then(function (response) {
                    if (response.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        // console.log(response)
                        setIsDelete(false);
                        getcategory();

                    }
                });
        } else {
            const filteredArray = categoryData && categoryData.fields.filter((eachItem) => eachItem.name != item);
            // console.log("filteredArray", filteredArray);
            setCategoryData({...categoryData , fields: filteredArray})
            setFiledsData(filteredArray);
            setIsDelete(false);
        }
    }
    function onCancel() {
        GetTimeActivity() 
        setIsDelete(false)
    }
    function onConfirm() {
        GetTimeActivity() 
        setSuccess(false)
    }
    function onConfirm1() {
        GetTimeActivity() 
        setAddSuccess(false);
        history.push("/categorymanagement")
    }
    const handleUpdateCategory = () => {
        GetTimeActivity() 
        setIsLoading(true);
        let payload = {
            "name": categoryData.name.toUpperCase(),
            "image": categoryData.image,
            "fields": categoryData.fields,
            "status": categoryData.status
        };
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")
        if(checkCatName === false){
            delete payload["name"];
        }
        console.log("payload", payload);
        axios.post(lambda + '/category?appname=' + appname + '&categoryid=' + id + "&token=" + token + "&userid=" + userid,
            payload,

        )
            .then(function (response) {
                setCheckCatName(false)
                if (response.data.statusCode === 200) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    }else if (response.data.result === "Category already exists") {
                        setIsLoading(false);
                        setCatNameExist(true)
                    } else {
                        getcategory();
                        setSuccess(true);
                        setIsLoading(false);
                    }
                }
            })
            .catch((err) => {
                setIsLoading(false);

            })

    }

    const handleValidate = () => {
        GetTimeActivity() 
        const isValid = validate();
        isValid.then(result => {
            if(result === true){
                handleAddCategory()
            } 
          }).catch(error => {
            console.log(error); 
          });
        // if (isValid) {
        //     handleAddCategory()
        // }
    }

    const validate = async () => {
        GetTimeActivity() 
        let formIsValid = true;

        if (categoryData.name === "" || categoryData.name === undefined) {
            setNameError("Please Enter Name");
            formIsValid = false;
        }
        if (categoryData.image === "" || categoryData.image === undefined) {
            setImageError("Please Upload Image");
            formIsValid = false;
        }

        return formIsValid;
    }

    const handleAddCategory = () => {
        GetTimeActivity() 
        setIsLoading(true);
        let payload = {
            "name": categoryData.name.toUpperCase(),
            "image": categoryData.image,
            "fields": categoryData.fields,
            "status": categoryData.status === undefined ? "INACTIVE" : categoryData.status
        };
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")
        // console.log("payload", payload);
        axios.put(lambda + '/addCategory?appname=' + appname + "&token=" + token + "&userid=" + userid,
            payload,

        )
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else if (response.data.result === "Category already exists") {
                        setIsLoading(false);
                        setCatNameExist(true)
                    } else {
                        setAddSuccess(true);
                        setIsLoading(false);
                    }
                }
            })
            .catch((err) => {
                setIsLoading(false);

            })

    }
    const onclickInvalid = () => {
        GetTimeActivity() 
        setInvalidCat(false)
        history.push('/contentmanagement')
    }

    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <SweetAlert show={invalidCat}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Category Not Found"}
                    onConfirm={e => onclickInvalid()}
                >
                </SweetAlert>
                {!invalidCat &&
                    <div className="main-content create-user edit-content add-client edit-category">

                        <div className="page-content ">
                            <div className="container-fluid">



                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">{add === true ? "ADD" : "EDIT"} CATEGORY</h4>
                                            </div>
                                            <div><a className="btn btn-primary" onClick={handleBack}>back</a></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="create-user-block content_edit block_buyer">
                                
                                { Object.keys(categoryData).length >0 ? 
                                            <>  
                                                

                                    <div className="row">
                                        <div className="col-md-3 pe-1">
                                            <div className="form-block">
                                                <div className="left_block">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">CATEGORY NAME{add === true && <span className="required">*</span>}</label>
                                                                <input className="form-control contact-number" type="text" name="name" placeholder="Category Name" id="example-email-input" value={categoryData.name && categoryData.name.toUpperCase()} onChange={(e) => handleChange(e)} />
                                                                {nameError != "" ?
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                    }}>{nameError}</span> : ""
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">UPLOAD IMAGE{add === true && <span className="required">*</span>}</label>
                                                                {categoryData.image &&
                                                                    <div className="upload-image">
                                                                        <img src={categoryData.image} />
                                                                    </div>
                                                                }
                                                                <button className="btn btn-primary btn-block btn-sm float-none " type="submit">{activeLoad === true ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null} <input type="file" name="upload" accept="image/png, image/jpeg , image/*" className="udisplay-none" id="upload" onChange={e => uploadS3(e, ["1920*1080", "Image", "landscape_logo_image"])} onClick={(e) => { e.target.value = ''; }} ref={ref} />{buttonText}</button>

                                                                {imageError != "" ?
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                    }}>{imageError}</span> : ""
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-9 ps-1">
                                            <div className="form-block">
                                                {/* <div className="row">
                                                    {add === true &&
                                                        <div className="col-md-4">
                                                            <div className="mb-3 input-field">
                                                                <label className="form-label form-label">SELECT METADATA TEMPLATE</label>
                                                                <select className="form-select" placeholder="Select Type">
                                                                    <option>Music</option>
                                                                    <option>Select</option>
                                                                    <option>Select</option>
                                                                    <option>Select</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className="col-md-8">
                                                    </div>*/}
                                                    <div className="col-md-12">
                                                        <div className="mb-1">
                                                            <label className="form-label form-label">META DATA</label>
                                                        </div>
                                                    </div>
                                                {/* </div>  */}
                                                <div className="table-responsive">
                                                    <table className="table table-striped seller_table buyer_table align-middle">
                                                        <thead>
                                                            <tr>

                                                                <th>NAME</th>
                                                                {/* <th>INPUT TYPE</th> */}
                                                                <th>SEARCHABLE</th>
                                                                <th>MANDATORY</th>
                                                                {/* <th>ACTIONS</th> */}

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filedsData && filedsData.length > 0 && filedsData.map(function (item, i) {
                                                                return (
                                                                    <tr key={i}>
                                                                        <td>{item.display}</td>
                                                                        {/* <td>{item.inputtype}</td> */}
                                                                        <td><div className="font-size-16">
                                                                            {item.cannotserachble === true && item.searchable === true ? <><input className="form-check-input" type="checkbox" id="checkAll" checked={item.searchable} onChange={(e) => handleChangeCheck(e, i, "searchable")} disabled /><label className="form-check-label" htmlFor="checkAll"></label></> : item.cannotserachble === false ?  <><input className="form-check-input" type="checkbox" id="checkAll" checked={item.searchable} onChange={(e) => handleChangeCheck(e, i, "searchable")} /><label className="form-check-label" htmlFor="checkAll"></label></> : null} </div></td>
                                                                        <td><div className="font-size-16">{item.cannotmandatory === true && item.mandatory === true ? <><input className="form-check-input" type="checkbox" id="checkAll" checked={item.mandatory} onChange={(e) => handleChangeCheck(e, i, "mandatory")} disabled /><label className="form-check-label" htmlFor="checkAll"></label></> : item.cannotmandatory === false ? <><input className="form-check-input" type="checkbox" id="checkAll" checked={item.mandatory} onChange={(e) => handleChangeCheck(e, i, "mandatory")} /><label className="form-check-label" htmlFor="checkAll"></label></> : null}</div></td>
                                                                        {/* <td>{item.default === false ? <div className="d-flex" onClick={(e) => handleDeleteFiled(e, item.name)}>
                                                                            <a data-bs-toggle="modal" data-bs-target="#staticBackdrop" className="text-danger action-button"><i className="mdi mdi-delete font-size-18 text-danger"></i></a></div> : null}</td> */}
                                                                    </tr>
                                                                )
                                                            })}


                                                        </tbody>
                                                    </table>

                                                </div>
                                                <div className="row status">
                                                    <div className="col-md-3 justify-content-between ps-0">
                                                        <div className="input-field d-flex align-items-center">
                                                            <label className="col-form-label">Status</label>
                                                            <select className="form-select" name="status" value={categoryData.status} onChange={(e) => handleChange(e)}>

                                                                <option value="INACTIVE">INACTIVE</option>
                                                                <option value="ACTIVE">ACTIVE</option>

                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-9 justify-content-end d-flex align-items-center">
                                                        {add === true ? <button className="btn btn-primary btn-block " type="submit" onClick={handleValidate} >{isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}SAVE</button> :

                                                            <button className="btn btn-primary btn-block " type="submit" onClick={handleUpdateCategory} >{isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}update</button>}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    </>
                                                : <div className="form-block">
                                                <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active show" id="home1" role="tabpanel">
                                                <div className="row"><Loader /></div>
                                                </div>
                                                </div>
                                                </div>
                                                }


                                </div>


                            </div>
                        </div>


                        <Footer />
                        <Modal className="access-denied" show={isDelete}>

                            <div className="modal-body enquiry-form">
                                <div className="container">
                                    <button className="close-btn" onClick={e => onCancel()}><span className="material-icons">close</span></button>
                                    <span className="material-icons access-denied-icon">delete_outline</span>
                                    <h3>Delete</h3>
                                    <p>This action cannot be undone.</p>
                                    <p>Are you sure you want to delete Field?</p>
                                    <div className="popup-footer">
                                        <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => handleDelete()}>Yes, Delete</button>
                                    </div>
                                </div>
                            </div>

                        </Modal>
                        <SweetAlert show={success}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Updated successfully"}
                            onConfirm={e => onConfirm()}
                        >
                        </SweetAlert>
                        <SweetAlert show={addSuccess}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Category added successfully"}
                            onConfirm={e => onConfirm1()}
                        >
                        </SweetAlert>
                        <SweetAlert show={imgSuccess}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Image uploaded successfully"}
                            onConfirm={e => setImgSuccess(false)}
                        >
                        </SweetAlert>
                        <SweetAlert show={catNameExist}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Category Name already exist"}
                            onConfirm={e => setCatNameExist(false)}
                        >
                        </SweetAlert>
                    </div>
                }
            </div>
        </>
    );
};

export default EditCategory;
