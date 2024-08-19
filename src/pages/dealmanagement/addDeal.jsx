/***
**Module Name: client
 **File Name :  client.js
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
 **Description : contains clients table details.
 ***/
import React, { useState, useEffect, useContext } from "react";


import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import tmdbApi from "../../api/tmdbApi";
import { useHistory, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SessionPopup from "../SessionPopup"
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from 'react-select';
import moment from "moment";
import Loader from "../../components/loader";
import TableLoader from "../../components/tableLoader";
import { contentContext } from "../../context/contentContext";
let { lambda, appname } = window.app;


const AddDeals = () => {
    const history = useHistory();
    let { id } = useParams();
    const [image, setImg] = useState('');
    const [allDealsData, setAllDealsData] = useState("");
    const [companiesData, setCompaniesData] = useState([]);
    const [followUp, setFollowUp] = useState("");
    const [success, setSuccess] = useState(false);
    const [followUpData, setFollowUpData] = useState({});
    const [errors, setErrors] = useState({});
    const [buyerdata, setBuyerData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [selecteddata, setSelectedData] = useState({});
    const [categoryName, setCategoryName] = useState([]);
    const [data, setData] = useState([]);
    const [lookup, setLookUp] = useState({});
    const [languagesData, setlanguagesData] = useState({});
    const [countryData, setCountryData] = useState({});
    const [videoformatData, setVideoformatData] = useState({});
    const [rightsData, setRightsData] = useState({});
    const [showSessionPopupup, setShowSessionPopupup] = useState(false)
    const [loaderEnable, setLoaderEnable] = useState(false);
    const [saveLoaderEnable, setSaveLoaderEnable] = useState(false);
    const [filter, setFilter] = useState([]);

    const [searchResult, setSearchResult] = useState({});

    const [dealContent, setDealContent] = useState({});
    const [contentData, setContentData] = useState([]);
    const [datasuccess, setDataSuccess] = useState(false);

    const [titleerror, setTitleError] = useState("");
    const [adderror, setAddError] = useState("");
    const [categoryerror, setCategoryError] = useState("");
    const [titleCount, setTitleCount] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [duplicate, setDuplicate] = useState("");
    const [duplicateFlag, setDuplicateFlag] = useState(false);
    //const [contentData, setContentData] = useState([]);
    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, userData, setActiveMenuId ,GetTimeActivity} = useContext(contentContext);

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
        setRoute("deal")
        setActiveMenuId(200003)
        getBuyerList();
        Categories();
        GetLookUp();
        Companies();
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
    // useEffect(() => {

    //     getOptionData();
    // }, [allDealsData.companyid]);

    useEffect(() => {
        if (allDealsData.rightsAvailableFromDate && allDealsData.rightavailableto) {

            if (allDealsData.rightavailableto < allDealsData.rightsAvailableFromDate) {
                setDataSuccess(true)
                // error["date"] ='To date cannot be earlier than From date';
                // formIsValid = false;
            }


        }
    }, [allDealsData.rightsAvailableFromDate, allDealsData.rightavailableto]);

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

    const Categories = async () => {
        GetTimeActivity() 
        try {

            const response = await tmdbApi.getCategory({});
            if (response.statusCode === 200) {
                if (response.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setData(response.result);
                    let arr = []
                    response.result.data.forEach((item) => {
                        arr.push(item.name);
                    });

                    const arrOfObj = arr.map((item) => {
                        return { value: item, label: item };
                    });
                    setCategoryName(arrOfObj);
                }
            }
        } catch {
            console.log("error");
        }
    };

    const getBuyerList = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")
        axios({
            method: 'GET',
            url: lambda + '/clientType?appname=' + appname + "&token=" + token + '&userId=' + userid,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setBuyerData(response.data.result.data);
                }

            });
    }

    const handleChange = (e) => {
        GetTimeActivity() 
        if (e.target.name === "comments") {
            setFilter({ ...filter, comments: e.target.value })
            setAllDealsData({ ...allDealsData, [e.target.name]: e.target.value });
        } else {

            setAllDealsData({ ...allDealsData, [e.target.name]: e.target.value });
        }
    }

    const handleBack = () => {
        GetTimeActivity() 
        history.push("/dealmanagement");
    }

    function onConfirm() {
        GetTimeActivity() 
        setSuccess(false);
        history.push("/dealmanagement");

    };


    function onConfirm1() {
        GetTimeActivity() 
        setDataSuccess(false);
        setAllDealsData({ ...allDealsData, rightavailableto: "" })

    };

    const returnArray = (arr) => {
        let arr2 = []
        //  console.log(arr);
        arr.map((eachItem) => {
            arr2.push(eachItem.value)
        })
        // console.log(arr2)
        return arr2
    }
    const returnArray1 = (arr) => {
        let arr2 = []
        //  console.log(arr);
        arr.map((eachItem) => {
            arr2.push(eachItem.value.toString())
        })
        // console.log(arr2)
        console.log("arr2", arr2);
        return arr2
    }
    const getOptionData = (selectedArray, getcompanyid) => {
        GetTimeActivity() 
        setLoaderEnable(true);
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")

        
        const linkUrl = `${lambda}/content?appname=${appname}&token=${token}&userid=${userid}&sortBy=title`;


      
        const categoryobj = {
            category: selectedArray,
            status: ["ACTIVE", "OFFLINE"]
          };
          
          if (getcompanyid && getcompanyid.length > 0) {
            categoryobj.companyid = getcompanyid;
          }
          
        axios({
            method: 'POST',
            url: linkUrl,
            data: categoryobj,
        })
            .then(function (response) {
                console.log("res1", response)
                setSearchResult(response.data.result.data)
                setLoaderEnable(false);

            });
    }

    const Companies = async (e) => {
        GetTimeActivity() 

        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")

        //  setcurrentPage(1);
        let obj = { sortby: 'companyname' }
        axios({
            method: 'POST',
            url: lambda + '/companies?appname=' + appname + "&token=" + token + "&userid=" + userid,
            data: obj
        })
            .then(function (response) {
                console.log("response", response.data.result.data);
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setCompaniesData(response.data.result.data);
                }
            }).catch((error) => {
                console.log(error);
            });
    }
    const handleCheckTitle = (selectedData) => {
        GetTimeActivity() 
        console.log("selected------------>", selectedData, contentData);

        selectedData?.map((eachItem) => {
            console.log("each",eachItem)
            contentData && contentData?.map((each) => {
                if(each.title === eachItem.value){
                    console.log("eachhhhhhhhh",eachItem , each);
                    setDuplicateFlag(true)
                }

            })
            // const filteredArray = contentData && contentData.length > 0 && contentData.filter((each) => each.title === eachItem.value);
            // setDuplicate(filteredArray)
           // console.log("filteredArray",filteredArray)
        })
    }
    const handleChangeMultiSelect = (selected, key) => {
        GetTimeActivity() 
        let newContent = Object.assign({}, allDealsData);

        if (key == 'buyer') {
            console.log('selected-->',selected)
            setErrors({})
            setSelectedData(selected);
            setAllDealsData({ ...newContent, name: [selected.value], companyid: selected.companyid, companyname: [selected.companyname], email: selected.email, type: selected.type, clientid: selected.clientid ,accountmanager: selected.accountmanager});
        }
        else if (key == 'title') {
            setTitleError("")
            setSelectedData(selected);
            setAllDealsData({ ...newContent, [key]: selected });
            setFilter({ ...filter, contenttitle: selected.value })
            handleCheckTitle(selected);
        } else if (key == 'companyid') {
            let selectedArray = returnArray1(selected);
            getOptionData(allDealsData.category, selectedArray);
            setFilter({ ...filter, [key]: selectedArray });

        } else {

            let selectedArray = returnArray(selected);
            setAllDealsData({ ...newContent, [key]: selectedArray });

            if (key === "category") {
                
                console.log("came")
                setFilter({ ...filter, category: selectedArray })
                getOptionData(selectedArray, filter.companyid);

            }

        }
    }

    const handleAdd = () => {
        GetTimeActivity() 
        setAddError("")
        if (allDealsData.category === undefined || allDealsData.category === "" || allDealsData.category.length <= 0) {
            setCategoryError("Please Select Category")
            setAllDealsData({ ...allDealsData, title: "" })
            setFilter({ ...filter, contenttitle: [] })
        }
        if (allDealsData.title === undefined || allDealsData.title === "") {
            setTitleError("Please Select Titles")
        }

        console.log("add", allDealsData)
        if (allDealsData.title !== undefined && allDealsData.category != undefined && allDealsData.category != "") {
            let obj = {}
            let arr = [...contentData]
            if (duplicateFlag === false) {
                allDealsData.title?.map((eachItem) => {

                    console.log("eachItem", eachItem, contentData)
                    obj = {
                        category: eachItem.category,
                        contentid: eachItem.contentid,
                        title: eachItem.value,
                        portraitimage: eachItem.portraitimage,
                        landscapeimage: eachItem.landscapeimage,
                        comments: allDealsData.comments,
                        clientid: allDealsData.clientid
                    }
                    arr.push(obj);
                })


                //arr.push(obj);
                if (allDealsData.category !== "") {
                    setContentData(arr);
                }
                console.log("contentData", contentData)
                setAllDealsData({ ...allDealsData, comments: "", contentid: "", portraitimage: "", title: "" })
                setFilter({ ...filter, contenttitle: [], comments: "" })
                // setSearchResult({})
                setTitleError("")
            }else{
                setTitleError("Title(s) already exists. Please select unique title(s).")
                setDuplicateFlag(false)
            }
        }

    }




    const handleDeleteDeal = (e, id) => {
        GetTimeActivity() 
        const filteredArray = contentData.filter((eachItem) => eachItem.contentid != id);
        setContentData(filteredArray);
    }

    const GetLookUp = async (e) => {
        GetTimeActivity() 
        try {
            let arrayType = ["country", "videoformat", "language", "territories"];

            const response = await tmdbApi.getLookUp({
                // type: arrayType

            });
            console.log(response);
            if (response.statusCode == 200) {
                let arrayType = ["country", "videoformat", "language", "territories", "rights"];
                let lookupsData = response.result.data || []
                arrayType.map((eachItem) => {
                    let arr1 = []
                    lookupsData.map((item1) => {
                        if (item1.type == eachItem) {
                            arr1.push(item1.name)
                        }
                    });
                    lookup[eachItem] = arr1
                    setLookUp({ ...lookup });
                })
                // console.log('loookup', lookup)
                const countryObj = prepareObject(lookup.country)
                const territoriesObj = prepareObject(lookup.territories)
                // console.log("countryObj", countryObj)
                // console.log("territoriesObjt", territoriesObj)
                setCountryData([...countryObj, ...territoriesObj])
                const languagesObj = prepareObject(lookup.language)
                setlanguagesData(languagesObj)
                const videoformatObj = prepareObject(lookup.videoformat)
                setVideoformatData(videoformatObj)
                const rightsObj = prepareObject(lookup.rights)
                setRightsData(rightsObj)

            }

        } catch {
            console.log("error");
        }
    }
    const prepareObject = (item) => {
        const resultArr = item.map((eachItem) => { return { value: eachItem, label: eachItem }; })
        return resultArr
    }

    const validate = async () => {
        GetTimeActivity() 
        let formIsValid = true;
        let error = { ...errors };
        let mandatoryFileds = [{ name: 'Buyer', key: 'name' },

        ];

        if (mandatoryFileds) {
            mandatoryFileds.forEach(function (item) {

                if (
                    (allDealsData[item.key] == "" ||
                        allDealsData[item.key] == undefined ||
                        allDealsData[item.key] == "undefined")
                ) {
                    error[item.key] = item.name + " is required";
                    formIsValid = false;
                }
            });

        }
        if(allDealsData?.accountmanager === undefined || allDealsData?.accountmanager === ""){
            error.accountmanger = "For the selected buyer, the assigned company doesn't have an account manager.";
            formIsValid = false;
            
        }else{
            delete error?.accountmanager
        }

        if (contentData.length <= 0) {
            if (allDealsData.category === undefined || allDealsData.category === "") {
                setCategoryError("Please add category");
            }
            setTitleError("Please add titles ");
            setAddError("Please add titles ");
            formIsValid = false;
        }
        console.log("errors", error);
        setErrors(error);
        return formIsValid;
    }

    const handleSave = () => {
        GetTimeActivity() 
        const isValid = validate();
        isValid.then(result => {
            if (result === true) {
                handleAddDeal()
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const handleRemoveError = async () => {
        GetTimeActivity() 
        setTitleError("")
    }

    const handleCatRemoveError = async () => {
        GetTimeActivity() 
        setCategoryError("")
    }

    const handleAddDeal = async () => {
        GetTimeActivity() 
        // let obj = {

        // }
        setSaveLoaderEnable(true);
        setButtonDisabled(true);
        try {
            const response = await tmdbApi.AddDeal({
                content: contentData,
                clientid: allDealsData.clientid,
                clientname: allDealsData.name.toString(),
                clienttype: allDealsData.type,
                companyid: allDealsData.companyid,
                queries: allDealsData.queries ? allDealsData.queries?.trim() : "",
                request: allDealsData.request ? allDealsData.request?.trim() : "",
                rightsAvailable: allDealsData.rightsavaliable ? allDealsData.rightsavaliable : "",
                requiredtodate: allDealsData.rightavailableto ? allDealsData.rightavailableto : "",
                requiredfromdate: allDealsData.rightsAvailableFromDate ? allDealsData.rightsAvailableFromDate : "",
                exclusive: allDealsData.exclusivity ? allDealsData.exclusivity : "",
                regionsrequired: allDealsData.regions ? allDealsData.regions : "",
                dubbinglanguagesrequired: allDealsData.dubbinglanguages ? allDealsData.dubbinglanguages : "",
                videoformatsrequired: allDealsData.videoformat ? allDealsData.videoformat : "",
                createdBy: { userid: userData.userid, username: userData.name }
            });
            console.log(response);
            if (response.statusCode == 200) {
                if (response.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setSuccess(true);
                    setAllDealsData({})
                    setContentData({})
                    setAllDealsData({ ...allDealsData, name: "", rightsavaliable: "", rightavailableto: "", rightsAvailableFromDate: "", exclusivity: "", request: "", queries: "", dubbinglanguages: "", videoformat: "", regions: "", category: "", clientid: "", type: "", title: "", email: "", companyname: "", companyid: "", comments: "" })
                    setSelectedData({ ...selecteddata, companyname: "" })
                    setErrors({})
                    setSaveLoaderEnable(false);
                }
            }

        } catch {
            console.log("error");
        }



    };

   
    return (
        <>
            {showSessionPopupup && <SessionPopup />}

            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                {isLoading ?
                    <Loader />
                    :

                    <div className="main-content user-management add-client view-deals create-deals">

                        <div className="page-content ">
                            <div className="container-fluid">



                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">CREATE DEALS</h4>
                                                <p className="menu-path">Deal Management / <b>Create Deals</b></p>
                                            </div>
                                            <div>
                                                <a onClick={handleBack} className="btn btn-primary">back</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="create-user-block">

                                    <div className="form-block">
                                        {loaderEnable && <TableLoader />}

                                        <div className="row">
                                            <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i> Buyer details</h5>
                                            <div className="col-md-4">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">Select Buyer</label>

                                                    <Select isMulti={false}
                                                        placeholder='Select buyer'
                                                        onChange={(e) => handleChangeMultiSelect(e, 'buyer')}
                                                        options={buyerdata && buyerdata.length > 0 ? buyerdata.map((eachItem) => { return { value: eachItem.name, label: eachItem.name, type: eachItem.type, email: eachItem.personalemail, clientid: eachItem.clientid, companyname: eachItem.companyname, companyid: eachItem.companyid, accountmanager :eachItem?.companyData && eachItem?.companyData[0] && eachItem?.companyData[0]?.accountmanager ? eachItem?.companyData[0]?.accountmanager : eachItem?.accountmanager ? eachItem?.accountmanager : "" } }) : []}
                                                        value={allDealsData && allDealsData.name && allDealsData.name.length > 0 && allDealsData.name.map((eachItem) => { return { value: eachItem, label: eachItem } })
                                                        }
                                                    />
                                                    {errors.name && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.name}</span>}
                                                    {errors.accountmanager && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.accountmanager}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="input-field">
                                                    <label htmlFor="example-text-input" className="col-form-label">Company Name</label>
                                                    <input className="form-control contact-number" type="text" name="title" value={selecteddata.companyname} disabled placeholder="company name" id="example-email-input" />

                                                </div>
                                            </div>
                                            {allDealsData?.accountmanager !== undefined && allDealsData?.accountmanager !== "" &&
                                            <div className="col-md-4">
                                                <div className="input-field">
                                                    <label htmlFor="example-text-input" className="col-form-label">Account manager</label>
                                                    <input className="form-control contact-number" type="text" name="accountmanager" value={allDealsData?.accountmanager} placeholder="account manager" id="example-email-input" disabled/>

                                                </div>
                                            </div>}
                                        </div>



                                        <div className="row table-data">
                                            <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i> Add Titles</h5>
                                            <div className="col-md-4">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">Category</label>

                                                    <Select isMulti={true}
                                                        placeholder='Select category'
                                                        onChange={(e) => handleChangeMultiSelect(e, 'category')}
                                                        options={categoryName}

                                                        onFocus={handleCatRemoveError}
                                                        value={filter && filter.category && filter.category?.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                    // }
                                                    />

                                                    {categoryerror != "" ?
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{categoryerror}</span> : ""
                                                    }
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">Seller Name</label>
                                                    <Select
                                                        isMulti={true}
                                                        placeholder='Select Company name'
                                                        onChange={(e) => handleChangeMultiSelect(e, 'companyid')}
                                                        options={companiesData && companiesData.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname } })}
                                                        value={filter && filter.companyname && filter.companyname?.map((eachItem) => { return { value: eachItem.companyid, label: eachItem.companyname } })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="input-field">
                                                    <label htmlFor="example-text-input" className="col-form-label">Search title</label>


                                                    <Select isMulti={true}
                                                        placeholder='Select title'
                                                        onChange={(e) => handleChangeMultiSelect(e, 'title')}
                                                        options={searchResult && searchResult.length > 0 ? searchResult.map((eachItem) => { return { value: eachItem.title, label: eachItem.title, portraitimage: eachItem.portraitimage, landscapeimage: eachItem.landscapeimage, contentid: eachItem.contentid, category: eachItem.category } }) : []}
                                                        onFocus={handleRemoveError}
                                                        value={filter && filter.contenttitle && filter.contenttitle.length > 0 && filter.contenttitle.map((eachItem) => { return { value: eachItem, label: eachItem } })

                                                        }
                                                    />

                                                    {titleerror != "" ?
                                                        <span className="errormsg" style={{
                                                            fontWeight: 'bold',
                                                            color: 'red',
                                                        }}>{titleerror}</span> : ""
                                                    }

                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">Additional Comments</label>
                                                    <textarea id="email" placeholder="Additional Comments" name="comments" type="text" className="form-control" value={filter.comments} onChange={(e) => handleChange(e)} />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <a onClick={handleAdd} className="btn btn-primary">add</a>

                                            </div>
                                            {adderror != "" ?
                                                <span className="errormsg" style={{
                                                    fontWeight: 'bold',
                                                    color: 'red',
                                                }}>{adderror}</span> : ""
                                            }
                                            <div className="col-md-12">
                                                <label className="form-label form-label">selected titles</label>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table align-middle table-nowrap table-check">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th className="align-middle">S.NO</th>
                                                            <th className="align-middle">THUMBNAIL</th>
                                                            <th className="align-middle">TITLE</th>
                                                            <th className="align-middle">CATEGORY</th>
                                                            <th className="align-middle">ADDITIONAL COMMENTS</th>
                                                            <th className="align-middle">ACTIONS</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {contentData && contentData.length > 0 && contentData.map(function (item, i) {
                                                            let picName = item.mediaType === 'video' ? 'videoclip-defaulr' : item.mediaType === 'audio' ? 'musicfile-default' : item.mediaType === 'pdf' ? 'pdf-default' : item.mediaType === 'doc' ? 'doc-defaulr' : 'img-default';
                                                            let defaultImg = `https://orasi-dev.imgix.net/orasi/common/images/${picName}.jpg`;

                                                            let imgUrl = (item.portraitimage != "" && item.portraitimage != undefined) ? image + item.portraitimage :
                                                                (item.landscapeimage != "" && item.landscapeimage != undefined) ? image + item.landscapeimage : defaultImg

                                                            let clientUrl = window.site.client.siteUrl;
                                                            console.log("clientUrl", clientUrl)
                                                            return (
                                                                <tr >
                                                                    <td>{i + 1}</td>
                                                                    <td><a href={clientUrl + "/moreinfo/" + item.contentid + "&showoffline=true"} target="_blank"><img src={imgUrl + "?auto=compress,format&width=40"} /></a></td>
                                                                    <td>{item.title}</td>
                                                                    {/* <td><button type="button" className="btn-primary btn-sm btn-rounded" data-bs-toggle="modal" data-bs-target="">{item && item.category.length > 1 ? item.category.join(", ") : item.category}</button></td> */}
                                                                    <td><div className="text-elipsis">{item && item.category.length > 1 ? item.category.join(", ") : item.category}</div></td>

                                                                    <td><div className="text-elipsis">{item.comments}</div></td>
                                                                    <td><div className="d-flex" onClick={(e) => handleDeleteDeal(e, item.contentid)}><a className="text-danger action-button"><i className="mdi mdi-delete font-size-18"></i></a></div></td>


                                                                </tr>
                                                            );
                                                        })}


                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i> enquiry details</h5>
                                            <div className="col-md-4">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">Required Rights</label>
                                                    {/* <input id="email" name="rightsavaliable" placeholder="Rights Available" type="text" className="form-control" onChange={(e) => handleChange(e)} value={allDealsData.rightsavaliable} /> */}

                                                    <Select isMulti={true}
                                                        placeholder='Required Rights'
                                                        onChange={(e) => handleChangeMultiSelect(e, 'rightsavaliable')}
                                                        options={rightsData}
                                                        value={allDealsData && allDealsData.rightsavaliable && allDealsData.rightsavaliable.length > 0 ? allDealsData.rightsavaliable?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}

                                                        isClearable={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">rights available From Date</label>
                                                    <input id="email" name="rightsAvailableFromDate" placeholder="Release Date" type="date" className="form-control" value={allDealsData.rightsAvailableFromDate} onChange={(e) => handleChange(e)} />
                                                    {errors.date && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.date}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">rights available to Date</label>
                                                    <input id="email" name="rightavailableto" placeholder="Rights Available To Date" type="date" className="form-control" value={allDealsData.rightavailableto} onChange={(e) => handleChange(e)} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">video format</label>

                                                    <Select isMulti={true}
                                                        placeholder='Video Format'
                                                        onChange={(e) => handleChangeMultiSelect(e, 'videoformat')}
                                                        options={videoformatData}
                                                        value={allDealsData && allDealsData.videoformat && allDealsData.videoformat.length > 0 ? allDealsData.videoformat?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}

                                                        isClearable={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 ">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">dubbing languages</label>

                                                    <Select isMulti={true}
                                                        placeholder='Dubbing Languages'
                                                        onChange={(e) => handleChangeMultiSelect(e, 'dubbinglanguages')}
                                                        options={languagesData}
                                                        value={allDealsData && allDealsData.dubbinglanguages && allDealsData.dubbinglanguages.length > 0 ? allDealsData.dubbinglanguages?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}

                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">exclusivity</label>

                                                    {/* <input type="text" className="form-control for-clear" id="example-email-input" name="exclusivity" placeholder="Exclusivity" value={allDealsData.exclusivity} onChange={(e) => handleChange(e)} /> */}

                                                    <select className="colorselect capitalize form-control" name="exclusivity" onChange={(e) => handleChange(e)} value={allDealsData.exclusivity}>
                                                        <option value="">Select Type</option>

                                                        <option value="Exclusive">Exclusive</option>
                                                        <option value="Non-Exclusive">Non-Exclusive</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">Regions Required</label>

                                                    <Select isMulti={true}
                                                        placeholder='Regions'
                                                        onChange={(e) => handleChangeMultiSelect(e, 'regions')}
                                                        options={countryData}
                                                        value={allDealsData && allDealsData.regions && allDealsData.regions.length > 0 ? allDealsData.regions?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []} />
                                                </div>
                                            </div>
                                            <div className="col-md-4 ">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">Request</label>
                                                    <textarea id="email" name="request" placeholder="Analytics" type="text" className="form-control" value={allDealsData.request} onChange={(e) => handleChange(e)} />
                                                </div>
                                            </div>

                                            <div className="col-md-4 ">
                                                <div className="mb-3 input-field">
                                                    <label className="form-label form-label">Queries</label>

                                                    <textarea id="email" name="queries" type="text" className="form-control" spellCheck="false" value={allDealsData.queries} onChange={(e) => handleChange(e)}   ></textarea>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="row status">
                                            <div className="col-md-3 justify-content-between ps-0">

                                            </div>

                                            <div className="col-md-9 justify-content-end d-flex align-items-center">

                                                <button className="btn btn-primary" onClick={handleSave} disabled={buttonDisabled}>{saveLoaderEnable ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null} CREATE DEAL</button>
                                            </div>

                                        </div>

                                    </div>

                                </div>


                            </div>
                        </div>


                        <Footer />
                        <SweetAlert show={datasuccess}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"To date cannot be earlier than From date"}
                            onConfirm={(e) => onConfirm1(e)}
                        >
                        </SweetAlert>
                        <SweetAlert show={success}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Deal Added"}
                            onConfirm={(e) => onConfirm(e)}
                        >
                        </SweetAlert>
                    </div>
                }

            </div>

        </>
    );
};

export default AddDeals;
