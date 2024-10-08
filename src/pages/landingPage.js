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
import { useHistory } from "react-router";
// import * as Config from "./../../constants/Config";
import { StandaloneSearchBox } from '@react-google-maps/api';
import { useJsApiLoader } from '@react-google-maps/api';
import propertyCalculator from "./propertyCalculator";
let token = localStorage.getItem("token")
// const headerNav = [
//   {
//     display: "Home",
//     path: `/${Config.HOME_PAGE}`,
//   },
//   {
//     display: "Movies",
//     path: `/${Config.HOME_PAGE}/movie`,
//   },
//   {
//     display: "TV Series",
//     path: `/${Config.HOME_PAGE}/tv`,
//   },
// ];


const LandingPage = (props) => {
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
    const [config, setConfig] = useState({});
    useEffect(() => {
        if (window.site) {
          setConfig(window.site);
    
        }
    
      }, [window.site]);
    useEffect(() => {
        if (localStorage.getItem("token")) {
            history.push("/yellowForm");
        }

    }, []);
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
        console.log('searchValueData', searchValueData)
        console.log('searchData', searchData)
        let locData = JSON.stringify(searchData)
        console.log('locData', locData)
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
    let imageCloudfront;
    if (config.common && config.common.imageCloudfront) {
      imageCloudfront = config.common.imageCloudfront;
    }
    return (
        <div className="landing_page">
            {/* {token && */}
            <Header />
            {/* } */}
            <div className="estimate_calculator">
                <div className="container">
                    <div className="estimate_price">
                        <h1>Simplify the Way You Create, Edit, and <br/>Maintain Sales & Service Reports</h1>
                        <div className="d-flex align-items-start mt-3 mb-4 justify-content-between">
                            <p>Managing your business data shouldn’t be complicated. At [Your Company Name], we provide an intuitive platform to streamline the creation, editing, and maintenance of your company’s sales and service reports, so you can focus on what really matters—growing your business.</p>
                            <div className="d-flex align-items-center">
                                <a className="register">Get Started</a>
                                {/* <a className="register btn-outline ms-2">Contact Us</a> */}
                                </div>
                        </div>
                    </div>
                    <img className="w-100" src={imageCloudfront + "propertyCalculator/images/hero.png"} />
                    <div className="adv_tools">
                        <h2>Advantages of Tools</h2>
                        <p>Nam pharetra egestas tellus, at lobortis erat. Cras vitae auctor nunc.</p>
                        <div className="d-flex align-items-center mt-4 mb-4 justify-content-center">
                            <div className="tool_block">
                                <div className="tool_card">
                                    <a href="#">
                                        <span className="material-symbols-outlined">cottage</span>
                                        <h5>Easy Report Creation</h5>
                                        <p>Generate comprehensive reports with just a few clicks. Our templates and customizable features ensure that your reports are professional, accurate, and ready to use in no time.</p>
                                        <button type="button">Read More<span className="material-symbols-outlined">arrow_forward</span></button>
                                    </a>
                                </div>
                            </div>
                            <div className="tool_block">
                                <div className="tool_card">
                                    <a href="#">
                                        <span className="material-symbols-outlined"><span className="material-symbols-outlined">
                                            quick_reference_all
                                        </span></span>
                                        <h5>Seamless Editing</h5>
                                        <p>Need to update your data? No problem! Our user-friendly interface allows you to quickly edit and modify existing reports. Never lose track of vital information with our version control feature.</p>
                                        <button type="button">Read More<span className="material-symbols-outlined">arrow_forward</span></button>
                                    </a>
                                </div>
                            </div>
                            <div className="tool_block">
                                <div className="tool_card">
                                    <a href="#">
                                        <span className="material-symbols-outlined">trending_up</span>
                                        <h5>Real-Time Data Synchronization</h5>
                                        <p>Our platform ensures that your sales and service data is always up to date. Whether you're accessing reports from the office or on the go, you can count on real-time accuracy.</p>
                                        <button type="button">Read More<span className="material-symbols-outlined">arrow_forward</span></button>
                                    </a>
                                </div>
                            </div>
                            <div className="tool_block">
                                <div className="tool_card">
                                    <a href="#">
                                        <span className="material-symbols-outlined">calculate</span>
                                        <h5>Stay Compliant and Organized</h5>
                                        <p>We understand how critical compliance is. Our system automatically organizes your reports, helping you stay on top of regulations and maintain an easily accessible archive.</p>
                                        <button type="button">Read More<span className="material-symbols-outlined">arrow_forward</span></button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
 <div className="adv_tools">

<section className="pricing py-4">
<h2>Plans</h2>
  <div className="container">
    <div className="row">
    
      <div className="col-lg-4">
        <div className="card mb-5 mb-lg-0">
          <div className="card-body">
            <h5 className="card-title text-muted text-uppercase text-center">Free</h5>
            <h6 className="card-price text-center">$0<span className="period">/month</span></h6>
            <hr></hr>
            <ul className="fa-ul">
              <li><span className="fa-li"><i className="fas fa-check"></i></span>Single User</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>5GB Storage</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>Unlimited Public Projects</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>Community Access</li>
              <li className="text-muted"><span className="fa-li"><i className="fas fa-times"></i></span>Unlimited
                Private Projects</li>
              <li className="text-muted"><span className="fa-li"><i className="fas fa-times"></i></span>Dedicated
                Phone Support</li>
              <li className="text-muted"><span className="fa-li"><i className="fas fa-times"></i></span>Free Subdomain
              </li>
              <li className="text-muted"><span className="fa-li"><i className="fas fa-times"></i></span>Monthly Status
                Reports</li>
            </ul>
            <div className="d-grid">
              <a href="#" className="btn btn-primary text-uppercase">select</a>
            </div>
          </div>
        </div>
      </div>
    
      <div className="col-lg-4">
        <div className="card mb-5 mb-lg-0">
          <div className="card-body">
            <h5 className="card-title text-muted text-uppercase text-center">Plus</h5>
            <h6 className="card-price text-center">$9<span className="period">/month</span></h6>
            <hr></hr>
            <ul className="fa-ul">
              <li><span className="fa-li"><i className="fas fa-check"></i></span><strong>5 Users</strong></li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>50GB Storage</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>Unlimited Public Projects</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>Community Access</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>Unlimited Private Projects</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>Dedicated Phone Support</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>Free Subdomain</li>
              <li className="text-muted"><span className="fa-li"><i className="fas fa-times"></i></span>Monthly Status
                Reports</li>
            </ul>
            <div className="d-grid">
              <a href="#" className="btn btn-primary text-uppercase">select</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-lg-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-muted text-uppercase text-center">Pro</h5>
            <h6 className="card-price text-center">$49<span className="period">/month</span></h6>
            <hr></hr>
            <ul className="fa-ul">
              <li><span className="fa-li"><i className="fas fa-check"></i></span><strong>Unlimited Users</strong>
              </li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>150GB Storage</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>Unlimited Public Projects</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>Community Access</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>Unlimited Private Projects</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>Dedicated Phone Support</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span><strong>Unlimited</strong> Free
                Subdomains</li>
              <li><span className="fa-li"><i className="fas fa-check"></i></span>Monthly Status Reports</li>
            </ul>
            <div className="d-grid">
              <a href="#" className="btn btn-primary text-uppercase">select</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</div>
<section className="contact_us">
<div className="cta-content">
<div className="container px-5 text-center">
<h1 className="text-white display-5 lh-1 mb-4">Get in touch with us 98909090</h1>
{/* <h3 className="text-white display-5 lh-1 mb-4">Make an Appointment</h3>
<div className="appointment">
<div className="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter Name" value=""/><label for="floatingInput">Name</label></div>
<div className="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter Email" value=""/><label for="floatingInput">Email</label></div>
<button className="fill_btn">Book Now</button>
</div> */}
</div>
</div>
</section>

              
                <div className="reserved">
                    <p>All Rights Reserved 2024.</p>
                </div>
            </div>
        </div>
    );
};



export default LandingPage;
