import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import { io } from 'socket.io-client';
import './chatroom.css';


class ChatRoom extends Component {

    constructor(props) {
		super(props);
		this.state = {
          Users: [{'userId':'Your Id', 'userName':'Your Name'}],
          MyId: "",
          NewMessage: null,
          inputMessage: "",
          showModal: false,
          videoStream: false,
          audioStream: false,
          ChatroomMssgs: []
		};

        this.socket = io("https://my-meet-app.herokuapp.com");
        this.roomId = this.props.match.params.id;
        this.sessionTitle = this.props.match.params.session;
        this.MyName = this.props.match.params.name;        

    }

    componentDidMount() {
        const roomId = this.roomId;
        this.socket.on("connect", () => {
          this.setState({ MyId: this.socket.id});
          console.log('my id', this.state.MyId);
          this.getChatroomMessages();
          this.socket.emit("join-chat-room", { roomId: roomId, userName: this.MyName, userId: this.socket.id} ); 
          this.getAllUsers(roomId);
        });

        this.socket.on("all-chat-users", (array) => {
            this.setState({ Users:array });
        });

        this.socket.on("chat-user-connected", (userId) => {
            this.getAllUsers(roomId);
        });

        this.socket.on("chat-user-disconnected", (userId) => {
            this.getAllUsers(roomId);
        })

        this.socket.on("chat-mssg", (mssg, userName) => {
            this.setState({ NewMessage: { "message": mssg , "userName": userName } });
            //console.log("new mssg", this.state.NewMessage);
        });

        this.socket.on("all-chatroom-mssg", (array) => {
            if (array!==null && array!==undefined) {
                this.setState({ChatroomMssgs: array});
                //console.log("works", this.state.ChatroomMssgs);
            }
            
        });

    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState.NewMessage !== this.state.NewMessage) {
            this.renderMessage(this.state.NewMessage);
        }

        if (prevState.ChatroomMssgs !== this.state.ChatroomMssgs) {
            this.renderChatRoomMssg(this.state.ChatroomMssgs);
        }
    };

    getAllUsers = (roomId) => {
        this.socket.emit("getAllChatUsers", roomId);
    };

    getChatroomMessages = () => {
        this.socket.emit("get-chatroom-mssg", this.roomId)
    };

    renderMessage = (message) => {

        if (message !== null ){
            const log = document.getElementById("chat-log");
            const mssg = message.message;
            const author = message.userName;
            const li = document.createElement("li");
            li.className = "chat-mssg-item";
            const div1 = document.createElement("DIV");
            div1.className = "author";
            const div2 = document.createElement("DIV");
            div2.className = "mssg";        
            const author_node = document.createTextNode(author);
            const mssg_node = document.createTextNode(mssg);
            div1.appendChild(author_node);
            div2.appendChild(mssg_node);
            li.appendChild(div1);
            li.appendChild(div2);
            log.appendChild(li);
        }
    };

    renderChatRoomMssg = (array) => {

        if (array.length>0) {

            for (let i=0; i<array.length; i++) {
                const object = {
                    "userName": array[i].author,
                    "message": array[i].message
                }
                console.log("rendering");
                this.renderMessage(object);
            }
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const log = document.getElementById("chat-log");
        this.setState({inputMessage:""});
        const author = this.MyName;
        const message = this.state.inputMessage;
        const li = document.createElement("LI");
        li.className = "chat-mssg-item";
        const div1 = document.createElement("DIV");
        div1.className = "author";
        const div2 = document.createElement("DIV");
        div2.className = "mssg";        
        const author_node = document.createTextNode(author);
        const mssg_node = document.createTextNode(message);
        div1.appendChild(author_node);
        div2.appendChild(mssg_node);
        li.appendChild(div1);
        li.appendChild(div2);
        log.appendChild(li);
        this.socket.emit("send-chat-mssg", message, this.roomId, this.MyName);
    };

    handleChange = (event) => {
        const mssg = event.target.value;
        this.setState({inputMessage: mssg});
    };

    handleVideo = (e) => {
        this.setState({ videoStream: e.target.checked })
    };
    handleAudio = (e) => {
        this.setState({ audioStream: e.target.checked })
    };

    disconnect = (roomId, userId) => {
        this.socket.emit("chatroom-disconnect-me", roomId, userId);
        return window.location.href = "/"
      };

    render() {
        const { Users, MyId, videoStream, audioStream } = this.state;
        const name = this.MyName;
        const roomId = this.roomId;
        const sessionTitle = this.sessionTitle;

        return(

            <>
                <Navbar />
                <div className="chatroom_wrapper d-flex flex-row justify-content-around">

                    <div className="members_list">
                        <h3>Members</h3><hr></hr>
                        { Users.map((user, index) => <div key={index} className='member_name'>{user.userName}<br></br></div>)}
                    </div>

                    <div className='chatroom_chat_form d-flex flex-column'>
                        <div className="chat_log order-1 " id="chat_log">
                            <ul className="list-group d-flex flex-column align-items-end" id="chat-log">
                            </ul>
                        </div>
                        <form onSubmit={this.handleSubmit} className="chat_input order-2" autoComplete="off">
                            <input type="text" 
                                class="form-control" 
                                name="mssg_input" 
                                id="mssg-input" 
                                placeholder="Your message ..." 
                                onChange={this.handleChange}
                                value={this.state.inputMessage}>
                            </input>
                        </form>

                        <div className='chatroom_buttons order-3 d-flex flex-row justify-content-end'>
                            <Button onClick={() => this.setState({showModal: true})}>Join Video Call</Button>
                            <Button onClick={() => this.disconnect(roomId, MyId)}>Leave Room</Button>

                        </div>
                    </div>
                </div>

                <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})} className="chatroom_modal">
                    <Modal.Header closeButton>
                        <Modal.Title>Created a Video Calling Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <h5>{name},</h5>
                        </div>
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
                        <Button>Copy Link</Button>
                        <Button>
                            <Link to={"/"+roomId+"/"+sessionTitle+"/"+name+"/"+videoStream.toString()+"/"+audioStream.toString()}>Enter the Room</Link>
                        </Button>
                       
                    </Modal.Footer>
                </Modal>

            </>

        )
    }
}

export default ChatRoom;