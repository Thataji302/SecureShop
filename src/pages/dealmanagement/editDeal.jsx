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
import SweetAlert from 'react-bootstrap-sweetalert';
import SessionPopup from "../SessionPopup"
import moment from "moment";
import Select from 'react-select';
import TableLoader from "../../components/tableLoader";
import { contentContext } from "../../context/contentContext";
import Loader from "../../components/loader"
let { lambda, appname } = window.app;



const EditDeals = () => {
    const history = useHistory();
    let { id } = useParams();
    const [image, setImg] = useState('');
    const [allDealsData, setAllDealsData] = useState({});
    const [contentData, setContentData] = useState({});
    const [followUp, setFollowUp] = useState(""); 
    const [followUpDate, setFollowUpDate] = useState(null); 
    const [success, setSuccess] = useState(false);
    const [followUpData, setFollowUpData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [lookup, setLookUp] = useState({});
    const [filter, setFilter] = useState([]);
    const [selecteddata, setSelectedData] = useState({});
    const [languagesData, setlanguagesData] = useState({});
    const [countryData, setCountryData] = useState({});
    const [videoformatData, setVideoformatData] = useState({});
    const [rightsData, setRightsData] = useState({});
    const [errors, setErrors] = useState({});
    const [categoryName, setCategoryName] = useState([]);
    const [searchResult, setSearchResult] = useState({});
    const [datasuccess, setDataSuccess] = useState(false);
    const [todate, setToDate] = useState("");
    const [invalidDeal, setInvalidDeal] = useState(false);
    const [companiesData, setCompaniesData] = useState([]);
    const [loaderEnable, setLoaderEnable] = useState(false); 
    const [duplicate, setDuplicate] = useState("");
    const [titleerror, setTitleError] = useState("");
    const [duplicateFlag, setDuplicateFlag] = useState(false);
    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, setActiveMenuId ,GetTimeActivity} = useContext(contentContext);

  
    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
            setCurrentPage(1)
            setRowsPerPage(15)
        }
    }, [prevRoute]);
    useEffect(() => {
        const presentDate = new Date();
        const nextWeekDate = new Date(presentDate);
        nextWeekDate.setDate(presentDate.getDate() + 7);
    
        // setFollowUpDate(nextWeekDate);
        setFollowUpDate( moment(new Date(nextWeekDate)).format('YYYY-MM-DD'));
        // moment(new Date(nextWeekDate)).format('YYYY-MM-DD')
      }, []);
    //   console.log('11111111',followUpDate ? followUpDate?.toDateString() : 'Loading...')
    //   console.log('222222222',followUpDate?.toISOString()?.split('T')[0])
    //   console.log('333333333 followUpDate-->',followUpDate)
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setRoute("deal")
        GetAllDeals();
        GetLookUp();
        setActiveMenuId(200003)
        Categories();
        Companies();
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
    // console.log('kkk')
    useEffect(() => {
        if (id) {
            getFollowup();
        }
    }, [success]);

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
    useEffect(() => {
        if (allDealsData.requiredfromdate && allDealsData.requiredtodate) {

            if (allDealsData.requiredtodate < allDealsData.requiredfromdate) {
                setDataSuccess(true)
                // error["date"] ='To date cannot be earlier than From date';
                // formIsValid = false;
            }


        }
    }, [allDealsData.requiredfromdate, allDealsData.requiredtodate]);


    const GetAllDeals = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")
        axios({
            method: 'POST',
            url: lambda + '/clientenquiry?appname=' + appname + '&enquiryid=' + id + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else if (response.data.result.data.length > 0) {


                    console.log('aaaaaaaaa', response.data.result);
                    setAllDealsData(response.data.result.data[0]);
                    setContentData(response.data.result.data[0].content);
                    setToDate(response.data.result.data[0].requiredtodate)
                }
                else {
                    setInvalidDeal(true)
                }


            });
    }

    const onclickInvalid = () => {
        GetTimeActivity() 
        setInvalidDeal(false)
        history.push('/dealmanagement')
    }

    const Categories = async () => {
        try {

            const response = await tmdbApi.getCategory({});
            if (response.statusCode === 200) {
                if (response.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    //  setData(response.result);
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

    const getFollowup = (e) => {
        GetTimeActivity() 
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/enquiryFollowup?appname=' + appname + '&enquiryid=' + id + "&token=" + token,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setFollowUpData(response.data.result.data)
                }

            });
    }

   
    const handleChange = (e) => {
        GetTimeActivity() 
        const { name, value } = e.target;
      
        if (name === "followupdate") {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
      
          if (selectedDate >= today) {
            // Valid date, clear the error
            let updatedErrors = { ...errors };
            delete updatedErrors.followupdate;
            setErrors(updatedErrors);
            setFollowUpDate(value)
          } else {
            // Invalid date, set an error message
            setErrors({ ...errors, followupdate: 'Please select a date from today onwards' });
          }
        }
      
        // Update the form data
        setAllDealsData({ ...allDealsData, [name]: value });
      };
      const handleFollowUp = (e)=> {
        GetTimeActivity() 
      if(e.target.name ==="followUp"){
        setFollowUp(e.target.value)
      }
      let error = {...errors}
      if(e.target.value.trim() === ""){
       
        error[e.target.name]="Follow up is required"
        setErrors(error)
      }else{
        delete error[e.target.name]
        setErrors(error)
      }
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
        return arr2
    }

    const handleCheckTitle = (selectedData) => {
        GetTimeActivity() 
        console.log("selected------------>", selectedData, contentData);

        selectedData?.map((eachItem) => {
            console.log("each", eachItem)
            contentData && contentData?.map((each) => {
                if (each.title === eachItem.value) {
                    console.log("eachhhhhhhhh", eachItem, each);
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
        if (key === 'title') {
            console.log(selected, "selected")
            setTitleError("")

            // let selectedArray = returnArray(selected);
            setSelectedData(selected);
            setAllDealsData({ ...newContent, [key]: selected });
            setFilter({ ...filter, contenttitle: selected.value })
            handleCheckTitle(selected);
        } else if (key == 'companyid') {
            let selectedArray = returnArray1(selected);
            // setAllDealsData({ ...filter, [key]: selectedArray });
            setFilter({ ...filter, [key]: selectedArray })
            getOptionData(filter.category, selectedArray);
        }
        else {
            let selectedArray = returnArray(selected);


            setAllDealsData({ ...newContent, [key]: selectedArray });

            if (key === "category") {
                setFilter({ ...filter, category: selectedArray })
                
                getOptionData(selectedArray, filter.companyid);
                if (selectedArray <= 1) {
                    setAllDealsData({ ...allDealsData, title: "" })
                    setFilter({ ...filter, contenttitle: [], comments: "", category: [] })
                }
                // else if(selectedArray <= 0){
                //     setFilter({ ...filter, })
                // }
            }
        }


    }
    const getOptionData = (selectedArray, companyid) => {
        GetTimeActivity() 
        setLoaderEnable(true);
        const token = localStorage.getItem("token")
        const linkUrl = `${lambda}/content?appname=${appname}&token=${token}&sortBy=title&userid=${localStorage.getItem("userId")}`;

        //  console.log("filter",selectedArray);

        let categoryobj;
        if (companyid && companyid.length > 0) {
            categoryobj = { category: selectedArray, status: ["ACTIVE", "OFFLINE"], companyid: companyid }
        } else {
            categoryobj = { category: selectedArray, status: ["ACTIVE", "OFFLINE"] }
        }

        axios({
            method: 'POST',
            url: linkUrl,
            data: categoryobj,
        })
            .then(function (response) {
                // console.log("res1", response)
                setSearchResult(response.data.result.data)
                setLoaderEnable(false);

            });
    }
    // console.log("allDealsData-----------", allDealsData)

    const handleAdd = () => {
        GetTimeActivity() 
        // console.log("allDealsData-----------", allDealsData)
        let obj = {}
        let arr = [...contentData]
        if (duplicateFlag === false) {
            allDealsData.title?.map((eachItem) => {
                // console.log("eachItem",eachItem)
                obj = {
                    category: eachItem.category,
                    contentid: eachItem.contentid,
                    title: eachItem.value,
                    portraitimage: eachItem.portraitimage,
                    landscapeimage: eachItem.landscapeimage,
                    comments: allDealsData.addcomments,
                    clientid: allDealsData.clientid
                }
                arr.push(obj);
            })

            if (allDealsData.category !== "") {
                setContentData(arr);
            }

            setAllDealsData({ ...allDealsData, addcomments: "", contentid: "", portraitimage: "", title: "" })
            setFilter({ ...filter, contenttitle: [], addcomments: "" })
        }
        else {
            setTitleError("Title(s) already exists. Please select unique title(s).")
            setDuplicateFlag(false)
        }

    }

    const handleUpdateDeals = async (e) => {
        GetTimeActivity() 
        setIsLoading(true)
        try {
            const response = await tmdbApi.UpdateDeals({
                // "followupdate": allDealsData.followupdate,
                "followupdate": followUpDate,
                "status": allDealsData.status === undefined ? "INPROGRESS" : allDealsData.status,
                "enquiryid": id,
                "content": contentData,
                "queries": allDealsData.queries ? allDealsData.queries?.trim() : "",
                "request": allDealsData.request ? allDealsData.request?.trim() : "",
                "rightsAvailable": allDealsData.rightsAvailable ? allDealsData.rightsAvailable : "",
                "requiredtodate": allDealsData.requiredtodate ? allDealsData.requiredtodate : "",
                "requiredfromdate": allDealsData.requiredfromdate ? allDealsData.requiredfromdate : "",
                "exclusive": allDealsData.exclusive ? allDealsData.exclusive : "",
                "regionsrequired": allDealsData.regionsrequired ? allDealsData.regionsrequired : "",
                "dubbinglanguagesrequired": allDealsData.dubbinglanguagesrequired ? allDealsData.dubbinglanguagesrequired : "",
                "videoformatsrequired": allDealsData.videoformatsrequired ? allDealsData.videoformatsrequired : "",
                "clientid": allDealsData.clientid,
                "clientname": allDealsData.clientname,
                "clienttype": allDealsData.type,
                "companyid": allDealsData.companyid,
            });
            // console.log(response.result.result);
            if (response.statusCode === 200) {
                if (response.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    setFollowUp("")
                    setSuccess(true);
                    setIsLoading(false)
                }
            }

        } catch {
            console.log("error");
        }
    }

    const updateFollowUp = async (e) => {
        GetTimeActivity() 
        try {
            const response = await tmdbApi.UpdateFollowupDeals({
                "followup": followUp,
                "enquiryid": id,
                "followupdate": followUpDate
            });
            // console.log(response.result.result);
            if (response.statusCode === 200) {
                if (response.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                } else {
                    const presentDate = new Date();
        const nextWeekDate = new Date(presentDate);
        nextWeekDate.setDate(presentDate.getDate() + 7);
    
        setFollowUpDate(nextWeekDate);
                }

            }

        } catch {
            console.log("error");
        }
    }

    const handleUpdate = (e) => {
        GetTimeActivity() 
       
        if(followUp.trim() === ""){
            let err = {...errors}
            err['followUp']="Follow up is required"
            setErrors(err)
        }else{
            
            handleUpdateDeals();
            updateFollowUp();
        }
        
    }

// console.log('followup errorr',errors)
    const handleBack = () => {
        GetTimeActivity() 
        history.push({
            pathname: "/dealmanagement",
            state: { search: true }
        });
    }

    function onConfirm() {
        GetTimeActivity() 
        setSuccess(false);

    };
    function onConfirm1() {
        GetTimeActivity() 
        setDataSuccess(false);
        setAllDealsData({ ...allDealsData, requiredtodate: todate })

    };

    const GetLookUp = async (e) => {
        GetTimeActivity() 
        try {
            let arrayType = ["country", "videoformat", "language", "territories"];

            const response = await tmdbApi.getLookUp({
                // type: arrayType

            });
            // console.log(response);
            if (response.statusCode == 200) {
                let arrayType = ["country", "videoformat", "language", "territories", "rights"];
                let lookupsData = response.result.data || []
                // console.log("lookupsData", lookupsData);
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
        GetTimeActivity() 
        const resultArr = item.map((eachItem) => { return { value: eachItem, label: eachItem }; })
        return resultArr
    }

    const handleDeleteDeal = (e, id) => {
        GetTimeActivity() 
        const filteredArray = contentData.filter((eachItem) => eachItem.contentid != id);
        setContentData(filteredArray);
    }

    // console.log("values----->", contentData);
    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <SweetAlert show={invalidDeal}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Deal Not Found"}
                    onConfirm={e => onclickInvalid()}
                >
                </SweetAlert>

                {!invalidDeal &&
                    <div className="main-content user-management add-client view-deals edit-deals">

                        <div className="page-content ">
                            <div className="container-fluid">



                                <div className="row mb-4 breadcrumb">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h4 className="mb-2 card-title">EDIT DEALS</h4>
                                                <p className="menu-path">Deal Management / <b>Edit Deals</b></p>
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
                                        <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link active" data-bs-toggle="tab" href="#home1" role="tab" aria-selected="true">
                                                    <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                    <span className="d-none d-sm-block">DETAILS</span>
                                                </a>
                                            </li>


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
                                            </li>



                                        </ul>
                                        <div className="tab-content p-3 text-muted">
                                            <div className="tab-pane active show" id="home1" role="tabpanel">
                                            {Object.keys(allDealsData).length > 0 ? 
                                            <>
                                                <div className="row">
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i> Buyer details</h5>
                                                    <div className="col-md-4">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Buyer Name</label>

                                                            <input id="email" name="buyer" placeholder="buyer" type="text" className="form-control" value={allDealsData && allDealsData.clientname} disabled

                                                            />

                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                    
                                                <div className="input-field">
                                                    <label htmlFor="example-text-input" className="col-form-label">Company Name</label>
                                                    <input className="form-control contact-number" type="text" name="title" value={allDealsData?.companyname && allDealsData?.companyname[0]} disabled  placeholder="company name" id="example-email-input" />

                                                </div>
                                                
                                            </div>
                                            <div className="col-md-4">
                                            {allDealsData?.accountmanager != undefined &&
                                                <div className="input-field">
                                                    <label htmlFor="example-text-input" className="col-form-label">Account Manager</label>
                                                    <input className="form-control contact-number" type="text" name="title" value={allDealsData?.accountmanager} disabled  placeholder="Account manager" id="example-email-input" />

                                                </div>}
                                            </div>

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
                                                                value={filter && filter.category && filter.category?.map((eachItem) => { return { value: eachItem, label: eachItem } })}
                                                            // }
                                                            />
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
                                                            <textarea id="email" placeholder="Additional Comments" name="addcomments" type="text" className="form-control" value={allDealsData.addcomments} onChange={(e) => handleChange(e)} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <a
                                                            onClick={handleAdd}
                                                            className="btn btn-primary">add</a>
                                                    </div>
                                                    <h5 className="font-size-14"><i className="mdi mdi-arrow-right"></i> titles Enquired</h5>
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
                                                                    let picName = item?.mediaType === 'video' ? 'videoclip-defaulr' : item?.mediaType === 'audio' ? 'musicfile-default' : item?.mediaType === 'pdf' ? 'pdf-default' : item?.mediaType === 'doc' ? 'doc-defaulr' : 'img-default'
                                                                    let defaultImg = `https://orasi-dev.imgix.net/orasi/common/images/${picName}.jpg`;

                                                                    let imgUrl = (item?.portraitimage != "" && item.portraitimage != undefined) ? image + item?.portraitimage :
                                                                        (item.landscapeimage != "" && item?.landscapeimage != undefined) ? image + item?.landscapeimage : defaultImg
                                                                    let clientUrl = window?.site?.client?.siteUrl;

                                                                    return (
                                                                        <tr key={i}>
                                                                            <td>{i + 1}</td>
                                                                            <td><div className="d-flex justify-content-start"><a href={clientUrl + "/moreinfo/" + item.contentid + "&showoffline=true"} target="_blank"><img src={imgUrl + "?auto=compress,format&width=40"} /></a> </div></td>
                                                                            <td>{item.title}</td>
                                                                            <td><div className="text-elipsis">{item && item.category.length > 1 ? item.category.join(", ") : item.category}</div></td>

                                                                            <td><div className="text-elipsis">{item.comments}</div></td>

                                                                            <td><div className="d-flex" onClick={(e) => handleDeleteDeal(e, item.contentid)}><a className="text-danger action-button"><i className="mdi mdi-delete font-size-18"></i></a></div></td>
                                                                        </tr>

                                                                    )
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
                                                            {/* <input id="email" name="rightsavaliable" placeholder="Rights Available" type="text" className="form-control" value={allDealsData && allDealsData.rightsAvailable && allDealsData.rightsAvailable.length > 1 ? allDealsData.rightsAvailable?.join(", ") : allDealsData.rightsAvailable} 
                                                            
                                                              /> */}

                                                            <Select isMulti={true}
                                                                placeholder='Required Rights'
                                                                onChange={(e) => handleChangeMultiSelect(e, 'rightsAvailable')}
                                                                options={rightsData}
                                                                value={allDealsData && allDealsData.rightsAvailable && allDealsData.rightsAvailable.length > 0 ? allDealsData.rightsAvailable.length > 0 && allDealsData.rightsAvailable?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : null}


                                                            />

                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">rights available From Date</label>
                                                            {/* <input id="email" name="rightavailableto" placeholder="Rights Available To Date" type="date" className="form-control" value={moment(allDealsData && allDealsData.requiredfromdate).utc().format("DD-MMM-YYYY")} disabled /> */}
                                                            {/* <input id="email" name="rightsavaliable" placeholder="Rights Available From Date" type="text" className="form-control" value={allDealsData && allDealsData.requiredfromdate ? moment(allDealsData && allDealsData.requiredfromdate).utc().format("DD-MMM-YYYY") : null} /> */}
                                                            <input id="email" name="requiredfromdate" placeholder="rightsAvailableFromDate" type="date" className="form-control" value={allDealsData.requiredfromdate} onChange={(e) => handleChange(e)} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">rights available to Date</label>
                                                            {/* <input id="email" name="rightavailableto" placeholder="Rights Available To Date" type="date" className="form-control" value={allDealsData.requiredtodate} disabled /> */}
                                                            {/* <input id="email" name="rightsavaliable" placeholder="Rights Available To Date" type="text" className="form-control" value={allDealsData && allDealsData.requiredtodate ? moment(allDealsData && allDealsData.requiredtodate).utc().format("DD-MMM-YYYY") : null} /> */}
                                                            <input id="email" name="requiredtodate" placeholder="rightsAvailableToDate" type="date" className="form-control" value={allDealsData.requiredtodate} onChange={(e) => handleChange(e)} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">video format</label>
                                                            {/* <input id="email" name="foreigntitle" placeholder="Video Format" type="text" className="form-control" value={allDealsData && allDealsData.videoformatsrequired && allDealsData.videoformatsrequired.length > 1 ? allDealsData.videoformatsrequired?.join(", ") : allDealsData.videoformatsrequired} /> */}
                                                            <Select isMulti={true}
                                                                placeholder='Video Format'
                                                                onChange={(e) => handleChangeMultiSelect(e, 'videoformatsrequired')}
                                                                options={videoformatData}
                                                                value={allDealsData && allDealsData.videoformatsrequired && allDealsData.videoformatsrequired.length > 0 ? allDealsData.videoformatsrequired?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}

                                                                isClearable={true}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 ">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">dubbing languages</label>
                                                            {/* <input id="email" name="foreigntitle" placeholder="Dubbing Languages" type="text" className="form-control" value={allDealsData && allDealsData.dubbinglanguagesrequired && allDealsData.dubbinglanguagesrequired.length > 1 ? allDealsData.dubbinglanguagesrequired?.join(", ") : allDealsData.dubbinglanguagesrequired} /> */}
                                                            <Select isMulti={true}
                                                                placeholder='Dubbing Languages'
                                                                onChange={(e) => handleChangeMultiSelect(e, 'dubbinglanguagesrequired')}
                                                                options={languagesData}
                                                                value={allDealsData && allDealsData.dubbinglanguagesrequired && allDealsData.dubbinglanguagesrequired.length > 0 ? allDealsData.dubbinglanguagesrequired?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []}

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">exclusivity</label>
                                                            {/* <input id="email" name="foreigntitle" placeholder="Exclusivity" type="text" className="form-control" value={allDealsData.exclusive} /> */}
                                                            <select className="colorselect capitalize form-control" name="exclusive" onChange={(e) => handleChange(e)} value={allDealsData.exclusive}>
                                                                <option value="">Select Type</option>

                                                                <option value="Exclusive">Exclusive</option>
                                                                <option value="Non-Exclusive">Non-Exclusive</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Regions Required</label>
                                                            {/* <input id="email" name="foreigntitle" placeholder="Regions Required" type="text" className="form-control" value={allDealsData && allDealsData.regionsrequired && allDealsData.regionsrequired.length > 1 ? allDealsData.regionsrequired?.join(", ") : allDealsData.regionsrequired} /> */}
                                                            <Select isMulti={true}
                                                                placeholder='Regions'
                                                                onChange={(e) => handleChangeMultiSelect(e, 'regionsrequired')}
                                                                options={countryData}
                                                                value={allDealsData && allDealsData.regionsrequired && allDealsData.regionsrequired.length > 0 ? allDealsData.regionsrequired?.map((eachItem) => { return { value: eachItem, label: eachItem } }) : []} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 ">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Request</label>
                                                            <textarea id="email" name="request" placeholder="Request" type="text" className="form-control" onChange={(e) => handleChange(e)} value={allDealsData.request} />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-4 ">
                                                        <div className="mb-3 input-field">
                                                            <label className="form-label form-label">Queries</label>
                                                            <textarea id="email" name="queries" placeholder="Queries" type="text" className="form-control" onChange={(e) => handleChange(e)} value={allDealsData.queries} />
                                                        </div>
                                                    </div>

                                                </div>


                                                <div className="row comment-section">
                                                    <div className="col-md-8">
                                                        <label className="verticalnav-address-input">FOLLOW UP<span className="required">*</span></label>
                                                        <textarea id="verticalnav-address-input" name="followUp" className="form-control" rows="2" value={followUp} onChange={(e) => handleFollowUp(e)} style={{ marginBottom: "10px" }}></textarea>
                                                        {errors.followUp && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.followUp}</span>}
                                                    </div>
                                                    <div className="col-md-4">

                                                        <label className="col-form-label">next followup Date<span className="required">*</span></label>
                                                        <input id="email" name="followupdate" placeholder="Release Date" type="date"  min={new Date().toISOString().split('T')[0]} value=
                                                        {moment(new Date(followUpDate)).format('YYYY-MM-DD')}  onChange={(e) => handleChange(e)} className="form-control" />
                                                          {errors.followUpDate && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{errors.followUpDate}</span>}
                                                    </div>
                                                </div>

                                                <div className="row status">

                                                    <div className="col-md-3 justify-content-between ps-0">

                                                        <div className="input-field d-flex align-items-center">

                                                            <label className="col-form-label">Status</label>

                                                            <select className="form-select" name="status" value={allDealsData.status} onChange={(e) => handleChange(e)} >
                                                                <option value="NEW">NEW</option>
                                                                <option value="INPROGRESS">INPROGRESS</option>
                                                                <option value="PARTIALLY CLOSED">PARTIALLY CLOSED</option>
                                                                <option value="CLOSED">CLOSED</option>
                                                                <option value="SUCCESSFULLY CLOSED">SUCCESSFULLY CLOSED</option>
                                                            </select>


                                                        </div>

                                                    </div>


                                                    <div className="col-md-9 justify-content-end d-flex align-items-center">

                                                        <a className="btn btn-primary" onClick={handleUpdate}> {isLoading ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}UPDATE</a>


                                                    </div>


                                                </div>
                                                </>
                                            :  <div className="row"><Loader /></div>}
                                            </div>

                                            <div className="tab-pane" id="messages1" role="tabpanel">
                                                <div className="mb-3 row">

                                                    {followUpData && followUpData.length > 0 ?
                                                        <div className="col-md-12">
                                                            <label >FOLLOW UP</label>
                                                            {followUpData && followUpData.length > 0 && followUpData.map(function (item, i) {

                                                                return (
                                                                    <div className="comments-block" key={i}>
                                                                    <div className="d-flex align-item-center justify-content-between">  <div> <label>Created on:</label> <p className="time">{item.created ? new Date(item.created).toLocaleDateString('en-IN', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric',
                                                                            // hour: 'numeric',
                                                                            // minute: 'numeric',
                                                                        }) : ""}</p>
                                                                      </div>
                                                                      <div>
                                                                        <label>Followup Date :</label><p className="time followup-date">{item.followupdate ? new Date(item.followupdate).toLocaleDateString('en-IN', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric',
                                                                            // hour: 'numeric',
                                                                            // minute: 'numeric',
                                                                        }) : ""}</p>
                                                                         </div>
                                                                         </div>
                                                                        <p className="comments">{item.followup}</p>
                                                                         
                                                                    </div>
                                                                )
                                                            })}

                                                        </div> : <div div className="followups"><div className="no-documents">
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


                        <Footer />
                        <SweetAlert show={success}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"Updated Successfully"}
                            onConfirm={e => onConfirm()}
                        >
                        </SweetAlert>

                        <SweetAlert show={datasuccess}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"To date cannot be earlier than From date"}
                            onConfirm={(e) => onConfirm1(e)}
                        >
                        </SweetAlert>
                    </div>
                }


            </div>

        </>
    );
};

export default EditDeals;
