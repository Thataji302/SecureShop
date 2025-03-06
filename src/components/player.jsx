import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Player } from 'bitmovin-player';
import { UIFactory } from 'bitmovin-player/bitmovinplayer-ui';
import 'bitmovin-player/bitmovinplayer-ui.css';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

const PlayerInfo = (props) => {
    const history = useHistory();
    const [player, setPlayer] = useState({});
    const [show, setShow] = useState(true);


    const playerConfig = {
        key: 'FF0D1AAA-33CA-476D-9309-D7E1703CB643',
        playback: {
            autoplay: true
        },
        textTrack: {
            showMenuSubtitleItem: true
        }
    };
    useEffect(() => {
        const playerSource = {
            hls: props.source,
            // textTracks: props.subtitles 
        };
        setupPlayer(playerSource,props.subtitles );
    }, [props.play]);

    const setupPlayer = async (playerSource,subtitles) => {
        setShow(true);
        const portalDiv = document.getElementById('player');
        if (!portalDiv) {
            throw new Error("The element #player wasn't found");
        }
        const playerInstance = new Player(portalDiv, playerConfig);
        UIFactory.buildDefaultUI(playerInstance);
        playerInstance.load(playerSource).then(() => {
             setPlayer(playerInstance);
           
            if (subtitles && subtitles.length > 0) {
             
                subtitles.forEach(subtitle => {
                    playerInstance.subtitles.add({
                        id: subtitle.uuid,
                        lang: subtitle.lang,
                        label: subtitle.label,
                        url: subtitle.path,
                        kind: "subtitle"
                    });
                });
            }
            console.log('Successfully loaded source');
        }, () => {
            console.log('Error while loading source');
        });
    };

    const destroyPlayer = async (e) => {
        if (player && player != null) {
            setShow(false);
            player.unload();
            setPlayer(null);
            props.setPlay(false);
        }
    };

    return (
        <>
            <Modal show={true} className="video-popup" onHide={destroyPlayer}>
                <button className="close-btn" onClick={(e) => destroyPlayer(e)}><span className="material-icons">close</span></button>
                <Modal.Body>
                    <div>
                        <div id='player' />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PlayerInfo;
