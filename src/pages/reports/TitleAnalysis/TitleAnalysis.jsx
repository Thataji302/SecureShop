/***
 **Module Name: recommend
 **File Name :  recommend.js
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
 **Description : contains recommend table details.
 ***/
 import React, { useState, useEffect, useContext } from "react";
 import Footer from "../../../components/dashboard/footer";
 import Header from "../../../components/dashboard/header";
 import Sidebar from "../../../components/dashboard/sidebar";
 import tmdbApi from "../../../api/tmdbApi";
 import { useHistory, Link } from "react-router-dom";
 import SweetAlert from "react-bootstrap-sweetalert";
 import Tooltip from '@mui/material/Tooltip'

 import axios from "axios";
 import moment from "moment";
 import { contentContext } from "../../../context/contentContext";
 import SessionPopup from "../../SessionPopup"
 import Loader from "../../../components/loader";
 import TableLoader from "../../../components/tableLoader";
 import DataTable from 'react-data-table-component';
import ViewTitleAnalysis from "./ViewTitleAnalysis";

 let { appname, lambda } = window.app;
 
 const TitleAnalysis = () => {
   const history = useHistory();
   // const [toggle, setToggle] = useState(false);
   const [content, setContent] = useState("");
   const [perpage, setPerpage] = useState(10);
 
   // const [data, setData] = useState([]);
 
   const [currentPage, setcurrentPage] = useState(1);
 
   const [itemsPerPage, setitemsPerPage] = useState(10);
 
   const [pageNumberLimit, setpageNumberLimit] = useState(5);
   const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
   const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
 
   const [TitleSearch, setTitleSearch] = useState("");
   const [ClientNameSearch, setClientNameSearch] = useState("");
   const [showSessionPopupup, setShowSessionPopupup] = useState(false);
 
   const [sortDirection, setSortDirection] = useState('asc');
   const [arrowdir, setArrowDir] = useState('down');
   const [num, setNum]= useState();
   const [rangeError, setRangeError] = useState(false); 

   const [fromdate, setFromDate] = useState("");
   const [todate, setToDate] = useState("");


   const [viewRecommend, setViewRecommend] = useState({});
   const [click, setClick] = useState(false);
   // const [isLoading, setIsLoading] = useState(false);
   
     const {  GetTimeActivity, isLoading, setIsLoading, sortTableAlpha, arrow, sortTableByDate, userData, data, setData,rowsPerPage, setRowsPerPage,currentPageNew, setCurrentPage,route, setRoute,usePrevious, setActiveMenuId ,setActiveMenuObj } = useContext(contentContext)
 
 
   const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem => eachItem.menu == "Reports")
   const subValDashboard = validateObj && validateObj[0] && validateObj[0].submenus && validateObj[0].submenus[1] && validateObj[0].submenus[1].dashboard
   // console.log('subValDashboard obj',subValDashboard)
 
   const prevRoute = usePrevious(route)
   useEffect(() => {
       if(prevRoute != undefined && prevRoute!=route){
           setCurrentPage(1)
           setRowsPerPage(15)
       }
   }, [prevRoute]);
  //  console.log('prevRoute--->',prevRoute)
  //  console.log('currentRoute--->',route)
  const keyForRerender = `${rowsPerPage}_${data.length}`;
   const columns = [
 
       {
           name: 'title',
           selector: row => row?.title ?? "",
           sortable: true,
       },
       { 
        name: 'Client Name',
     
        selector: row =>  row?.clientData?.[0]?.name ?? "",
        // cell: (props) => <div className="text-elipsis">{props.message}</div>,

        sortable: true,
    },
    { 
        name: 'Company Name',
     
        selector: row => row?.clientData?.[0]?.companyname[0] ?? "",
        // cell: (props) => <div className="text-elipsis">{props.message}</div>,

        sortable: true,
    },
       { 
           name: 'Cart',
           selector: row =>  row?.addedToCart ? "TRUE": "FALSE",
           sortable: true,
       },
       {
          name: 'Enquired',
          selector: row => row?.enquired ? "TRUE": "FALSE",
          sortable: true,
      },
      {
       name: 'Viewed On',
       // selector: row => moment(row.created).utc().format("DD-MMM-YYYY"),
       selector: row => row.created ? new Date(row.created).toLocaleDateString('en-IN', {
         day: 'numeric',
         month: 'short',
         year: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
       }) : "",
       sortable: true,
   },
      
 
      
 
    //    {
    //        name: <>{subValDashboard && subValDashboard.view && subValDashboard.view.display === true && 'Actions'}</>,
    //        cell: (props) => 
    //       //   {
    //        subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
    //       <div className="d-flex">
    //       <a
    //         className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}
    //         onClick={(e) => handleRecommendView(e, props.recommendedid)}
    //       >
    //         <i className="mdi mdi-eye font-size-18"></i>
    //       </a>
    //     </div>
    //       //  }
    //        ,
    //        ignoreRowClick: true,
    //        allowOverflow: true,
    //        button: true,
    //    },
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
     if (!localStorage.getItem("token")) {
       history.push("/");
     }
     setRoute("titleanalysis")
    setActiveMenuId(300059)
     setActiveMenuObj({
         "Client Management": false,
         "Reports": true
     })
     getTitleAnalysis();
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
   const getTitleAnalysis = async (e) => {
    GetTimeActivity()   

    // console.log('get titlte analysis--->')
     setIsLoading(true)
     const token = localStorage.getItem("token")
     axios({
       method: "POST",
       url:
         lambda +
         "/contentReports?appname=" +
         appname + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
     }).then(function (response) {
      //  console.log("response", response.data.result.data);
       if (response.data.result == "Invalid token or Expired") {
         setShowSessionPopupup(true)
       } else {
         setData(response.data.result.data);
         setContent(response.data.result);
         setIsLoading(false)
         setTitleSearch("")
       }
     });
   };
 
 
 
 
   const validate = () => {
    GetTimeActivity()   

    let flag = true
    if (fromdate && todate) {
        if (new Date(fromdate) > new Date(todate)) {
            setRangeError(true)
            flag = false;
        } else {
            setRangeError(false)
        }
    }
    return flag
}

 
   const handleSearch = () => {
    GetTimeActivity()   

    const valid = validate()
    if(valid){
    console.log('handleSearch')
     setCurrentPage(1);
       setIsLoading(true)
       const token = localStorage.getItem("token")
       let payload ={};

  
        if(fromdate){
          payload.viewedfromdate =fromdate
        }
        if(todate){
          payload.viewedtodate =todate
        }
      
     
       const linkUrl = `${lambda}/contentReports?appname=${appname}&token=${token}&userid=${localStorage.getItem("userId")}${ClientNameSearch ? `&clientname=${ClientNameSearch}` :''}${TitleSearch ? `&title=${TitleSearch}`:''}`
       axios({
         method: "POST",
         url:linkUrl,
         data:payload
       }).then(function (response) {
         console.log("res", response)
          if (response.data.result == "Invalid token or Expired") {
           setShowSessionPopupup(true)
         } else {
           console.log("response", response);
           setData(response.data.result.data);
           setContent(response.data.result);
           setIsLoading(false)
         }
       });
      }
   };
 
   const handleChange = (e) => {
    const {name,value}=e.target
    if(name === "titlesearch")
     setTitleSearch(value);
    else
    setClientNameSearch(value)
   };
 
   const handleKeypress = (e) => {
     //it triggers by pressing the enter key
     GetTimeActivity()   
 
     if (e.key === "Enter") {
       setTimeout(function () {
         handleSearch();
       }, 1000);
     }
   };
   const handleRange = (e)=>{
    setRangeError(false)
    if(e.target.name==="viewedfromdate"){
      setFromDate(e.target.value)
    }else{
      setToDate(e.target.value)
    }
   }
   useEffect(() => {
     if (TitleSearch === "" && ClientNameSearch === "" && todate === "" && fromdate === "") {
       getTitleAnalysis();
     }
   }, [TitleSearch, ClientNameSearch, todate, fromdate])
   const clearSearch = () => {
    GetTimeActivity()   
     setTitleSearch("");
     setRangeError(false)
     setcurrentPage(1);
     setToDate("");
     setFromDate("");
     setClientNameSearch("");
   }
   const customNoRecords = () => {
     return(
         
         <div className="empty-state-body empty-record"  >
             <div className="empty-state__message">
                 <span className="material-icons">summarize</span>
                 <p className="form-check font-size-16">No names or emails were found with the searched keyword</p>
             </div> </div>
     )
 } 
 
   // console.log("matched data--------->", viewRecommend);
   return (
     <>
       {showSessionPopupup && <SessionPopup />}
       <div id="layout-wrapper">
         <Header />
         <Sidebar />
         { click ? (<ViewTitleAnalysis data={viewRecommend} click={click} setClick={setClick} />) :
             <div className="main-content user-management clients clients-search recommeded title_analysis_report">
               <div className="page-content">
                 <div className="container-fluid">
                   <div className="row mb-4 breadcrumb">
                     <div className="col-lg-12">
                       <div className="d-flex align-items-center">
                         <div className="flex-grow-1">
                           <h4 className="mb-2 card-title">Title Analysis Report</h4>
                         </div>
                       </div>
                     </div>
                   </div>
 
                   <div className="row table-data">
                     <div className="col-12">
                       <div className="card">
                         <div className="card-body">
                           <div className="row mb-2">
                             <div className="col-sm-4"></div>
                             <div className="col-sm-8">
                               <div className="search-box mb-2 d-inline-block">
                                 <div className="position-relative">
                                 <input
                                     type="text"
                                     className="form-control"
                                     placeholder="Search by client name"
                                     value={ClientNameSearch}
                                     name="clientnamesearch"
                                     onChange={(e) => handleChange(e)}
                                    
                                   />
                                   <input
                                     type="text"
                                     className="form-control"
                                     placeholder="Search Title"
                                     name="titlesearch"
                                     value={TitleSearch}
                                     onChange={(e) => handleChange(e)}
                                     onKeyPress={handleKeypress}
                                   />
                                      <div className="input-daterange input-group" id="datepicker6" data-date-format="dd M, yyyy" data-date-autoclose="true" data-provide="datepicker" data-date-container='#datepicker6'>


                                      <Tooltip title="From Date" placement="top">


                                   <input type="date" className="form-control date-input" name="viewedfromdate" placeholder="Search from" value={fromdate} onChange={(e) => handleRange(e)} max={new Date().toISOString().split('T')[0]} />
                                   </Tooltip>



                                   <Tooltip title="To Date" placement="top">


                                   <input type="date" className="form-control date-input" name="viewedtodate" placeholder="Search To" value={todate} onChange={(e) => handleRange(e)} max={new Date().toISOString().split('T')[0]}/> 
                                   
                                   </Tooltip>
                                 </div>

                                   {/* <input className="form-control u-calendar" name="availableFrom" type="date" placeholder="Release Date" max="2023-03-15" value="" />
                                                              <input className="form-control u-calendar" name="availableFrom" type="date" placeholder="Release Date" max="2023-03-15" value="" /> */}
                                   <button className="fill_btn" onClick={handleSearch}>
                                     <span
                                       className="material-icons search-icon"
                                     
                                     >
                                       search
                                     </span>
                                   </button>
                                 </div>
                                 <div className="dataTables_length" id="datatable_length">
                                   <button className="fill_btn" onClick={clearSearch}><span className="material-icons-outlined">sync</span>Reset</button>
                                 </div>
                                
                               </div>
                               <div className="text-sm-end">  
                               {rangeError && <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>To date cannot be earlier than From date</span>}
                               </div>
                             </div>
                           </div>
 
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
                                                  subHeaderWra
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
                                            
                                                  progressPending={isLoading}
                                                  progressComponent={<TableLoader />}
                                                    />
                         </div>
                       </div>
                     </div>
                   </div>
 
                 </div>
               </div>
 
               <Footer />
             
             </div>
         }
       </div>
     </>
   );
 };
 
 export default TitleAnalysis;
 