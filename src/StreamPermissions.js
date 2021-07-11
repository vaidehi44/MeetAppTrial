import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import './streamPermissions.css';
import 'bootstrap/dist/css/bootstrap.css';


class StreamPermissions extends Component {

    constructor() {
        super();
        this.state = { 
            videoStream: false,
            audioStream: false,
            name: ""
        };
        this.token = localStorage.getItem('meetapp-bearer-token');
        this.userName = localStorage.getItem('meetapp-username');
        if (this.token) this.isLoggedIn = true;
        
      }

    handleVideo = (e) => {
        //console.log('video-',e.target.checked);
        this.setState({ videoStream: e.target.checked })
      }

    handleAudio = (e) => {
        this.setState({ audioStream: e.target.checked })
    }

    setName = (e) => {
        this.setState({ name: e.target.value });
    }
      
    render() {
        const roomId = this.props.match.params.id;
        const session = this.props.match.params.session;
        const loggedInUser = this.userName
        const { videoStream, audioStream, name } = this.state;
        
        return (

            this.isLoggedIn ? (
                <Modal show="true" className="stream_permission_modal">
                    <Modal.Header>
                        <Modal.Title>MeetApp - Joining a Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Hello <strong>{loggedInUser}</strong>,</h5>
                        <div>Please allow browser to access your video and audio streams and select your initial video and audio preferences -</div>
                        <label className="switch">
                            <input type="checkbox" onChange = { this.handleVideo }></input>
                            <span className="slider round"></span>
                            <span className='streamLabel'>Video</span>
                        </label>
                        <label className="switch">
                            <input type="checkbox" onChange = { this.handleAudio }></input>
                            <span className="slider round"></span>
                            <span className='streamLabel'>Audio</span>
                        </label>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button>
                            <Link to={"/"}>Cancel</Link>
                        </Button>
                        <Button>
                            <Link to={"/"+roomId+"/"+session+"/"+loggedInUser+"/"+videoStream.toString()+"/"+audioStream.toString()}>Enter Room</Link>
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <Modal show="true" className="stream_permission_modal">
                    <Modal.Header>
                        <Modal.Title>MeetApp - Joining a Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>Join as - <input type='text' placeholder="Your name" value={name} onChange={this.setName} autoComplete="off"></input></div>

                        <div>Please allow browser to access your video and audio streams and select your initial video and audio preferences -</div>
                        <label className="switch">
                            <input type="checkbox" onChange = { this.handleVideo }></input>
                            <span className="slider round"></span>
                            <span className='streamLabel'>Video</span>
                        </label>
                        <label className="switch">
                            <input type="checkbox" onChange = { this.handleAudio }></input>
                            <span className="slider round"></span>
                            <span className='streamLabel'>Audio</span>
                        </label>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button>
                            <Link to={"/"}>Cancel</Link>
                        </Button>
                        <Button>
                            <Link to={"/"+roomId+"/"+session+"/"+name+"/"+videoStream.toString()+"/"+audioStream.toString()}>Enter Room</Link>
                        </Button>
                    </Modal.Footer>
                </Modal>
            )
        
        )
        
    }
}

export default StreamPermissions;