/***
**Module Name: contact us 
 **File Name :  contactus.js
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
 **Description : contains contact us table details.
 ***/
 import React, { useState, useEffect, useContext } from "react";
 import Footer from "../../components/dashboard/footer";
 import Header from "../../components/dashboard/header";
 import Sidebar from "../../components/dashboard/sidebar";
//  import tmdbApi from ".../../api/tmdbApi";
 import { useHistory, Link } from "react-router-dom";
 import SweetAlert from 'react-bootstrap-sweetalert';
 import axios from 'axios';
 import moment from "moment";
//  import ViewContactList from "../contactus/viewContactus";
 import Loader from "../../components/loader";
 import { contentContext } from "../../context/contentContext";
 import TableLoader from "../../components/tableLoader";
 import SessionPopup from "../SessionPopup";
 import DataTable from 'react-data-table-component';
// import ViewClientSessions from "./ViewClientSessions";
import Tooltip from '@mui/material/Tooltip'

 let { appname, lambda } = window.app;
 
 
 const ClientSessions = () => {
     const history = useHistory();
     // const [toggle, setToggle] = useState(false);
     const [content, setContent] = useState("");
     const [perpage, setPerpage] = useState(10);
     const [loginToDate, setLogintodate] = useState("");
     const [loginFromDate, setLoginfromdate] = useState("");
 
 
    //  const [data, setData] = useState([]);
 
    const [rangeError, setRangeError] = useState(false); 


     const [sortDirection, setSortDirection] = useState('asc');
    const [arrowdir, setArrowDir] = useState('down');
    const [num, setNum]= useState();
 
     //const [search, setSearch] = useState("");
     const [viewContact, setViewContact] = useState({});
     const [click, setClick] = useState(false);
     const [NameEmailSearch, setNameEmailSearch] = useState("");

    //  const [isLoading, setIsLoading] = useState(false);
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
     const { isLoading, setIsLoading,sortTableAlpha , arrow,sortTableByDate,userData , data, setData,rowsPerPage, setRowsPerPage,currentPageNew, setCurrentPage,route, setRoute,usePrevious,setActiveMenuObj,setActiveMenuId, GetTimeActivity} = useContext(contentContext)
 

     const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem=>eachItem.menu == "Reports")
     const subValDashboard = validateObj && validateObj[0] && validateObj[0].submenus && validateObj[0].submenus[2] && validateObj[0].submenus[2].dashboard
    //  console.log('subValDashboard obj',subValDashboard)


 
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
            name: 'User name',
            selector: row => row?.userData?.[0]?.name ?? '',
            sortable: true,
        },
        {
            name: 'User email id', 
            selector: row => row?.userData?.[0]?.emailid ?? '',
            sortable: true,
        },
       
        { 
            name: 'login time',
         
            selector: row =>  row?.login ? new Date(row.login).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }) : "",
            sortable: true,
        },
        { 
            name: 'logout time',
         
            
            selector: row =>  row?.loggedout ? new Date(row.loggedout).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }) : "",

            sortable: true,
        },
  
    
     
        {
            name: <>{subValDashboard && subValDashboard.view && subValDashboard.view.display === true && 'Actions'}</>,
            cell: (props) => 
           //   {
            subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
           <div className="d-flex">
           <a className={`${ subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none':''} text-success action-button`} onClick={(e)=>handleContactView(e,props._id)}><i className="mdi mdi-eye font-size-18"></i></a>

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
         setRoute("clientsessions")
         setActiveMenuId(300002)
         setActiveMenuObj({
             "Client Management": false,
             "Reports": true
         })
            getClientSessions();
            // userActivity();
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
 
    
 
     const customNoRecords = () => {
        return(
            
            <div className="empty-state-body empty-record"  >
                <div className="empty-state__message">
                    <span className="material-icons">summarize</span>
                    <p className="form-check font-size-16">No names were found with the searched keyword</p>
                </div> </div>
        )
    }
 
 
    const validate = () => {
        GetTimeActivity()   
        let flag = true
        if (loginFromDate && loginToDate) {
            if (new Date(loginFromDate) > new Date(loginToDate)) {
                setRangeError(true)
                flag = false;
            } else {
                setRangeError(false)
            }
        }
        return flag
    }


 
     const getClientSessions = () => {
        GetTimeActivity()   
        const valid = validate()
        if(valid){
        setCurrentPage(1);
       
    
            setIsLoading(true)
            const token = localStorage.getItem("token")
            let payload = {}
            if (NameEmailSearch) {
                payload.search = NameEmailSearch;
              }
              
              if (loginFromDate) {
                payload.loginfromdate = loginFromDate;
              }
              
              if (loginToDate) {
                payload.logintodate = loginToDate;
              }
              
             axios({
                 method: 'POST',
                 url: lambda + '/sessionReports?appname=' + appname + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
                 data:payload
             })
                 .then(function (response) {
                     if (response.data.result === "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                         console.log("response", response);
                         setData(response.data.result.data);
                         setContent(response.data.result);
                         console.log("dataaaaaa--->",data)
                        //  console.log("rrrrrr---->",content)
                         setIsLoading(false)
                     }
                 });
                }
     }
 
     const handleChange = (e) => {
        GetTimeActivity()   
        setRangeError(false);
        const {name,value} = e.target
        if(name === 'search')
         setNameEmailSearch(e.target.value)
         if(name === 'logintodate')
         setLogintodate(value)
         if(name === 'loginfromdate')
         setLoginfromdate(value)
        }

 
     const handleKeypress = (e) => {
        GetTimeActivity()   
         //it triggers by pressing the enter key
        
       if ((e.key === "Enter")) {
         setTimeout(function () { 
            getClientSessions();
     }, 1000);
       }
     };

     const handleContactView = (e, id) => {
        GetTimeActivity()   
        for (let key in data) {
          console.log("data",data);
          if (data.hasOwnProperty(key) && data[key]._id === id) {

            setViewContact(data[key]);
            setClick(true);
            
          }
        }
      };
     useEffect(() => {
         if (loginToDate === "" && loginFromDate === "" && NameEmailSearch==="") {
             getClientSessions()
         }
     }, [loginToDate, loginFromDate,NameEmailSearch])
      const clearSearch = () => {
        setNameEmailSearch("");
        // getClientSessions();
        GetTimeActivity()   
        setRangeError(false);
        setCurrentPage(1);
        setLogintodate("");
        setLoginfromdate("");
     }
 

    
     return (
         <>
 {showSessionPopupup && <SessionPopup />}
             <div id="layout-wrapper">
                 <Header />
                 <Sidebar />
              
                 <div className="main-content user-management clients clients-search contact account-manager-report Client_Sessions_Report">
 
                     <div className="page-content">
                         <div className="container-fluid">
 
 
 
                             <div className="row mb-4 breadcrumb">
                                 <div className="col-lg-12">
                                     <div className="d-flex align-items-center">
                                         <div className="flex-grow-1">
                                             <h4 className="mb-2 card-title">Sessions Report</h4>
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
 
                                                 </div>
                                                 <div className="col-sm-8">
 
                                                     <div className="search-box mb-2 d-inline-block">
                                                         <div className="position-relative">
                                                             <input type="text" className="form-control" placeholder="Search name" value={NameEmailSearch} name="search" onChange={(e) => handleChange(e)} onKeyPress={handleKeypress} />

                                                             {/* <input className="form-control u-calendar" name="loginfromdate" type="date" placeholder="login from date"  value={loginFromDate} onChange={(e) => handleChange(e)} max={new Date().toISOString().split('T')[0]}  />
                                                             <input className="form-control u-calendar" name="logintodate" type="date" placeholder="login to date" onChange={(e) => handleChange(e)} max={new Date().toISOString().split('T')[0]}  value={loginToDate} /> */}

                                                             <div className="input-daterange input-group" id="datepicker6" data-date-format="dd M, yyyy" data-date-autoclose="true" data-provide="datepicker" data-date-container='#datepicker6'>
                                                             <Tooltip title="From Date" placement="top">

                                                                    <input type="date" className="form-control date-input" name="loginfromdate" placeholder="login from date"  value={loginFromDate} onChange={(e) => handleChange(e)} max={new Date().toISOString().split('T')[0]}  />

                                                                    </Tooltip>

                                                                    <Tooltip title="To Date" placement="top">

                                                                      <input type="date" className="form-control date-input" name="logintodate"  placeholder="login to date" onChange={(e) => handleChange(e)} max={new Date().toISOString().split('T')[0]}  value={loginToDate} />

                                                                      </Tooltip>
                                                                </div>
                                                             
                                                             <button className="fill_btn" onClick={getClientSessions}><span className="material-icons search-icon">search</span></button>
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
 
             </div>
         </>
     );
 };
 
 export default ClientSessions;
 