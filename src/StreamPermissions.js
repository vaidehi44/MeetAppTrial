import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import './streamPermissions.css';
import 'bootstrap/dist/css/bootstrap.css';


class StreamPermissions extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            videoStream: false,
            audioStream: false,
            name: ""
        };
        this.roomId = this.props.match.params.id;
        this.session = this.props.match.params.session;
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
        const roomId = this.roomId;
        const session = this.session;
        const loggedInUser = this.userName;
        const { name } = this.state;
        
        return (

            this.isLoggedIn ? (
                <Modal show="true" className="stream_permission_modal">
                    <Modal.Header>
                        <Modal.Title>MeetApp </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Hello <strong>{loggedInUser}</strong>,</h5>
                        <h5>Joining session {session}</h5>
                    
                    </Modal.Body>
                    <Modal.Footer>
                        <Button>
                            <Link to={"/"}>Cancel</Link>
                        </Button>
                        <Button>
                            <Link to={"/"+roomId+"/"+session+"/"+loggedInUser}>Enter Room</Link>
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <Modal show="true" className="stream_permission_modal">
                    <Modal.Header>
                        <Modal.Title>MeetApp </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Joining session {session}</h5>
                        <div>Join as - <input type='text' placeholder="Your name" value={name} onChange={this.setName} autoComplete="off"></input></div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button>
                            <Link to={"/"}>Cancel</Link>
                        </Button>
                        <Button>
                            <Link to={"/"+roomId+"/"+session+"/"+name+"/"}>Enter Room</Link>
                        </Button>
                    </Modal.Footer>
                </Modal>
            )
        
        )
        
    }
}

export default StreamPermissions;