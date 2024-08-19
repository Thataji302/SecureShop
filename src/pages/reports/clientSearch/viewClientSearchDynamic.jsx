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
 import React, { useState, useEffect,useContext } from "react";


 import Footer from "../../../components/dashboard/footer";
 import Header from "../../../components/dashboard/header";
 import Sidebar from "../../../components/dashboard/sidebar";
 import tmdbApi from "../../../api/tmdbApi";
 import { useHistory, Link } from "react-router-dom";
 import { useParams } from 'react-router-dom';
 import moment from "moment";
 import axios from 'axios';
 import { contentContext } from "../../../context/contentContext";
 let { lambda, appname } = window.app;
 
 
 
 const ViewClientSearchDynamic = (props) => {
     const history = useHistory();
     const [recommendData, setRecommendData] = useState("");
     const [searchData, setSearchData] = useState("");
     const [type, setType] = useState("");

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
         setRoute("clientsearch")
         setActiveMenuId(300050)
         setActiveMenuObj({
             "Client Management": false,
             "Reports": true
         })
         setSearchData(props.data)
       
     }, []);


    //  console.log("dataaaaaaaa--------->",searchData);
   
     const handleBack = (e) => {
        GetTimeActivity()   
        props.setClick(false);
     }
 
     return (
         <>
 
             <div id="layout-wrapper">
              
 
                 <div className="main-content user-management viwe-client-search">
 
                     <div className="page-content">
                         <div className="container-fluid">
 
 
 
                             <div className="row mb-4 breadcrumb">
                                 <div className="col-lg-12">
                                     <div className="d-flex align-items-center">
                                         <div className="flex-grow-1">
                                             <h4 className="mb-2 card-title">View Client Search</h4>
                                             <p className="menu-path">Reports / <b>View Client Search</b></p>
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
                                         <div className="row mb-2">
                                         <div className="col-sm-12">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <p className="menu-path">Client Name<b>{searchData.clientname}</b></p>
                                                            <p className="lg-badge badge">{ searchData.type === "BOTH" ? searchData.showmycontent === true ? "SELLER" : "BUYER": searchData.type}</p>
                                                        </div>
                                                    </div>
 
                                                
                                             </div>
 
                                                <div className="table-responsive">
                                                 <table className="table align-middle table-nowrap table-check">
                                                    
                                                 <tbody>
                                                            <tr>
                                                                <td className="align-middle">Company Name</td>
                                                                <td className="align-middle">{searchData && searchData.companyname}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="align-middle">Login Time</td>
                                                                <td className="align-middle">
                                                                    {new Date(searchData["login_time"]).toLocaleDateString('en-IN', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                        hour: 'numeric',
                                                                        minute: 'numeric',
                                                                        second: 'numeric',
                                                                    })}
                                                                   
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="align-middle">Searched On</td>
                                                                <td className="align-middle">
                                                                   
                                                                    {new Date(searchData.created).toLocaleDateString('en-IN', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                        hour: 'numeric',
                                                                        minute: 'numeric',
                                                                    })}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="align-middle">Asset Total</td>
                                                                <td className="align-middle">{searchData.assetTotal}</td>
                                                            </tr>
                                                            {searchData && searchData.category &&
                                                                <tr>
                                                                    <td className="align-middle">Category</td>
                                                                    <td className="align-middle">{searchData && searchData.category?.join(", ")}</td>
                                                                </tr>}

                                                            {searchData && searchData.title &&
                                                                <tr>
                                                                    <td className="align-middle">title</td>
                                                                    <td className="align-middle">{searchData && searchData.title}</td>
                                                                </tr>}

                                                            {searchData && searchData["countryorigin"] &&
                                                                <tr>
                                                                    <td className="align-middle">country of origin </td>
                                                                    <td className="align-middle">{searchData["countryorigin"]?.join(", ")}</td>
                                                                </tr>}

                                                            {searchData && searchData.certificate &&
                                                                <tr>
                                                                    <td className="align-middle">Certificate</td>
                                                                    <td className="align-middle">{searchData.certificate?.join(", ")}</td>
                                                                </tr>}

                                                            {searchData && searchData.cast &&
                                                                <tr>
                                                                    <td className="align-middle">Cast</td>
                                                                    <td className="align-middle">{searchData.cast}</td>
                                                                </tr>}

                                                            {searchData && searchData["releaseyear"] &&
                                                                <tr>
                                                                    <td className="align-middle">Release year</td>
                                                                    <td className="align-middle">{searchData["releaseyear"]}</td>
                                                                </tr>}

                                                            {searchData && searchData.director &&
                                                                <tr>
                                                                    <td className="align-middle">Director</td>
                                                                    <td className="align-middle">{searchData.director}</td>
                                                                </tr>}

                                                            {searchData && searchData["dubbinglanguages"] &&
                                                                <tr>
                                                                    <td className="align-middle">Dubbing Languages</td>
                                                                    <td className="align-middle">{searchData["dubbinglanguages"]?.join(", ")}</td>
                                                                </tr>}

                                                            {searchData && searchData.genre &&
                                                                <tr>
                                                                    <td className="align-middle">Genre</td>
                                                                    <td className="align-middle">{searchData.genre?.join(", ")}</td>
                                                                </tr>}

                                                            {searchData && searchData["IMDBrating"] &&
                                                                <tr>
                                                                    <td className="align-middle">IMDB Rating</td>
                                                                    <td className="align-middle">{searchData["IMDBrating"]}</td>
                                                                </tr>}

                                                            {searchData && searchData.languages &&
                                                                <tr>
                                                                    <td className="align-middle">Language</td>
                                                                    <td className="align-middle">{searchData.languages?.join(", ")}</td>
                                                                </tr>}

                                                            {searchData && searchData.subtitleslanguages &&
                                                                <tr>
                                                                    <td className="align-middle">Subtitle Languages</td>
                                                                    <td className="align-middle">{searchData.subtitleslanguages?.join(", ")}</td>
                                                                </tr>}

                                                            {searchData && searchData.territoriesavailable &&
                                                                <tr>
                                                                    <td className="align-middle">Territories Available</td>
                                                                    <td className="align-middle">{searchData.territoriesavailable?.join(", ")}</td>
                                                                </tr>}

                                                            {searchData && searchData["leadartist"] &&
                                                                <tr>
                                                                    <td className="align-middle">Lead Artist</td>
                                                                    <td className="align-middle">{searchData["leadartist"]}</td>
                                                                </tr>}


                                                            {searchData && searchData["league_tournament"] &&
                                                                <tr>
                                                                    <td className="align-middle">League/Tournament</td>
                                                                    <td className="align-middle">{searchData["league_tournament"]}</td>
                                                                </tr>}


                                                            {searchData && searchData.lyricist &&
                                                                <tr>
                                                                    <td className="align-middle">Lyricist</td>
                                                                    <td className="align-middle">{searchData.lyricist}</td>
                                                                </tr>}

                                                            {searchData && searchData['anchor'] &&
                                                                <tr>
                                                                    <td className="align-middle">Anchor</td>
                                                                    <td className="align-middle">{searchData["anchor"]}</td>
                                                                </tr>}

                                                            {searchData && searchData.otherartists &&
                                                                <tr>
                                                                    <td className="align-middle">Other Artists</td>
                                                                    <td className="align-middle">{searchData.otherartists}</td>
                                                                </tr>}

                                                            {searchData && searchData["band name"] &&
                                                                <tr>
                                                                    <td className="align-middle">Band Name</td>
                                                                    <td className="align-middle">{searchData["band name"]}</td>
                                                                </tr>}

                                                            {searchData && searchData.chef &&
                                                                <tr>
                                                                    <td className="align-middle">Chef</td>
                                                                    <td className="align-middle">{searchData.chef}</td>
                                                                </tr>}

                                                            {searchData && searchData["mealtype"] &&
                                                                <tr>
                                                                    <td className="align-middle">Meal Type</td>
                                                                    <td className="align-middle">{searchData["mealtype"]}</td>
                                                                </tr>}

                                                            {searchData && searchData.musicgenre &&
                                                                <tr>
                                                                    <td className="align-middle">Music Genre</td>
                                                                    <td className="align-middle">{searchData.musicgenre}</td>
                                                                </tr>}

                                                            {searchData && searchData.cuisine &&
                                                                <tr>
                                                                    <td className="align-middle">Cuisine</td>
                                                                    <td className="align-middle">{searchData.cuisine}</td>
                                                                </tr>}

                                                            {searchData && searchData["performancetype"] &&
                                                                <tr>
                                                                    <td className="align-middle">Performance Type</td>
                                                                    <td className="align-middle">{searchData["performancetype"]}</td>
                                                                </tr>}

                                                            {searchData && searchData.sport &&
                                                                <tr>
                                                                    <td className="align-middle">Sport</td>
                                                                    <td className="align-middle">{searchData.sport?.join(", ")}</td>
                                                                </tr>}


                                                            {searchData && searchData["sportsstars"] &&
                                                                <tr>
                                                                    <td className="align-middle">Sports Star</td>
                                                                    <td className="align-middle">{searchData["sportsstars"]}</td>
                                                                </tr>}

                                                            {searchData && searchData.typeofrights &&
                                                                <tr>
                                                                    <td className="align-middle">Type of Rights</td>
                                                                    <td className="align-middle">{searchData.typeofrights?.join(", ")}</td>
                                                                </tr>}
                                                            {searchData && searchData.videoquality &&
                                                                <tr>
                                                                    <td className="align-middle">Video Quality</td>
                                                                    <td className="align-middle">{searchData.videoquality?.join(", ")}</td>
                                                                </tr>}
                                                                {searchData && searchData.pageNumber &&
                                                                <tr>
                                                                    <td className="align-middle">Page Number</td>
                                                                    <td className="align-middle">{searchData.pageNumber}</td>
                                                                </tr>}
                                                                {searchData && searchData.perPage &&
                                                                <tr>
                                                                    <td className="align-middle">Per Page</td>
                                                                    <td className="align-middle">{searchData.perPage}</td>
                                                                </tr>}
                                                                {searchData && searchData.showmycontent &&
                                                                <tr>
                                                                    <td className="align-middle">Show My Content</td>
                                                                    <td className="align-middle">{searchData.showmycontent ? "TRUE":"FALSE"}</td>
                                                                </tr>}
                                                        </tbody>

                                                     
                                                 </table>
                                             </div>
 
                                         </div>
                                     </div>
                                 </div>
                             </div>
 
                         </div>
                     </div>
 
 
 
                     
                 </div>
             </div>
         </>
     );
 };
 
 export default ViewClientSearchDynamic;
 