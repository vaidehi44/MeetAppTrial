import React, { Component } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button, Modal } from 'react-bootstrap';
import './homepage.css';
import 'bootstrap/dist/css/bootstrap.css';

class SimpleHomepage extends Component {

    constructor(props) {
		super(props);
		this.state = {
            showModalOne: false,
            showModalTwo: false,
            sessionTitle: "Untitled Session",
            name: ""
		}

    };

    showModalOne = () => this.setState({showModalOne: true});
    closeModalOne = () => this.setState({showModalOne: false});

    openModalTwo = (e) => {
        this.setState({ showModalOne: false });
        this.setState({ showModalTwo: true });
    }
    closeModalTwo = () => this.setState({showModalTwo: false});


    setTitle = (e) => {
        this.setState({ sessionTitle: e.target.value });
    }

    setName = (e) => {
        this.setState({ name: e.target.value });
    }

    render() {
        const roomId = uuidv4();
        const { name, sessionTitle } = this.state;
        return(
            <>
                <Navbar />
                <div className="website-content">
                    <h1>MeetApp</h1>
                    <h4>Some text..</h4>

                    <button type='button' onClick={this.showModalOne}>
                        Create New Room
                    </button>
                </div>
                
                
                <Modal show={this.state.showModalOne} onHide={this.closeModalOne} className="homepage_modalOne">
                    <Modal.Header closeButton>
                        <Modal.Title>Create a Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Hello User</h4>,
                        <h5>Please enter the following details to create a new chatroom</h5>
                        <h4>Join as - <input type='text' placeholder="Your name" value={name} onChange={this.setName} autoComplete="off"></input></h4>
                        <h4>Session Title - <input type="text" id="session-title-input" value={sessionTitle} onChange={ this.setTitle } placeholder="(optional)" autoComplete="off"></input></h4>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.openModalTwo}>Generate Link</Button>

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

export default SimpleHomepage;