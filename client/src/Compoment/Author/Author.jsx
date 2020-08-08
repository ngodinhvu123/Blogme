import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

class Author extends Component {
    render() {
       
        return (
            <div>
                {JSON.stringify(this.props.match)}
            </div>
        );
    }
}

export default withRouter(Author);