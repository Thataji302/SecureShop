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
 import { useHistory, Link } from "react-router-dom";
 import SweetAlert from 'react-bootstrap-sweetalert';
 import axios from 'axios';
 import moment from "moment";

//  import Loader from "../../../components/loader";
 import { contentContext } from "../../context/contentContext";
 import TableLoader from "../../components/tableLoader";
 import SessionPopup from "../SessionPopup";
 import DataTable from 'react-data-table-component';

import * as XLSX from 'xlsx';
import Tooltip from '@mui/material/Tooltip'

import * as FileSaver from 'file-saver';

 let { appname, lambda } = window.app;
 
 
 const Activity = () => {
     const history = useHistory();
     // const [toggle, setToggle] = useState(false);
     const [content, setContent] = useState("");
     const [perpage, setPerpage] = useState(10);
 
 
    //  const [data, setData] = useState([]);
 
    const [tableErrMsg, setTableErrMsg] = useState(false);


     const [sortDirection, setSortDirection] = useState('asc');
    const [arrowdir, setArrowDir] = useState('down');
    const [num, setNum]= useState();
    const [clientGroupData, setClientGroupData]= useState([]);
    // const [ActivePageName, setActivePageName]= useState("");

     //const [search, setSearch] = useState("");
     const [viewContact, setViewContact] = useState({});
     const [ClientNameSearch, setClientNameSearch] = useState("");
     const [click, setClick] = useState(false);
    //  const [isLoading, setIsLoading] = useState(false);
     const [showSessionPopupup, setShowSessionPopupup] = useState(false);
     const [rangeError, setRangeError] = useState(""); 

     const getFormattedDate = (date) => {
        return date.toISOString().split('T')[0];
      };
    
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
      const formattedFromDate = getFormattedDate(thirtyDaysAgo);
      const formattedToDate = getFormattedDate(new Date());
    
    //   const [fromdate, setFromDate] = useState(formattedFromDate);
    //   const [todate, setToDate] = useState(formattedToDate);
      const [fromdate, setFromDate] = useState(""); 
      const [todate, setToDate] = useState("");
    //  const [fromdate, setFromDate] = useState(() => {
    //      // Set default value for fromdate (one month ago)
    //      const oneMonthAgo = new Date();
    //      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    //      return oneMonthAgo.toISOString().split('T')[0];
    //    });
       
    //    const [todate, setToDate] = useState(() => {
    //      // Set default value for todate (today)
    //      return new Date().toISOString().split('T')[0];
    //    });
       
 
     const { isLoading, setIsLoading,sortTableAlpha , arrow,sortTableByDate,userData , data, setData,rowsPerPage, setRowsPerPage,currentPageNew,setCurrentPage,route, setRoute,usePrevious,setActiveMenuObj,setActiveMenuId, GetTimeActivity,ActivePageName, setActivePageName} = useContext(contentContext)
 

     const validateObj = userData && userData.permissions && userData.permissions.length > 0 && userData.permissions.filter(eachItem=>eachItem.menu == "Reports")
     const subValDashboard = validateObj && validateObj[0] && validateObj[0].submenus && validateObj[0].submenus[2] && validateObj[0].submenus[2].dashboard
    //  console.log('subValDashboard obj',subValDashboard)

         

     

 
    const prevRoute = usePrevious(route)
    useEffect(() => {
        if(prevRoute != undefined && prevRoute!=route){
            setCurrentPage(1)
            setRowsPerPage(15)
            setClientNameSearch("")
        
            // const oneMonthAgo = new Date();
            // oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            // const formattedFromDate = oneMonthAgo.toISOString().split('T')[0];
            setFromDate(formattedFromDate);
        
            // Set default value for todate (today)
            // const formattedToDate = new Date().toISOString().split('T')[0];
            setToDate(formattedToDate);
        }
    }, [prevRoute]);
   //  console.log('prevRoute--->',prevRoute)
   //  console.log('currentRoute--->',route)
   const keyForRerender = `${rowsPerPage}_${data?.length}`;
    const columns = [

        {
            name: 'Page Name',
            selector: row => row?.pagename ?? "",
            sortable: true,
        },
        {
            name: 'Page url',
            selector: row => row?.pageurl ?? "",
            // cell: (props) => <a className="text-elipsis" href={props?.pageurl}>{props?.pageurl}</a>,

            sortable: true,
        },
        
        { 
            name: 'User Name',
         
            selector: row => row && row.userData &&  row.userData[0] && row.userData[0].name ? row?.userData[0]?.name  : "",
            // cell: (props) => <div className="text-elipsis">{props.message}</div>,

            sortable: true,
        },
       
    
        {
            name: 'Start Time',
            selector: row => row?.created,
              cell: (props) =>   props.created != undefined ?  new Date(props.created).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            }) :'',
            sortable: true,
            //   sortFunction: (a, b) => moment(a.created).diff(b.created),
        },
       
        { 
            name: 'End Time',
         
            selector: row =>  row?.endtime ,
              cell: (props) =>   props.endtime != undefined ?  new Date(props.endtime).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            }) :'',
            // cell: (props) => <div className="text-elipsis">{props.message}</div>,

            sortable: true,
            // sortFunction: (a, b) => moment(a.endtime).diff(b.endtime),
        },
        {
            name: <>{subValDashboard && subValDashboard.view && subValDashboard.view.display === true && 'Actions'}</>,
            cell: (props) => 
           //   {
            subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
           <div className="d-flex">
           <a className={`${ subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none':''} text-success action-button`}><i className="mdi mdi-eye font-size-18"></i></a>

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
         setRoute("clientactivity")
         setActiveMenuId(300001)
         setActiveMenuObj({
             "Client Management": false,
             "Reports": true
         })
            getClientActivity();
        //    userActivity();
            
     }, []);

     const getClientActivityGroupData = async (item) => {
        GetTimeActivity()   
        //  let payload = { emailType: [item] }
         setIsLoading(true)
         const token = localStorage.getItem("token")
         axios({
           method: 'POST',
           url: lambda + '/clientActivityGroup?appname=' + appname + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
         })
           .then(function (response) {
             console.log("response-->", response?.data)
             if (response?.data?.result === "Invalid token or Expired") {
               setShowSessionPopupup(true)
             } else {
               console.log("response 3", response?.data);
               setClientGroupData(response?.data?.result)
             }
           }).catch((err) => {
            console.log('error', err);
            setTableErrMsg(true)
            setIsLoading(false);
        });
       }

       const handleClientType = async (e) => {
        GetTimeActivity()   
        const value = e.target.value
        console.log('value',value)
        setCurrentPage(1)
        setRowsPerPage(15)
        setActivePageName(value)
        
        handleSearch2(value);
      console.log("search----->",handleSearch2)
      }  
   

    // const handleViewClientActivity = (e, id) => {
    //     GetTimeActivity();
    //     history.push("/viewclientactivity/" + id);
    // }

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
        const urlLink = `${lambda}/useractivity?appname=${appname}${previousId ? `&previousid=${previousId}` : ''}`;
        
        axios({
            method: 'POST',
            url: urlLink,
            data: payload
        })
            .then(function (response) {
                if (response?.data?.statusCode === 200) {
                    localStorage.setItem("previousid", response?.data?.result)
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
        if (fromdate && todate) {
            if (new Date(fromdate) > new Date(todate)) {
                setRangeError("To date cannot be earlier than From date")
                flag = false;
            } else {
                const fromDateObj = new Date(fromdate);
                const toDateObj = new Date(todate);
                const dateDifference = Math.abs(toDateObj - fromDateObj) / (1000 * 60 * 60 * 24);
            
                if (dateDifference > 30) {
                    setRangeError('Date range should be maximum 30 days');
                    flag = false;
                } else {
                    setRangeError("");
                  // Perform your search logic here
                }
                // setRangeError("")
            }
        }
        if(fromdate === ""){
            setRangeError("Please select From Date")
            flag = false;
        }else if(todate === ""){
            setRangeError("Please select To Date")
            flag = false;
        } 
     
        return flag
    }

 
 

 
     const getClientActivity = () => {
        const valid = validate()
        if(valid){
        setCurrentPage(1);
       
        GetTimeActivity()   
            setIsLoading(true)
            const token = localStorage.getItem("token")
            const linkUrl = `${lambda}/activityReports?appname=${appname}&token=${token}&userid=${localStorage.getItem("userId")}` +  (ClientNameSearch ? `&search=${ClientNameSearch}` : '') + (ActivePageName ? `&pagename=${ActivePageName}` :'') +  (fromdate ? `&searchedFrom=${fromdate}` : "") +
            (todate ? `&searchedTo=${todate}` : "") ;
          
          
             axios({
                 method: 'POST',
                 url: linkUrl,
             })
                 .then(function (response) {
                     if (response?.data?.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                         console.log("response", response);
                         setData(response?.data?.result?.data);
                         global.exportExcelData = response?.data?.result?.data
                      


                         setContent(response?.data?.result);
                         setIsLoading(false)
                     }
                 }).catch((err) => {
                    console.log('error', err);
                    setTableErrMsg(true)
                    setIsLoading(false);
                });
            }
     }
     useEffect(() => {
        // const oneMonthAgo = new Date();
        // oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        // const formattedFromDate = oneMonthAgo.toISOString().split('T')[0];
        // // setFromDate(formattedFromDate);

        // // Set default value for todate (today)
        // const formattedToDate = new Date().toISOString().split('T')[0];
        // // setToDate(formattedToDate);
        if (fromdate === formattedFromDate && todate === formattedToDate && ClientNameSearch === "") {
            getClientActivity()
        }
    }, [fromdate, todate, ClientNameSearch])

console.log('ClientNameSearch',ClientNameSearch)
     const handleSearch2 = (item) => {
        GetTimeActivity()   
        setCurrentPage(1);
           setIsLoading(true)
            const token = localStorage.getItem("token")
            const linkUrl = `${lambda}/activityReports?appname=${appname}&token=${token}&userid=${localStorage.getItem("userId")}` +  (ClientNameSearch ? `&search=${ClientNameSearch}` : '') + (item ? `&pagename=${item}` :'')+(fromdate ? `&searchedFrom=${fromdate}` : "") +
            (todate ? `&searchedTo=${todate}` : "") ;
           
          
             axios({
                 method: 'POST',
                 url: linkUrl,
             })
                 .then(function (response) {
                     if (response?.data?.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                         console.log("response", response);
                         setData(response?.data?.result?.data);
                         global.exportExcelData = response?.data?.result?.data
                      


                         setContent(response?.data?.result);
                         setIsLoading(false)
                     }
                 }).catch((err) => {
                    console.log('error', err);
                    setTableErrMsg(true)
                    setIsLoading(false);
                });
         
     }
 
     const handleChange = (e) => {
        GetTimeActivity()   
         setClientNameSearch(e.target.value)
     }

 
     const handleKeypress = (e) => {
         //it triggers by pressing the enter key
         GetTimeActivity()    
       if ((e.key === "Enter")) {
         setTimeout(function () { 
         getClientActivity();
     }, 1000);
       }
     };

  
      useEffect(() => {
        if (ClientNameSearch === "" && ActivePageName === "" ) {
            getClientActivity();
        }
    }, [ ClientNameSearch,ActivePageName])


      const clearSearch = () => {
        setClientNameSearch("");
        GetTimeActivity()   
       
       setActivePageName("")
        setCurrentPage(1);
        setRangeError(false);
        // setFromDate("")
        // const oneMonthAgo = new Date();
        // oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        // const formattedFromDate = oneMonthAgo.toISOString().split('T')[0];
        setFromDate(formattedFromDate);

        // Set default value for todate (today)
        // const formattedToDate = new Date().toISOString().split('T')[0];
        setToDate(formattedToDate);
     }
 

     const handleExport = () => {
       
              // let k = defaultData || exportExcelData
          const modifiedArray = global.exportExcelData.map((each,i) => ({
                "S.NO":i+1,
                "PAGE NAME": each?.pagename ?? "",
                "PAGE URL": each?.pageurl ?? "",
                "CLIENT NAME": each?.clientData?.[0]?.name ?? "",
                "COMPANY NAME": Array.isArray(each?.clientData?.[0]?.companyname) ? each?.clientData?.[0]?.companyname?.[0] : each?.clientData?.[0]?.companyname ?? "",
                "START TIME":  each?.created ? new Date(each?.created).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short', 
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                   
                }) :"",
                "END TIME":   each?.endtime ? new Date(each?.endtime).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short', 
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                   
                }) :"",
              }));
            
            exportToExcel(modifiedArray, "data");
      
        }
        function exportToExcel(jsonData, fileName) {
            delete jsonData['_id'];
            const worksheet = XLSX.utils.json_to_sheet(jsonData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
            //FileSaver.saveAs(data, `${fileName}.xlsx`);
            FileSaver.saveAs(data, `ClientActivityData.xlsx`);
        }
    //   console.log('data',data)
    const customSort = (rows, selector, direction) => {
        const sortedData = rows.slice().sort((rowA, rowB) => {
          // use the selector function to resolve your field names by passing the sort comparators
          // const aField = selector(rowA);
        const aField = String(selector(rowA)).toLowerCase();

          //  const bField = selector(rowB);
          const bField = String(selector(rowB)).toLowerCase();
      
          let comparison = 0;
      
          if (aField > bField) {
            comparison = 1;
          } else if (aField < bField) {
            comparison = -1;
          }
      
          return direction === 'desc' ? comparison * -1 : comparison;
        });
      
        // Log the sorted data to the console
        // setSortedRecomData(sortedData)
        global.exportExcelData = sortedData
        // console.log('Sorted Data------>:', sortedData);
      
        return sortedData;
      };    

     return (
         <>
 {showSessionPopupup && <SessionPopup />}
             <div id="layout-wrapper">
                 <Header />
                 <Sidebar />
                {/* { click ?  (<ViewClientActivity data={viewContact} click={click} setClick={setClick}  />) : */}
                {/* ( */}
                     <div className="main-content user-management clients clients-search contact account-manager-report client_activity_report">
 
                     <div className="page-content">
                         <div className="container-fluid">
 
 
 
                             <div className="row mb-4 breadcrumb">
                                 <div className="col-lg-12">
                                     <div className="d-flex align-items-center">
                                         <div className="flex-grow-1">
                                             <h4 className="mb-2 card-title">Activity Report</h4>
                                         </div>
                                     </div>
                                 </div>
                             </div>
 
                             <div className="row table-data">
                                 <div className="col-12">
                                     <div className="card">
                                         <div className="card-body">
                                             <div className="row mb-2">
                                                
                                                     <div className="col-sm-4 button-block d-flex">
                                                     {/* <div className="dataTables_length" id="datatable_length">
                                                                         <button className={`fill_btn ${data.length <= 0 ?'disable pe-none':''}`} onClick={handleExport}><span className="material-icons">north_east</span>Export</button>
                                                                     </div> */}
                                                         <select name="Type-search" id="dropdown" value={ActivePageName} className="ms-2 custom-select custom-select-sm form-control form-control-sm form-select form-select-sm" onChange={e => handleClientType(e)}>
                                                             <option value="">Select Page Name</option>
                                                             {[...new Set(data.map(eachItem => eachItem.pagename))].map((pageName, index) => (
                                                           <option key={index} value={pageName}>{pageName}</option>
  ))}

                                                         </select>
                                                     </div>
                                                 <div className="col-sm-8">
 
                                                     <div className="search-box mb-2 d-inline-block">
                                                         {/* <div className="position-relative">
                                                             <input type="text" className="form-control" placeholder="Search by client name" value={ClientNameSearch} onChange={(e) => handleChange(e)} onKeyPress={handleKeypress} />
                                                             <button className="fill_btn" onClick={getClientActivity}><span className="material-icons search-icon">search</span></button>
                                                         </div> */}
                                                         <div className="position-relative">
                                                         <input type="text" className="form-control" placeholder="Search by user name" value={ClientNameSearch} onChange={(e) => handleChange(e)} onKeyPress={handleKeypress} />
                                                            
                                                                <div className="input-daterange input-group" id="datepicker6" data-date-format="dd M, yyyy" data-date-autoclose="true" data-provide="datepicker" data-date-container='#datepicker6'>

                                                                    <Tooltip title="From Date" placement="top">
                                                                        <input type="date" className="form-control date-input" name="availableFrom" placeholder="Start Date" value={fromdate} onChange={(e) => {setFromDate(e.target.value);setRangeError(false)}} max={new Date().toISOString().split('T')[0]} />
                                                                    </Tooltip>


                                                                    <Tooltip title="To Date"   placement="top">
                                                                    <input type="date" className="form-control date-input" name="availableTo" placeholder="End Date" value={todate} onChange={(e) => {setToDate(e.target.value);setRangeError(false)}} max={new Date().toISOString().split('T')[0]} />
                                                                    </Tooltip>
                                                                 
                                                                </div>
                                                                <button className="fill_btn" onClick={getClientActivity}><span className="material-icons search-icon">search</span></button>

                                                                 

                                                            </div>
                                                         <div className="dataTables_length" id="datatable_length">
                                                                <button className="fill_btn" onClick={clearSearch}><span className="material-icons-outlined">sync</span>Reset</button>
                                                            </div>
 
                                                      
                                                     </div>
                                                     <div className="text-sm-end">
                                                     {rangeError != "" ?  <span className="errormsg" style={{ fontWeight: 'bold', color: 'red' }}>{rangeError}</span> :null}
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
                                                sortFunction={customSort}

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
 
                     <SweetAlert show={tableErrMsg}
                         custom
                         confirmBtnText="ok"
                         confirmBtnBsStyle="primary"
                         title={"Something went wrong. Please reload again."}
                         onConfirm={e => setTableErrMsg(false)}
                     >
                     </SweetAlert>
 
                     <Footer />
                   
                 </div>
                 {/* ) */}
{/*  } */}
             </div>
         </>
     );
 };
 
 export default Activity;
 