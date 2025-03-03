/***
**Module Name: Lookups
 **File Name :  Lookups.js
 **Project :    Dealer Mis Reports
 **Copyright(c) : X Platform Consulting.
 **Organization : Peafowl Inc
 **author :  Vani
 **author :  Amrutha
 **license :
 **version :  1.0.0
 **Created on :
 **Created on: Feb 14 2025
 **Last modified on: Feb 19 2025
 **Description : Tabs.
 ***/
import React, { useState, useEffect } from "react";
import Header from "../components/header/Header";
import SubLookup from "./SubLookup"

const Lookups = () => {



    let { lambda, appname } = window.app;
    let companyId = localStorage.getItem("companyid");
    let userid = localStorage.getItem("userid") || localStorage.getItem("userId")

    const lookupForms = [
        {
            tab: "Branches",
            formFields: [
                { name: "name", label: "Branch Name", type: "text", required: true },
                { name: "phoneNumber", label: "Phone Number", type: "text", required: true, pattern: /^[6-9]\d{9}$/ },
                { name: "address", label: "Address", type: "text", required: true },
                { name: "dealerCode", label: "Dealer Code", type: "text" },
                { name: "gst", label: "GST", type: "text" },
                //{ name: "gst", label: "GST", type: "text", pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/ },
                { name: "state", label: "State", type: "dropdown" },
                {
                    name: "branch", label: "Branch", type: "select", required: true,
                    options: [
                        { value: "mainbranch", label: "Main Branch" },
                        { value: "subbranch", label: "Sub Branch" }
                    ]
                },
                {
                    name: "status", label: "Status", type: "select",
                    options: [
                        { value: "Active", label: "Active" },
                        { value: "InActive", label: "InActive" }
                    ],
                    conditional: (values) => values._id // Show only when updating
                }
            ],
            tableFields: [],
            services: {
                "summaryAPI": {
                    method: "GET",
                    url: `${lambda}/branchInfo?appname=${appname}&companyid=${companyId}&userid=${userid}`

                },
                "createAPI": {
                    method: "POST",
                    url: `${lambda}/addBranch?appname=${appname}&companyid=${companyId}`,
                    errors: [
                        "Branch already exists"]
                },
                "updateAPI": {
                    method: "POST",
                    url: `${lambda}/updateBranch?appname=${appname}&branchid=$id`,
                    errors: [
                        "Branch already exists"]

                },
                "deleteAPI": {
                    method: "POST",
                    url: `${lambda}/updateBranch?appname=${appname}&branchid=$id&type=delete`,
                }
            },
            columns: [
                { key: "name", label: "Branch Name", type: "string" },
                { key: "address", label: "Address", type: "string" },
                { key: "phoneNumber", label: "Phone Number", type: "string" },
                { key: "dealerCode", label: "Dealer Code", type: "string" },
                { key: "created", label: "Created", type: "date" }
            ],
            labels: {
                "add": "Add Branch",
                "edit": "Edit Branch"
            }

        },
        {
            tab: "Models",
            formFields: [
                { name: "name", label: "Modal Name", type: "text", required: true },
                { name: "gst", label: "GST", type: "text" },
                {
                    name: "color", label: "Color", type: "select",
                    options: [
                        { value: "Red", label: "Red" },
                        { value: "Black", label: "Black" },
                        { value: "Yellow", label: "Yellow" },
                        { value: "White", label: "White" },
                        { value: "Blue", label: "Blue" },
                        { value: "Green", label: "Green" },
                        { value: "Silver", label: "Silver" },
                        { value: "Maroon", label: "Maroon" }
                    ]
                },
                {
                    name: "fuel", label: "Fuel", type: "select",
                    options: [
                        { value: "Deisel", label: "Deisel" },
                        { value: "Petrol", label: "Petrol" }
                    ]
                },
                { name: "state", label: "State", type: "dropdown" },
                { name: "variant", label: "Variant", type: "text" },
                {
                    name: "status", label: "Status", type: "select",
                    options: [
                        { value: "Active", label: "Active" },
                        { value: "InActive", label: "InActive" }
                    ],
                    conditional: (values) => values._id // Show only when updating
                }

            ],
            tableFields: [],
            services: {
                "summaryAPI": {
                    method: "GET",
                    url: `${lambda}/modelInfo?appname=${appname}&companyid=${companyId}&userid=${userid}`

                },
                "createAPI": {
                    method: "POST",
                    url: `${lambda}/addModels?appname=${appname}&companyid=${companyId}`,
                    errors: [
                        "Model already exists"]
                },
                "updateAPI": {
                    method: "POST",
                    url: `${lambda}/updateModels?appname=${appname}&modelId=$id&companyid=${companyId}`,
                    errors: [
                        "Branch already exists"]

                },
                "deleteAPI": {
                    method: "POST",
                    url: `${lambda}/updateModels?appname=${appname}&modelId=$id&type=delete&companyid=${companyId}`,
                }
            },
            columns: [
                { key: "name", label: "Model", type: "string" },
                { key: "color", label: "Color", type: "string" },
                { key: "variant", label: "Variant", type: "string" },
                { key: "fuel", label: "Fuel", type: "string" },

            ],
            labels: {
                "add": "Add Model",
                "edit": "Edit Model"
            }
        },
        {
            tab: "Insurance",
            formFields: [
                { name: "name", label: "Name", type: "text", required: true },
                { name: "phoneNumber", label: "Phone Number", type: "text", required: true, pattern: /^[6-9]\d{9}$/ },
                { name: "commission", label: "Commission(%)", type: "text", required: true, pattern: /^(0\.[1-9]\d?|[1-9]\d?(\.\d{1,2})?)$/

 },
                { name: "gst", label: "GST", type: "text"},
                { name: "state", label: "State", type: "dropdown" },
                {
                    name: "status", label: "Status", type: "select",
                    options: [
                        { value: "Active", label: "Active" },
                        { value: "InActive", label: "InActive" }
                    ],
                    conditional: (values) => values._id // Show only when updating
                }
            ],
            tableFields: [],
            services: {
                "summaryAPI": {
                    method: "GET",
                    url: `${lambda}/insuranceInfo?appname=${appname}&companyid=${companyId}&userid=${userid}`

                },
                "createAPI": {
                    method: "POST",
                    url: `${lambda}/addInsurance?appname=${appname}&companyid=${companyId}`,
                    errors: [
                        "Insurance already exists"]
                },
                "updateAPI": {
                    method: "POST",
                    url: `${lambda}/updateInsurance?appname=${appname}&insuranceId=$id&companyid=${companyId}`,
                    errors: [
                        "Insurance already exists"]

                },
                "deleteAPI": {
                    method: "POST",
                    url: `${lambda}/updateInsurance?appname=${appname}&insuranceId=$id&type=delete&companyid=${companyId}`,
                }
            },
            columns: [
                { key: "name", label: "Name", type: "string"},
                { key: "phoneNumber", label: "Phone Number", type: "string" },
                { key: "commission", label: "Commission(%)", type: "string"},
                { key: "gst", label: "GST", type: "string"},
                { key: "state", label: "State", type: "string" },
            ],
            labels: {
                "add": "Add Insurance",
                "edit": "Edit Insurance"
            }
        },
        {
            tab: "Finance",
            formFields: [
                { name: "name", label: "Name", type: "text", required: true },
                { name: "phoneNumber", label: "Phone Number", type: "text", required: true, pattern: /^[6-9]\d{9}$/ },
                { name: "commission", label: "Commission(%)", type: "number", required: true },
                { name: "gst", label: "GST", type: "text" },
                { name: "state", label: "State", type: "dropdown" },
                
                {
                    name: "status", label: "Status", type: "select",
                    options: [
                        { value: "Active", label: "Active" },
                        { value: "InActive", label: "InActive" }
                    ],
                    conditional: (values) => values._id // Show only when updating
                }
            ],
            tableFields: [],
            services: {
                "summaryAPI": {
                    method: "GET",
                    url: `${lambda}/financeInfo?appname=${appname}&companyid=${companyId}&userid=${userid}`

                },
                "createAPI": {
                    method: "POST",
                    url: `${lambda}/addFinance?appname=${appname}&companyid=${companyId}`,
                    errors: [
                        "Finance already exists"]
                },
                "updateAPI": {
                    method: "POST",
                    url: `${lambda}/updateFinance?appname=${appname}&financeId=$id&companyid=${companyId}`,
                    errors: [
                        "Finance already exists"]

                },
                "deleteAPI": {
                    method: "POST",
                    url: `${lambda}/updateFinance?appname=${appname}&financeId=$id&type=delete&companyid=${companyId}`,
                }
            },
            columns: [
                { key: "name", label: "Name", type: "string" },
                { key: "phoneNumber", label: "Phone Number", type: "string" },
                { key: "commission", label: "Commission(%)", type: "string" },
                { key: "gst", label: "GST", type: "string" },
                { key: "state", label: "State", type: "string" },
            ],
            labels: {
                "add": "Add Finance",
                "edit": "Edit Finance"
            }
        },
        {
            tab: "Fastag",
            formFields: [
                { name: "name", label: "Name", type: "text", required: true },
                { name: "phoneNumber", label: "Phone Number", type: "text", required: true, pattern: /^[6-9]\d{9}$/ },
                { name: "commission", label: "Commission(%)", type: "number", required: true },
                { name: "gst", label: "GST", type: "text" },
                { name: "state", label: "State", type: "dropdown" },
                
                {
                    name: "status", label: "Status", type: "select",
                    options: [
                        { value: "Active", label: "Active" },
                        { value: "InActive", label: "InActive" }
                    ],
                    conditional: (values) => values._id // Show only when updating
                }
            ],
            tableFields: [],
            services: {
                "summaryAPI": {
                    method: "GET",
                    url: `${lambda}/fastagInfo?appname=${appname}&companyid=${companyId}&userid=${userid}`

                },
                "createAPI": {
                    method: "POST",
                    url: `${lambda}/addFastag?appname=${appname}&companyid=${companyId}`,
                    errors: [
                        "Fastag already exists"]
                },
                "updateAPI": {
                    method: "POST",
                    url: `${lambda}/updateFastag?appname=${appname}&fastagId=$id&companyid=${companyId}`,
                    errors: [
                        "Fastag already exists"]

                },
                "deleteAPI": {
                    method: "POST",
                    url: `${lambda}/updateFastag?appname=${appname}&fastagId=$id&type=delete&companyid=${companyId}`,
                }
            },
            columns: [
                { key: "name", label: "Name", type: "string" },
                { key: "phoneNumber", label: "Phone Number", type: "string" },
                { key: "commission", label: "Commission(%)", type: "string" },
                { key: "gst", label: "GST", type: "string" },
                { key: "state", label: "State", type: "string" },
            ],
            labels: {
                "add": "Add Fastag",
                "edit": "Edit Fastag"
            }
        },
        {
            tab: "Vendor",
            formFields: [
                { name: "name", label: "Name", type: "text", required: true },
                { name: "gst", label: "GST", type: "text" },
                { name: "state", label: "State", type: "dropdown" },
                
                {
                    name: "status", label: "Status", type: "select",
                    options: [
                        { value: "Active", label: "Active" },
                        { value: "InActive", label: "InActive" }
                    ],
                    conditional: (values) => values._id // Show only when updating
                }
            ],
            tableFields: [],
            services: {
                "summaryAPI": {
                    method: "GET",
                    url: `${lambda}/vendorsInfo?appname=${appname}&companyid=${companyId}&userid=${userid}`

                },
                "createAPI": {
                    method: "POST",
                    url: `${lambda}/addVendors?appname=${appname}&companyid=${companyId}`,
                    errors: [
                        "Vendor already exists"]
                },
                "updateAPI": {
                    method: "POST",
                    url: `${lambda}/updateVendors?appname=${appname}&vendorId=$id&companyid=${companyId}`,
                    errors: [
                        "Vendor already exists"]

                },
                "deleteAPI": {
                    method: "POST",
                    url: `${lambda}/updateVendors?appname=${appname}&vendorId=$id&type=delete&companyid=${companyId}`,
                }
            },
            columns: [
                { key: "name", label: "Vendor Name", type: "string" },
                { key: "gst", label: "GST", type: "string" },
                { key: "state", label: "State", type: "string" },
            ],
            labels: {
                "add": "Add Vendor",
                "edit": "Edit Vendor"
            }
        },

    ];
    const [activeTab, setActiveTab] = useState('Branches');
    const [imageCloudfront, setImageCloudfront] = useState(null);
    useEffect(() => {
        if (window?.site?.common?.imageCloudfront) {
            setImageCloudfront(window.site.common.imageCloudfront);
        }
    }, [window?.site?.common]);

    const tabClick = (tab) => {
        setActiveTab(tab)
    }

    return (
        <>
            <div id="layout-wrapper">
                <div className="dashboard">
                    <Header />
                    <div className="main-content look_ups">

                        <div className="page-content">
                            <div className="container-fluid">
                                <div className="card">
                                    <div className="card-body">

                                        <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                            {
                                                lookupForms.map((lookupForm, index) => <li className="nav-item" onClick={() => tabClick(lookupForm.tab)} key={index}>
                                                    <a className={`nav-link ${activeTab === lookupForm.tab ? 'active' : ''}`} data-bs-toggle="tab" href={`${lookupForm.tab}`} role="tab">
                                                        <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                                        <span className="d-none d-sm-block">{lookupForm.tab}</span>
                                                    </a>
                                                </li>)
                                            }
                                        </ul>
                                        <div className="tab-content pt-15 text-muted">
                                            {
                                                lookupForms.map((lookupForm, index) => <div key={`tab-content-${index}`} className={`tab-pane branches ${activeTab === lookupForm.tab ? 'active' : ''}`} id={`${lookupForm.tab}`} role="tabpanel">

                                                    {imageCloudfront && <SubLookup tabData={lookupForm} imageCloudfront={imageCloudfront} />}
                                                </div>)
                                            }

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Lookups;
