import React, { Component } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button, Modal } from 'react-bootstrap';
import './homepage.css';
import 'bootstrap/dist/css/bootstrap.css';

class Homepage extends Component {

    constructor(props) {
		super(props);
		this.state = {
            showModalOne: false,
            showModalTwo: false,
            videoStream: false,
            audioStream: false,
            sessionTitle: "Untitled Session",
		}
        this.name = localStorage.getItem("meetapp-username");
    };

    showModalOne = () => this.setState({showModalOne: true});
    closeModalOne = () => this.setState({showModalOne: false});

    openModalTwo = (e) => {
        this.setState({ showModalOne: false });
        this.setState({ showModalTwo: true });
    }
    closeModalTwo = () => this.setState({showModalTwo: false});


    handleVideo = (e) => {
        this.setState({ videoStream: e.target.checked })
      }
    handleAudio = (e) => {
        this.setState({ audioStream: e.target.checked })
    }

    setTitle = (e) => {
        this.setState({ sessionTitle: e.target.value });
    }

    render() {
        const roomId = uuidv4();
        const name = this.name;
        const { videoStream, audioStream, sessionTitle } = this.state;
        return(
            <>
                <Navbar />
                <div className="website-content">
                    <h1>MeetApp</h1>
                    <h4>Some text..</h4>

                    <button type='button' onClick={this.showModalOne}>
                        Create New Room
                    </button>

                
                    <button type='button'>
                        <Link to={'/sessions'}>Your Sessions</Link>
                    </button>
                </div>
                
                <Modal show={this.state.showModalOne} onHide={this.closeModalOne} className="homepage_modalOne">
                    <Modal.Header closeButton>
                        <Modal.Title>Create a Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Hi <strong>{name}</strong>,</h4>
                        <h5>Please enter a name for your session/call -</h5>
                        <br></br>
                        <h4>Session Title - <span><input type="text" id="session-title-input" value={sessionTitle} onChange={ this.setTitle } placeholder="(optional)" autoComplete="off"></input></span></h4>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.openModalTwo()}>
                            Generate Link
                        </Button>
                        <Button onClick={this.closeModalOne}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showModalTwo} onHide={this.closeModalTwo} className="homepage_modalTwo">
                    <Modal.Header closeButton>
                        <Modal.Title>Created a Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <h4>{name},</h4>
                            <h6>
                                Your link is - <br></br>
                                <strong style={{color: '#3965bd'}}>my-meetapp.netlify.app/{roomId}/{sessionTitle}</strong>
                            </h6>
                        </div>
                                              
                    </Modal.Body>
                    <Modal.Footer>
                        <Button>Copy Link</Button>
                        <Button>
                            <Link to={"/"+roomId+"/"+sessionTitle+"/"+name}>Enter the Room</Link>
                        </Button>
                       
                    </Modal.Footer>
                </Modal>


            </>
           
        )
    }
}

export default Homepage;