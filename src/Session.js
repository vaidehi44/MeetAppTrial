import React, { Component } from "react";
import './session.css'
import 'bootstrap/dist/css/bootstrap.css';

const apiUrl = "http://localhost:5000/api/sessions-info";


const showChats = (array) => {
    const chats = array.map((chat, index) => {
        const {author} = chat;
        const {message} = chat;

        return(
            <li className="chat-mssg-block">
                <div className="author">{author}</div>
                <div className="mssg">{message}</div>
            </li>
        )
        
    })

    return <ul>{chats}</ul>
}

const showNotes = (array) => {
    const notes = array.map((note, index) => {
        return <div>{note}</div>
    })

    return <div>{notes}</div>
}


const Rows = (props) => {
    const data = props.data;

    const rows = data.map((row, index) => {
        const sessionRow = (
            <div className="accordion-item">
                <h2 className="accordion-header" id={"heading"+index}>
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#data"+index} aria-expanded="false" aria-controls={"data"+index}>
                            { row.session_title }
                        </button>
                </h2>
                <div id={"data"+index} className="accordion-collapse collapse" aria-labelledby={"heading"+index} data-bs-parent="#sessions-accordion">
                    <div className="accordion-body">
                        <div className="chat-notes-container d-flex justify-content-center">
                            <div className="chats">
                                { showChats(row.chats) }
                            </div>
                            <div className="notes">
                                { showNotes(row.notes) }
                            </div>

                        </div>
                    </div>
                </div>
            </div>)
        return <div>{sessionRow}</div>
    })
    
    return <div className="accordion" id="sessions-accordion">{rows}</div>
}

class Session extends Component {

    constructor(props) {
		super(props);
		this.state = {
            sessions:[]
		}
        this.MyDbId = localStorage.getItem('meetapp-dbId');
        this.userToken = localStorage.getItem('meetapp-bearer-token');
    };
    
    componentDidMount() {
        const user_id = this.MyDbId;

        fetch(apiUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': this.userToken},
            body: JSON.stringify({
                user_id: user_id
            })
        }).then(res => {
            if (res.status===200) {
                //console.log("received sessions data");
                return res.json();
            } else {
                //console.log("couldn't get sessions data ");
            }
        }).then(res => {
            this.setState({ sessions: res['sessions']});
        })
        .catch(err => {
            //console.log(err);
        })
    }

    render() {
        const { sessions } = this.state;

        return(
            <>
                <h2>Your Sessions - </h2>
                <div className="accordion-container d-flex justify-content-center">
                    <Rows data={sessions} />

                </div>
            </>
        )
    }
}

export default Session;