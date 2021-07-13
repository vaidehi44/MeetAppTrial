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
                        <h5>Join as - <input type='text' placeholder="Your name" value={name} onChange={this.setName} autoComplete="off"></input></h5>
                        <h5>Session Title - <input type="text" id="session-title-input" value={sessionTitle} onChange={ this.setTitle } placeholder="(optional)" autoComplete="off"></input></h5>
                        
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
                            <h5>{name},</h5>
                            Your link is - <span>/{roomId}/{sessionTitle}</span>
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