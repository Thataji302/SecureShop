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
 import Footer from "../../../components/dashboard/footer";
 import Header from "../../../components/dashboard/header";
 import Sidebar from "../../../components/dashboard/sidebar";
 import tmdbApi from "../../../api/tmdbApi";
 import { useHistory, Link } from "react-router-dom";
 import SweetAlert from 'react-bootstrap-sweetalert';
 import axios from 'axios';
 import moment from "moment";
 import ViewContactList from "../contactus/viewContactus";
 import Loader from "../../../components/loader";
 import { contentContext } from "../../../context/contentContext";
 import TableLoader from "../../../components/tableLoader";
 import SessionPopup from "../../SessionPopup"
 import DataTable from 'react-data-table-component';
import ViewClientActivity from "./ViewClientActivity";
 let { appname, lambda } = window.app;
 
 
 const ClientActivity = () => {
     const history = useHistory();
     // const [toggle, setToggle] = useState(false);
     const [content, setContent] = useState("");
     const [perpage, setPerpage] = useState(10);
 
 
    //  const [data, setData] = useState([]);
 


     const [sortDirection, setSortDirection] = useState('asc');
    const [arrowdir, setArrowDir] = useState('down');
    const [num, setNum]= useState();
    const [clientGroupData, setClientGroupData]= useState([]);
    const [ActivePageName, setActivePageName]= useState("");

     //const [search, setSearch] = useState("");
     const [viewContact, setViewContact] = useState({});
     const [ClientNameSearch, setClientNameSearch] = useState("");
     const [click, setClick] = useState(false);
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
            name: 'Page Name',
            selector: row => row?.pagename || "",
            sortable: true,
        },
        
        { 
            name: 'Client Name',
         
            selector: row => row && row.clientData &&  row.clientData[0] && row.clientData[0].name ? row?.clientData[0]?.name  : "",
            // cell: (props) => <div className="text-elipsis">{props.message}</div>,

            sortable: true,
        },
        { 
            name: 'Company Name',
         
            selector: row =>row && row.clientData &&  row.clientData[0] &&  row?.clientData[0]?.companyname &&  row?.clientData[0]?.companyname[0] ?  row?.clientData[0]?.companyname[0] : "",
            // cell: (props) => <div className="text-elipsis">{props.message}</div>,

            sortable: true,
        },
    
        {
            name: 'Start Time',
            selector: row => row?.created ? new Date(row?.created).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }) : "",
            sortable: true,
        },
       
        { 
            name: 'End Time',
         
            selector: row =>  row?.endtime ? new Date(row?.endtime).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }) : "",
            // cell: (props) => <div className="text-elipsis">{props.message}</div>,

            sortable: true,
        },
    //     {
    //         name: <>{subValDashboard && subValDashboard.view && subValDashboard.view.display === true && 'Actions'}</>,
    //         cell: (props) => 
    //        //   {
    //         subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
    //        <div className="d-flex">
    //        <a className={`${ subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none':''} text-success action-button`} onClick={(e)=>handleContactView(e,props._id)}><i className="mdi mdi-eye font-size-18"></i></a>

    //    </div>
    //        //  }
    //         ,
    //         ignoreRowClick: true,
    //         allowOverflow: true,
    //         button: true,
    //     },
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
         setActiveMenuId(300058)
         setActiveMenuObj({
             "Client Management": false,
             "Reports": true
         })
            getClientActivity();
            userActivity();
            getClientActivityGroupData();
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
             if (response?.data?.result == "Invalid token or Expired") {
               setShowSessionPopupup(true)
             } else {
               console.log("response 3", response.data);
               setClientGroupData(response?.data?.result)
             }
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
      
      }  
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
 
 
 

 
     const getClientActivity = () => {
        setCurrentPage(1);
       
        GetTimeActivity()   
            setIsLoading(true)
            const token = localStorage.getItem("token")
            const linkUrl = `${lambda}/clientActivity?appname=${appname}&token=${token}&userid=${localStorage.getItem("userId")}` +  (ClientNameSearch ? `&search=${ClientNameSearch}` : '') + (ActivePageName ? `&pagename=${ActivePageName}` :'');
           
          
             axios({
                 method: 'POST',
                 url: linkUrl,
             })
                 .then(function (response) {
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
     const handleSearch2 = (item) => {
        GetTimeActivity()   
        setCurrentPage(1);
           setIsLoading(true)
            const token = localStorage.getItem("token")
            const linkUrl = `${lambda}/clientActivity?appname=${appname}&token=${token}&userid=${localStorage.getItem("userId")}` +  (ClientNameSearch ? `&search=${ClientNameSearch}` : '') + (item ? `&pagename=${item}` :'');
           
          
             axios({
                 method: 'POST',
                 url: linkUrl,
             })
                 .then(function (response) {
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
     }
 

    
     return (
         <>
 {showSessionPopupup && <SessionPopup />}
             <div id="layout-wrapper">
                 <Header />
                 <Sidebar />
                { click ?  (<ViewClientActivity data={viewContact} click={click} setClick={setClick}  />) :
                ( <div className="main-content user-management clients clients-search contact account-manager-report client_activity_report">
 
                     <div className="page-content">
                         <div className="container-fluid">
 
 
 
                             <div className="row mb-4 breadcrumb">
                                 <div className="col-lg-12">
                                     <div className="d-flex align-items-center">
                                         <div className="flex-grow-1">
                                             <h4 className="mb-2 card-title">Client Activity Report</h4>
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
                                                         <select name="Type-search" id="dropdown" value={ActivePageName} className="custom-select custom-select-sm form-control form-control-sm form-select form-select-sm" onChange={e => handleClientType(e)}>
                                                             <option value="">Select Page Name</option>
                                                             {clientGroupData.map(eachItem => <option value={eachItem}>{eachItem}</option>)}

                                                         </select>
                                                     </div>
                                                 <div className="col-sm-8">
 
                                                     <div className="search-box mb-2 d-inline-block">
                                                         <div className="position-relative">
                                                             <input type="text" className="form-control" placeholder="Search by client name" value={ClientNameSearch} onChange={(e) => handleChange(e)} onKeyPress={handleKeypress} />
                                                             {/* <input className="form-control u-calendar" name="availableFrom" type="date" placeholder="Release Date" max="2023-03-15" value="" />
                                                             <input className="form-control u-calendar" name="availableFrom" type="date" placeholder="Release Date" max="2023-03-15" value="" /> */}
                                                             <button className="fill_btn" onClick={getClientActivity}><span className="material-icons search-icon">search</span></button>
                                                         </div>
                                                         <div className="dataTables_length" id="datatable_length">
                                                                <button className="fill_btn" onClick={clearSearch}><span className="material-icons-outlined">sync</span>Reset</button>
                                                            </div>
 
                                                      
                                                     </div>
                                                     <div className="text-sm-end">
 
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
                   
                 </div>)
 }
             </div>
         </>
     );
 };
 
 export default ClientActivity;
 