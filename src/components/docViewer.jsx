import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FileViewer = (props) => {
    console.log(props.type);
    const docs = [
        { uri: props.source ,fileType: props.type,fileName: props.name }  // Local File
      ];

   console.log('docs',docs);
    return (
        <>
           
            <Modal show={true} className="video-popup document-popup">
                <button className="close-btn" onClick={(e) => props.close(false)}>
                    <span className="material-icons">close</span>
                </button>
                <Modal.Body>
                    <div style={{ width: '100%', height: '90vh', position: 'relative' }}>
                        <DocViewer
                            style={{ width: '100%', height: '100%' }}
                            pluginRenderers={DocViewerRenderers}
                            documents={docs}
                        />
                        <a
                            href={props.source} // Replace with the actual URL of your Excel file
                            download={props.type} // Specify the desired filename for download
                            style={{
                                position: 'absolute',
                                bottom: '20px',
                                right: '20px',
                                backgroundColor: 'blue',
                                color: 'white',
                                padding: '10px 20px',
                                textDecoration: 'none',
                                borderRadius: '5px',
                            }}
                        >
                            Download
                        </a>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    );
};


export default FileViewer;



