import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "./chat.css";


class Chat extends Component {

    constructor(props) {
		super(props);
		this.state = {
          inputMessage:"",
		}
	};

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.message !== this.props.message) {
            this.renderMessage(this.props.message);
        }

        if (prevProps.ChatroomMssgs !== this.props.ChatroomMssgs) {
            this.renderChatRoomMssg(this.props.ChatroomMssgs);
        }
    };

    renderMessage = (message) => {
        //const { messages } = this.props;
        //for (let i=0; i<messages.length; i++) {
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
    }

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
        const author = this.props.author;
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
        this.props.sendMessage(message);
    };

    handleChange = (event) => {
        const mssg = event.target.value;
        this.setState({inputMessage: mssg});
    };

    render() {

        const { message, sendMessage, ChatroomMssgs } = this.props;

        return(

            <>
                <div className='chat_form'>

                    <div className="chat_log" id="chat_log">
                        <ul className="list-group" id="chat-log">
                        </ul>
                    </div>

                    <form onSubmit={this.handleSubmit} autoComplete="off">
                        <input type="text" 
                            class="form-control" 
                            name="mssg_input" 
                            id="mssg-input" 
                            placeholder="Your message ..." 
                            onChange={this.handleChange}
                            value={this.state.inputMessage}>
                        </input>
                    </form>
                </div>
                

            </>
        )
    }
}

    
    
export default Chat;
    
    
    
    
    
    
    
    
    
    
    
    
    
