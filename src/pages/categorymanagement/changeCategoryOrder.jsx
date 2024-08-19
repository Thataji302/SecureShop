/***
**Module Name: Company details
 **File Name :  Company.js
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
 **Description : contains compant tables details.
 ***/
 import React, { useState, useEffect ,useContext} from "react";

 import Footer from "../../components/dashboard/footer";
 import Header from "../../components/dashboard/header";
 import Sidebar from "../../components/dashboard/sidebar";
 import tmdbApi from "../../api/tmdbApi";
 import { useHistory, Link } from "react-router-dom";
 import { useParams } from 'react-router-dom';
 import moment from "moment";
 import SweetAlert from 'react-bootstrap-sweetalert';
 import axios from 'axios';
 import { contentContext } from "../../context/contentContext";
 import TableLoader from "../../components/tableLoader";
 import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

 let { lambda, appname } = window.app;
 
 
 
 const Changecategoryorder = (props) => {
     const history = useHistory();
     const [contactData, setContactData] = useState("");
     const [BtnLoader, setBtnLoader] = useState(false);
     const [success, setSuccess] = useState(false); 

     const [categories, setCategories] = useState([
        // {
        //   name: "DOCUMENTARIES",
        //   order: 4,
        // },
        // {
        //   name: "MOVIES",
        //   order: 2,
        // },
        // {
        //   name: "KIDS SERIES",
        //   order: 1,
        // },
        // {
        //   name: "SERIES",
        //   order: 3,
        // },
        // {
        //     name: "DOCUSERIES",
        //     order: 5,
        //   },
        //   {
        //     name: "LIFESTYLE",
        //     order: 6,
        //   },
        //   {
        //     name: "LINEAR CHANNELS",
        //     order: 7,
        //   },
        //   {
        //     name: "LIVE EVENTS",
        //     order: 8,
        //   },          {
        //     name: "MUSIC",
        //     order: 9,
        //   },          {
        //     name: "SHORT FILMS",
        //     order: 10,
        //   },          {
        //     name: "SPORTS",
        //     order: 11,
        //   },          {
        //     name: "STAR SPORTS",
        //     order: 12,
        //   },          
      ]);
     const {route, setRoute,setCurrentPage,setRowsPerPage,usePrevious, setActiveMenuId,setActiveMenuObj,GetTimeActivity} = useContext(contentContext);

     const prevRoute = usePrevious(route)
     useEffect(() => {
         if(prevRoute != undefined && prevRoute!=route){
             setCurrentPage(1)
             setRowsPerPage(15)
         }
     }, [prevRoute]);
 
     useEffect(() => {
         if (!localStorage.getItem("token")) {
             history.push("/");
         }
         CategoryDetails()
         setRoute("category")
         setActiveMenuId(200002)
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
     const handleBack = (e) => {
        history.push("/categorymanagement");
        props.setClick(false);
     }
 
     const CategoryDetails = async (e) => {
        // setIsLoading(true);
        const token = localStorage.getItem("token")
        axios({
            method: 'GET',
            url: lambda + '/category?appname=' + appname + "&token=" + token,
        })
            .then(function (response) {
                let k = response?.data?.result?.data
                const sortedData = k.sort((a, b) => a.order - b.order);
                const kk = sortedData.map(item=>({'categoryid':item.categoryid,'order':item.order,'name':item.name ,'status':item.status}))
                 setCategories(kk);
                    // setCategories(response?.data?.result?.data);
                   
            });
    }
    const handleUpdate = () => {
       
        GetTimeActivity() 
        setBtnLoader(true)
        const token = localStorage.getItem("token")
        const catArray = categories
        axios({
            method: 'POST',
            url: lambda + '/arrangeOrder?appname=' + appname + "&token=" + token+ "&userid=" + localStorage.getItem("userId"),
            data: catArray
        })
            .then(function (response) {
               console.log('responseeee',response)
               setBtnLoader(false)
               setSuccess(true)
            });
    }

     const onDragEnd = result => {
        GetTimeActivity() 
        if (!result.destination) {
          return;
        }
    
        const updatedCategories = Array.from(categories);
        const [reorderedCategory] = updatedCategories.splice(result.source.index, 1);
        updatedCategories.splice(result.destination.index, 0, reorderedCategory);
    
        // Update the orders based on the new positions
        updatedCategories.forEach((category, index) => {
          category.order = index + 1;
        });
    
        setCategories(updatedCategories);
      };
     return (
         <>
 
             <div id="layout-wrapper">
              
             <Header />
                <Sidebar />

                 <div className="main-content user-management viwe-client-search category-order">
 
                     <div className="page-content">
                         <div className="container-fluid">
 
 
 
                             <div className="row mb-4 breadcrumb">
                                 <div className="col-lg-12">
                                     <div className="d-flex align-items-center">
                                         <div className="flex-grow-1">
                                             <h4 className="mb-2 card-title">Arrange Order</h4>
                                            
                                         </div>
                                         <div>
                                             <a onClick={handleBack} className="btn btn-primary">back</a>
                                         </div>
 
                                     </div>
                                 </div>
                             </div>
 
                           
                             <div className="row table-data">
                                 <div className="col-12">
                                     <div className="card">
                                         <div className="card-body">
                                         {categories.length>0 ? <>
                                         <div className="row mb-2">
                                                 <div className="col-sm-12">
                                                 <div className="d-flex align-items-center justify-content-center">
                                                 {/* <p className="menu-path">Client Name<b>{searchData.clientname}</b></p>
                                                 <p className="lg-badge badge">{type ? type : searchData.type}</p> */}
                                                 </div>
                                                 </div>
 
                                               
                                             </div>
 
                                                <div className="table-responsive">
                                                 <table className="table align-middle table-nowrap table-check">
                                                     <thead>
                                                         <tr>
                                                             <th>Name</th>
                                                             <th>Order</th>
                                                             <th>Status</th>
                                                         </tr>
                                                     </thead>
                                                      
                                                         <DragDropContext onDragEnd={onDragEnd}>
                                                             <Droppable droppableId="categories" direction="vertical">
                                                                 {provided => (
                                                                     <tbody {...provided.droppableProps} ref={provided.innerRef}>
                                                                         {categories.map((category, index) => (
                                                                             <Draggable key={category.name} draggableId={category.name} index={index}>
                                                                                 {provided => (
                                                                                   
                                                                                      <tr>
                                                                                      <td  
                                                                                      {...provided.draggableProps}
                                                                                           {...provided.dragHandleProps}
                                                                                       ref={provided.innerRef} className="align-middle" 
                                                                                      > <div className="drag-indicator"><span className="material-icons-outlined">drag_indicator</span> {category.name}</div></td>
                                                                                      <td className="align-middle">{category.order}</td>
                                                                                      <td className="align-middle">{category.status}</td>
                                                                                          </tr>
                                                                                        
                                                                                 )}
                                                                             </Draggable>
                                                                         ))}
                                                                         {provided.placeholder}
                                                                     </tbody>
                                                                 )}
                                                             </Droppable>
                                                         </DragDropContext>
                                                  
                                              
                                                     
                                                 </table>
                                             </div>
                                             
                                             <div className="justify-content-end d-flex align-items-center change-order-btn">
                                                 <a onClick={handleUpdate} className="btn btn-primary">{BtnLoader ? (<img src="https://orasi-dev.imgix.net/orasi/client/resources/orasiv1/images/common-icons/rotate_right.svg" className="loading-icon" />) : null}UPDATE</a>
                                             </div>
                                             </>   :  
                                          
                                                <div className="orasi-preloader">
                                                    <img src="https://orasi-dev.imgix.net/orasi/common/images/preloader.png" />
                                                </div>
                                        
                                       } 
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
                             title={"Updated successfully"}
                             onConfirm={e => { setSuccess(false); setBtnLoader(false) }}
                         ></SweetAlert>
 
 
                     
                 </div>
             </div>
         </>
     );
 };
 
 export default Changecategoryorder;
 