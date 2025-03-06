/***
**Module Name: content check
 **File Name :  contentCheck.js
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
 **Description : contains imported deatails not found details.
 ***/
import React, { useState, useEffect, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const ContentCheck = (props) => {
    const history = useHistory();
    const [content, setContent] = useState({});

    const [jsonobj, setJsonObj] = useState({});

    useEffect(() => {
        if (props && props.data) {
            setContent(props.data[0]);

        }

    }, [props && props.data]);


    function exportToExcel(jsonData, fileName) {
        delete jsonData['_id'];
        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        //FileSaver.saveAs(data, `${fileName}.xlsx`);
        FileSaver.saveAs(data, `rejectedcontent.xlsx`);
    }

    const handlecheck = (data, fileName) => {
     

        for (let key in data) {
            delete data[key]['_id']
            delete data[key]['created']
            delete data[key]['companyid']
            delete data[key]['status']
            delete data[key]['mediaType']
            delete data[key]['appname']
            delete data[key]['source']
            delete data[key]['importId']
         

            for (let item in data[key]) {
                console.log("iteeeeee", typeof (data[key][item]));
                if (typeof (data[key][item]) === "object") {
                    data[key][item] = data[key] && data[key][item] && data[key][item].length > 1 && data[key][item]?.join(', ');
                } else {
                    data[key][item] = data[key][item];
                }
                
            }


        }
        exportToExcel(data, fileName);

    }


    const handleClose = () => {
        history.push("/contentmanagement");
    }
    
    return (
        <>

            <div id="layout-wrapper">
                <div className="page-content import-content-status ">
                    <div className="container-fluid">
                        <div className="row mb-4 breadcrumb">
                            <div className="col-lg-12">
                                <div className="d-flex align-items-center justify-content-between">

                                    <div className="d-flex align-items-center content-status-count">
                                        <h4 className="mb-2 card-title">IMPORT CONTENT STATUS</h4>
                                        <div className="d-flex">
                                            <p className="menu-path"><span className="material-icons text-success">verified</span >{content && content.insertedCount} Titles Imported Successfully</p>
                                            <p className="menu-path"><span className="material-icons text-success">verified</span >{content && content.updatedCount} Titles Updated Successfully</p>
                                            
                                        </div>
                                        {/* <div className="d-flex align-items-center">
                                           
                                        </div> */}
                                        <div className="d-flex">
                                        <p className="menu-path"><span className="material-icons text-danger">report_problem</span>{content && content.duplicateContentCount} Duplicate Title(s)</p>

                                        <p className="menu-path"><span className="material-icons text-danger">report_problem</span>{content && content.rejectedCount} Titles Failed to import</p>
                                        </div>

                                    </div>
                                    <div>
                                        <a onClick={handleClose} className="btn btn-primary">close</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {content && content.rejected && content.rejected.length > 0 ?
                        <div className="create-user-block">
                            <div className="d-flex align-items-center">
                                    <p>Failed Content List</p>

                                    {/* <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button"
        table="table-to-xls"
        filename="Rejectedlist"
        sheet="tablexls"
        buttonText="Export"
        
    /> */}
                                    <button className="btn btn-primary " type="button" onClick={(e) => handlecheck(content.rejected, "data")}>
                                        Export

                                    </button>
                                </div><table className="table align-middle table-nowrap table-check" id="table-to-xls">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="align-middle">Title</th>
                                                <th className="align-middle">Category</th>
                                                <th className="align-middle">Reason</th>


                                            </tr>
                                        </thead>
                                        <tbody>
                                            {content && content.rejected && content.rejected.length > 0 && content.rejected.map(function (item, i) {
                                                return (
                                                    <tr key={i}>
                                                        <td>{item.title}</td>
                                                        <td>{item && item.category && item.category.length > 1 ? item && item.category : item && item.category?.join(", ")}</td>
                                                        <td>{item.rejectableReason}</td>


                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                            
                        </div>
                        :<div className="empty-state-body">
                        <div className="empty-state__message">
                        <span className="material-symbols-outlined">fact_check</span>
                        <p className="form-check font-size-16">All titles successfully imported</p>
                        </div>
                        </div>}
                    </div>
                </div>
            </div>

        </>
    );
};

export default ContentCheck;
