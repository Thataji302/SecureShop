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
import React, { useState, useEffect, useContext } from "react";


import Footer from "../../../components/dashboard/footer";
import Header from "../../../components/dashboard/header";
import Sidebar from "../../../components/dashboard/sidebar";
import tmdbApi from "../../../api/tmdbApi";
import { useHistory, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Loader from "../../../components/loader";
import { useParams } from 'react-router-dom';
import { contentContext } from "../../../context/contentContext";
import SessionPopup from "../../SessionPopup";
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from "moment";
import axios from 'axios';
import TableLoader from "../../../components/tableLoader";

let { lambda, appname } = window.app;



const ViewClientSearch = () => {
    let { id } = useParams();
    const history = useHistory();

    const [searchData, setSearchData] = useState("");
    const [type, setType] = useState("");
    const [loginTime, setLoginTime] = useState("");
    const [showSessionPopupup, setShowSessionPopupup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();

    const [invalidContent, setInvalidContent] = useState(false);

    const { route, setRoute, setCurrentPage, setRowsPerPage, usePrevious, setActiveMenuId, setActiveMenuObj ,GetTimeActivity} = useContext(contentContext);

    const prevRoute = usePrevious(route)
    useEffect(() => {
        if (prevRoute != undefined && prevRoute != route) {
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

        getClientSearchDetails();
        userActivity();

    }, []);
    const userActivity = () => {
        let path = window.location.pathname.split("/");
        const pageName = path[path.length - 2];
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
    const getClientSearchDetails = (e) => {
        const token = localStorage.getItem("token")
        setIsLoading(true)
        axios({
            method: 'POST',
            url: lambda + '/clientSearch?appname=' + appname + '&id=' + id + "&token=" + token + "&userid=" + localStorage.getItem("userId"),
        })
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    console.log(response)
                    if (response.data.result == "Invalid token or Expired") {
                        setShowSessionPopupup(true)
                    } else {
                        if(response.data.result.functionName != "getSearch"){
                            setIsLoading(false)
                            setSearchData(response.data.result.result[0])


                            if (response && response.data && response.data.result && response.data.result.result[0] && response.data.result.result[0].type === "BOTH") {
                                console.log("go");
                                if (response && response.data && response.data.result && response.data.result.result[0] && response.data.result.result[0].showmycontent === true) {
                                    console.log("sell")
                                    setType("SELLER")
                                } else {
                                    console.log("buy")
                                    setType("BUYER")
                                }
                            }

                            if (response && response.data && response.data.result.result[0] && response.data.result.result[0].login_time) {
                                var created_date = new Date(response.data.result.result[0].login_time);
                                var created_hour = created_date.getHours();
                                var created_min = created_date.getMinutes();
                                var created_sec = created_date.getSeconds();
                                let min;
                                let sec;
                                if (created_min < 10) {
                                    min = "0" + created_min
                                } else {
                                    min = created_min
                                }
                                if (created_sec < 10) {
                                    sec = "0" + created_sec
                                } else {
                                    sec = created_min
                                }
                                setLoginTime(created_hour + ':' + min + ':' + sec)
                            }
                        }else{
                            setInvalidContent(true)
                        }
                      
                    }
                }
                setIsLoading(false)
            });
    }

    const onclickInvalid = () => {
        setInvalidContent(false)
        history.push('/clientsearch')
    }

    const handleBack = (e) => {

        history.push({
            pathname: "/clientsearch",
            state: { search: true }
        });
    }

    return (
        <>
            {showSessionPopupup && <SessionPopup />}
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <SweetAlert show={invalidContent}
                    custom
                    confirmBtnText="ok"
                    confirmBtnBsStyle="primary"
                    title={"Client Search Not Found"}
                    onConfirm={e => onclickInvalid()}
                >
                </SweetAlert>
                {!invalidContent &&

                <div className="main-content user-management viwe-client-search">

                    <div className="page-content">
                        <div className="container-fluid">



                            <div className="row mb-4 breadcrumb">
                                <div className="col-lg-12">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <h4 className="mb-2 card-title">Client Search</h4>
                                            <p className="menu-path">Reports / <b>client search</b></p>
                                        </div>
                                        <div>
                                            <a onClick={handleBack} className="btn btn-primary">back</a>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* {isLoading ? <TableLoader /> : */}
                            {Object.keys(searchData).length > 0 ? 
                                            <>   
                                <div className="row table-data">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="row mb-2">
                                                    <div className="col-sm-12">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <p className="menu-path">Client Name<b>{searchData.clientname}</b></p>
                                                            <p className="lg-badge badge">{type ? type : searchData.type}</p>
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
                                                                    })}
                                                                    {/* {moment(searchData["login_time"]).utc().format("DD-MMM-YYYY HH:mm")} */}
                                                                    {/* {searchData && searchData["login_time"]} */}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="align-middle">Created On</td>
                                                                <td className="align-middle">
                                                                    {/* {moment(searchData.created).utc().format("DD-MMM-YYYY HH:mm")} */}
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

                                                            {searchData && searchData["anchor"] &&
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

                                                        </tbody>

                                                    </table>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>  
                                </>
                                        : 
                                    <div className="create-user-block">
                                        <div className="form-block">
                                            <div className="tab-content p-3 text-muted">
                                                <div className="tab-pane active show" id="home1" role="tabpanel">
                                                    <div className="row"><Loader />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                       
                                                }
                            {/* } */}
                        </div>
                    </div>



                    <Footer />
                </div>
}

            </div>
        </>
    );
};

export default ViewClientSearch;
