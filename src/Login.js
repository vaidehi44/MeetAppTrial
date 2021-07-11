import React, { Component } from 'react';
import "./auth.css";
import Navbar from './Navbar';


const apiUrl = "https://my-meet-app.herokuapp.com/api/login";

export default class Login extends Component {

    constructor(props) {
		super(props);
		this.state = {
          username:"",
          password:""
		}
	};

    handleSubmit = (event) => {
        const { username, password } = this.state;
        fetch(apiUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => {
                if (res.status===200) {
                    //console.log('Login successful');
                    return res.json()
                } else if (res.status===401 || res.status===403) {
                    //console.log(res);
                    alert('Invalid credentials!')
                } else if (res.status===500) {
                    alert("Some error occured!")
                }
            })
            .then(res => {
                localStorage.setItem('meetapp-bearer-token', res['token']);
                localStorage.setItem('meetapp-username', res['username']);
                localStorage.setItem('meetapp-dbId', res['dbId']);
                this.props.history.push('/');
            })
            .catch(err => {
                //console.log(err);
            })

            event.preventDefault();
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    render() {
        const { username, password } = this.state;

        return(

            <>
                <Navbar />
                <div className="form-wrapper">

                    <div className="appTitle">
                        <h3>MeetApp</h3>
                    </div>

                    <form className="auth-form" onSubmit={this.handleSubmit} autoComplete="off">
                        <input type="text" name="username" value= {username} placeholder="Username" onChange={this.handleChange}></input>
                        <input type="text" name="password" value= {password} placeholder="Password" onChange={this.handleChange}></input>
                        <input type="submit" value="Login"></input>
                    </form>
                </div>
            </>
            
        )
    }
}