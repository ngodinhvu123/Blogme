import React, { Component } from 'react';
import { Card, Col, Image, Row, Nav } from 'react-bootstrap';
import { Link, NavLink, withRouter, Switch, Route } from 'react-router-dom';
import Author from '../Author/Author';


class Info_user extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.renderDate = this.renderDate.bind(this);
    }
    renderDate(value) {
        const Datenew = new Date(Date.parse(value))
        return Datenew.getDate() + "/" + (Datenew.getMonth() + 1) + "/" + Datenew.getFullYear() + "  " + Datenew.getHours() + ":" + Datenew.getMinutes();
    }
    render() {
        return (
            <Row className='flex-row mb-3 border-bottom '>
                <Switch>
                    <Route path={`${this.props.match.path}`}>
                        <Image style={{ maxWidth: '37px', maxHeight: '37px' }} roundedCircle src={this.props.image_user}></Image>
                        <Col>
                            <Card.Text ><Link style={{ fontSize: '15px' }} to={`/author/${this.props.author}`} >{this.props.author}</Link>
                                <span style={{ fontSize: '12px' }} className='pl-2 text-muted'>{this.renderDate(this.props.create_at)}</span>
                            </Card.Text>

                            <Link
                                to={`/home/${this.props.id}`} style={{color:'#000'}}
                                className="h5 text-left font-weight-bold">{this.props.title}</Link>
                            <Card.Body className='p-1'>
                                {this.props.content}
                            </Card.Body>
                        </Col>
                    </Route>
                    <Route path='/author/:author_id'>
                       <Author/>
                    </Route>
                </Switch>
            </Row>

        );
    }
}

export default withRouter(Info_user);
