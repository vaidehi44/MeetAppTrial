import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "./notebook.css";


class Notebook extends Component {
    constructor(props) {
		super(props);
		this.state = {
          notes: ""
		}
    }

    handleChange = (event) => {
        const notes = event.target.value;
        this.setState({ notes: notes});
        this.props.getNotes(notes);
    }

    render() {
        const { notes } = this.state;

        return(
            <>
                <textarea className="notes_page" id="notes_page" onChange={ this.handleChange } value={ notes }>
                </textarea>
            </>
        )
    }
}


export default Notebook;