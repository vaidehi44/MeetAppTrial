import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';


class Navbar extends Component {

    constructor(props) {
		super(props);
		this.state = {
		}
        this.token = localStorage.getItem('meetapp-bearer-token');
        if (this.token) this.isLoggedIn = true;
    };

    logout = () => {
        localStorage.removeItem("meetapp-bearer-token");
        localStorage.removeItem("meetapp-username");
        localStorage.removeItem("meetapp-dbId");
        window.location.href = "/";
    }


    render() {
        return (
            this.isLoggedIn ? (
                <>
                    <nav class="navbar navbar-expand-lg navbar-light bg-light">
                        <a class="navbar-brand" href="#" style={{ fontSize: '30px' }}>MeetApp</a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup" >
                            <div class="navbar-nav ml-auto mt-2 mt-lg-0" style={{ fontSize: '20px' }}>
                                <a class="nav-item nav-link" href="#" onClick={this.logout}>Logout</a>
                            </div>
                        </div>
                    </nav>
                </>
            ) : (
                <>
                    <nav class="navbar navbar-expand-lg navbar-light bg-light">
                        <a class="navbar-brand" href="#" style={{ fontSize: '30px' }}>MeetApp</a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div class="navbar-nav ml-auto mt-2 mt-lg-0">
                                <a class="nav-item nav-link" href="/login" style={{ fontSize: '20px' }}>Log In</a>
                                <a class="nav-item nav-link" href="/register" style={{ fontSize: '20px' }}>Sign In</a>
                            </div>
                        </div>
                    </nav>
                </>
            )
        )
        
    }
}

export default Navbar;