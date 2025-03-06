/***
**Module Name: Header 
 **File Name :  Header.js
 **Project :    Orasi Media
 **Copyright(c) : X Platform Consulting.
 **Organization : Peafowl Inc
 **author :  chandrasekhar
 **author :  Hari
 **license :
 **version :  1.0.0
 **Created on :
 **Created on: Dec 27 2022
 **Last modified on: Dec 27 2022
 **Description : contains header component details.
 ***/
import React, { useState, useEffect, useContext, useCallback } from "react";
// import { Link, useLocation, useHistory } from "react-router-dom";
// import Header from ".././components/dashboard/header";
import Header from ".././components/header/Header";
import Sidebar from ".././components/dashboard/sidebar";
import { useHistory } from "react-router";
import axios from 'axios';
// import * as Config from "./../../constants/Config";

import { StandaloneSearchBox } from '@react-google-maps/api';
import { useJsApiLoader } from '@react-google-maps/api';
import propertyCalculator from "./propertyCalculator";
let token = localStorage.getItem("token")
let { lambda, appname } = window.app
const menuList = [
    {
        id: '1',
        name: 'travel_explore',
        labelName: 'Search',
        route: "search"
    },
    {
        id: '2',
        name: 'collections_bookmark',
        labelName: 'Properties',
        route: "dashboard"
    },
    {
        id: '3',
        name: 'settings',
        labelName: 'Groups',
        // route: "dashboard"
    },
    // {
    //     id: '10',
    //     name: 'settings',
    //     labelName: 'Playlist'
    // },

]


const Search = (props) => {
    // const { pathname } = useLocation();
    // const headerRef = useRef(null);
    // const [scroll, setScroll] = useState(false);
    const history = useHistory();
    const libraries = ["places"];
    // console.log("props", props.menus);
    // const active = headerNav.findIndex((e) => e.path === pathname);
    const [searchBox, setSearchBox] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [searchData, setSearchData] = useState(null);
    const [searchValueData, setSearchValueData] = useState(null);
    const [propertyData, setPropertyData] = useState({})
    const [config, setConfig] = useState({});
    const [activeId, setActiveId] = useState();
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            history.push("/");
        }
        else if (menuList[0]?.id) {
            setActiveId(menuList[0].id)
        }

    }, []);
    useEffect(() => {
        if (window.site) {
            setConfig(window.site);

        }

    }, [window.site]);
    useEffect(() => {
        // if (!localStorage.getItem("token")) {
        //     history.push("/");
        // }else{
        GetPropertyData();
        // }

    }, []);
    const GetPropertyData = () => {
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userId")
        const urlLink = lambda + '/getProperties?appname=' + appname + "&token=" + token + "&userid=" + userid;
        axios({
            method: 'POST',
            url: urlLink,
        })
            .then(function (response) {
                if (response.data.result) {
                    setPropertyData(response.data.result)
                }
            });
    }
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCbt0tJTo-ltu5B5xTGurz5GLRCZCEVkF4',
        libraries: libraries,
    });
    const onSearchBoxLoad = useCallback((ref) => {
        setSearchBox(ref);
    }, []);
    function fetchAndStorePlaceImage(place, callback) {
        // Define the Street View Service
        const streetViewService = new window.google.maps.StreetViewService();

        // Request Street View data for the place's location
        streetViewService.getPanorama({ location: place.geometry.location }, (data, status) => {
            if (status === 'OK') {
                // Construct the URL of the Street View image
                const imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${place.geometry.location.lat()},${place.geometry.location.lng()}&key=AIzaSyCbt0tJTo-ltu5B5xTGurz5GLRCZCEVkF4`;

                // Call the callback function with the image URL
                callback(imageUrl);
            } else {
                console.error('Could not retrieve Street View image for the place:', status);
                // Call the callback function with null if image retrieval fails
                callback(null);
            }
        });
    }
    const onPlacesChanged = () => {
        const inputValue = document.querySelector('.searchcontroll').value;
        console.log('inputValue', inputValue);
        setSearchValueData(inputValue)
        if (inputValue === '') {
            // Search has been cleared
            console.log('Search cleared');
            // Handle the cleared search as needed (e.g., reset selected place)
            props?.setSelectedPlace('');
            return; // Exit early if the input is empty
        }

        const places = searchBox.getPlaces();
        console.log('places', places);
        const addressData = {}; // Initialize address data object

        // Process address components from the Places API
        places?.[0]?.address_components?.forEach(place => {
            place.types.forEach(type => {
                switch (type) {
                    case 'street_number':
                        addressData.street_number = place.long_name;
                        break;
                    case 'route':
                        addressData.route = place.long_name;
                        break;
                    case 'locality':
                        addressData.locality = place.long_name;
                        break;
                    case 'postal_code':
                        addressData.postal_code = place.long_name;
                        break;
                    // Add additional cases as needed
                    default:
                        break;
                }
            });
        });

        // Use Geocoder to fetch more detailed address information
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: places[0]?.geometry.location }, (results, status) => {
            if (status === 'OK' && results[0]) {
                fetchAndStorePlaceImage(results[0], (imageUrl) => {
                    // Store the image URL in addressData
                    addressData.image = imageUrl;
                    console.log('Image URL:', imageUrl);
                    props?.setAddressData(prevData => ({
                        ...prevData,
                        image: imageUrl
                    }));
                });
                const addressComponents = results[0].address_components;
                console.log('addressComponentsaddressData', addressData);
                addressComponents.forEach(component => {
                    const types = component.types;
                    if (types.includes('locality')) {
                        addressData.city = component.long_name;
                    } else if (types.includes('administrative_area_level_1')) {
                        addressData.state = component.long_name;
                    } else if (types.includes('postal_code')) {
                        addressData.postal_code = component.long_name;
                    } else if (types.includes('sublocality_level_1')) {
                        addressData.area = component.long_name;
                    }
                });
            } else {
                console.error('Geocoder failed due to: ', status);
            }

            // Log the processed address data
            // console.log('addressDatahere',addressData.image);
            setSearchData(addressData)

            // Update props with the processed address data
            // props?.setAddressData(prevData => ({
            //     ...prevData,
            //     url: places[0]?.url,
            //     geolocation: places[0]?.geometry,
            //     zipcode: addressData.postal_code || '',
            //     state: addressData.state || addressData.city || '',
            //     address: `${addressData.street_number || ''} ${addressData.route || ''}`,
            //     city: addressData.city || '',
            //     area: addressData.area || '',
            //     fullAddress: places[0].formatted_address,
            //     image: addressData.image
            // }));

            // Set the selected place if formatted address is available
            // if (places[0].formatted_address) {
            //     console.log("place address",places[0].formatted_address);
            //     props?.setSelectedPlace(places[0].formatted_address);
            //     if(props?.placeIndex){
            //         props?.setAddressIndex({...props?.addressIndex,[props?.placeIndex]:props?.placeIndex});// comes from deal under wrtiting termsheet
            //     }

            // }
        });
    };
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        console.log('valueee----->', value)

        // Check if the input is empty
        if (value === '') {
            console.log('Input cleared');
            props?.setSelectedPlace('');
            // Handle the input clear case here (e.g., resetting state or triggering a search)
        }
    };
    const handleSearch = () => {
        // console.log('searchValueData',searchValueData)
        // console.log('searchData',searchData)
        let locData = JSON.stringify(searchData)
        // console.log('locData',locData)
        localStorage.setItem("searchData", locData)
        localStorage.setItem("searchValueData", searchValueData)
        if (searchData !== null) {
            console.log('searchValueData', searchValueData)
            history.push("/calculator")
        }
        // const value = event.target.value;
        // setInputValue(value);
        // console.log('valueee----->',value)

        // // Check if the input is empty
        // if (value === '') {
        //   console.log('Input cleared');
        //   props?.setSelectedPlace('');
        //   // Handle the input clear case here (e.g., resetting state or triggering a search)
        // }
    };
    const searchClick = () => {
        history.push("/search");
    }
    const savedClick = () => {
        history.push("/dashboard");
    }
    const savedProperties = (e, name, state, zipCode) => {
        //  console.log('name',name)
        let nameValue = name + "," + state + "," + zipCode
        console.log('nameValue', nameValue)
        localStorage.setItem("propertyName", nameValue)
        localStorage.setItem("name", name)
        // localStorage.setItem("propertyZipCode", zipCode)
        history.push("/properties");
    }
    let imageCloudfront;
    if (config.common && config.common.imageCloudfront) {
        imageCloudfront = config.common.imageCloudfront;
    }
    const goBack = () => {
        history.goBack();
    }
    const onClickMenu = (e, item) => {
        //setMenu(id);
        console.log('handleActiveMenuObj------------>', item)
        setActiveId(item.id)

        history.push(item.route)
    }
    return (
        <div className="dashboard">
            <Header />

            <div className="vertical-menu">

                <div data-simplebar className="h-100">
                    <div id="sidebar-menu">
                        <ul className="metismenu list-unstyled" id="side-menu">
                            {/* <li>
                                <a href="#" className={isActive ? "waves-effect active": "waves-effect"} onClick={searchClick}> <span className="material-symbols-outlined icon"> travel_explore </span> <span key="t-chat">Search</span> </a>
                            </li>
                            <li>
                                <a href="#" className="waves-effect " onClick={savedClick}> <span className="material-symbols-outlined icon"> collections_bookmark </span> <span key="t-chat">Properties</span> </a>
                            </li>
                            <li>
                                <a href="#" className="waves-effect"> <span className="material-symbols-outlined icon"> settings </span> <span key="t-chat">Settings</span> </a>
                            </li> */}
                            {/* {menuList.map(eachItem => (
                                            <li key={eachItem.id}><a href='#' className={`"waves-effect ${eachItem.id === menu ? 'active' : ''}`} onClick={() => onClickMenu(eachItem.id,eachItem.route)}  data-tip={eachItem.labelName}><span className="material-symbols-outlined icon"> {eachItem.name} </span> <span key="t-chat">{eachItem.labelName}</span></a> <Tooltip />  </li>
                                        ))} */}
                            {menuList.map((val) => (
                                <li key={val.id}>
                                    <a href='#' className={`${activeId === val.id ? "waves-effect active" : "waves-effect"}`} onClick={(e) => onClickMenu(e, val)} data-tip={val.labelName}><span className="material-symbols-outlined icon"> {val.name} </span> <span key="t-chat">{val.labelName}</span></a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>


            <div className="main-content">

                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <div className="title-block">
                                            <h4 className="mb-2 card-title">Search property</h4>
                                            {/* <div className="dropdown d-flex">
                                                <button className=" btn-primary me-2" type="button">ADD CONTENT</button>
                                                <button className=" btn-primary" type="button">IMPORT</button>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="new_search">
                                            <div className="estimate_price">
                                                <h2>Search Property to Estimate Price</h2>
                                                <div className="search_block">
                                                    <span className="material-symbols-outlined">location_on</span>
                                                    {/* <input type="text" className="form-control" placeholder="Search Property" value="">
                                                               <button className="search_btn"><span className="material-symbols-outlined">mystery</span>search</button> */}
                                                    {isLoaded && <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged} >
                                                        <input onChange={handleInputChange} type="text" placeholder="Search Properties" className="form-control searchcontroll" defaultValue={props?.selectedPlace ? (props?.simpleAddress ? props?.selectedPlace?.split(',')[0] : props?.selectedPlace) : ''} name={props?.name ? props?.name : 'locationsearch'} />

                                                    </StandaloneSearchBox>}

                                                    <button className="search_btn" role="link" onClick={handleSearch}><span className="material-symbols-outlined">mystery</span>search</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {propertyData && propertyData?.data && propertyData?.data?.length > 0 && <h4 className="mb-2 card-title">Recent Searches</h4>}
                        {propertyData && propertyData?.data && propertyData?.data?.length > 0 &&
                            <div className="row recent_searches">
                                {propertyData && propertyData?.data && propertyData?.data?.map((eachItem, key) => {
                                    return (
                                        <div className="col-md-3" key={key}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="property_info">
                                                        <div className="info">
                                                            <div className="card-wrapper">
                                                                <div className="icon-box">
                                                                    <span className="material-symbols-outlined"> cottage </span>
                                                                </div>
                                                                <div className="card-info" onClick={e => savedProperties(e, eachItem?.propertyName, eachItem?.state, eachItem?.postal_code)}>
                                                                    {/* <p className="calendar_month"><span className="material-symbols-outlined">calendar_month</span>15 Oct, 19</p> */}
                                                                    <p>{eachItem?.propertyName}, {eachItem?.state}, {eachItem?.postal_code}</p>
                                                                    <h6>{eachItem && eachItem?.search && eachItem?.search?.length + " " + "Offers"}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)
                                })}
                            </div> 
                        //     :
                            
                        // !propertyData &&
                        //     <div className="no-recent-searches">
                        //         {/* <img src={imageCloudfront + "propertyCalculator/images/not-found.png"} height="300px" /> */}
                        //         <p>There are no recent searches.</p>
                        //         {/* <button className="button_style" href="#" onClick={goBack}> GO BACK</button> */}
                        //     </div>

                        }

                    </div>
                </div>
            </div>


            <footer className="footer">
                <div className="container-fluid">
                    <div className="row">

                        <div className="col-sm-12 text-center">
                            <div className="text-sm-center d-none d-sm-block text-center">
                                All Rights Reserved 2024.
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};



export default Search;
