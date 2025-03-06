/***
**Module Name: add/edit client
 **File Name :  editclient.js
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
 **Description : contains add/edit client data.
 ***/
import React, { useState, useEffect, useContext } from "react";
import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import tmdbApi from "../../api/tmdbApi";
import Modal from 'react-bootstrap/Modal';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useHistory, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from "axios";
import Loader from "../../components/loader";
import moment from "moment";
import SessionPopup from "../SessionPopup"
import Select from 'react-select';
import { contentContext } from "../../context/contentContext";

let { lambda, country, appname } = window.app;

const EditClient = () => {
    const history = useHistory();
    let { id } = useParams();
    const [nda, setNda] = useState(false);
    const [agreement, setAgreement] = useState(false);
    const [show, setShow] = useState(true);
    const [countries, setCountries] = useState('');

    const [error, setError] = useState("");
    const [activeMsg, setActiveMsg] = useState("");
    const [add, setAdd] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errAccManage, setErrAccManage] = useState(false);

    const [termssuccess, setTermsSuccess] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [message, setMessage] = useState(false);
    const [folowupcontent, setFollowupContent] = useState([]);
    const [account, setAccount] = useState([]);

    const [company, setCompany] = useState([]);
    const [companyValue, setCompanyValue] = useState({});
    const [editUser, setEditUser] = useState({ companyname: '', personalemail: '' });
    const [companyId, setCompanyId] = useState("");
    const [companyDeatilsList, setCompanyDetailsList] = useState({});

    const [phoneError, setPhoneError] = useState('');
    const [IdcError, setIdcError] = useState('');

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [typeError, setTypeError] = useState("");
    const [entityError, setEntityError] = useState("");
    const [contentError, setContentError] = useState("");
    const [amError, setAmError] = useState("");
    const [companynameError, setCompanyNameError] = useState("");


    const [companyData, setCompanyData] = useState({});
    const [selectedCom, setSelectedCom] = useState({});

    const [individualdata, setIndividualData] = useState({});
    const [popup, setPopup] = useState(false);
    const [flag, setFlag] = useState(false);
    const [checkAM, setCheckAM] = useState("");

    const [createdon, setCreatedOn] = useState("");
    const [idc, setIdc] = useState("");
    const [defaultCountryCode, setDefaultCountryCode] = useState(""); 

    const [approvedon, setApprovedOn] = useState("");
    const [termsacceptedon, setTermsAcceptedOn] = useState("");
    const [checkStatus, setCheckStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [invalidContent, setInvalidContent] = useState(false);

    const [followuptext, setFollowupText] = useState("");

    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, userData, setActiveMenuId, setActiveMenuObj ,GetTimeActivity} = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);
    // console.log('prevRoute--->',prevRoute)
    // console.log('currentRoute--->',route)

    useEffect(() => {

        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("client")
        setActiveMenuId(300001)
        setActiveMenuObj({
            "Client Management": true,
            "Reports": false
        })
        GetCountries();
        if (id) {
            setAdd(false);
            getclient();
            GetCompany();


        } else {
            setAdd(true);
            GetCompany();
        }
      
        // getAccount();
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

    useEffect(() => {
        if (id) {
            getFollowup();
        }
    }, [updated]);



    useEffect(() => {
        console.log("useeffect flag", flag)
    }, [flag]);




    const getclient = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/client?appname=' + appname + '&clientuserid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    if (response.data.result.length > 0) {
                        const result = response.data.result[0];
                        setEditUser({ ...result});  

                        if (response && response.data && response.data.result[0] && response.data.result[0].created) {
                            var created_date = new Date(response.data.result[0].created);
                            var created_hour = created_date.getHours();
                            var created_min = created_date.getMinutes();
                            var created_sec = created_date.getSeconds();
                            setCreatedOn(created_hour + ':' + created_min + ':' + created_sec)
                        }

                        if (response && response.data && response.data.result[0] && response.data.result[0].approvedOn) {
                            var created_date = new Date(response.data.result[0].approvedOn);
                            var created_hour = created_date.getHours();
                            var created_min = created_date.getMinutes();
                            var created_sec = created_date.getSeconds();
                            setApprovedOn(created_hour + ':' + created_min + ':' + created_sec)
                        }
                        if (response && response.data && response.data.result[0] && response.data.result[0].termsAccptedOn) {
                            var created_date = new Date(response.data.result[0].termsAccptedOn);
                            var created_hour = created_date.getHours();
                            var created_min = created_date.getMinutes();
                            var created_sec = created_date.getSeconds();
                            setTermsAcceptedOn(created_hour + ':' + created_min + ':' + created_sec)
                        }
                        if(response &&
                             response.data &&  
                             response.data.result &&
                             response.data.result[0] && 
                             response.data.result[0].companydetails && 
                             response.data.result[0].companydetails[0] &&
                             response.data.result[0].companydetails[0].accountmanager){
                                setCheckAM(response &&
                                    response.data &&  
                                    response.data.result &&
                                    response.data.result[0] && 
                                    response.data.result[0].companydetails && 
                                    response.data.result[0].companydetails[0] &&
                                    response.data.result[0].companydetails[0].accountmanager)
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
        history.push('/clients')
    }

    const GetCompany = () => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'get',
            url: lambda + '/companylist?appname=' + appname + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    // console.log("response", response.data.result);
                    setCompany(response.data.result.data);

                    //  let arr = []

                    //  response.data.result.data.forEach((item) => {
                    //    arr.push(item.companyname);


                    //  });

                    const arrOfObj = response.data.result.data.map((item) => {
                        return { value: item.companyname, label: item.companyname, id: item.companyid,accountmanager:item.accountmanager };
                    });
                    setCompanyData(arrOfObj);
                }

            });
    }



    const getFollowup = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/followup?appname=' + appname + '&clientid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setFollowupContent(response.data.result.data);
                }

            });
    }




    const GetCountries = async () => {
        try {

            const response = await tmdbApi.getLookUp({
                "type": ["country"],
                 "sortBy": "alpha3",
                "projection":"tiny"
            });


            setCountries(response.result.data);
            // console.log('responseresponseresponse',response.result.data)
            // await axios({
            //     method: 'GET',
            //     url: "https://d4nv8o5tzs3mt.cloudfront.net/",
            // })
            //     .then(function (response2) {
            //         console.log('response2',response2)
            //       // let locData = JSON.stringify(response.data)
            //       let temp = response2.data.headers['cloudfront-viewer-country'][0].value
            //       console.log('temp',temp)
            //       setDefaultCountryCode(temp)
                  
            //       let k = response && response.result && response.result.data && response.result.data.length>0 && response.result.data.filter(eachItem=>eachItem.alpha2.trim() == temp)
               
            //       if (id == undefined) {
            //         setIdc(k[0].alpha3)
            //         let newUser = Object.assign({}, editUser);
            //         setEditUser({ ...newUser, ['idc']: k[0].alpha3 });
            //       }
                
              
        
            //     });
            
        } catch {
            console.log("error");
        }
    };

    // console.log('idc cccc',idc)
    // console.log('idc cccc',id)
    const validateOnchangeEmail = (e) => {
        GetTimeActivity() 
        let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (reg.test(editUser.personalemail) == false) {
            setEmailError("Please Enter Valid Email");
        } else {
            setEmailError("");
        }
    }

    const Checkcompany = (e) => {
        if (editUser.entity === "COMPANY") {
            if (editUser?.company?.companyname === '' || editUser?.company?.companyname === undefined) {
                // setError("Please select Company");
                setActiveMsg("Please select Company")
                setPopup(true)
                // setTimeout(function () { setError("") }, 3000);
            }
        } else {
            if (editUser.accountmanager === '' || editUser.accountmanager === undefined) {
                // setError("Please select Account Manager");
                // setTimeout(function () { setError("") }, 3000);
                setActiveMsg("Please select Account Manager")
                setPopup(true)

            }
        }


    }

    const handleChange = (e) => {

        if (e.target.name === "accountmanager") {
            let accountName = e.target.value.split("/");
            editUser[e.target.name] = accountName[0];
            editUser["accountManagerId"] = accountName[1];
            setEditUser({ ...editUser, [e.target.name]: accountName[0], accountManagerId: accountName[1] });
        } else if (e.target.name === "entity") {

            setEditUser({ ...editUser, [e.target.name]: e.target.value });
            if (e.target.value === "COMPANY") {
                console.log("editUser", editUser.companyname)
                setEditUser({ ...editUser, companyname: [''], [e.target.name]: e.target.value })

            }

        }
        else if (e.target.name === "status") {
            if (add === false) {
                setCheckStatus(true)
            }
            setEditUser({ ...editUser, [e.target.name]: e.target.value });
        }else if(e.target.name === "followup"){
            setFollowupText(e.target.value)

        }
        else {
            // if (e.target.value === "ACTIVE") {
            //     Checkcompany();
            // }

            setEditUser({ ...editUser, [e.target.name]: e.target.value });
        }



    }

    // console.log("editUser-->", editUser);


    const handleUpdate = (e) => {
        GetTimeActivity() 

        if (editUser.entity === "INDIVIDUAL") {
            let payload = {
                "name": editUser.name?.trim() || "",
                "idc": editUser.idc === undefined ? k[0].alpha3:editUser.idc,
                "personalphone": editUser.personalphone || "",
                "personalemail": editUser.personalemail,
                "type": editUser.type || "",
                "entity": editUser.entity || "",
                "companyname": Array.isArray(editUser.companyname) ? editUser.companyname : [editUser.companyname],
                "companyid": editUser.companyid,
                "status": editUser.status === "APPROVED" ? "ACTIVE" : editUser.status,
            }
            if (checkStatus === false) {
                delete payload["status"];
            }

            const token = localStorage.getItem("token")
            const userid = localStorage.getItem("userId")

            axios.post(lambda + '/client?appname=' + appname + '&userId=' + id + "&token=" + token , payload,
            )
                .then(function (response) {
                    console.log("ress", response);
                    if (response.data.statusCode === 200) {
                        if (response.data.result == "Invalid token or Expired") {
                            setShowSessionPopupup(true)
                        } else {
                            getclient()
                            setUpdated(true);
                            setIsLoading(false);
                            setFollowupText("");
                        }

                    }
                }) .catch((err) => {
                    setIsLoading(false);
                    console.log('errr',err)
                })
        } else {
            let payload = {
                "name": editUser.name?.trim() || "",
                "idc": editUser.idc === undefined ? k[0].alpha3:editUser.idc,
                "personalphone": editUser.personalphone || "",
                "personalemail": editUser.personalemail,
                "type": editUser.type || "",
                "entity": editUser.entity || "",
                "companyname": editUser.companyname,
                "companyid": editUser.companyid,
                "accountmanager": companyDeatilsList.accountmanager || "",
                "accountManagerId": companyDeatilsList.accountManagerId || "",
                "status": editUser.status === "APPROVED" ? "ACTIVE" : editUser.status
            };

            if (checkStatus === false) {
                delete payload["status"];
            }

            console.log("payload", payload);
            const token = localStorage.getItem("token")
            const userid = localStorage.getItem("userid")

            axios.post(lambda + '/client?appname=' + appname + '&userId=' + id + "&token=" + token ,

                payload,


            )
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        if (response.data.result == "Invalid token or Expired") {
                            setShowSessionPopupup(true)
                        } else {
                            getclient()
                            setUpdated(true);
                            setIsLoading(false);
                            setFollowupText("");
                        }
                    }
                }) .catch((err) => {
                    setIsLoading(false);
                    console.log('errr',err)
                });

        }
    }



    const Validate = () => {
        GetTimeActivity() 
        let formIsValid = true;
        if (editUser.name === "" || editUser.name === undefined) {
            setNameError("Please Enter Name");
            setTimeout(function () { setNameError("") }, 3000);
            formIsValid = false;
        }
        if (add === true) {
            if (editUser.personalemail === "" || !editUser.personalemail) {
                setEmailError("Please Enter Email");
                setTimeout(function () { setEmailError("") }, 3000);
                formIsValid = false;
            }
            const regEx = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}(.[a-zA-Z{2,8}])?/g;
            if (regEx.test(editUser?.personalemail)) {
                setEmailError("")
    
            } else if (!regEx.test(editUser.personalemail) && editUser.personalemail !== "") {
                
                setEmailError("Enter Valid Email");
                setTimeout(function () { setEmailError("") }, 3000);
                formIsValid = false;
           
            }
        }
        if (editUser.type === "" || editUser.type === undefined) {
            setTypeError("Please Select Type");
            setTimeout(function () { setTypeError("") }, 3000);
            formIsValid = false;
        }
      if(add){
        if (!editUser.personalphone && editUser.idc) {
           
            setPhoneError("Enter phone number");
            setTimeout(function () { setPhoneError("") }, 3000);
            formIsValid = false;
          }
      
        
          if (editUser.personalphone && !editUser.idc) {
            setIdcError("Select country code");
            setTimeout(function () { setIdcError("") }, 3000);
            formIsValid = false;
          }

      }

        // if (add === true) {
            if (editUser.entity === "" || editUser.entity === undefined) {
                setEntityError("Please Select Entity");
                setTimeout(function () { setEntityError("") }, 3000);
                formIsValid = false;
            }
        // }

        // if (editUser.entity === "INDIVIDUAL") {
        //     if (editUser.contenttype === "" || editUser.contenttype === undefined) {
        //         setContentError("Please Select Content Type");
        //         setTimeout(function () { setContentError("") }, 3000);
        //         formIsValid = false;
        //     }
        // }
        if(editUser.companyname.toString() === "" || editUser.companyname.length <=0 || editUser.companyname === undefined ){
            setCompanyNameError("Please select Company name");
            setTimeout(function () { setCompanyNameError("") }, 3000);
            formIsValid = false;
        }
        if (editUser.entity === "COMPANY") {

            {
                // console.log('company check==>',editUser.companyname)
                // console.log('company check string==>',editUser.companyname.toString())
                let companyCheck = Object.keys(companyData).filter((key) =>
                    (companyData[key].value === editUser.companyname.toString())

                )
                
                // console.log('company check 333==>',companyCheck)
                // console.log('edituser==>',editUser)
                // console.log('companyData==>',companyData)

                if (companyCheck.length <= 0 && editUser?.companyid === undefined ) {
                    setCompanyNameError("Please select Company name");
                    setTimeout(function () { setCompanyNameError("") }, 3000);
                    formIsValid = false;
                }

            }


        }

        if (editUser.status === "APPROVED") {
            if (editUser.entity === "COMPANY") {
                console.log('editUser.companyname',editUser.companyname)
                console.log('companyData.companyData',companyData)
                {
                    let companyCheck = Object.keys(companyData).filter((key) =>
                        (companyData[key].value.toString() === editUser.companyname.toString())

                    )

                    if (companyCheck.length <= 0) {
                        setCompanyNameError("Please select Company name");
                        setTimeout(function () { setCompanyNameError("") }, 3000);
                        formIsValid = false;
                    }

                }


            }
            if(checkAM === undefined || checkAM === ""){
                setErrAccManage(true)
                formIsValid = false;
            }
        }
       


        // if (editUser.status === "APPROVED") {
        //     if (editUser.entity === "INDIVIDUAL") {
        //         {

        //             console.log("before");
        //             fetchData();
        //             console.log("fladdddd", flag);

        //         }

        //     }

        // }

        return formIsValid;


    }




    const handleFollowup = async () => {
        GetTimeActivity() 
        if (followuptext) {
            try {
                const response = await tmdbApi.FollowUp({
                    "followup": followuptext,
                    "clientid": id,

                });


            } catch {
                console.log("error");
            }
        }
    };

    const handleSubmit = (e) => {
        GetTimeActivity() 
        const isValid = Validate();

        if (isValid && add) {
            setIsLoading(true);
            SaveClient();
        } else if (isValid) {
            setIsLoading(true);
            handleUpdate();
            handleFollowup();
        }

    }
// console.log('add--->',add)
    const SaveClient = async () => {
        GetTimeActivity() 
       
            let type = localStorage.getItem("ClientType")
            if (editUser.entity === "INDIVIDUAL") {

                try {
                    const response = await tmdbApi.SaveClient({
                        "name": editUser.name?.trim() || "",
                        "personalemail": editUser.personalemail?.trim() || "",
                        "idc": editUser.idc,
                        "personalphone": editUser.personalphone || "",
                        "type": editUser.type || "",
                        "entity": editUser.entity || "",
                        "companyid": editUser.companyid || "",
                        "companyname": editUser.companyname ? [editUser.companyname] : [editUser.name],
                        "status": type === "SUPER ADMIN" || type === "ADMIN" ? "ACTIVE" : "PENDING APPROVAL",
                        "createdBy": { userid: userData.userid, username: userData.name }
                    });

                    if (response.result === "Client already exists") {
                        setIsLoading(false);
                        setActiveMsg("Client Already Exists")
                        setPopup(true)


                    }
                    else if (response.result === "PENDING VERIFICATION") {
                        setIsLoading(false);
                        setActiveMsg("Pending Verification")
                        setPopup(true)
                    }
                    else if (response.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    }
                    else if (response.result !== "PENDING VERIFICATION" && response.result !== "Client already exists") {
                        id = response.result;
                         history.push("/editclient/" + id);
                         getclient();
                        setAdd(false);
                        
                        setMessage(true);
                        setIsLoading(false);
                    }


                } catch {
                    console.log("error");
                    setIsLoading(false);
                }
            } else {
                try {
                    const response = await tmdbApi.SaveClient({
                        "name": editUser.name?.trim() || "",
                        "personalemail": editUser.personalemail?.trim() || "",
                        "idc": editUser.idc,
                        "personalphone": editUser.personalphone || "",
                        "type": editUser.type || "",
                        "entity": editUser.entity || "",
                        "companyid": editUser.companyid || "",
                        "accountmanager": companyDeatilsList.accountmanager || "",
                        "accountManagerId": companyDeatilsList.accountManagerId || "",
                        "companyname": [editUser.companyname],
                        "status": type === "SUPER ADMIN" || type === "ADMIN" ? "ACTIVE" : "PENDING APPROVAL",
                        createdBy: { userid: userData.userid, username: userData.name }
                    });

                    if (response.result === "Client already exists") {
                        setIsLoading(false);
                        setActiveMsg("Client Already Exists")
                        setPopup(true)
                    }
                    else if (response.result === "PENDING VERIFICATION") {
                        setActiveMsg("Pending Verification")
                        setPopup(true)
                        setIsLoading(false);

                    }
                    else if (response.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        if (response.result != "") {
                            id = response.result;
                             history.push("/editclient/" + id);
                             getclient()
                            setMessage(true);
                            setIsLoading(false);
                            setAdd(false)


                        }
                    }


                } catch {
                    console.log("error");
                    setIsLoading(false);
                }

            }
        
    };


    const handleBack = () => {
        GetTimeActivity() 
        if (add === false) {
            history.push({
                pathname: "/clients",
                state: { search: true }
            });
        } else {
            history.push("/clients")
        }
    }

    function onConfirm() {
        GetTimeActivity() 
        setSuccess(false);

    };
    function onConfirm2() {
        GetTimeActivity() 
        setMessage(false);
      //  history.push("/clients")
    };
    function onConfirm1() {
        GetTimeActivity() 
        setUpdated(false);
    };

    function onConfirm3() {
        GetTimeActivity() 
        setTermsSuccess(false);

    };
    const returnArray = (arr) => {
        let arr2 = []
        arr2.push(arr.value)
        return arr2
    }
    const returnId = (arr) => {
        let arr2 = []
        arr2.push(arr.id)
        return arr2
    }

    const handleChangeMultiSelect = (selected) => {
        GetTimeActivity() 
        // setEditUser({...editUser , companyname:selected.value, companyid:selected.id})
     
        setCheckAM(selected?.accountmanager ? selected?.accountmanager:"")
        let selectedArray = returnArray(selected);
        let selectedId = returnId(selected).toString();
        // console.log("selected--->", selected)
        selectedCom["companyname"] = selectedArray
        selectedCom["companyid"] = selectedId
        setSelectedCom({ ...selectedCom });
        setEditUser({ ...editUser, companyname: selectedArray, companyid: [selectedId] })

    };
// console.log('checkAm',checkAM)
    // console.log("editUser",editUser.companyid)

    function onCancel() {
        GetTimeActivity() 
        setPopup(false);
    }

    const handleTermsEmail = () => {
        GetTimeActivity() 
        let payload = {
            "name": editUser.name,
            "personalemail": editUser.personalemail,
        }
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")

        axios.put(lambda + '/termsEmail?appname=' + appname + '&clientid=' + editUser.clientid + "&token=" + token + "&userid=" + userid,

            payload,


        )
            .then(function (response) {
                console.log("res", response)

                if (response.data.statusCode === 200) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        setTermsSuccess(true)

                    }
                }
            });
    }


// console.log("editUser",editUser);

    let k = countries && countries.length>0 && countries.filter(eachItem=>eachItem.alpha2===defaultCountryCode)
// console.log('kkkkkkkkkk',k)

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
                    title={"Clients Not Found"}
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
                                                <h4 className="mb-2 card-title">{add === true ? "ADD" : "EDIT"} CLIENT</h4>
                                                <p className="menu-path"><span>Client Management</span> / <b>{add === true ? "Add" : "Edit"} Client</b></p>
                                            </div>
                                            <div>{add === false && editUser.status === "PENDING TERMS" ? <a className="btn btn-primary" onClick={handleTermsEmail} style={{ marginRight: "10px" }}>Send Terms Email</a> : null}</div>
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
                                                <>
                                                    {/* <li className="nav-item" role="presentation">
                                                 <a className="nav-link" data-bs-toggle="tab" href="#profile1" role="tab" aria-selected="false" tabIndex="-1">
                                                     <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                                                     <span className="d-none d-sm-block">DOCUMENTS</span>
                                                 </a>
                                             </li> */}
                                                    <li className="nav-item" role="presentation">
                                                        <a className="nav-link" data-bs-toggle="tab" href="#messages1" role="tab" aria-selected="false" tabIndex="-1">
                                                            <span className="d-block d-sm-none"><i className="far fa-envelope"></i></span>
                                                            <span className="d-none d-sm-block">FOLLOW UP</span>
                                                        </a>
                                                    </li></>
                                                : ""}


                                        </ul>
                                        <div className="tab-content p-3 text-muted">
                                            <div className="tab-pane active show add-client-details" id="home1" role="tabpanel">
                                            {Object.keys(editUser).length > 0 && countries.length >0 ? 
                                                <>
                                                <div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i> basic details</h5>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="col-form-label">NAME<span className="required">*</span></label>
                                                            <input className="form-control" placeholder="Enter Name" type="text" name="name" value={editUser.name} onChange={(e) => handleChange(e)} id="example-text-input" />
                                                            {nameError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{nameError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="col-form-label">EMAIL<span className="required">*</span></label>
                                                            {add === false ?
                                                                <input className="form-control contact-number" type="email" value={editUser.personalemail} id="example-email-input" disabled name="personalemail" />

                                                                :
                                                                <input className="form-control contact-number" type="email" value={editUser.personalemail} name="personalemail" placeholder="Please Enter Email" onChange={(e) => handleChange(e)} id="example-email-input" onBlur={e => validateOnchangeEmail(e)} />
                                                            }
                                                            {emailError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{emailError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="col-form-label">contact number</label>
                                                            <div className="country-code">
                                                                <select name="idc" value={editUser.idc} className="colorselect capitalize" onChange={(e) => handleChange(e)}>
                                                                    <option value="">Select</option>
                                                                    {/* <option value={k && k[0] && k[0].alpha3}>{k && k[0] && k[0].alpha3}{k && k[0] && k[0].countrycode}</option> */}
                                                                    {countries && countries.length > 0 && countries.map((task, i) => {
                                                                        return (
                                                                            <><option key={i} value={task.alpha3}>{task.alpha3}{task.countrycode}</option></>
                                                                        )
                                                                    }
                                                                    )}
                                                                </select>

                                                                <input className="form-control contact-number" type="tel" name="personalphone" value={editUser.personalphone} placeholder="Enter Phone Number" onChange={(e) => handleChange(e)} maxLength="10" id="example-tel-input" />
                                                                <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{IdcError}</span>
                                                            <span className="errormsg" style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                            }}>{phoneError}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Type<span className="required">*</span></label>

                                                            <select className="form-select" name="type" onChange={(e) => handleChange(e)} value={editUser.type}>
                                                                <option value="">Select Type</option>
                                                                <option>BUYER</option>
                                                                <option>SELLER</option>
                                                                <option>BOTH</option>
                                                            </select>
                                                            {typeError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{typeError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="col-form-label">entity<span className="required">*</span></label>

                                                            <select className="form-select" name="entity" onChange={(e) => handleChange(e)} value={editUser.entity}>
                                                                <option value="">Select Entity</option>
                                                                <option>INDIVIDUAL</option>
                                                                <option>COMPANY</option>

                                                            </select>
                                                            {entityError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{entityError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="input-field">
                                                            <label className="col-form-label">Company Name<span className="required">*</span></label>

                                                            {editUser.entity === "INDIVIDUAL" || editUser.entity === undefined ?
                                                                <input className="form-control" name="companyname" placeholder="Enter Company Name" type="text" value={editUser && editUser.companyname} onChange={(e) => handleChange(e)} id="example-text-input" />
                                                                :

                                                                <Select isMulti={false}
                                                                    classNamePrefix="select category"
                                                                    placeholder='Company Name'
                                                                    name="companyobj"
                                                                    onChange={(e) => handleChangeMultiSelect(e)}
                                                                    options={companyData}
                                                                    value={editUser && editUser.companyname && editUser.companyname.length > 0 ? editUser?.companyname?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}
                                                                />
                                                            }
                                                            {companynameError != "" ?
                                                                <span className="errormsg" style={{
                                                                    fontWeight: 'bold',
                                                                    color: 'red',
                                                                }}>{companynameError}</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    {/* {editUser.entity === "INDIVIDUAL" &&
                                                        <div className="col-md-6">
                                                            <div className="input-field">
                                                                <label className="col-form-label">Content Type<span className="required">*</span></label>
                                                                <select className="form-select" name="contenttype" onChange={(e) => handleChange(e)} value={editUser.contenttype}>
                                                                    <option value="">Select Content Type</option>
                                                                    <option>OWNER</option>
                                                                    <option>DISTRIBUTOR</option>
                                                                    <option>OWNER & DISTRIBUTOR</option>

                                                                </select>
                                                                {contentError != "" ?
                                                                    <span className="errormsg" style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                    }}>{contentError}</span> : ""
                                                                }
                                                            </div>
                                                        </div>
                                                    } */}
                                                    {add === false && editUser && editUser.companydetails && editUser.companydetails[0] && editUser.companydetails[0].accountmanager &&
                                                        <div className="col-md-6">
                                                            <div className="input-field">
                                                                <label className="col-form-label">Account Manager</label>
                                                                <input className="form-control" placeholder="Enter Name" type="text" name="name" value={checkAM 
                                                                    //  editUser && editUser.companydetails && editUser.companydetails[0] && editUser.companydetails[0].accountmanager
                                                                    } onChange={(e) => handleChange(e)} id="example-text-input" disabled />

                                                            </div>
                                                        </div>
                                                    }

                                                </div>
                                                {add === false && editUser?.created &&
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
                                                        {editUser.termsAccptedOn &&
                                                            <div className="col-md-4">
                                                                <label className="col-form-label">Terms Accepted On</label>
                                                                <input className="form-control" placeholder="Enter Name" type="text" value={new Date(editUser.termsAccptedOn).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                    hour: 'numeric',
                                                                    minute: 'numeric',
                                                                })} id="example-text-input" disabled />
                                                            </div>
                                                        }
                                                        {editUser.approvedOn &&
                                                            <div className="col-md-4">
                                                                <label className="col-form-label">Approved On</label>
                                                                <input className="form-control" placeholder="Enter Name" type="text" value={new Date(editUser.approvedOn).toLocaleDateString('en-IN', {
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
                                                            <textarea id="verticalnav-address-input" name="followup" onChange={(e) => handleChange(e)} value={followuptext} className="form-control" rows="2" style={{ marginBottom: "10px" }}></textarea>
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
                                                        {add === false ?
                                                            <div className="input-field d-flex align-items-center">
                                                                <label className="col-form-label">Status</label>

                                                                <>
                                                                    {editUser.status === "ACTIVE" || editUser.status === "INACTIVE" ?
                                                                        <select className="form-select" name="status" value={editUser.status} onChange={(e) => handleChange(e)} >

                                                                            <option value="INACTIVE">Inactive</option>
                                                                            <option value="ACTIVE">Active</option>

                                                                        </select> :
                                                                        <select className="form-select" name="status" value={editUser.status} onChange={(e) => handleChange(e)}  >

                                                                            <option value="PENDING APPROVAL">Pending Approval</option>
                                                                            <option value="PENDING TERMS">Pending Terms</option>
                                                                            <option value="APPROVED">Approved</option>
                                                                            <option value="REJECT">Reject</option>

                                                                        </select>
                                                                    }
                                                                </>


                                                            </div>
                                                            : null}

                                                    </div>



                                                    {add === false ?
                                                        <div className="col-md-9 justify-content-end d-flex align-items-center">


                                                            <a onClick={handleSubmit} className="btn btn-primary">{isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}UPDATE</a>


                                                        </div>

                                                        : <div className="col-md-9 justify-content-end d-flex align-items-center">


                                                            <a onClick={handleSubmit} className="btn btn-primary">
                                                                {isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}SAVE</a>


                                                        </div>}

                                                </div>
                                                </>
                                                :  <div className="row"><Loader /></div>}
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

                                                        </div>
                                                        : <div div className="followups"><div className="no-documents">
                                                            <span className="material-icons-outlined">comment</span>
                                                            <p>No follow-ups were found</p>
                                                        </div></div>}
                                                </div>
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
                            title={"something went wrong"}
                            onConfirm={e => onConfirm()}
                        >
                        </SweetAlert>
                        <SweetAlert show={errAccManage}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Before activating this client, assign an account manager first"}
                            onConfirm={e => setErrAccManage(false)}
                        >
                        </SweetAlert>
                        <SweetAlert show={updated}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Client Details Updated"}
                            onConfirm={e => onConfirm1()}
                        >
                        </SweetAlert>
                        <SweetAlert show={message}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Client Details Saved"}
                            onConfirm={e => onConfirm2()}
                        >
                        </SweetAlert>
                        <SweetAlert show={termssuccess}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Terms Email sent"}
                            onConfirm={e => onConfirm3()}
                        >
                        </SweetAlert>
                        <SweetAlert show={popup}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={activeMsg}
                            onConfirm={e => onCancel()}
                        >
                        </SweetAlert>

                        <Footer />
                        {/* <Modal className="access-denied" show={popup}>

                            <div className="modal-body enquiry-form">
                                <div className="container">
                                    <button className="close-btn" onClick={e => onCancel()}><span className="material-icons">close</span></button>

                                    <span className="material-icons access-denied-icon"></span>
                                    <h3></h3>
                                    <p></p>
                                    <h5>Please provide Necessary Details in Company Level to Active Client</h5>
                                </div>
                            </div>

                        </Modal> */}
                    </div>
                }



            </div>
        </>
    );
};

export default EditClient;
