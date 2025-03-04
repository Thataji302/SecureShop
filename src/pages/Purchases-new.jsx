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

const Purchases = () => {



    let { lambda, appname } = window.app;
    let companyId = localStorage.getItem("companyid");
    let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
    const [modelData, setModelData] = useState(null);
    const [lookupForms, setUpLookUpForms] = useState(null);
    
    const [activeTab, setActiveTab] = useState('Purchases');
    const [imageCloudfront, setImageCloudfront] = useState(null);
    
    useEffect(() => {
        if (window?.site?.common?.imageCloudfront) {
            setImageCloudfront(window.site.common.imageCloudfront);
            GetModelData();
        }
    }, [window?.site?.common]);

    const tabClick = (tab) => {
        setActiveTab(tab)
    }

    const GetModelData = (type) => {
        
        let userid = localStorage.getItem("userid") || localStorage.getItem("userId")
        let companyId = localStorage.getItem("companyid");
        const urlLink = `${lambda}/modelInfo?appname=${appname}&companyid=${companyId}&userid=${userid}`
        fetch({
            method: 'GET',
            url: urlLink,
        })
            .then(function (response) {
                if (response?.data?.result && response?.data?.result?.data) {
                    let res=[];
                    response.data.result.data.forEach(item=>{
                        let obj={
                            value:item.name,
                            label:item.name
                        }
                        if(item.status === "Active"){
                            res.push(obj)
                        }
                    });
                    setModelData(res)
                }
            });
    }


    useEffect(()=>{
        const lookupFormsTmp = [
            {
                tab: "Purchases",
                formFields: [
                    { name: "name", label: "Branch Name", type: "text", required: true },
                    { name: "invoiceDate", label: "invoice Date", type: "date", required: true, },
                    { name: "invoiceNumber", label: "invoice Number", type: "text", required: true },
                    { name: "chassisNumber", label: "chassis Number Code", type: "text" },
                    { name: "vendorName", label: "vendor Name", type: "text" },
                    { name: "variant", label: "Variant", type: "text" },
                    { name: "modelName", label: "Model Name", type: "select",options:modelData },
    
                    
    
                    //{ name: "gst", label: "GST", type: "text", pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/ },
                    {
                        name: "fuel", label: "Fuel", type: "select",
                        options: [
                            { value: "Deisel", label: "Deisel" },
                            { value: "Petrol", label: "Petrol" },
                            { value: "Electrical", label: "Electrical" }
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
    
                services: {
                    "summaryAPI": {
                        method: "GET",
                        url:  lambda + '/lookups?appname=' + appname + "&type=models"+ (userid ? "&userid=" + userid : "")
    
                    },
                    "createAPI": {
                        method: "POST",
                        url: lambda + '/addPurchase?appname=' + appname,
                        errors: [
                            "Purchases already exists"]
                    },
                    "updateAPI": {
                        method: "POST",
                        url:lambda + '/purchase?appname=' + appname + "&purchaseId=$id&userId=" + userid + "&type=purchase",
                        errors: [
                            "Purchases already exists"]
    
                    },
                    "deleteAPI": {
                        method: "POST",
                        url:lambda + '/deletePurchase?appname=' + appname + "&purchaseId=$id&userId=" + userid + "&type=delete"
                    }
                },
                columns: [
                    { key: "InvoiceDate", label: " Invoice Date", type: "date" },
                    { key: "invoiceNumber", label: "Invoice Number", type: "string" },
                    { key: "Name", label: "name", type: "string" },
                    { key: "Chassis Number", label: "chassisNumber", type: "string" },
                    { key: "Vendor Name", label: "vendorName", type: "date" },
                    { key: "Created", label: "created", type: "date" }

                ],
                labels: {
                    "add": "add purchases",
                    "edit": "edit purchases"
                }
    
            }
    
        ];
        setUpLookUpForms(lookupFormsTmp)

    },[modelData])

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


                                        <div className="tab-content pt-15 text-muted">
                                            {
                                                lookupForms && lookupForms.map((lookupForm, index) => <div key={`tab-content-${index}`} >

                                                    {imageCloudfront && <SubLookup tabData={lookupForm} imageCloudfront={imageCloudfront} tabSelected={activeTab} />}
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

export default Purchases;
