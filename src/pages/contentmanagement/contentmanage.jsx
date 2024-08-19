/***
**Module Name: content dashboard
 **File Name :  contentmanage.js
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
 **Description : contains content mamnagement details.
 ***/
import React, { useState, useEffect, useContext } from "react";


import Footer from "../../components/dashboard/footer";
import Header from "../../components/dashboard/header";
import Sidebar from "../../components/dashboard/sidebar";
import tmdbApi from "../../api/tmdbApi";
import { useHistory, Link, useLocation } from "react-router-dom";
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import Button from 'react-bootstrap/Button';
import moment from "moment";
import Modal from 'react-bootstrap/Modal';
import TableLoader from "../../components/tableLoader";
import SessionPopup from "../SessionPopup"
import AdvanceSearch from "./advanceSearch";
import Loader from "../../components/loader";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from 'react-data-table-component';

import { contentContext } from "../../context/contentContext";
let { lambda, appname } = window.app





const ContentMange = () => {
    const history = useHistory();
    const { state } = useLocation();
    const { search } = state || {};
    // const [toggle, setToggle] = useState(false);
    const [content, setContent] = useState("");
    // const [data, setData] = useState([]);
    const [success, setSuccess] = useState(false);
    const [isAlert, setIsAlert] = useState(false);
    const [isdelete, setDelete] = useState(false);
    const [item, setItem] = useState("");
    const [activeCheckId, setActiveCheckId] = useState("");
    const [isCompanyInclude, setIsCompanyInclude] = useState(false); 
    const [exportLoad, setExportLoad] = useState(false); 

    // const [arrow, setArrow] = useState(0);
    const [perpage, setPerpage] = useState(10);

    const [itemsPerPage, setitemsPerPage] = useState(10);

    const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
    const [searchCount, setSearchCount] = useState(0);
    const [count, setCount] = useState(0);

    // const [pay, setPay] = useState({});
    //  const [popup, setShowPopup] = useState(false);


    const [image, setImg] = useState('');
    const [flag, setFlag] = useState(false);

    const [sort, setSort] = useState(true);
    const [activedirect, setActiveDirect] = useState("");
    const [activetype, setActiveType] = useState("");

    const [sortData, setSortData] = useState("");
    const [loaderEnable, setLoaderEnable] = useState(false);
    const [loaderDelete, setLoaderDelete] = useState(false);
    const [btnDisable, setBtnDisable] = useState(false);
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [activeExportBtn, setActiveExportBtn] = useState("");

    const handleEditContent = (e, id) => {
        // if( subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === true){
        history.push("/editcontent/" + id);
        // }

    }
    const customSort = (rows, selector, direction) => {
        	return rows.sort((a, b) => {
        		// use the selector to resolve your field names by passing the sort comparators
        		const aField = selector(a).toLowerCase();
        		const bField = selector(b).toLowerCase();
        
        		let comparison = 0;
       
        		if (aField > bField) {
        			comparison = 1;
        		} else if (aField < bField) {
        			comparison = -1;
        	}
        
        		return direction === 'desc' ? comparison * -1 : comparison;
        });
        };
        

    const handleViewContent = (e, id) => {
        history.push("/viewcontent/" + id);
    }

    // const [isLoading, setIsLoading] = useState(false);

    const [exportFlag, setExportFlag] = useState(true);
    const [exportData, setExportData] = useState({});

    const {searchedFlag, setSearchedFlag, sortTableAlpha, arrow, sortTableByDate, contentsearch, setContentSearch, searchPayload, setSearchPayload, contentAdvCount, setContentAdvCount, currentPage, setSelectedOptions, setMultiSelectFields, setActiveFieldsObj, setSelectedOptionsClientName,data, setData,rowsPerPage, setRowsPerPage,currentPageNew, setCurrentPage,route, setRoute,usePrevious,isLoading, setIsLoading ,setActiveMenuId,pay, setPay } = useContext(contentContext)

    const { initialCategoriesData1, userData, setInitialCategoriesData1, popup, setShowPopup, handleClosePopup, GetTimeActivity} = useContext(contentContext);
    
    const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Content Management")
    const subValDashboard = validateObj && validateObj[0] && validateObj[0].dashboard
    // console.log('currentPageNewcurrentPageNew',currentPageNew)

    // console.log('payloadd',pay)

    // console.log('content search',contentsearch,initialCategoriesData1)
    const prevRoute = usePrevious(route)
    useEffect(() => {
        if(prevRoute != undefined && prevRoute!=route){
            console.log('use eefffect prevroute')
            setCurrentPage(1)
            setRowsPerPage(15)
            setSelectedOptions([])
           
            setContentSearch("")
            setPay({})
            setMultiSelectFields({ dubbinglanguages: [], typeofrights: [], countryorigin: [], languages: [], typeofrights: [], genre: [], videoquality: [], certificate: [], subtitleslanguages: [], territoriesavailable: [], sport: [], musicgenre: [] })
            setActiveFieldsObj({ CookingshowActive: false, seriesActive: false, SportsActive: false, LiveEventActive: false, MusicActive: false })
            setSelectedOptionsClientName([])
            setSearchPayload({})
            setSearchedFlag(false);
        }
    }, [prevRoute]);
    const keyForRerender = `${rowsPerPage}_${data.length}`;
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        setActiveMenuId(200001)
        setRoute("content")
        // if(search == true){
        //     handleSearch();
        // }
        // else{
        //     GetContent();
        // }    
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
    useEffect(() => {
      
        if(searchedFlag === false){
            setPay({})
        }

        // console.log("trueeeeeeeeee",searchedFlag);
        if (searchedFlag) { 
            console.log("came") 
            handleSearch();
        } else {
            console.log("called get all deals") 
            GetContent();;
        }

    }, [searchedFlag]);
    const columns = [

        {
            name: 'Image',
            cell: (props) =>  <img src={`${props.portraitimage ?
                image + props.portraitimage :
                props.landscapeimage ? image + props.landscapeimage :
                    `https://orasi-dev.imgix.net/orasi/common/images/${props.mediaType === 'video' ? 'videoclip-defaulr' : props.mediaType === 'audio' ? 'musicfile-default' : props.mediaType === 'pdf' ? 'pdf-default' : props.mediaType === 'doc' ? 'doc-defaulr' : 'img-default'}.jpg`}?auto=compress,format&width=40`} alt='Image' />,
            sortable: false,
        },
        {
            name: 'Title',
            selector: row => row?.title ?? "",
            sortable: true,
        },
        {
            name: 'Category',
            selector: row =>  row.category && Array.isArray(row.category) ? row.category.join(', ') : '',
            sortable: true,
        },
        { 
            name: 'Videos',
            cell: (props) =>   
            <div className="availability"><span className="material-symbols-outlined">{props.videoAvailable == true ?'video_library':'videocam_off'}</span>{props.videoAvailable == true ? 'YES':'NO'}</div>
            ,
          
            sortable: false,
        },
        {
           name: 'Featured',
           selector: row => JSON.stringify(row?.featured),
           sortable: true,
       },
        {
            name: 'Genre',
            selector: row => row?.genre && Array.isArray(row?.genre) ? row?.genre.join(', ') : '',
            sortable: true,
        },
        {
            name: 'DURATION',
            selector: row => row?.duration ?? "",
            sortable: true,
        },
        {
            name: 'RELEASED',
            selector: row =>  row?.releaseyear ? row?.releaseyear : row?.releasedate ? moment(row?.releasedate).format("DD-MMM-YYYY") :  "",
            sortable: true,
        },
        {
            name: 'STATUS',
            selector: row => row?.status === "INPROGRESS" ? "IN PROGRESS": row?.status,
            sortable: true,
        },
        {
            name: <>{(subValDashboard && subValDashboard.view && subValDashboard.view.display === true) || (subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true) ? 'Actions' : null}</>,
            cell: (props) => 
           //  {
            subValDashboard && subValDashboard.view && subValDashboard.edit && (subValDashboard.view.display === true || subValDashboard.edit.display === true) &&
              
                  <div className="d-flex" >
 
                  {subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
                      <a onClick={e => handleViewContent(e, props.contentid)} className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}><i className="mdi mdi-eye font-size-18"></i></a>}

                  {subValDashboard && subValDashboard.edit && subValDashboard.edit.display === true &&

                      <a onClick={e => handleEditContent(e, props.contentid)} className={`${subValDashboard && subValDashboard.edit && subValDashboard.edit.enable === false ? 'pe-none' : ''} text-danger action-button`}><i className="mdi mdi-pencil font-size-18" ></i></a>}
              </div>
           //  }
            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const handlePageChange = (page) => {
        GetTimeActivity()
        setCurrentPage(page);
      };
    
      const handlePerRowsChange = (newPerPage) => {
        GetTimeActivity()
        setRowsPerPage(newPerPage);
      };
    
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

    //  const handleClosePopup = () => setShowPopup(false);
    const handleShowPopup = () => {
        GetTimeActivity()
        //  setSuccess(true);
        setShowPopup(true);
    };

    const handleData = (childData, count) => {
        GetTimeActivity()
        setPay(childData);
        setCount(count)
        // console.log("ccccccc",count);
    };



  


    useEffect(() => {
        if (initialCategoriesData1.length>0) {
            setData(initialCategoriesData1);
            setSearchCount(initialCategoriesData1?.length);
            setActiveDirect("");
            setActiveType("");
            setSortData("");
            setSearchedFlag(true);
        }
        // else if(initialCategoriesData1.length<=0){
        //     setData([]);
        // }

    }, [initialCategoriesData1]);



const customNoRecords = () => {
    return(
        
        <div className="empty-state-body empty-record"  >
            <div className="empty-state__message">
                <span className="material-icons">summarize</span>
                <p className="form-check font-size-16">No content was found for the searched keyword</p>
            </div> </div>
    )
}
    const GetContent = async () => {
        // console.log('get content function ')
        setLoaderEnable(true)
        setIsLoading(true);
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userId")

        axios({
            method: 'POST',
            url: lambda + '/content?appname=' + appname + "&token=" + token + "&userid=" + userid,
        })
            .then(function (response) {
                if (response.data.result == "Invalid token or Expired") {
                    setShowSessionPopupup(true)
                    setLoaderEnable(false)
                } else {
                    // setData(response.data.result.data)
                    const dataArray = Object.values(response.data.result.data).map((obj) => obj);
                    setData(dataArray)
                    setContent(response.data.result)
                    setIsLoading(false);
                    setLoaderEnable(false)
                    console.log('get content current page')
                    // setCurrentPage(1)
                    // setRowsPerPage(15)
                    setContentSearch("");
                    setSearchedFlag(false);
                    setContentAdvCount("");
                }
            });
    };


    const handleCompanyInclude = (e) => {
        // console.log('e.target.checked',e.target.checked)
        // console.log('e.target.name',e.target.name)
        if (e.target.checked === true) {
            setIsCompanyInclude(true)
        } else {
            setIsCompanyInclude(false)
        }
    }

  

    useEffect(() => {
        if(contentsearch){

        }
       
      }, [contentsearch]);

 
    const handleSearch = (e, flagggg) => {
  
        if(flagggg === "normalsearch" || pay.length > 0){
            console.log('handle search flag', pay. searchedFlag)
            setSearchedFlag(true)
       }
        if (flagggg) {
            setCurrentPage(1);
            setRowsPerPage(15);
        }
        setFlag(true)
        
        if (contentsearch === "" && pay.length <= 0) {
            console.log("called get content");
            GetContent();
        }

        else {
            let payload
            setIsLoading(true);
            setActiveDirect("");
            setActiveType("");
            setSortData("");
            console.log("starting");
            if (contentsearch ) {
                console.log("title");
                payload = { 'title': contentsearch }
            } else {
                console.log("payloadddd");
                payload = searchPayload
            }
            const token = localStorage.getItem("token")
            const userid = localStorage.getItem("userId")

            axios({
                method: 'POST',
                url: lambda + '/content?appname=' + appname + "&token=" + token + "&userid=" + userid,
                data: payload,
            })
                .then(function (response) {
                    if (response.data.result) {
                        if (response.data.result.data && response.data.result.data.length == 0) {
                            //  setSuccess(true);
                            setIsLoading(false)
                        } else if (response.data.result == "Invalid token or Expired") {
                            setShowSessionPopupup(true)
                        } else {
                            setSuccess(false);
                        }
                        console.log("response", response.data.result);
                        setData(response.data.result.data);
                        setContent(response.data.result);
                        setIsLoading(false);
                        // setCurrentPage(1)
                        // setRowsPerPage(15)
                        // setSelectedOptions([])
                        // setMultiSelectFields({ dubbinglanguages: [], typeofrights: [], countryorigin: [], languages: [], typeofrights: [], genre: [], videoquality: [], certificate: [], subtitleslanguages: [], territoriesavailable: [], sport: [], musicgenre: [] })
                        // setActiveFieldsObj({ CookingshowActive: false, seriesActive: false, SportsActive: false, LiveEventActive: false, MusicActive: false })
                        // setSelectedOptionsClientName([])
                        // setSearchPayload({})
                    }
                });
        }
    }
    const clearSearch = () => {
        setSuccess(false);
        GetContent();
        setPay({});
        setSelectedOptions([])
        setMultiSelectFields({ dubbinglanguages: [], typeofrights: [], countryorigin: [], languages: [], typeofrights: [], genre: [], videoquality: [], certificate: [], subtitleslanguages: [], territoriesavailable: [], sport: [], musicgenre: [] })
        setActiveFieldsObj({ CookingshowActive: false, seriesActive: false, SportsActive: false, LiveEventActive: false, MusicActive: false })
        setSelectedOptionsClientName([])
        setSearchPayload({})
        setCount(0)
        if (contentsearch) {
            setContentSearch('')
        }
        setCurrentPage(1);
    }
    function onConfirm() {
        setSuccess(false);
        setIsAlert(false)
        if (exportData.length <= 0) {
            setExportFlag((prevState) => !prevState);
        }

    };
    const handleChange = (e) => {
        if (e.target.value === "") {
            // GetContent();
            setFlag(false)
        }
        if ((e.key === "Enter")) {
            setTimeout(function () {
                handleSearch();
            }, 1000);
        }
        setContentSearch(e.target.value)
    }


    const handleUpload = () => {
        history.push("/contentupload");
    };

    const handleKeypress = (e) => {
        //it triggers by pressing the enter key
        // console.log('handleKeypress')
        if ((e.key === "Enter")) {
            setTimeout(function () {
                handleSearch();
            }, 1000);
        }
    };



    const handleAddContent = () => {
        history.push("/addcontent");
    }

    const handletoggle = () => {
        setActiveExportBtn("")
        setExportFlag((prevState) => !prevState);

        if (exportFlag === true) {
            fetchExportData();

        }
        if (exportFlag === false) {
            setExportData({})
        }

    };

    const fetchExportData = (e) => {
        setExportLoad(true)
      
        const token = localStorage.getItem("token")
        let userid = localStorage.getItem("userId");
        axios({
            method: 'POST',
            url: lambda + '/fetchExports?appname=' + appname + "&userid=" + userid + "&source=content" + "&token=" + token + "&userid=" + userid,
        })
            .then(function (response) {
                if (response) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        setExportData(response.data.result);
                        console.log("export data", response.data.result);
                        // const objj = response.data.result
                        // const k = Object.keys(objj).filter(item => objj[item].status === "Inprogress")
                        // console.log('kkkkkkkkkkkkkk',k)
                        // if (k.length <= 0){
                        //     setBtnDisable(false)
                        // }
                      
                    }
                    setExportLoad(false)
                }
                setExportLoad(false)

            });
    };
    // console.log('ActiveCheckId',activeCheckId)
    const handleRefresh = (e, item) => {
        setActiveCheckId(item.exportId)
        const token = localStorage.getItem("token")
        let userid = localStorage.getItem("userId");
        let exportId = item.exportId
        axios({
            method: 'POST',
            url: lambda + '/fetchExports?appname=' + appname + "&userid=" + userid + "&source=content" + "&token=" + token + "&exportid=" + exportId
        })
            .then(function (response) {
                if (response) {
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        console.log('response----------------->', response)
                       

                        const updatedRecord = response.data.result && response.data.result[0];
                       
                        const updatedData1 = exportData.map((record) => {
                            if (record.exportId === exportId) {
                                return { ...record, ...updatedRecord };
                            }
                            return record;
                        });

                        console.log('updatedData', updatedData1)
                       
                        setExportData(updatedData1);
                    }
                    setActiveCheckId("")
                }
                setActiveCheckId("")

            });
    };

    const handleDeleteExportFilePopup = (e, fileid) => {
        setDelete(true);
        setItem(fileid);
    }

    function onCancel() {
        setDelete(false)
    }


    const handleDeleteExportFile = (e) => {
        let userid = localStorage.getItem("userId");
        const token = localStorage.getItem("token")
        const id = item
        setLoaderDelete(true)
        axios({
            method: 'DELETE',
            url: lambda + '/deleteExports?appname=' + appname + "&exportid=" + id + "&userid=" + userid + "&token=" + token,
        })
            .then(function (response) {
                if (response) {
                    if (response.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {

                        fetchExportData();
                        setSuccess(true)
                    }
                    setLoaderDelete(false)
                    setDelete(false)

                }
            });
    }


    // console.log('exportData--->', exportData.length)
    // console.log('exportFlag--->', exportFlag)
    useEffect(() => {
        if(exportFlag === false && exportData.length>0){

        
        const interval = setInterval(() => {
            fetchExportData();
            
        }, 5000);
        return () => clearInterval(interval);}
      }, [exportFlag,exportData]);

    //   console.log('exportFlag',exportFlag)
    const handleExport = (e, type) => {
        // if(!btnDisable){
            setActiveExportBtn(type)
        let userid = localStorage.getItem("userId");
        let obj;
       
        if (contentsearch.trim() !== "" && flag) {
            obj = { "title":contentsearch }
        } else if (pay) {
            obj = { ...pay }
        }
        if (isCompanyInclude) {
            obj = { ...obj, "companyname": true }
        }
        const token = localStorage.getItem("token")

        axios({
            method: 'POST',
            url: lambda + '/export?appname=' + appname + "&userid=" + userid + '&type=' + type + "&source=content" + "&token=" + token,
            data: obj
        })
            .then(function (response) {
                if (response.data.result=="No data found with the filterd values") {
                    setIsAlert(true)
                }
                else {
                    setBtnDisable(true)
                    fetchExportData();
                }
            });
        // }
    }
    // const validateObj =[]

    // console.log('kkkkkkkkkkkkkkkkkk',userData)




    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />

             

                    <div className="main-content user-management content-management export">

                        <div className="page-content">
                            <div className="container-fluid">



                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <div className="title-block">
                                                <h4 className="mb-2 card-title">content management</h4>
                                                <div className="dropdown d-flex">

                                                    {subValDashboard && subValDashboard.add && subValDashboard.add.display === true &&
                                                        <button className={`${subValDashboard && subValDashboard.add && subValDashboard.add.enable === false ?
                                                            'disable' : ''
                                                            } btn-primary me-2`} type="button" disabled={subValDashboard && subValDashboard.add && subValDashboard.add.enable === false} onClick={handleAddContent}>
                                                            ADD CONTENT

                                                        </button>}
                                                    {subValDashboard && subValDashboard.import && subValDashboard.import.display === true &&
                                                        <button className={`${subValDashboard && subValDashboard.import && subValDashboard.import.enable === false ?
                                                            'disable' : ''
                                                            } btn-primary`} type="button"
                                                            disabled={subValDashboard && subValDashboard.import && subValDashboard.import.enable === false} onClick={handleUpload}>
                                                            IMPORT CONTENT

                                                        </button>}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                                <div className="row table-data " >
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="row mb-2">
                                                    <div className={`${exportFlag === true ?'col-sm-4':'col-sm-6'} button-block`}>
                                                        {subValDashboard && subValDashboard.export && subValDashboard.export.display === true && <>
                                                            {exportFlag === true ?
                                                                <div className="dataTables_length" id="datatable_length">

                                                                    <button className={`${subValDashboard && subValDashboard.export && subValDashboard.export.enable === false ?
                                                            'disable pe-none' : ''
                                                            } fill_btn`} disabled={validateObj && validateObj[0] && subValDashboard && subValDashboard.export && subValDashboard.export.enable === false} onClick={handletoggle}><span className="material-icons">north_east</span>Export</button>
                                                                </div>
                                                                :
                                                                <>
                                                                    <div className="dataTables_length" id="datatable_length">
                                                                        <button className="fill_btn" onClick={handletoggle}><span className="material-icons">arrow_back</span>BACK</button>
                                                                    </div>
                                                                    {data.length > 0 ? <>
                                                                        <div className="dataTables_length" id="datatable_length">
                                                                            <button 
                                                                            // className={`fill_btn text-danger border-danger fw-bolder ${btnDisable ? 'disable pe-none':''}`}
                                                                            className={`fill_btn text-danger border-danger fw-bolder ${activeExportBtn == 'pdf' ? 'active':''}`}
                                                                            
                                                                            onClick={(e) => handleExport(e, "pdf")}>PDF</button>
                                                                        </div><div className="dataTables_length" id="datatable_length">
                                                                            <button 
                                                                            
                                                                            // className={`fill_btn text-success border-success fw-bolder ${btnDisable ? 'disable pe-none':''}`}
                                                                            className={`fill_btn text-success border-success fw-bolder ${activeExportBtn == 'csv' ? 'active':''}`}
                                                                            
                                                                            onClick={(e) => handleExport(e, "csv")}>CSV</button>
                                                                        </div><div className="dataTables_length" id="datatable_length">
                                                                            <button 
                                                                            // className={`fill_btn text-primary border-primary fw-bolder ${btnDisable ? 'disable pe-none':''}`} 
                                                                             className={`fill_btn text-primary border-primary fw-bolder ${activeExportBtn == 'xls' ? 'active':''}`}
                                                                            
                                                                            onClick={(e) => handleExport(e, "xls")}>XLS</button>
                                                                        </div>
                                                                        <div className="dataTables_length" id="datatable_length">
                                                                            <button 
                                                                            
                                                                            // className={`fill_btn text-warning border-warning fw-bolder ${btnDisable ? 'disable pe-none':''}`} 
                                                                            className={`fill_btn text-warning border-warning fw-bolder ${activeExportBtn == 'fullxls' ? 'active':''}`} 
                                                                            
                                                                            
                                                                            onClick={(e) => handleExport(e, "fullxls")}>FULL XLS</button>
                                                                        </div>



                                                                    </>
                                                                        : null}

                                                                </>
                                                            }
                                                        </>
                                                        }





                                                    </div>

                                                    {exportFlag === true ?
                                                        <div className="col-sm-8">
                                                            <div className="search-box mb-2 d-inline-block">
                                                                <div className="position-relative">
                                                                    <input type="text" className="form-control" value={contentsearch} onChange={(e) => handleChange(e)} onKeyPress={handleKeypress} placeholder="Search Title" />
                                                                    <button className="fill_btn" onClick={(e) => handleSearch(e, "normalsearch")}><span className="material-icons search-icon">search</span></button>
                                                                </div>
                                                                <div className="dataTables_length" id="datatable_length">
                                                                    <button className="fill_btn" onClick={handleShowPopup}>Advanced Search</button>
                                                                </div>
                                                                <div className="dataTables_length" id="datatable_length">
                                                                    <button className="fill_btn" onClick={clearSearch}><span className="material-icons-outlined">sync</span>Reset</button>
                                                                </div>
                                                             
                                                            </div>
                                                            <div className="text-sm-end">

                                                            </div>
                                                        </div> : <div className="col-sm-6">
                                                            <div className="input-field switch-buttons d-flex"><label className="switch"><input type="checkbox" name="companyname" onChange={(e) => handleCompanyInclude(e)} /><span className="slider round"></span></label><label className="col-form-label">Company Name</label></div>
                                                        </div>}
                                                </div>
                                                {exportFlag === false ?
                                                
                                                
                                                exportData && exportData.length > 0 ? <div className="table-responsive">
                                                    <table className="table align-middle table-nowrap table-check export-table-data" id="table">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th></th>
                                                                <th className="align-middle">File</th>
                                                                <th className="align-middle" >status

                                                                </th>
                                                                <th className="align-middle">Created</th>
                                                                <th className="align-middle">Type</th>

                                                                <th className="align-middle">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        {/* <tbody> */}

                                                        <tbody>
                                                            {exportData && exportData.length > 0 && exportData.map(function (item, i) {
                                                                // console.log(item.downloadLink)
                                                                return (
                                                                    <tr key={i}>
                                                                        <th></th>
                                                                        <td>{item.exportId}</td>
                                                                        <td>{item.status === "Inprogress" ? <><label>Inprogress</label><div className="progress">
                                                                            <div className="progress-bar progress-bar-striped bg-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div></> : item.status}
                                                                        </td>
                                                                        <td>
                                                                        {new Date(item.created).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                    })}
                                                                        </td>
                                                                        <td>{item.type}</td>

                                                                        <td>
                                                                            <div className="d-flex">
                                                                                {item.status === "Inprogress" ? <a className="text-success action-button" onClick={(e) => handleRefresh(e, item)}>
                                                                                    <span className="material-icons-outlined text-warning">
                                                                                        {activeCheckId === item.exportId ?
                                                                                            (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg"
                                                                                                className="loading-icon" />) :


                                                                                            <span className="material-icons-outlined">refresh</span>}
                                                                                    </span></a>
                                                                                    : <a href={window && window.site &&  window.site.common && window.site.common.proxiesCloudFront + "/"+ item.downloadLink}
                                                                                        className="text-success action-button"
                                                                                    //  onClick={(e) => handleDownload(e, item.downloadLink)}
                                                                                    ><span className="material-icons-outlined text-success">download</span></a>}

                                                                                <a className="text-danger action-button"
                                                                                    //  onClick={(e) => handleDeleteExportFile(e, item.exportId)}
                                                                                    onClick={(e) => handleDeleteExportFilePopup(e, item.exportId)}

                                                                                ><span className="material-icons-outlined text-danger">delete_outline</span></a>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}

                                                        </tbody>

                                                      
                                                    </table>
                                                </div> :
                                                exportLoad ? 
                                                <div className="empty-state-body export-empty" >
                                                <div className="empty-state__message">
                                                <TableLoader />
                                                             </div> </div>
                                                
                                                :
                                                <div className="empty-state-body export-empty" >
                                                <div className="empty-state__message">
                                                                 <span className="material-icons">summarize</span>
                                                                 <p className="form-check font-size-16">No Export Data was found</p>
                                                             </div> </div>:
                                                    <>
                                                       < DataTable  key={keyForRerender}
                                                 // title=""
                                                 columns={columns}
                                                 // className="table align-middle table-nowrap table-check"
                                                 keyField='_id'
                                                 data={data}
                                                 direction="auto"
                                                 highlightOnHover
                                                 fixedHeaderScrollHeight="300px"
                                                 pagination
                                                 responsive
                                                 persistTableHead
                                                 // selectableRowsVisibleOnly
                                                 striped
                                                 // selectableRowsHighlight
                                                 // selectableRows
                                                 subHeaderAlign="right"
                                                 defaultSortField="name"
                                                 subHeaderWrap
                                                 noDataComponent={customNoRecords()}
                                                 paginationTotalRows={data.length}
                                                 onChangeRowsPerPage={handlePerRowsChange}
                                                 onChangePage={handlePageChange}
                                                 paginationPerPage={rowsPerPage}
                                                 paginationDefaultPage={currentPageNew}
                                                 paginationRowsPerPageOptions={[15,25,50,75,100]}
                                          
                                                 paginationComponentOptions={{
                                                     rowsPerPageText: 'Per page:',
                                                     rangeSeparatorText: 'of',
                                                     noRowsPerPage: false,
                                                     selectAllRowsItem: false,
                                                     selectAllRowsItemText: 'All',
                                                   }}
                                                // sortFunction={customSort}
                                                 progressPending={isLoading}
                                                 progressComponent={<TableLoader />}
                                                   />
                                                    
                                                    
                                                    </>
                                                }

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
                            title={"Deleted SuccessFully"}
                            onConfirm={e => onConfirm()}
                        >
                        </SweetAlert>
                        <SweetAlert show={isAlert}
                            custom
                            confirmBtnText="ok"
                            confirmBtnBsStyle="primary"
                            title={"No content to export as all selected are inactive content"}
                            onConfirm={e => onConfirm()}
                        >
                        </SweetAlert>
                        <Modal className="advance-search" show={popup} onHide={handleClosePopup} backdrop="static">
                            <Modal.Header closeButton>
                                <Modal.Title>Advanced Search</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><AdvanceSearch onData={handleData} /></Modal.Body>

                        </Modal>
                        <Modal className="access-denied" show={isdelete}>

                            <div className="modal-body enquiry-form">
                                <div className="container">
                                    <button className="close-btn" onClick={e => onCancel()}><span className="material-icons">close</span></button>
                                    <span className="material-icons access-denied-icon">delete_outline</span>
                                    <h3>Delete</h3>
                                    <p>This action cannot be undone.</p>
                                    <p>Are you sure you want to delete File?</p>
                                    <div className="popup-footer">
                                        <button className="fill_btn yellow-gradient" data-bs-toggle="modal" data-bs-target="#recommendModal" onClick={e => handleDeleteExportFile()}> {loaderDelete ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}Yes, Delete</button>
                                    </div>
                                </div>
                            </div>

                        </Modal>
                        <Footer />
                    </div>
         


            </div>
        </>
    );
};

export default ContentMange;