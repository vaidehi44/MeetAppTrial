import React, { Component } from 'react';
import Navbar from './Navbar';

const apiUrl = "http://localhost:5000/api/register";

export default class Register extends Component {

    constructor(props) {
		super(props);
		this.state = {
          username:"",
          password:""
		}
	};

    handleSubmit = (event) => {
        event.preventDefault();
        const { username, password } = this.state;
        console.log(username,password)
        fetch(apiUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => {
                if (res.status===201) {
                    console.log('Sign up successful',res['message']);
                    alert("User Created successfully!!");
                    this.props.history.push("/login");
                } else if (res.status===403) {
                    console.log(res)
                    alert("Username already exists! Please try some other username.");
                } else {
                    alert("Some error occured. Please try again.");

                }
            }, err => {
                console.log(err)
            })
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
                        <input type="submit" value="Sign Up"></input>
                    </form>
                </div>
            </>
            
        )
    }
}