

import React, { useState, useContext, useEffect, useRef } from "react";
import { useHistory, Link } from "react-router-dom";
import * as Config from "../../constants/Config";


import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import Footer from "../../components/dashboard/footer";
import SessionPopup from "../SessionPopup"
import { contentContext } from "../../context/contentContext";
import Loader from "../../components/loader";
import TableLoader from "../../components/tableLoader";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Modal from 'react-bootstrap/Modal';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useParams } from 'react-router-dom';
import moment from "moment";
import axios from "axios";
import { v4 as uuid } from 'uuid';
import tmdbApi from "../../api/tmdbApi";

let { lambda, country, appname } = window.app

const ViewProduct = (props) => {
    const history = useHistory();
    let { id } = useParams();
    console.log(id, "iiii")
    const ref = useRef();

    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, userData, setActiveMenuId, GetTimeActivity } = useContext(contentContext);
    const prevRoute = usePrevious(route)
    const [isLoading, setIsLoading] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false)
    const [saveLoaderEnable, setSaveLoaderEnable] = useState(false);
    const [showUpload, setShowUpload] = useState(false);

    const [deleteFile, setDeleteFile] = useState(false);
    const [playContent, setPlayContent] = useState({});
    const [showDoc, setshowDoc] = useState(false);
    const [fileDocName, setFileDocName] = useState("");
    const [activeDeleteId, setActiveDeleteId] = useState(null);

    //const [uploadContent, setUploadContent] = useState([]);
    const [showDocAlert, setShowDocAlert] = useState(false);
    const [checkCompanyName, setCheckCompanyName] = useState(false);
    const [docFlag, setDocFlag] = useState(false);
    const [invalidContent, setInvalidContent] = useState(false);
    const [restrict, setRestrict] = useState(false);
    const [success, setSuccess] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [nameExist, setNameExist] = useState(false);
    const [image, setImg] = useState("");
    const [productid, setProductId] = useState(false);
    const [product, setProduct] = useState({ productid: "", productname: '', price: '', producttype: "", description: '', status: '', images: [] });
    const [validation, setValidation] = useState({});
    const [Error, setError] = useState({});

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


    useEffect(async () => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("products")
        try {
            if (id) {
                console.log(id, "---")
                setIsLoading(true);
                try {
                    const response = await tmdbApi.getProducts(id);

                    if (response.statusCode === 200) {
                        if (response.result == "Invalid token or Expired") {
                            setShowSessionPopupup(true)
                        } else {
                            if (response.result.length != 0) {
                                console.log(response.result, "response.result.data")
                                // if(response.result[0].images){
                                //     setUploadContent(response.result[0].images);
                                // }
                                setProduct(response.result[0]);
                            }

                        }
                    }

                } catch {
                    console.log("error");
                }
                setIsLoading(false);
            }
        } catch (err) {
            console.log(err)
        }



    }, []);

    const handleChange = (e) => {
        GetTimeActivity();
        if (!!Error[e.target.name]) {
            let error = Object.assign({}, Error);
            delete error[e.target.name];
            setError(error);

        }
        console.log(e)
        let name = "description";
        let val = e;
        if (e.target) {
            name = e.target.name;
            val = e.target.value;

        }

        setProduct({ ...product, [name]: val });
    }
    const handleEditorChange = (e) => {
        GetTimeActivity();

        let name = "description";
        let val = e;
        if (e.target) {
            name = e.target.name;
            val = e.target.value;

        }

        setProduct({ ...product, [name]: val });
    }

    const isValid = (expReturn) => {
        GetTimeActivity()
        let errTmp = {};
        let productTmp = { ...product };
        if (productTmp.productname.trim() === '') {
            errTmp["productname"] = "Please enter product name";
        }
        if (productTmp.price.trim() === '') {
            errTmp["price"] = "Please enter price";
        }
        if (productTmp.description.trim() === '') {
            errTmp["status"] = "status";
        }
        if (productTmp.description.trim() === '') {
            errTmp["description"] = "Please enter description";
        }
        console.log(errTmp)
        setError(errTmp);
        if (expReturn) {
            return Object.keys(errTmp).length === 0 ? true : false;
        }

    }

    const validate = (e) => {
        let formIsValid = true;
        let error = { ...Error };
        let mandatoryFileds = [{ name: 'Product Name', key: 'productname' }, { name: 'Product Type', key: 'producttype' }, { name: 'Price', key: 'price' }, { name: 'Status', key: 'status' }]
        if (mandatoryFileds) {
            mandatoryFileds.forEach(function (item) {

                if (
                    (product[item.key] == "" ||
                        product[item.key] == undefined ||
                        product[item.key] == "undefined")
                ) {
                    error[item.key] = item.name + " is required";
                    formIsValid = false;
                }

            });
        }
        console.log("errors", error);
        if(product && product.images && product.images.length <=0){
            error["image"] = "Product Image is required"
            formIsValid = false;
        }
        setError(error)
        return formIsValid;
    }

    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 1];
        var presentTime = moment();
        let payload;

        payload = {
            "userid": localStorage.getItem("userId"),
            "pagename": "VIEWPRODUCT",
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

    const handleAdd = () => {
        const isValid = validate();

        if (isValid) {
            GetTimeActivity()
            const token = localStorage.getItem("token")
            const userid = localStorage.getItem("userId")
            setSaveLoaderEnable(true);
            let method = 'PUT';
            let data = product;
            let params = '?appname=' + appname + "&token=" + token + "&userid=" + userid;
            let url = lambda + '/addproduct' + params;
            if (id) {
                method = 'POST';
                delete data._id;
                url = lambda + "/updateproduct" + params + "&productid=" + id;
            } else {
                data['productid'] = uuid();
            }
            axios({
                method: method,
                data: data,
                url: url,
            })
                .then(function (response) {
                    if (response?.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        setSaveLoaderEnable(false);
                        setSuccess(true)


                    }


                }).catch((err) => {
                    console.log('error', err);
                    setIsLoading(false);
                });
        }

    }

    function onConfirm() {
        GetTimeActivity()
        setSuccess(false);
        history.push("/products")
    };
    const handleDeleteDoc = (e, item) => {
        console.log(item, e)
        GetTimeActivity()
        setActiveDeleteId(item)
        setShowDocAlert(true);

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
    const handleDeleteFile = () => {
        console.log(activeDeleteId, "item")
        GetTimeActivity()
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId");
        let images = [...product?.images];
        let newImages = images.filter((item) => item.path !== activeDeleteId.path);
        setProduct({ ...product, images: newImages });
        setShowDocAlert(false);
        setDeleteFile(true);
        setActiveDeleteId(null);

        //setIsLoading(true)
        // axios({
        //     method: 'DELETE',
        //     url: lambda + '/deleteFile?appname=' + appname + '&companyid=' + id + '&docid=' + docid + "&token=" + token + "&userid=" + userid,
        // })
        //     .then(function (response) {
        //         if (response.result == "Invalid token or Expired") {
        //             setShowSessionPopupup(true)
        //         } else {
        //             setIsLoading(false);
        //             setShowDocAlert(false);
        //             setDeleteFile(true);
        //             // getclient();

        //         }


        //     }).catch((err) => {
        //         console.log('error', err);
        //         setIsLoading(false);
        //     });

    }


    const uploadS3 = async (e, type) => {
        GetTimeActivity()

        delete Error["image"];
        var fileData = new FormData();
        setIsLoading(true)
        var file = e.target.files[0];
        console.log("file", file);
        let filetype = file.type.split("/");
        console.log("filetype", filetype[0])
        if (filetype[0] === "video" || filetype[0] === "audio") {
            setRestrict(true)
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
                var ObjectID = require("bson-objectid");
                var fileid = new ObjectID().toString();
                var fileformat = format[format.length - 1]
                const timestamp = Date.now();
                image.src = e.target.result;

                bucket = window.site.common.resourceBucket;
                var path
                if (id) {
                    path = "products/" + id;
                } else {
                    var ObjectID = require("bson-objectid");
                    var productid = new ObjectID().toString();
                    path = "products/" + productid;
                    setProductId(productid);
                }


                uploadFilePath = appname + "/" + path + "/" + fileid + "_" + removeSpecialCharecters(format[0]) + "_" + timestamp + "." + fileformat;

                console.log("uploadFilePath", uploadFilePath)
                let imagePath = window.site && window.site.common && window.site.common.resourcesUrl;
                var data = { source_bucket: bucket, sourcepath: uploadFilePath }
                const token = localStorage.getItem("token")
                const userid = localStorage.getItem("userId")

                axios.post(lambda + '/uploadFiles?appname=' + appname + "&token=" + token + "&userid=" + userid, data, { type: 'application/json' })
                    .then((response) => {
                        if (response.data && response.data.result) {
                            var url = response.data.result;

                            let uploadObj = {};
                            setDocFlag(false);
                            setShowUpload(false);
                            setIsLoading(false);


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
                                        console.log(response, "===")
                                        let uploadObj = {};
                                        uploadObj.path = uploadFilePath
                                        setDocFlag(false);
                                        setShowUpload(false);
                                        setIsLoading(false);
                                        let images = [...product?.images];
                                        images.push(uploadObj)
                                        setProduct({ ...product, images: images });

                                        // try {
                                        //     let imageUploadPath = uploadFilePath;
                                        //     console.log("parth", imageUploadPath);
                                        //     const current = new Date();
                                        //     let uploadObj = {};
                                        //     // uploadObj.uploaded_on = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()}`;
                                        //     // uploadObj.id = uuid();
                                        //     // uploadObj.name = fileName;
                                        //     uploadObj.path = response.result;
                                        //     //uploadObj.type = file.type;
                                        //     setDocFlag(false);
                                        //     setShowUpload(false);
                                        //     setIsLoading(false);
                                        //     setProduct({ ...product, images: [uploadObj] });
                                        //     // let uploadContentTmp = [uploadObj, ...uploadContent];
                                        //     // setUploadContent(uploadContentTmp)
                                        // } catch (err) {
                                        //     console.log(err)
                                        // }


                                        //  handleUpdate();

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



    }


    // const setProductData = (value, key) => {
    //     let productCpy = { ...product };
    //     productCpy[key] = value;
    //     setProduct(productCpy)

    // }

    const handleUploadPopup = (e) => {
        GetTimeActivity()
        setShowUpload(true);
    }
    const handleOpen = (e, content) => {
        GetTimeActivity()
        let source;
        source = window.site.common.resourcesUrl + "/" + content.path;
        console.log("source", content, source)
        setFileDocName(content?.name)
        setPlayContent(source);
        setshowDoc(true);
        //setType(content.type);
        console.log("playercontent==========>", source);
    }

    const handleBack = () => {
        GetTimeActivity()
        history.push("/products");
    }

    console.log("product", product);

    return (
        <>
            {showSessionPopupup && <SessionPopup />}

            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                {isLoading ?
                    <Loader />
                    :

                    <div className="main-content user-management create-user">

                        <div className="page-content ">
                            <div className="container-fluid">






                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">VIEW PRODUCT</h4>
                                                <p className="menu-path">Products / <b>View Product</b></p>
                                            </div>
                                            <div>
                                                <a onClick={handleBack} className="btn btn-primary">back</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="create-user-block">
                                    <div className="form-block">
                                        <div className="row">
                                            <div className="col-md-6 pe-5">
                                                <div className="col-md-12">
                                                    <div className="mb-3 input-field">
                                                        <label className="form-label form-label">Product Name<span className="required">*</span></label>
                                                        <input name="productname" placeholder="Name" type="text" className="form-control form-control" aria-invalid="false"  value={product?.productname} disabled/>
                                                        
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="mb-3 input-field">
                                                        <label className="form-label form-label">Product Type<span className="required">*</span></label>
                                                        <input name="producttype" placeholder="producttype" type="text" className="form-control form-control" aria-invalid="false"  value={product?.producttype} disabled/>


                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="mb-3 input-field">
                                                        <label className="form-label form-label">Price<span className="required">*</span></label>
                                                        <input name="price" placeholder="Add Price" type="number" className="form-control form-control" aria-invalid="false"  value={product?.price} disabled/>
                                                      
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="mb-3 input-field">
                                                        <label className="form-label form-label">Add Description</label>
                                                        <ReactQuill theme="snow" readOnly style={{ height: '200px ' }} value={product?.description}  />


                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="mb-3 input-field">
                                                        <label className="form-label form-label">status<span className="required">*</span></label>
                                                        <input type="text" name="status" placeholder="status" className="form-control form-control" aria-invalid="false"  value={product?.status} disabled/>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 ps-5">

                                                <div className="add_images" id="profile1" role="tabpanel">

                                                    <label >Add Images(PNG & JPG Formats only)</label>




                                                    <div className="document-title">
                                                        {product && product?.images && product?.images.length > 0 &&
                                                          
                                                     
                                                                <>
                                                                    {product.images.map(function (item, i) {
                                                                        console.log("i",i)
                                                                        return (
                                                                            <div class="position-relative">
                                                                            <div class="edit-info black-gradient landscape-btns"></div><a><img className="documentlogo" src={`${image}${item.path}?${Config.compress}&height=200&width=200`} /></a></div>
                                                                        )
                                                                    })}

                                                                </>
                                                       
}
                                                        {/* <a className="btn btn-primary"><input type="file" name="upload" accept=".jpg, .png, .jpeg" className="udisplay-none" id="upload" onChange={e => uploadS3(e, ["1920*1080", "Image", "landscape_logo_image"])} onClick={(e) => { e.target.value = ''; }} ref={ref} />
                                                            {isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : <span className="material-icons">add</span>}</a> */}


                                                    </div>
                                                    {Error.image && <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{Error.image}</span>}

                                                </div>
                                            </div>
                                        </div>

                                        <div className="row status">


                                            <div className="col-md-3 d-flex align-items-center">

                                                {/* <button className="btn btn-primary" onClick={handleAdd} >{saveLoaderEnable ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null} {id ? "UPDATE" : "CREATE PRODUCT"}</button> */}
                                            </div>
                                            <div className="col-md-9">

                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* <div className="create-user-block">

                                                <div className="form-block">


                                                    <div className="row">
                                                        <h5 className="font-size-14"> Enter Product details</h5>

                                                        <div className="col-md-4">
                                                            <div className="input-field">
                                                                <label htmlFor="example-text-input" className="col-form-label">Product Name</label>
                                                                <input className="form-control contact-number" type="text" name="name" value={selecteddata.productname} placeholder="name" />

                                                            </div>
                                                        </div>

                                                        <div className="col-md-4">
                                                            <div className="input-field">
                                                                <label htmlFor="example-text-input" className="col-form-label">Price</label>
                                                                <input className="form-control contact-number" type="number" name="price" value={selecteddata.price} placeholder="name" />

                                                            </div>
                                                        </div>

                                                    </div>



                                                </div>

                                            </div> */}


                            </div>
                        </div>


                        <Footer />
                        <SweetAlert show={success}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={id ? "updated Product Details Succesfully" : "Saved Product Details Successfully "}
                            onConfirm={e => onConfirm()}
                        >
                        </SweetAlert>
                        <SweetAlert show={updated}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Updated Successfully"}
                            onConfirm={e => { setUpdated(false); setIsLoading(false) }}
                        >
                        </SweetAlert>

                        <SweetAlert show={nameExist}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Company Name Already Exist"}
                            onConfirm={e => setNameExist(false)}
                        >
                        </SweetAlert>

                        <SweetAlert show={deleteFile}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Flie Deleted Successfully"}
                            onConfirm={e => setDeleteFile(false)}
                        >
                        </SweetAlert>
                        <SweetAlert show={restrict}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Invalid file type. please select valid file"}
                            onConfirm={e => { setRestrict(false); setShowUpload(false); setIsLoading(false); }}
                        >
                        </SweetAlert>
                        {showUpload &&
                            <Modal show={true} className="seller-pop new-look-up add-document" >
                                {/* <button className="close-btn" onClick={(e) => setShowUpload(false)}><span className="material-icons">close</span></button>
                                <div className="col-md-3">
                                    <input name="filename" placeholder="Enter File Name" type="text" className="form-control" onChange={(e) => setFileName(e.target.value)} value={fileName} />
                                </div>
                                {fileName &&
                                    <><input type="file" accept="image/png, image/jpeg , image/*,audio/*,video/*,.pdf, .xls, .xlsx,.csv,.docx" name="landscape_logo_image" className="udisplay-none" onChange={e => uploadS3(e, ["1920*1080", "Image", "landscape_logo_image"])} onClick={(e) => { e.target.value = ''; }} ref={ref} />
                                        <button type="button" onClick={handleUpdate} className="btn-success waves-effect waves-light mb-2 me-2">
                                            save</button></>
                                } */}
                                <Modal.Header >
                                    <Modal.Title>Add Image</Modal.Title>
                                    <button className="close-btn" onClick={(e) => setShowUpload(false)}><span className="material-icons">close</span></button>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="row">
                                        <div className="col-md-12 documents">

                                            <div className={`mb-3 input-field btn-gray`}>
                                                <input type="file" name="upload" accept=".jpg, .png, .jpeg" className="udisplay-none" id="upload" onChange={e => uploadS3(e, ["1920*1080", "Image", "landscape_logo_image"])} onClick={(e) => { e.target.value = ''; }} ref={ref} />
                                                {isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : <span className="material-icons">upload</span>}upload image</div>
                                            <p>Only jpg and png image allowed.</p>

                                            {/* <a className="btn btn-primary" onClick={handleUpdate}>done</a> */}
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        }
                        {showDocAlert && <Modal className="access-denied" show={true}>

                            <div className="modal-body enquiry-form">
                                <div className="container">
                                    <button className="close-btn" onClick={e => setShowDocAlert(false)}><span className="material-icons">close</span></button>
                                    <span className="material-icons access-denied-icon">delete_outline</span>
                                    <h3>Delete</h3>
                                    <p>This action cannot be undone.</p>
                                    <p>Are you sure you want to delete File?</p>
                                    <div className="popup-footer">
                                        <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => { handleDeleteFile() }}> {isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}Yes, Delete</button>
                                    </div>
                                </div>
                            </div>

                        </Modal>}
                    </div>
                }

            </div>

        </>)

}
export default ViewProduct;