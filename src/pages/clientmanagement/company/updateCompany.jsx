/***
**Module Name: add/edit company 
 **File Name :  updatecompany.js
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
 **Description : contains add or edit company details.
 ***/
import React, { useState, useEffect, useRef, useContext } from "react";
import Footer from "../../../components/dashboard/footer";
import Header from "../../../components/dashboard/header";
import Sidebar from "../../../components/dashboard/sidebar";
import SweetAlert from 'react-bootstrap-sweetalert';
import { useHistory, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import moment from "moment";
import axios from "axios";
import { v4 as uuid } from 'uuid';
import Modal from 'react-bootstrap/Modal';

import * as Config from "../../../constants/Config";
import tmdbApi from "../../../api/tmdbApi";
import { updateCompany, saveCompany } from "../../../utils/reducer";
import Loader from "../../../components/loader";
import FileViewer from "../../../components/docViewer";
import SessionPopup from "../../SessionPopup"
import { contentContext } from "../../../context/contentContext";
let { lambda, country, appname } = window.app



const UpdateCompany = () => {
    const history = useHistory();
    let { id } = useParams();
    const ref = useRef();
    const [nda, setNda] = useState(false);
    const [agreement, setAgreement] = useState(false);
    const [show, setShow] = useState(true);
    const [countries, setCountries] = useState('');
    const [type, setType] = useState(false);
    const [error, setError] = useState("");
    const [add, setAdd] = useState(false);
    const [success, setSuccess] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [activeDeleteId, setActiveDeleteId] = useState("");
    const [valid, setValid] = useState(true);
    //  const [folowupcontent, setFollowupContent] = useState([]);
    const [user, setUser] = useState([]);
    const [account, setAccount] = useState([]);
    const [folowupcontent, setFollowupContent] = useState([]);

    const [editUser, setEditUser] = useState({ companyname: '', companytype: '', contenttype: '', agreement:false, signednda:false,address: '', region: '', city: '', country: '', zipcode: '', legalname: '', legalnumber: '', legalemail: '', accountname: '', accountemail: '', accountnumber: '', technicalname: '', technicalemail: '', technicalnumber: '', ctoname: '', ctoemail: '', ctonumber: '', ceoname: '', ceoemail: '', ceonumber: '', acquisitionsname: '', acquisitionsemail: '', acquisitionsnumber: '', syndicationname: '', syndicationemail: '', syndicationnumber: '', commission: '', commissiontype: '', accountmanager: '', status: 'INACTIVE', followup: '' });
    // const [editUser, setEditUser] = useState({});

    const [companyemailError, setCompanyEmailError] = useState("");
    const [legalemailError, setLegalEmailError] = useState("");
    const [accountemailError, setAccountEmailError] = useState("");
    const [technicalemailError, setTechnicalEmailError] = useState("");
    const [ceoemailError, setCeoEmailError] = useState("");
    const [ctoemailError, setCtoEmailError] = useState("");
    const [acquistionemailError, setAcquistionEmailError] = useState("");
    const [syndicationemailError, setSyndicationEmailError] = useState("");
    const [popup, setPopUp] = useState(false);
    const [accmanager, setAccManager] = useState("");
    const [companyError, setCompanyError] = useState("");
    const [commissionError, setCommissionError] = useState("");
    const [commissiontypeError, setCommissionTypeError] = useState("");
    const [accountmanagerError, setAccountManagerError] = useState("");
    const [agreementError, setAgreementError] = useState("");

    const [nameExist, setNameExist] = useState(false);

    const [createdon, setCreatedOn] = useState("");
    const [activatedon, setActivatedOn] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [deleteFile, setDeleteFile] = useState(false);
    const [playContent, setPlayContent] = useState({});
    const [showDoc, setshowDoc] = useState(false);
    const [fileDocName, setFileDocName] = useState("");

    const [uploadContent, setUploadContent] = useState({});
    const [fileName, setFileName] = useState("");
    const [showUpload, setShowUpload] = useState(false); 
    const [showDocAlert, setShowDocAlert] = useState(false); 
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [fileNameerror, setFileNameError] = useState(false);
    const [checkCompanyName, setCheckCompanyName] = useState(false);
    const [docFlag, setDocFlag] = useState(false);
    const [invalidContent, setInvalidContent] = useState(false);
    const [restrict, setRestrict] = useState(false);

    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, userData, setActiveMenuId, setActiveMenuObj,GetTimeActivity} = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);
    useEffect(() => {

        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        GetCountries();
        setRoute("company")
        setActiveMenuId(300002)
        setActiveMenuObj({
            "Client Management": true,
            "Reports": false
        })
        if (id) {
            setAdd(false);
            getclient();
            getUsers();
            getAccount();
        } else {
            setAdd(true);
            getAccount();
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
    // useEffect(() => {
    //     getUsers();
    // }, [user]);

    useEffect(() => {
        if (id) {
            getFollowup();
        }

    }, [updated]);

    useEffect(() => {
        if (docFlag) {
            handleUpdate()
        }

    }, [editUser.documents]);

    const getFollowup = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/followup?appname=' + appname + '&companyid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setFollowupContent(response.data.result.data);
                }


            });
    }

    const handleFollowup = async () => {
        GetTimeActivity() 
        if (editUser.followup && editUser.followup.length > 0) {
            try {
                const response = await tmdbApi.FollowUp({
                    "followup": editUser.followup,
                    "companyid": id,

                });


            } catch {
                console.log("error");
            }
        }
    };

    const getUsers = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/companyUsers?appname=' + appname + '&companyid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setUser(response.data.result.data);
                }
            });
    }

    const getclient = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/company?appname=' + appname + '&companyid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    if (response.data.result.length > 0) {
                        setEditUser(response.data.result[0]);
                        setAccManager(response.data.result[0].accountmanager)
                        setUploadContent(response.data.result[0].documents)
                        if (response.data.result[0].entity === "INDIVIDUAL") {
                            setShow(true);
                        }

                        if (response && response.data && response.data.result[0] && response.data.result[0].created) {
                            var created_date = new Date(response.data.result[0].created);
                            var created_hour = created_date.getHours();
                            var created_min = created_date.getMinutes();
                            var created_sec = created_date.getSeconds();
                            setCreatedOn(created_hour + ':' + created_min + ':' + created_sec)
                        }

                        if (response && response.data && response.data.result[0] && response.data.result[0].activatedOn) {
                            var created_date = new Date(response.data.result[0].activatedOn);
                            var created_hour = created_date.getHours();
                            var created_min = created_date.getMinutes();
                            var created_sec = created_date.getSeconds();
                            setActivatedOn(created_hour + ':' + created_min + ':' + created_sec)
                        }
                    } else {
                        setInvalidContent(true)
                    }

                }

            });
    }

    const onclickInvalid = () => {
        GetTimeActivity() 
        setInvalidContent(false)
        history.push('/company')
    }

    const getAccount = async () => {
        GetTimeActivity() 
        try {
            const response = await tmdbApi.getAccount({
            });
            if (response.result == "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {
                setAccount(response.result);
            }

        } catch {
            console.log("error");
        }
    };


    const GetCountries = async () => {
        try {
            console.log(tmdbApi);
            const response = await tmdbApi.getLookUp({
                "type": ["country"],
                "sortBy": "alpha3",
                "projection":"tiny"
            });

            console.log(response.result);
            setCountries(response.result.data);
        } catch {
            console.log("error");
        }
    };


    let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    const validateOnchangeEmail1 = (e) => {
        GetTimeActivity() 
        if (reg.test(editUser.legalemail) == false) {
            setLegalEmailError("Please Enter Valid Legal Email");
            setTimeout(function () { setLegalEmailError("") }, 3000);
        } else {
            setLegalEmailError("");
        }
    }
    const validateOnchangeEmail2 = (e) => {
        GetTimeActivity() 
        if (reg.test(editUser.accountemail) == false) {
            setAccountEmailError("Please Enter Valid Account Email");
            setTimeout(function () { setAccountEmailError("") }, 3000);
        } else {
            setAccountEmailError("");
        }
    }
    const validateOnchangeEmail3 = (e) => {
        GetTimeActivity() 
        if (reg.test(editUser.technicalemail) == false) {
            setTechnicalEmailError("Please Enter Valid Technical Email");
            setTimeout(function () { setTechnicalEmailError("") }, 3000);
        } else {
            setTechnicalEmailError("");
        }
    }
    const validateOnchangeEmail4 = (e) => {
        GetTimeActivity() 
        if (reg.test(editUser.ctoemail) == false) {
            setCtoEmailError("Please Enter Valid CTO Email");
            setTimeout(function () { setCtoEmailError("") }, 3000);
        } else {
            setCtoEmailError("");
        }
    }
    const validateOnchangeEmail5 = (e) => {
        GetTimeActivity() 
        if (reg.test(editUser.ceoemail) == false) {
            setCeoEmailError("Please Enter Valid CEO Email");
            setTimeout(function () { setCeoEmailError("") }, 3000);
        } else {
            setCeoEmailError("");
        }
    }
    const validateOnchangeEmail6 = (e) => {
        GetTimeActivity() 
        if (reg.test(editUser.acquisitionsemail) == false) {
            setAcquistionEmailError("Please Enter Valid Acquisitions Email");
            setTimeout(function () { setAcquistionEmailError("") }, 3000);
        } else {
            setAcquistionEmailError("");
        }
    }
    const validateOnchangeEmail7 = (e) => {
        GetTimeActivity() 
        if (reg.test(editUser.syndicationemail) == false) {
            setSyndicationEmailError("Please Enter Valid Syndication Email");
            setTimeout(function () { setSyndicationEmailError("") }, 3000);
        } else {
            setSyndicationEmailError("");
        }
    }

    const handleChange = (e, keyname) => {
        console.log('nameeeee',e.target.name)
        console.log('checkedd',e.target.checked)
        console.log('valueeee',e.target.value)
        if (!!companyError[keyname]) {
            let error = Object.assign({}, companyError);
            console.log('error in handle change',error)
            delete error[keyname];
            setCompanyError(error);

        }
        if (e.target.name == 'commission') {
            setCommissionError("");
        }
        if(editUser?.status != 'ACTIVE' || (e.target.name == 'status' && e.target.value === "INACTIVE")){
            setAccountManagerError("")
        }
        if(editUser?.companytype != 'ONLINE' || (e.target.name == 'companytype' && e.target.value != "ONLINE")){
            setAgreementError("")
        }
        
        if((editUser?.companytype === "ONLINE" && e.target.name == 'agreement' && e.target.checked == true) || (editUser?.companytype != "ONLINE")){
            setAgreementError("")
        }
        

        if (e.target.name === "accountmanager") {

            console.log("........", e.target.value);
            for (let key in account) {

                console.log(account)
                if (account.hasOwnProperty(key) && account[key].username === e.target.value) {
                    setEditUser({ ...editUser, [e.target.name]: account[key].username, accountManagerId: account[key].userid })
                }

            }
            if (e.target.value === "") {
                setEditUser({ ...editUser, [e.target.name]: "", accountManagerId: "" })
            }

        } else if (e.target.name === "signednda" || e.target.name === "agreement") {
            const { name, checked } = e.target;
            console.log("cccc", name,   );
            setEditUser((prevCheckboxes) => ({
                ...prevCheckboxes,
                [name]: checked,
            }));
        }
        else if (e.target.name === "companyname") {
            if (add === false) {
                setCheckCompanyName(true)
            }
            setEditUser({ ...editUser, [e.target.name]: e.target.value });

        }
        else {

            setEditUser({ ...editUser, [e.target.name]: e.target.value });
        }

    }

    const handleUpdate = (e) => {
        GetTimeActivity() 
        console.log("editUser", editUser)
        setIsLoading(true)
        updateCompany(id, editUser, checkCompanyName).then((data) => {
            console.log("getClientcontent data", data);
            if (data.statusCode == 200) {
                setCheckCompanyName(false)
                if (data.result === "Company name already exists") {
                    setNameExist(true);
                    setIsLoading(false);
                    setUpdated(false);
                }
                else if (data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {

                    getclient();
                    setUpdated(true);
                    setEditUser({ ...editUser, followup: '' })

                    ref.current.value = "";
                    setFileName("");
                    setShowUpload(false);
                    setIsLoading(false)
                    setDocFlag(false)
                }
                setIsLoading(false)
            }
        }).catch((error) => {
            console.log(error);
            setIsLoading(false)
        })
    }



    const Validate = (e) => {
        GetTimeActivity() 
        let formIsValid = true;

        if (editUser?.status === "ACTIVE") {
            if ((editUser?.accountmanager === undefined || editUser?.accountmanager === "")) {
                console.log('accouint mangage validation')
                setAccountManagerError("Please Select Account Manager");
                formIsValid = false;
                // setPopUp(true)

            } else {
                formIsValid = true;
            }

        }
        // if (editUser?.companytype === "ONLINE") {
        //     if ((editUser?.agreement === undefined || editUser.agreement == false)) {
                
        //         setAgreementError("Agreement is required");
        //         formIsValid = false;
        //         // setPopUp(true)

        //     }

        // }

        let error = { ...companyError };
        let mandatoryFileds = [{ name: 'Company Name', key: 'companyname' }, { name: 'Company Type', key: 'companytype' }, { name: 'Content Type', key: 'contenttype' }]
        if (mandatoryFileds) {
            mandatoryFileds.forEach(function (item) {

                if (
                    (editUser[item.key] == "" ||
                        editUser[item.key] == undefined ||
                        editUser[item.key] == "undefined")
                ) {
                    error[item.key] = item.name + " is required";
                    formIsValid = false;
                }

            });
        }
      
        if (editUser.commission && editUser.commission < 0 || editUser.commission && editUser.commission < "0") {
            setCommissionError("commission should be greater than or Equal to Zero");
            formIsValid = false;
        }

        console.log("status", editUser.status);
        if (!editUser.phone && editUser.idc) {
            error['phone'] = `Enter phone number`;
            // setPhoneError("Enter phone number");
            // setTimeout(function () { setPhoneError("") }, 3000);
            formIsValid = false;
          }
      
        
          if (editUser.phone && !editUser.idc) {
            error['idc'] = `Select country code`;
            // setIdcError("Select country code");
            // setTimeout(function () { setIdcError("") }, 3000);
            formIsValid = false;
          }

         
          const fieldNames = [
           
            'legalcontactnumber',
            'accountcontactnumber',
            'technicalcontactnumber',
            'ctonumber',
            'ceonumber',
            'acquisitionsnumber',
            'syndicationnumber',
          ];
          const newArr = fieldNames.map(item=> {
            return {num : item,idc : item+"idc"}
          })
         newArr.forEach(item=>{
            let flag1 = true
            let flag2 = true
            console.log('itemitemitemitemitemitem',item,editUser[item.num],editUser[item.idc])
            if (!editUser[item.num] && editUser[item.idc]) {
               flag1 = false
                error[item.num]= `Enter contact number`;
                formIsValid = false;
              }
          
            
              if (editUser[item.num] && !editUser[item.idc]) {
                flag2 = false
                error[item.idc]= `Select country code`;
                formIsValid = false;
              }
              if(flag1 === true){
                delete error[item.num]
              }
              if(flag2 === true){
                delete error[item.idc]
              }
             
         })
      
        
        console.log('company ererrrorrrr',error)
        console.log("excuted",formIsValid == true ? 'trueeee':'false')
        setCompanyError(error);
        return formIsValid;

    }
    console.log('editUser----->',editUser)
    console.log('companyError----->',companyError)

    function onCancel() {
        setPopUp(false);
    }


    const handleSubmit = (e) => {
        GetTimeActivity() 
        const isValid = Validate();

        console.log("isValid", isValid);
        if (isValid && add) {

            SaveCompany();

        } else if (isValid) {
           console.log("isValid",isValid);
            handleUpdate();
            handleFollowup();
        }
    }

    const SaveCompany = async () => {
        GetTimeActivity() 
        setIsLoading(true)
        let obj = { ...editUser, createdBy: { userid: userData.userid, username: userData.name } }
        saveCompany(obj).then((data) => {
            console.log("getClientcontent data", data);
            if (data.result === "Company name already exists") {
                setNameExist(true);
                setIsLoading(false)
            } else if (data.result == "Invalid token or Expired") {
                setShowSessionPopupup(true)
            } else {
                setSuccess(true);
                setIsLoading(false);
            }
        }).catch((error) => {
            console.log(error);
        })
    };




    const handleBack = () => {
        GetTimeActivity() 
        if (add === false) {
            history.push({
                pathname: "/company",
                state: { search: true }
            });
        } else {
            history.push("/company")
        }
    }

    function onConfirm() {
        GetTimeActivity() 
        setSuccess(false);
        history.push("/company")
    };

 



    const handleBread = () => {
        GetTimeActivity() 
        history.push("/company")
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
        if (fileName !== "" && fileName !== undefined) {
          
            var fileData = new FormData();
            setIsLoading(true)
            var file = e.target.files[0];
            console.log("file", file);
            let filetype = file.type.split("/");
            console.log("filetype",filetype[0])
            if(filetype[0] === "video" || filetype[0] === "audio"){
                setRestrict(true)
            }else{
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

                bucket = window.site.common.resourceBucket;

                var path = "uploads/" + id;
                uploadFilePath = appname + "/" + path + "/" + removeSpecialCharecters(format[0]) + "_" + timestamp + "." + fileformat;

                console.log("uploadFilePath", uploadFilePath)
                let imagePath = window.site && window.site.common && window.site.common.resourcesUrl;
                var data = { source_bucket: bucket, sourcepath: uploadFilePath }
                const token = localStorage.getItem("token")
                const userid = localStorage.getItem("userId")

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

                                        let imageUploadPath = uploadFilePath;
                                        console.log("parth", imageUploadPath);
                                        const current = new Date();
                                        const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
                                        const unique_id = uuid();
                                        let uploadObj = {};
                                        uploadObj.id = unique_id;
                                        uploadObj.name = fileName;
                                        uploadObj.path = imageUploadPath;
                                        uploadObj.type = file.type;
                                        uploadObj.uploaded_on = date.replaceAll("/", "-");
                                        setDocFlag(true)
                                        setEditUser({ ...editUser, documents: [uploadObj] })
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
        else {
            setFileNameError(true);
        }
    }

    const handleOpen = (e, content) => {
        GetTimeActivity() 
        let source;
        source = window.site.common.resourcesUrl + "/" + content.path;
        console.log("source", content, source)
        setFileDocName(content?.name)
        setPlayContent(source);
        setshowDoc(true);
        setType(content.type);
        console.log("playercontent==========>", source);
    }


    const handleDeleteFile = (e, docid) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")
        setIsLoading(true)
        axios({
            method: 'DELETE',
            url: lambda + '/deleteFile?appname=' + appname + '&companyid=' + id + '&docid=' + docid + "&token=" + token + "&userid=" + userid,
        })
            .then(function (response) {
                if (response.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setIsLoading(false);
                    setShowDocAlert(false);
                    setDeleteFile(true);
                    getclient();
                   
                }


            }).catch((err)=>{
                console.log('error',err);
                setIsLoading(false);
            });

    }
const handleDeleteDoc= (e,id)=>{
    GetTimeActivity() 
    console.log('iddddd',id)
    setActiveDeleteId(id)
    setShowDocAlert(true);
   
}
    const handleUploadPopup = (e) => {
        GetTimeActivity() 
        setShowUpload(true);
    }

    const handleRemoveAccError = (e) => {
        GetTimeActivity() 
        setAccountManagerError("");
    }

    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <SweetAlert show={invalidContent}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Company Not Found"}
                    onConfirm={e => onclickInvalid()}
                >
                </SweetAlert>
                {!invalidContent &&

                    <div className="main-content create-user edit-content add-client">

                        <div className="page-content ">
                            <div className="container-fluid">



                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">{add === true ? "ADD" : "EDIT"} COMPANY</h4>
                                                <p className="menu-path"><span onClick={handleBread}>Company Management</span> / <b>{add === true ? "Add" : "Edit"} Company</b></p>
                                            </div>
                                            <div>
                                                <a onClick={handleBack} className="btn btn-primary">back</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="create-user-block">

                                    <div className="form-block">
                                        <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link active" data-bs-toggle="tab" href="#home1" role="tab" aria-selected="true">
                                                    <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                    <span className="d-none d-sm-block">DETAILS</span>
                                                </a>
                                            </li>
                                            {add === false ?
                                                <><li className="nav-item" role="presentation">
                                                    <a className="nav-link" data-bs-toggle="tab" href="#profile1" role="tab" aria-selected="false" tabIndex="-1">
                                                        <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                                                        <span className="d-none d-sm-block">DOCUMENTS</span>
                                                    </a>
                                                </li><li className="nav-item" role="presentation">
                                                        <a className="nav-link" data-bs-toggle="tab" href="#messages1" role="tab" aria-selected="false" tabIndex="-1">
                                                            <span className="d-block d-sm-none"><i className="far fa-envelope"></i></span>
                                                            <span className="d-none d-sm-block">FOLLOW UP</span>
                                                        </a>
                                                    </li>
                                                    <li className="nav-item" role="presentation">
                                                        <a className="nav-link" data-bs-toggle="tab" href="#users" role="tab" aria-selected="false" tabIndex="-1">
                                                            <span className="d-block d-sm-none"><i className="far fa-envelope"></i></span>
                                                            <span className="d-none d-sm-block">USERS</span>
                                                        </a>
                                                    </li>
                                                </>
                                                : ""}


                                        </ul>
                                        <div className="tab-content p-3 text-muted">
                                            <div className="tab-pane active show" id="home1" role="tabpanel">
                                                {Object.keys(editUser).length > 0 && countries.length >0 ? 
                                                <>
                                                <div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>company</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Company Name<span className="required">*</span></label>
                                                            <input className="form-control" placeholder="Enter Company Name" type="text" name="companyname" value={editUser.companyname} onChange={(e) => handleChange(e, "companyname")} id="example-text-input" />
                                                            {/* {companynameError != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{companynameError}</span> : ""
                                                        } */}
                                                            {companyError.companyname && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.companyname}</span>}
                                                        </div>
                                                    </div>


                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Company Email</label>
                                                            {add === false && editUser.entity === "INDIVIDUAL" ?
                                                                <input className="form-control" placeholder="Enter Company Email" type="text" name="emailid" value={editUser.emailid} onChange={(e) => handleChange(e)} id="example-text-input" disabled />
                                                                : <input className="form-control" placeholder="Enter Company Email" type="text" name="emailid" value={editUser.emailid} onChange={(e) => handleChange(e)} id="example-text-input" />}

                                                            {companyemailError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{companyemailError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Company phone</label>
                                                            <div className="country-code">
                                                                <select name="idc" value={editUser.idc} className="colorselect capitalize" onChange={(e) => handleChange(e,'idc')}>
                                                                    <option value="">Select</option>
                                                                    {countries && countries.length > 0 && countries.map((task, i) => {
                                                                        return (
                                                                            <><option key={i} value={task.alpha3}>{task.countrycode && task.alpha3 ? task.alpha3 + task.countrycode : task.name}</option></>
                                                                        )
                                                                    }
                                                                    )}
                                                                </select>
                                                                <input className="form-control contact-number" type="tel" maxLength="10" name="phone" onChange={(e) => handleChange(e,'phone')} value={editUser.phone} placeholder="Enter Company Phone Number" id="example-tel-input" />
                                                            </div>
                                                           
                                                            {companyError.idc && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.idc}</span>}
                                                                {companyError.phone && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.phone}</span>}
                                                                
                                                        </div>
                                                    </div>










                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Company type<span className="required">*</span></label>
                                                            <select className="form-select" name="companytype" placeholder="Select Type" onChange={(e) => handleChange(e, "companytype")} value={editUser.companytype}>
                                                                <option value="">Select Type</option>
                                                                <option>ONLINE</option>
                                                                <option>OFFLINE</option>
                                                            </select>
                                                            {/* {companytypeError != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{companytypeError}</span> : ""
                                                        } */}
                                                            {companyError.companytype && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.companytype}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">content type<span className="required">*</span></label>
                                                            <select className="form-select" name="contenttype" onChange={(e) => handleChange(e, "contenttype")} value={editUser.contenttype}>
                                                                <option value="">Select Content Type</option>
                                                                <option>OWNER</option>
                                                                <option>DISTRIBUTOR</option>
                                                                <option>OWNER & DISTRIBUTOR</option>
                                                                <option>BUYER</option>
                                                                <option>AGENT</option>
                                                                <option>OTHER</option>
                                                            </select>
                                                            {/* {contenttypeError != "" ?
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{contenttypeError}</span> : ""
                                                        } */}
                                                            {companyError.contenttype && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.contenttype}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">address</label>
                                                            <input className="form-control contact-number" name="address" type="text" onChange={(e) => handleChange(e)} value={editUser.address} placeholder="Enter Address" id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">region</label>
                                                            <input className="form-control contact-number" name="region" type="text" onChange={(e) => handleChange(e)} value={editUser.region} placeholder="Enter Region" id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">city</label>
                                                            <input className="form-control contact-number" name="city" type="text" onChange={(e) => handleChange(e)} value={editUser.city} placeholder="Enter City" id="example-email-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">country</label>
                                                            {/* <input className="form-control contact-number" type="text" onChange={(e) => handleChange(e)} value={editUser.country} name="country" placeholder="Enter Country" id="example-email-input" /> */}


                                                            <select value={editUser.country} id="example-email-input" name="country" className="form-control contact-number" onChange={(e) => handleChange(e)}>
                                                                <option value="">Select Country</option>
                                                                {countries && countries.length > 0 && countries.map((task, i) => {
                                                                    return (
                                                                        <option key={i} value={task.name}>{task.name}</option>
                                                                    )
                                                                }
                                                                )}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">zipcode</label>
                                                            <input className="form-control contact-number" type="text" onChange={(e) => handleChange(e)} name="zipcode" value={editUser.zipcode} placeholder="Enter Zipcode" id="example-email-input" />
                                                        </div>
                                                    </div>
                                                </div>



                                                <div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>legal contact</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">legal contact name</label>
                                                            <input className="form-control" placeholder="Enter Legal Contact Name" type="text" name="legalname" onChange={(e) => handleChange(e)} value={editUser.legalname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">legal contact email</label>
                                                            <input className="form-control contact-number" type="email" name="legalemail" onChange={(e) => handleChange(e)} value={editUser.legalemail} placeholder="Enter Legal Contact Email" id="example-email-input" onBlur={e => validateOnchangeEmail1(e)} />
                                                            {legalemailError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{legalemailError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">legal contact number</label>
                                                            <div className="country-code">
                                                                <select name="legalcontactnumberidc" value={editUser.legalcontactnumberidc} className="colorselect capitalize" onChange={(e) => handleChange(e,'legalcontactnumberidc')}>
                                                                <option value="">Select</option>
                                                                
                                                                    {countries && countries.length > 0 && countries.map((task, i) => {
                                                                        return (
                                                                            <><option key={i} value={task.alpha3 }>{task.alpha3 + task.countrycode}</option></>
                                                                        )
                                                                    }
                                                                    )}
                                                                </select>
                                                                <input className="form-control contact-number" type="tel" maxLength="10" name="legalcontactnumber" onChange={(e) => handleChange(e,'legalcontactnumber')} value={editUser.legalcontactnumber} placeholder="Enter Legal Contact Number" id="example-tel-input" />
                                                                {companyError.legalcontactnumberidc && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.legalcontactnumberidc}</span>}
                                                                {companyError.legalcontactnumber && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.legalcontactnumber}</span>}
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Accounting Contact</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">account contact name</label>
                                                            <input className="form-control" placeholder="Enter Account Contact Name" type="text" name="accountname" onChange={(e) => handleChange(e)} value={editUser.accountname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">account contact email</label>
                                                            <input className="form-control contact-number" type="email" name="accountemail" onChange={(e) => handleChange(e)} value={editUser.accountemail} placeholder="Enter Accounting Contact Email" id="example-email-input" onBlur={e => validateOnchangeEmail2(e)} />
                                                            {accountemailError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{accountemailError}</span> : ""
                                                            }

                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">account contact number</label>
                                                            <div className="country-code">
                                                                <select name="accountcontactnumberidc" value={editUser.accountcontactnumberidc} className="colorselect capitalize" onChange={(e) => handleChange(e,'accountcontactnumberidc')}>
                                                                    <option value="">Select</option>
                                                                    {countries && countries.length > 0 && countries.map((task, i) => {
                                                                        return (
                                                                            <><option key={i} value={task.alpha3 }>{task.alpha3 + task.countrycode}</option></>
                                                                        )
                                                                    }
                                                                    )}
                                                                </select>

                                                                <input className="form-control contact-number" type="tel" maxLength="10" name="accountcontactnumber" onChange={(e) => handleChange(e,'accountcontactnumber')} value={editUser.accountcontactnumber} placeholder="Enter Accounting Contact Number" id="example-tel-input" />
                                                                {companyError.accountcontactnumberidc && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.accountcontactnumberidc}</span>}
                                                                {companyError.accountcontactnumber && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.accountcontactnumber}</span>}
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Technical Contact</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">technical contact name</label>
                                                            <input className="form-control" placeholder="Enter Techinical Contact Name" type="text" name="technicalname" onChange={(e) => handleChange(e)} value={editUser.technicalname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">technical contact email</label>
                                                            <input className="form-control contact-number" type="email" name="technicalemail" onChange={(e) => handleChange(e)} value={editUser.technicalemail} placeholder="Enter Technical Contact Email" id="example-email-input" onBlur={e => validateOnchangeEmail3(e)} />
                                                            {technicalemailError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{technicalemailError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">technical contact number</label>
                                                            <div className="country-code">
                                                                <select name="technicalcontactnumberidc" value={editUser.technicalcontactnumberidc} className="colorselect capitalize" onChange={(e) => handleChange(e,'technicalcontactnumberidc')}>
                                                                    <option value="">Select</option>
                                                                    {countries && countries.length > 0 && countries.map((task, i) => {
                                                                        return (
                                                                            <><option key={i} value={task.alpha3 }>{task.alpha3 + task.countrycode}</option></>
                                                                        )
                                                                    }
                                                                    )}
                                                                </select>

                                                                <input className="form-control contact-number" type="tel" maxLength="10" name="technicalcontactnumber" onChange={(e) => handleChange(e,'technicalcontactnumber')} value={editUser.technicalcontactnumber} placeholder="Enter Technical Contact Number" id="example-tel-input" />
                                                               
                                                                {companyError.technicalcontactnumberidc && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.technicalcontactnumberidc}</span>}
                                                                {companyError.technicalcontactnumber && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.technicalcontactnumber}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>CTO</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">cto name</label>
                                                            <input className="form-control" placeholder="Enter CTO Name" type="text" name="ctoname" onChange={(e) => handleChange(e)} value={editUser.ctoname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">cto email</label>
                                                            <input className="form-control contact-number" type="email" name="ctoemail" onChange={(e) => handleChange(e)} value={editUser.ctoemail} placeholder="Enter CTO Email" id="example-email-input" onBlur={e => validateOnchangeEmail4(e)} />
                                                            {ctoemailError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{ctoemailError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">CTO Number</label>
                                                            <div className="country-code">
                                                                <select name="ctonumberidc" value={editUser.ctonumberidc} className="colorselect capitalize" onChange={(e) => handleChange(e,'ctonumberidc')}>
                                                                    <option value="">Select</option>
                                                                    {countries && countries.length > 0 && countries.map((task, i) => {
                                                                        return (
                                                                            <><option key={i} value={task.alpha3 }>{task.alpha3 + task.countrycode}</option></>
                                                                        )
                                                                    }
                                                                    )}
                                                                </select>
                                                                <input className="form-control contact-number" type="tel" maxLength="10" name="ctonumber" onChange={(e) => handleChange(e,'ctonumber')} value={editUser.ctonumber} placeholder="Enter CTO Number" id="example-tel-input" />
                                                                {companyError.ctonumberidc && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.ctonumberidc}</span>}
                                                                {companyError.ctonumber && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.ctonumber}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>CEO</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">ceo name</label>
                                                            <input className="form-control" placeholder="Enter Ceo Name" type="text" name="ceoname" onChange={(e) => handleChange(e)} value={editUser.ceoname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">ceo email</label>
                                                            <input className="form-control contact-number" type="email" name="ceoemail" onChange={(e) => handleChange(e)} value={editUser.ceoemail} placeholder="Enter CEO Email" id="example-email-input" onBlur={e => validateOnchangeEmail5(e)} />
                                                            {ceoemailError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{ceoemailError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">ceo number</label>
                                                            <div className="country-code">
                                                                <select name="ceonumberidc" value={editUser.ceonumberidc} className="colorselect capitalize" onChange={(e) => handleChange(e,'ceonumberidc')}>
                                                                    <option value="">Select</option>
                                                                    {countries && countries.length > 0 && countries.map((task, i) => {
                                                                        return (
                                                                            <><option key={i} value={task.alpha3 }>{task.alpha3 + task.countrycode}</option></>
                                                                        )
                                                                    }
                                                                    )}
                                                                </select>

                                                                <input className="form-control contact-number" type="tel" maxLength="10" name="ceonumber" onChange={(e) => handleChange(e,'ceonumber')} value={editUser.ceonumber} placeholder="Enter CEO Number" id="example-tel-input" />
                                                                {companyError.ceonumberidc && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.ceonumberidc}</span>}
                                                                {companyError.ceonumber && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.ceonumber}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Head of Acquisitions</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Head of Acquisitions Name</label>
                                                            <input className="form-control" placeholder="Enter Head of Acquisitions Name" type="text" name="acquisitionsname" onChange={(e) => handleChange(e)} value={editUser.acquisitionsname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Head of Acquisitions Email</label>
                                                            <input className="form-control contact-number" type="email" name="acquisitionsemail" onChange={(e) => handleChange(e)} value={editUser.acquisitionsemail} placeholder="Enter Head of Acquisitions Email" id="example-email-input" onBlur={e => validateOnchangeEmail6(e)} />
                                                            {acquistionemailError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{acquistionemailError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Head of Acquisitions Number</label>
                                                            <div className="country-code">
                                                                <select name="acquisitionsnumberidc" value={editUser?.acquisitionsnumberidc} className="colorselect capitalize" onChange={(e) => handleChange(e,'acquisitionsnumberidc')}>
                                                                    <option value="">Select</option>
                                                                    {countries && countries.length > 0 && countries.map((task, i) => {
                                                                        return (
                                                                            <><option key={i} value={task.alpha3 }>{task.alpha3 + task.countrycode}</option></>
                                                                        )
                                                                    }
                                                                    )}
                                                                </select>
                                                                <input className="form-control contact-number" type="tel" maxLength="10" name="acquisitionsnumber" onChange={(e) => handleChange(e,'acquisitionsnumber')} value={editUser.acquisitionsnumber} placeholder="Enter Head of Acquisitions Number" id="example-tel-input" />
                                                                {companyError.acquisitionsnumberidc && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.acquisitionsnumberidc}</span>}
                                                                {companyError.acquisitionsnumber && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.acquisitionsnumber}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Head of Syndication</h5>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Head of Syndication Name</label>
                                                            <input className="form-control" placeholder="Enter Head of Syndication Name" type="text" name="syndicationname" onChange={(e) => handleChange(e)} value={editUser.syndicationname} id="example-text-input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Head of Syndication Email</label>
                                                            <input className="form-control contact-number" type="email" name="syndicationemail" onChange={(e) => handleChange(e)} value={editUser.syndicationemail} placeholder="Enter Head of Syndication Email" id="example-email-input" onBlur={e => validateOnchangeEmail7(e)} />
                                                            {syndicationemailError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{syndicationemailError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Head of Syndication Number</label>
                                                            <div className="country-code">
                                                                <select name="syndicationnumberidc" value={editUser.syndicationnumberidc} className="colorselect capitalize" onChange={(e) => handleChange(e,'syndicationnumberidc')}>
                                                                    <option value="">Select</option>
                                                                    {countries && countries.length > 0 && countries.map((task, i) => {
                                                                        return (
                                                                            <><option key={i} value={task.alpha3 }>{task.alpha3 + task.countrycode}</option></>
                                                                        )
                                                                    }
                                                                    )}
                                                                </select>
                                                                <input className="form-control contact-number" type="tel" maxLength="10" name="syndicationnumber" onChange={(e) => handleChange(e,'syndicationnumber')} value={editUser.syndicationnumber} placeholder="Enter Head of Syndication Number" id="example-tel-input" />
                                                                {companyError.syndicationnumberidc && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.syndicationnumberidc}</span>}
                                                                {companyError.syndicationnumber && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{companyError.syndicationnumber}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Commission</h5>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="col-form-label">commission</label>
                                                            <input className="form-control contact-number" type="number" name="commission" onChange={(e) => handleChange(e)} value={editUser.commission} placeholder="Enter commission" id="example-email-input" />
                                                            {commissionError && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{commissionError}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="col-form-label">commission type</label>
                                                            <select className="form-select" name="commissiontype" onChange={(e) => handleChange(e)} value={editUser.commissiontype}>
                                                                <option value="">Select Commission Type</option>
                                                                <option>FIXED</option>
                                                                <option>VARIABLE</option>

                                                            </select>
                                                            {commissiontypeError && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{commissiontypeError}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row-separte">
                                                    <div className="row inner-separate">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Account Manager{editUser?.status==="ACTIVE" ?<span className="required">*</span>:null}</h5>
                                                        <div className="col-md-12">
                                                            <div className="input-field">

                                                                <select id="example-email-input" value={editUser.accountmanager} onChange={(e) => handleChange(e)} name="accountmanager" onFocus={handleRemoveAccError} className="form-control">
                                                                    <option value="">Select Account Manager</option>

                                                                    {account && account.length > 0 && account.map((task, i) => {

                                                                        return (
                                                                            <option key={i} value={task.username}>{task.username}</option>
                                                                        );
                                                                    }
                                                                    )}
                                                                </select>
                                                                {accountmanagerError && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{accountmanagerError}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row inner-separate">
                                                        <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i>Signed
                                                        {/* {editUser?.companytype==="ONLINE" ?<span className="required">*</span>:null} */}
                                                        </h5>
                                                        <div className="col-md-12 switch-buttons-block">
                                                            <div className="input-field switch-buttons d-flex align-items-center">
                                                                <label className="col-form-label">NDA</label>
                                                                <label className="switch disable"><input type="checkbox" name="signednda" checked={editUser.signednda} onChange={(e) => handleChange(e)} /><span className="slider round"></span></label>

                                                            </div>


                                                            <div className="input-field switch-buttons d-flex align-items-center">
                                                                <label className="col-form-label">Agreement
                                                                {/* {editUser?.companytype==="ONLINE" ?<span className="required">*</span>:null} */}
                                                                </label>
                                                                <label className="switch disable"><input type="checkbox" name="agreement" checked={editUser.agreement} onChange={(e) => handleChange(e)} /><span className="slider round"></span></label>
                                                            </div>
                                                        </div>
                                                        {agreementError && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{agreementError}</span>}
                                                    </div>
                                                </div>
                                                {add === false &&
                                                    <div className="row comment-section created">
                                                        {editUser.created &&
                                                            <div className="col-md-4">
                                                                <label className="col-form-label">Created On</label>
                                                                <input className="form-control" placeholder="Enter Name" type="text" value={new Date(editUser.created).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                    hour: 'numeric',
                                                                    minute: 'numeric',
                                                                })} id="example-text-input" disabled />
                                                            </div>
                                                        }
                                                        {editUser.activatedOn &&
                                                            <div className="col-md-4">
                                                                <label className="col-form-label">Actived On</label>
                                                                <input className="form-control" placeholder="Enter Name" type="text" value={new Date(editUser.activatedOn).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                    hour: 'numeric',
                                                                    minute: 'numeric',
                                                                })} id="example-text-input" disabled />
                                                            </div>
                                                        }

                                                    </div>
                                                }

                                                {add === false ?
                                                    <div className="row comment-section">
                                                        <div className="col-md-12">
                                                            <label className="verticalnav-address-input">FOLLOW UP</label>
                                                            <textarea id="verticalnav-address-input" name="followup" onChange={(e) => handleChange(e)} value={editUser.followup} className="form-control" rows="2" style={{ marginBottom: "10px" }}></textarea>
                                                        </div>
                                                    </div>
                                                    : ""}


                                                {error != "" ?
                                                    <span className="errormsg" style={{
                                                        fontWeight: 'bold',
                                                        color: 'red',
                                                    }}>{error}</span> : ""
                                                }


                                                <div className="row status">

                                                    <div className="col-md-3 justify-content-between ps-0">

                                                        <div className="input-field d-flex align-items-center">

                                                            <label className="col-form-label">Status</label>

                                                            <select className="form-select" name="status" value={editUser.status} onChange={(e) => handleChange(e)} >

                                                                <option value="INACTIVE">Inactive</option>
                                                                <option value="ACTIVE">Active</option>

                                                            </select>


                                                        </div>

                                                    </div>

                                                    {/* <div className="col-md-3 justify-content-between ps-0">
                                                </div> */}
                                                    {add === false ?
                                                        <div className="col-md-9 justify-content-end d-flex align-items-center">


                                                            <a onClick={handleSubmit} className="btn btn-primary">{isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}UPDATE</a>
                                                            {/* <a onClick={handleSubmit} className={`btn btn-primary ${checkCompanyName === false ? "disable" : ""}`}  disabled={checkCompanyName === false}>UPDATE</a> */}

                                                        </div>

                                                        : <div className="col-md-9 justify-content-end d-flex align-items-center">


                                                            <a onClick={handleSubmit} className="btn btn-primary">SAVE</a>


                                                        </div>}

                                                </div>
                                                </>
                                                :  <div className="row"><Loader /></div>}
                                            </div>
                                            
                                            <div className="tab-pane" id="profile1" role="tabpanel">
                                                <div className="document-title">
                                                    <label >documents</label>
                                                    <a className="btn btn-primary" onClick={handleUploadPopup}><span className="material-icons">add</span>add</a>


                                                </div>
                                                {uploadContent && uploadContent.length > 0 ?
                                                    <div className="row mb-3 document-list">
                                                        {/* <div>No Documents Found</div> */}
                                                        {uploadContent && uploadContent.length > 0 && uploadContent.map(function (item, i) {
                                                            return (
                                                                <div className="column5">
                                                                    <div className="document-cont">
                                                                        <div className="document-img" onClick={(e) => handleOpen(e, item)}>
                                                                            <a><img className="documentlogo" src={"https://orasi-dev.imgix.net/orasi/common/images/doc-defaulr1.jpg?" + Config.compress} /></a>
                                                                        </div>
                                                                        <div className="documentTitle">
                                                                            <h3>{item.name}</h3>
                                                                            <p>updated on {item.uploaded_on} </p>
                                                                            <button type="button" className="btn-success btn-rounded waves-effect waves-light mb-2 me-2" onClick={(e) => handleDeleteDoc(e,item.id)}>
                                                                                <span className="material-icons-outlined"> delete_outline</span></button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}

                                                    </div>
                                                    : <div className="no-documents">
                                                        <span className="material-icons-outlined">description</span>
                                                        <p>No document has been found yet !</p>
                                                    </div>


                                                }


                                            </div>

                                            <div className="tab-pane" id="messages1" role="tabpanel">
                                                <div className="mb-3 row">

                                                    {folowupcontent && folowupcontent.length > 0 ?
                                                        <div className="col-md-12">
                                                            <label >FOLLOW UP</label>
                                                            {folowupcontent && folowupcontent.length > 0 && folowupcontent.map(function (item, i) {

                                                                return (
                                                                    <div className="comments-block" key={i}>
                                                                        <p className="time">{item.created ? new Date(item.created).toLocaleDateString('en-IN', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric',
                                                                            hour: 'numeric',
                                                                            minute: 'numeric',
                                                                        }) : ""}</p>
                                                                        <p className="comments">{item.followup}</p>
                                                                    </div>
                                                                )
                                                            })}

                                                        </div> :
                                                        <div div className="followups"><div className="no-documents">
                                                            <span className="material-icons-outlined">comment</span>
                                                            <p>No follow-ups were found</p>
                                                        </div></div>

                                                    }

                                                </div>
                                            </div>

                                            <div className="tab-pane" id="users" role="tabpanel">
                                                {user.length > 0 ?
                                                    <table className="table align-middle table-nowrap table-check">
                                                        <thead className="table-light">
                                                            <tr>

                                                                <th className="align-middle">NAME</th>
                                                                <th className="align-middle">EMAIL</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {user && user.length > 0 && user.map(function (item, i) {
                                                                return (
                                                                    <tr key={i}>
                                                                        <td>{item.name}</td>
                                                                        <td>{item.personalemail}</td>
                                                                    </tr>
                                                                )
                                                            })}

                                                        </tbody>

                                                    </table>
                                                    : <div div className="followups"><div className="no-documents">
                                                        <span className="material-icons-outlined"><span className="material-icons-outlined">people</span></span>
                                                        <p>No users were found</p>
                                                    </div></div>}
                                            </div>
                                       </div>

                                    </div>

                                </div>


                            </div>
                        </div>
                        <SweetAlert show={success}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Company Details Saved"}
                            onConfirm={e => onConfirm()}
                        >
                        </SweetAlert>
                        <SweetAlert show={updated}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Updated Successfully"}
                            onConfirm={e => { setUpdated(false);setIsLoading(false)}}
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
                            onConfirm={e =>  setDeleteFile(false)}
                        >
                        </SweetAlert>
                        <SweetAlert show={restrict}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Invalid file type. please select valid file"}
                            onConfirm={e => {  setRestrict(false);setShowUpload(false);setIsLoading(false);setFileName("");}}
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
                                    <Modal.Title>Add Document</Modal.Title>
                                    <button className="close-btn" onClick={(e) => setShowUpload(false)}><span className="material-icons">close</span></button>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="row">
                                        <div className="col-md-12 documents">
                                            <div className="mb-3 input-field">
                                                <label className="form-label form-label">Document Name<span className="required">*</span></label>
                                                <input name="filename" placeholder="Enter File Name" type="text" className="form-control" onChange={(e) => setFileName(e.target.value)} value={fileName} />
                                                {fileNameerror ?
                                                    <span className="errormsg" style={{
                                                        fontWeight: 'bold',
                                                        color: 'red',
                                                    }}>Please enter File Name</span> : ""
                                                }
                                            </div>
                                            <div className={`mb-3 input-field btn-gray ${(fileName===undefined|| fileName === "") ? 'disable pe-none':''}`}>
                                                <input type="file" name="upload" accept=".ppt, .pptx, .doc, .docx, .xls, .xlsx,.pdf," className="udisplay-none" id="upload" onChange={e => uploadS3(e, ["1920*1080", "Image", "landscape_logo_image"])} onClick={(e) => { e.target.value = ''; }} ref={ref} disabled={fileName===undefined|| fileName === ""} />
                                                {isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : <span className="material-icons">upload</span>}upload document</div>
                                            <p>Only pdf and word document allowed.</p>

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
                                        <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e =>  {handleDeleteFile("e",activeDeleteId)}}> {isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}Yes, Delete</button>
                                    </div>
                                </div>
                            </div>

                        </Modal>}
                        <Footer />
                        {showDoc && <FileViewer source={playContent} type={type} close={setshowDoc} name={fileDocName}/>}

                    </div>
                }




            </div>
        </>
    );
};

export default UpdateCompany;
