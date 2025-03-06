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
import axios from "axios";
import moment from "moment";
import ViewRecommendList from "./viewRecommend";
import { contentContext } from "../../../context/contentContext";
import SessionPopup from "../../SessionPopup"
import Loader from "../../../components/loader";
import TableLoader from "../../../components/tableLoader";
import DataTable from 'react-data-table-component';
let { appname, lambda } = window.app;

const Recommend = () => {
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

  const [recommendedsearch, setRecommendedSearch] = useState("");
  const [showSessionPopupup, setShowSessionPopupup] = useState(false);

  const [sortDirection, setSortDirection] = useState('asc');
  const [arrowdir, setArrowDir] = useState('down');
  const [num, setNum]= useState();


  const [viewRecommend, setViewRecommend] = useState({});
  const [click, setClick] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const { isLoading, setIsLoading, sortTableAlpha, arrow, sortTableByDate, userData, data, setData,rowsPerPage, setRowsPerPage,currentPageNew, setCurrentPage,route, setRoute,usePrevious, setActiveMenuId ,setActiveMenuObj, GetTimeActivity} = useContext(contentContext)


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
          name: 'Client Name',
          selector: row => row?.clientname ?? "",
          sortable: true,
      },
      {
          name: 'Client Email',
          selector: row => row?.clientemailid ?? "",
          sortable: true,
      },
      {
          name: 'RECOMMEND TO',
          selector: row => row?.name ?? "",
          sortable: true,
      },
      { 
          name: 'RECOMMEND EMAIL',
          selector: row =>  row?.emailid ?? "",
          sortable: true,
      },
      {
         name: 'CONTACT NUMBER',
         selector: row => row?.contact ?? "",
         sortable: true,
     },
     {
      name: 'RECOMMENDED ON',
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
     

     

      {
          name: <>{subValDashboard && subValDashboard.view && subValDashboard.view.display === true && 'Actions'}</>,
          cell: (props) => 
         //   {
          subValDashboard && subValDashboard.view && subValDashboard.view.display === true &&
         <div className="d-flex">
         <a
           className={`${subValDashboard && subValDashboard.view && subValDashboard.view.enable === false ? 'pe-none' : ''} text-success action-button`}
           onClick={(e) => handleRecommendView(e, props.recommendedid)}
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
    setRoute("recommend")
    setActiveMenuId(300051)
    setActiveMenuObj({
        "Client Management": false,
        "Reports": true
    })
    getRecommend();
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
  const getRecommend = async (e) => {
    GetTimeActivity()   
    setIsLoading(true)
    const token = localStorage.getItem("token")
    axios({
      method: "POST",
      url:
        lambda +
        "/recommend?appname=" +
        appname + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
    }).then(function (response) {
      console.log("response", response.data.result.data);
      if (response.data.result == "Invalid token or Expired") {
        setShowSessionPopupup(true)
      } else {
        setData(response.data.result.data);
        setContent(response.data.result);
        setIsLoading(false)
        setRecommendedSearch("")
      }
    });
  };





  const handleSearch = () => {
    GetTimeActivity()   
    setCurrentPage(1);

    if (recommendedsearch === "") {
      getRecommend();
    } else {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      axios({
        method: "POST",
        url:
          lambda +
          "/recommend?appname=" +
          appname +
          "&search=" +
          recommendedsearch + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
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
    if (e.target.value === "") {
      //getRecommend();
    }
    setRecommendedSearch(e.target.value);
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

  const handleRecommendView = (e, id) => {
    GetTimeActivity()   
    for (let key in data) {
      
      if (data.hasOwnProperty(key) && data[key].recommendedid === id) {
        console.log("data id", id);
        setViewRecommend(data[key]);
        setClick(true);

      }
    }
  };

  const clearSearch = () => {
    GetTimeActivity()   
    setRecommendedSearch("");
    getRecommend();
    setcurrentPage(1);
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
        { click ? (<ViewRecommendList data={viewRecommend} click={click} setClick={setClick} />) :
            <div className="main-content user-management clients clients-search recommeded">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="row mb-4 breadcrumb">
                    <div className="col-lg-12">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h4 className="mb-2 card-title">Recommended Data</h4>
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
                                    placeholder="Search Name"
                                    value={recommendedsearch}
                                    onChange={(e) => handleChange(e)}
                                    onKeyPress={handleKeypress}
                                  />
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
                              <div className="text-sm-end"></div>
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

export default Recommend;
