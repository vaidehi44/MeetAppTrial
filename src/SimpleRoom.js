import React, { Component } from 'react';
import { io } from 'socket.io-client';
import Chat from "./Chat";
import Notebook from "./Notebook";
import Peer from 'peerjs';
import 'bootstrap/dist/css/bootstrap.css';
import "./room.css";

const real = "https://my-meet-app.herokuapp.com/";
const local = "http://localhost:5000";

//check this
class SimpleRoom extends Component {
  constructor(props) {
		super(props);
		this.state = {
          Users: [{'userId':'Your Id', 'userName':'Your Name'}],
          MyId: "",
          MyStream: null,
          MyPeer: null,
          Streams: [],
          ScreenShared: { "bool": false, "stream": null},
          NewMessage: null,
          MyNotes: [],
          ChatroomMssgs: []
		};

    this.socket = io(real);
    this.roomId = this.props.match.params.id;
    this.MyName = this.props.match.params.name;
    this.initialVideo = this.props.match.params.video;
    this.initialAudio = this.props.match.params.audio;
    this.sessionTitle = this.props.match.params.session;

	};

  componentDidMount() {
    const roomId = this.roomId;
    this.socket.on("connect", () => {
      this.setState({ MyId: this.socket.id});
      this.getChatroomMessages();
      /*this.setState({MyPeer: new Peer(this.socket.id)});*/
      this.setState({MyPeer: new Peer(this.socket.id, { host: "meetapp-peerjs-server.herokuapp.com", port: window.location.protocol === 'https:' ? 443 : 9000, secure: true, debug: 3, 
          config: {'iceServers': [
              { 'urls': 'stun:stun.l.google.com:19302' },
              { 'urls': 'turn:numb.viagenie.ca:3478', credential: 'muazkh', username:'webrtc@live.com' },
              { 'urls': 'turn:numb.viagenie.ca', credential: 'muazkh', username:'webrtc@live.com' },
              { 'urls': 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' },
              { 'urls': 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' },
              { 'urls': "turn:13.250.13.83:3478?transport=udp","username": "YzYNCouZM1mhqhmseWk6","credential": "YzYNCouZM1mhqhmseWk6"}
            ]
          }})});
      this.socket.emit("join-room", { roomId: roomId, userName: this.MyName, userId: this.socket.id} ); 
      this.getAllUsers(roomId);
    });
    
    this.getMyStream();

    this.socket.on("all-users", (array) => {
      this.setState({ Users:array });
    });

    this.socket.on("user-connected", (userId) => {
      this.HandleNewConn(roomId, userId);
    });

    this.socket.on("user-disconnected",(id) => {
      this.handleDisconnection(id);
    });

    this.socket.on("accept screen", () => {
      this.acceptScreen();
    });

    this.socket.on("remove shared screen", (userId) => {
      this.removeStream("screen"+userId);
    });

    this.socket.on("chat-mssg", (mssg, userName) => {
      this.setState({ NewMessage: { "message": mssg , "userName": userName } });
      //console.log("new mssg", this.state.NewMessage);
    });

    this.socket.on("all-chatroom-mssg", (array) => {
      this.setState({ChatroomMssgs: array});
    });

    if (this.state.MyPeer!==null) {
      this.state.MyPeer.on("disconnected", () => {
        console.log("trying to reconnect peer");
        this.state.MyPeer.reconnect();
      })
    };

  };

  getChatroomMessages = () => {
    this.socket.emit("get-chatroom-mssg", this.roomId)
  };

  getMyStream = () => {
    navigator.mediaDevices.getUserMedia({'video':true, 'audio': true})
    .then(stream => {
      this.setState({ MyStream: stream });
      this.setState({ Streams: [...this.state.Streams, stream.id]});
      this.addMyVideo(stream);
      const setInitialStream = (video, audio) => {
        if (video==='true') {
            return stream.getVideoTracks()[0].enabled = true;
        }
        if (video==='false') {
            return stream.getVideoTracks()[0].enabled = false;
        }
        if (audio==='true') {
            return stream.getAudioTracks()[0].enabled = true;
        }
        if (audio==='false') {
            return stream.getAudioTracks()[0].enabled = false;
        }
      };

      setInitialStream(this.initialVideo, this.initialAudio);
      this.AcceptConnection();
    })
    .catch(error => {
      console.error('Error accessing media devices.', error);
    });
  };

  getAllUsers = (roomId) => {
    this.socket.emit("getAllUsers", roomId);
  };

  HandleNewConn = (roomId, userId) => {
      this.getAllUsers(roomId);
      this.MakeConnection(userId);
  };

  MakeConnection = (id) => {
    if (this.state.MyPeer!==null){
      var call = this.state.MyPeer.call(id, this.state.MyStream, {metadata: { "type" : "camera"}});
      call.on("stream", (stream) => {
        if (!this.state.Streams.includes(stream.id)) {
          this.setState({ Streams: [...this.state.Streams, stream.id]})
          this.addMemberVideo(stream, call.peer);
          console.log("received stream from make conn", id);
        }
      })
    } 
  };

  AcceptConnection = () => {
    if (this.state.MyPeer!==null) {
      this.state.MyPeer.on("call", (call) => {  
        if (call.metadata.type==="camera") {
          call.answer(this.state.MyStream);
          call.on("stream", (stream) => {
            if (!this.state.Streams.includes(stream.id)) {
              this.setState({ Streams: [...this.state.Streams, stream.id]})
              this.addMemberVideo(stream, call.peer);
              console.log("received stream from accept conn")
              }
            })
          } 
        })  
      } 
    };

  addMyVideo = (stream) => {
    const video = document.getElementsByClassName('myStream')[0];
    video.id = this.state.MyId;
    video.srcObject = stream;
    video.muted = true;
    video.play();
  };

  addMemberVideo = (stream, memberId) => {
    const memberName = this.state.Users.find(object => object["userId"]===memberId)["userName"];
    const container = document.getElementById("stream-container");
    const videoContainer = document.createElement("div");
    const memberNameDiv = document.createElement("div");
    const video = document.createElement("video");
    videoContainer.className = "memberVideoContainer";
    videoContainer.id = memberId;
    videoContainer.onclick = () => {this.screenExpand(memberId)};
    memberNameDiv.className = "memberNameContainer";
    memberNameDiv.innerHTML = memberName;
    videoContainer.appendChild(memberNameDiv);
    videoContainer.appendChild(video);
    container.appendChild(videoContainer);
    video.className = "memberVideo";
    video.srcObject = stream;
    video.play();
  };

  screenExpand = (id) => {
    const container = document.getElementById(id.toString());
    const memberNameDiv = container.childNodes[0];
    const video = container.childNodes[1];
    container.classList.toggle('expand');
    memberNameDiv.classList.toggle('expand');
    video.classList.toggle('expand');
  }

  screenShareExpand = (id) => {
    const vid = document.getElementById(id);
    vid.classList.toggle('expand');
  }

  myVideoControl = (stream) => {
    if(stream!=null){
      stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled);
      //console.log("stream set", typeof(stream.getVideoTracks()[0]))
    }
  };

  myAudioControl = (stream) => {
    if(stream!=null){
      stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
      //console.log("stream set", stream.getAudioTracks()[0])
    }
  };


  disconnect = (roomId, userId) => {
    this.state.MyPeer.destroy();
    this.socket.emit("disconnect-me", roomId, userId);
    return window.location.href = "/"
  };

  handleDisconnection = (id) => {
      this.removeStream(id);
      this.getAllUsers(this.roomId);
  };

  removeStream = (videoId) => {
    var video = document.getElementById(videoId);
    video.remove();
  }

  shareScreen = () => {
    if (!this.state.ScreenShared.bool) {
      navigator.mediaDevices.getDisplayMedia({'video':true, 'audio': true})
      .then(stream => {
        this.setState({ ScreenShared: { "bool": true, "stream": stream } });
        this.sendScreen(stream);
        this.setState({isScreenShared:true})        
      })
      .catch(error => {
        console.error('Error accessing/sending the screen.', error);
      });
    }else {
      this.state.ScreenShared.stream.getTracks().forEach(track => track.stop());
      this.setState({ ScreenShared: { "bool": false, "stream": null } });
      this.socket.emit("screen unshare", this.roomId, this.state.MyId);
      this.removeStream("screen"+this.state.MyId);
      this.setState({isScreenShared:false});
    }
  };

  sendScreen = (stream) => {
    for (let i=0; i<this.state.Users.length; i++) {
      var call = this.state.MyPeer.call(this.state.Users[i].userId, stream, {metadata: { "type": "screenShare"}});
      if (!this.state.Streams.includes(stream.id)) {
        this.setState({ Streams: [...this.state.Streams, stream.id]})
        this.socket.emit("send screen", this.roomId);
        const container = document.getElementById("stream-container");
        const video = document.createElement("video");
        video.className = "shared-screen";
        const vidId = "screen" + this.state.MyId;
        video.id = vidId;
        video.onclick = () => {this.screenShareExpand(vidId)}
        container.appendChild(video);
        video.srcObject = stream;
        video.play();
      }
    }
  };

  acceptScreen = () => {
    if (this.state.MyPeer !== null) {
      this.state.MyPeer.on("call", (call) => {
        if (call.metadata.type==="screenShare") {
          call.answer();
          call.on("stream", (stream => {
          if (!this.state.Streams.includes(stream.id)) {
              this.setState({ Streams: [...this.state.Streams, stream.id]});
              const container = document.getElementById("stream-container");
              const video = document.createElement("video");
              video.id = "screen" + call.peer;
              container.appendChild(video);
              video.srcObject = stream;
              video.setAttribute("width","400");
              video.play(); 
              //console.log("accepted screen");
            }
          })
          )
        }
      })
  }};

  sendMessage = (mssg) => {
    this.socket.emit("send-chat-mssg", mssg, this.roomId, this.MyName);
  }

  getNotes = (notes) => {
    const array = notes.split('\n');
    this.setState({ MyNotes: array })
  }

  sidebarToggle = () => {
    const sidebar = document.getElementById('sidebar');
    const video = document.getElementById('myVideoContainer');
    const stream_btn = document.getElementById('streamToggle');
    const member_chat_notes = document.getElementById('members_chat_notes');
    const toggle_btn = document.getElementById('sidebarCollapse');
    const main = document.getElementById('main-container');
    sidebar.classList.toggle('hide');
    video.classList.toggle('hide');
    stream_btn.classList.toggle('hide');
    member_chat_notes.classList.toggle('hide');
    toggle_btn.classList.toggle('hide');
    main.classList.toggle('expand');
  }

  toggleStream = () => {
    const stream = document.getElementById('myVideoContainer');
    const toggle_btn = document.getElementById('streamToggle');
    stream.classList.toggle('streamHide');
    toggle_btn.classList.toggle('collapsed');
    const members = document.getElementById('membersContainer');
    const chat_log = document.getElementById('chat_log');
    const notebook = document.getElementById('notes_page');
    members.classList.toggle('expand');
    chat_log.classList.toggle('expand');
    notebook.classList.toggle('expand');
  }
  

  render() {
    const roomId = this.roomId;
    const MyName = this.MyName;
    const sessionTitle = this.sessionTitle;
    const { ChatroomMssgs, MyId, MyStream, NewMessage, Users } = this.state;

    return(
      <>
      <div className="room_page d-inline-flex" >
          <div id="sidebar" className='d-flex flex-column align-items-center justify-content-start'>
            <div className="align-self-end">
              <button type="button" id="sidebarCollapse" onClick={() => {this.sidebarToggle()}} >
                  <span></span>
                  <span></span>
              </button>
            </div>
            <div id="myStreamContainer"  >
              <div className='myVideoContainer' id='myVideoContainer'>
                <div className='callerName'>{ MyName } <small>( you )</small></div>
                <video className="myStream" width="300"></video>
              </div>
            </div>

            <button id="streamToggle" className="streamToggle" onClick={() => {this.toggleStream()}}>
                <span></span>
                <span></span>
            </button>

            <div id="members_chat_notes" className="members_chat_notes d-flex flex-column justify-content-start ">
                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="pills-participants-tab" data-bs-toggle="pill" data-bs-target="#pills-participants" type="button" role="tab" aria-controls="pills-participants" aria-selected="true">Members</button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="pills-chat-tab" data-bs-toggle="pill" data-bs-target="#pills-chat" type="button" role="tab" aria-controls="pills-chat" aria-selected="false">Chatbox</button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="pills-notebook-tab" data-bs-toggle="pill" data-bs-target="#pills-notebook" type="button" role="tab" aria-controls="pills-notebook" aria-selected="false">Notebook</button>
                  </li>
                </ul>
              <div id="members_chat_notes_wrapper">
                <div class="tab-content" id="pills-tabContent">
                  <div class="tab-pane fade show active" id="pills-participants" role="tabpanel" aria-labelledby="pills-participants-tab"> 
                    <div className="membersContainer" id="membersContainer">
                      { Users.map((user, index) => <div key={index} className='member_name'>{user.userName}<br></br></div>)}
                    </div>
                  </div>
                  <div class="tab-pane fade" id="pills-chat" role="tabpanel" aria-labelledby="pills-chat-tab">
                    <Chat author={this.MyName} message={NewMessage} sendMessage={this.sendMessage} ChatroomMssgs={ChatroomMssgs}/>
                  </div>
                  <div class="tab-pane fade" id="pills-notebook" role="tabpanel" aria-labelledby="pills-notebook-tab">
                    <Notebook getNotes={this.getNotes}/>
                  </div>
                </div>
              </div>
            </div>

          </div>
        
          <div className="main d-flex flex-row" id="main-container">
            <div className="main-wrapper">
              <div className="sessionTitle"><p>{ sessionTitle }</p></div>
              <div className='stream-container d-flex flex-row flex-wrap justify-content-around' id='stream-container'></div>

              <div className="control-btns d-inline-flex justify-content-center">
                    <button onClick={() => {this.myVideoControl(MyStream)}} id="video-btn" >Video</button>
                    <button onClick={() => {this.myAudioControl(MyStream)}} id="audio-btn" >Audio</button>
                    <button onClick={() => {this.disconnect(roomId, MyId)}} id="disconnect-btn" >Disconnect</button>
                    <button onClick={() => {this.shareScreen()}} id="share screen" >Share Screen</button>
              </div>

            </div>
        </div>
          
      </div>
            
      </>
    )
  };
};


export default SimpleRoom;