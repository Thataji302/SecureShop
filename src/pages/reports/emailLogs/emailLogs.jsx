/***
 **Module Name: Email Logs
 **File Name :  Emaillogs.js
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
 **Description : contains Email Logs table details.
 ***/
 import React, { useState, useEffect, useContext } from "react";
 import Footer from "../../../components/dashboard/footer";
 import Header from "../../../components/dashboard/header";
 import Sidebar from "../../../components/dashboard/sidebar";
 import tmdbApi from "../../../api/tmdbApi";
 import { useHistory, Link } from "react-router-dom";
 import SweetAlert from "react-bootstrap-sweetalert";
 import axios from "axios";
 import moment from "moment";
import ViewEmailLogs from "./viewEmailLogs"; 
import { contentContext } from "../../../context/contentContext";
 import SessionPopup from "../../SessionPopup"
 import Loader from "../../../components/loader";
 import TableLoader from "../../../components/tableLoader";
 import DataTable from 'react-data-table-component';
 import Tooltip from '@mui/material/Tooltip'

 let { appname, lambda } = window.app;
 
 const EmailLogs = () => {
   const history = useHistory();
   // const [toggle, setToggle] = useState(false);
   const [content, setContent] = useState("");
   const [perpage, setPerpage] = useState(10);
 
   // const [data, setData] = useState([]);
   const [fromdate, setFromDate] = useState("");
   const [rangeError, setRangeError] = useState(false); 

   const [todate, setToDate] = useState("");

   const [currentPage, setcurrentPage] = useState(1);

   const [EmailLogsSearch, setEmailLogsSearch] = useState("");
   const [showSessionPopupup, setShowSessionPopupup] = useState(false);
 
   const [ActiveEmailType, setActiveEmailType]= useState("");
   const [emailGroupData, setEmailGroupData]= useState([]);
 
 
   const [viewEmailLogs, setViewEmailLogs] = useState({});
   const [click, setClick] = useState(false);

   const { isLoading, setIsLoading, userData, data, setData,rowsPerPage, setRowsPerPage,currentPageNew, setCurrentPage,route, setRoute,usePrevious, setActiveMenuId ,setActiveMenuObj, GetTimeActivity} = useContext(contentContext)
 
 
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

  const keyForRerender = `${rowsPerPage}_${data.length}`;
   const columns = [
 
       {
           name: 'Name',
           selector: row =>  row?.name ?? "",
           sortable: true,
       },
       {
           name: 'Email Type',
           selector: row =>  row?.emailType ?? "",
           sortable: true,
       },
       {
           name: 'To Email ID',
           selector: row =>  typeof(row?.toEmailid)!='string'?  row?.toEmailid?.join(", "): row?.toEmailid,

           sortable: true,
       },
       { 
           name: 'status',
           selector: row =>  row?.successRes ? "Success": row?.errorRes ? "Fail":"",
           sortable: true,
       },
       {
          name: 'App Type',
          selector: row => row?.app ?? "",
          sortable: true,
      },
      {
       name: 'CREATED ON',
       // selector: row => moment(row.created).utc().format("DD-MMM-YYYY"),
       selector: row => row?.created ?new Date(row?.created).toLocaleDateString('en-IN', {
         day: 'numeric',
         month: 'short',
         year: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
       }):"",
       sortable: true,
   },
      
 
      
 
       {
           name: <>{subValDashboard && subValDashboard.view && subValDashboard.view.display === true && 'Actions'}</>,
           cell: (props) => 
          //   {
           subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
          <div className="d-flex">
          <a
            className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}
            onClick={(e) => handleEmailLogsView(e, props.uuid)}
          >
            <i className="mdi mdi-eye font-size-18"></i>
          </a>
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
     if (!localStorage.getItem("token")) {
       history.push("/");
     }
     setRoute("emaillogs")
     setActiveMenuId(300056)
     setActiveMenuObj({
         "Client Management": false,
         "Reports": true
     })
     getEmailLogs();
     userActivity();
     getEmailGroupData();
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
      const urlLink = `${lambda}/useractivity?appname=${appname}${previousId ? `&previousid=${previousId}` : ""}`;

 
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
   const getEmailLogs = async (e) => {
    GetTimeActivity()   
     setIsLoading(true)
     const token = localStorage.getItem("token")
     axios({
       method: "POST",
       url:
         lambda +
         "/emailLogs?appname=" +
         appname + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
     }).then(function (response) {
       console.log("response", response.data.result.data);
       if (response.data.result == "Invalid token or Expired") {
         setShowSessionPopupup(true)
       } else {
         setData(response.data.result.data);
         setContent(response.data.result);
         setIsLoading(false)
         setEmailLogsSearch("")
       }
     });
   };
 
 
   const handleSearch2 = (item) => {
    GetTimeActivity()   
    setCurrentPage(1);
   
    setIsLoading(true)
    const token = localStorage.getItem("token")
   
   
    let payload = item !== undefined && item !== "" ? { emailType: item } : {}
   
    console.log('handleSearch payload',payload)
     
       if(fromdate){
         payload.createdFromDate =fromdate
       }
       if(todate){
         payload.createdToDate =todate
       }
       if(EmailLogsSearch){
        payload.search = EmailLogsSearch
       }
     
   
    const linkUrl = `${lambda}/emailLogs?appname=${appname}&token=${token}&userid=${localStorage.getItem("userId")}`;

    console.log('payload', payload)
  
    axios({
      method: "POST",
      url: linkUrl,
      data: payload
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
    })
    .catch((err)=>{
     setIsLoading(false)
     console.log('error',err)
    });

  };

   const handleSearch = () => {
    GetTimeActivity()   
    const valid = validate()
        if(valid){
     setCurrentPage(1);
     console.log('EmailLogsSearch', EmailLogsSearch)

     setIsLoading(true)
     const token = localStorage.getItem("token")
    
     let payload = ActiveEmailType !== undefined && ActiveEmailType !== "" ? { emailType: ActiveEmailType } : {}
    
     console.log('handleSearch payload',payload)
  

        if(fromdate){
          payload.createdFromDate =fromdate
        }
        if(todate){
          payload.createdToDate =todate
        }
        if(EmailLogsSearch){
          payload.search = EmailLogsSearch
         }

     const linkUrl = `${lambda}/emailLogs?appname=${appname}&token=${token}&userid=${localStorage.getItem("userId")}`;

     console.log('payload', payload)
   
     axios({
       method: "POST",
       url: linkUrl,
       data: payload
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
     })
     .catch((err)=>{
      setIsLoading(false)
      console.log('error',err)
     });
    }
   };

   const handleChange = (e) => {
    
     if (e.target.value === "") {
       //getEmailLogs();
     }
     setEmailLogsSearch(e.target.value);
   };
 
   const handleKeypress = (e) => {
    GetTimeActivity()   
     //it triggers by pressing the enter key
 
     if (e.key === "Enter") {
       setTimeout(function () {
      
         handleSearch();
       }, 1000);
     }
   };
 
   const handleEmailLogsView = (e, id) => {
    GetTimeActivity()   
     for (let key in data) {
       
       if (data.hasOwnProperty(key) && data[key].uuid === id) {
         console.log("data id", id);
         setViewEmailLogs(data[key]);
         setClick(true);
 
       }
     }
   };

   useEffect(() => {
     if (EmailLogsSearch === "" && todate === "" && fromdate === "" && ActiveEmailType === "") {
       getEmailLogs();
     }
   }, [EmailLogsSearch, todate, fromdate, ActiveEmailType])
 
   const clearSearch = () => {
     setEmailLogsSearch("");
     GetTimeActivity()   
     setRangeError(false);
     setcurrentPage(1);
     setToDate("");
     setFromDate("")
     setActiveEmailType("")
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
 const handleEmailType = async (e) => {
  GetTimeActivity()   
  const value = e.target.value
  console.log('value',value)
  setCurrentPage(1)
  setRowsPerPage(15)
  setActiveEmailType(value)
  handleSearch2(value);
  // getEmailGroupData(value)


}
const getEmailGroupData = async (item) => {
  GetTimeActivity()   
    //  let payload = { emailType: [item] }
     setIsLoading(true)
     const token = localStorage.getItem("token")
     axios({
       method: 'POST',
       url: lambda + '/emailLogsGroup?appname=' + appname + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
     })
       .then(function (response) {
         console.log("response-->", response?.data)
         if (response?.data?.result == "Invalid token or Expired") {
           setShowSessionPopupup(true)
         } else {
           console.log("response 3", response.data);
           setEmailGroupData(response?.data?.result.sort())
         }
       });
   }

   const handleRange = (e)=>{
    
    setRangeError(false)
    if(e.target.name==="searchFrom"){
      setFromDate(e.target.value)
    }else{
      setToDate(e.target.value)
      
    }
   }
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

// console.log('email goup',emailGroupData)
 
   return (
     <>
       {showSessionPopupup && <SessionPopup />}
       <div id="layout-wrapper">
         <Header />
         <Sidebar />
         { click ? (<ViewEmailLogs data={viewEmailLogs} click={click} setClick={setClick} />) :
             <div className="main-content user-management clients clients-search recommeded email_logs">
               <div className="page-content">
                 <div className="container-fluid">
                   <div className="row mb-4 breadcrumb">
                     <div className="col-lg-12">
                       <div className="d-flex align-items-center">
                         <div className="flex-grow-1">
                           <h4 className="mb-2 card-title">Email Logs</h4>
                         </div>
                       </div>
                     </div>
                   </div>
 
                   <div className="row table-data">
                     <div className="col-12">
                       <div className="card">
                         <div className="card-body">
                           <div className="row mb-2">
                           <div className="col-sm-4">
                             <select name="Type-search" id="dropdown" value={ActiveEmailType} className="custom-select custom-select-sm form-control form-control-sm form-select form-select-sm" onChange={e => handleEmailType(e)}>
                             <option value="">Select Email Type</option>
                              {emailGroupData.map(eachItem=><option value={eachItem}>{eachItem}</option>)}
                            
                             </select>
                           </div>
                             <div className="col-sm-8">
                               <div className="search-box mb-2 d-inline-block">
                                 <div className="position-relative">
                                   <input
                                     type="text"
                                     className="form-control"
                                     placeholder="Search Name or Email"
                                     value={EmailLogsSearch}
                                     onChange={(e) => handleChange(e)}
                                     onKeyPress={handleKeypress}
                                   />


                                 {/* <div className="dropdown">
                                   <div className="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Search Between</div>
                                   <div className="dropdown-menu">
                                     <div className="form-group"><input className="form-control u-calendar" name="searchFrom" type="date" placeholder="Release Date" value={fromdate} onChange={(e) => handleRange(e)} max={new Date().toISOString().split('T')[0]} /></div>
                                     <p className="and">and</p>
                                     <div className="form-group"><input className="form-control u-calendar" name="searchTo" type="date" placeholder="Release Date" value={todate} onChange={(e) => handleRange(e)} max={new Date().toISOString().split('T')[0]} /></div>

                                     <div className="form-group"><button className="apply btn-primary">Apply</button></div>
                                   </div>
                                 </div> */}


                                 <div className="input-daterange input-group" id="datepicker6" data-date-format="dd M, yyyy" data-date-autoclose="true" data-provide="datepicker" data-date-container='#datepicker6'>
                                 <Tooltip title="From Date" placement="top">
                                   <input type="date" className="form-control date-input" name="searchFrom" placeholder="Search from" value={fromdate} onChange={(e) => handleRange(e)} max={new Date().toISOString().split('T')[0]} />
                                   </Tooltip>

                                   <Tooltip title="To Date" placement="top">
                                   <input type="date" className="form-control date-input" name="searchTo" placeholder="Search To" value={todate} onChange={(e) => handleRange(e)} max={new Date().toISOString().split('T')[0]}/>  
                                         </Tooltip>
                                 </div>





                                   <button className="fill_btn" onClick={(e)=>handleSearch()}>
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
 
 export default EmailLogs;
 