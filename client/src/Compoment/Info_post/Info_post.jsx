import React, { Component } from 'react';
import PraseHTML from 'react-html-parser';
import { Container, Alert, Col, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import { withRouter } from 'react-router-dom'
import HtmlParser from 'react-html-parser';
class Info_post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null,
            tag: [],
            title: null,
            author: null,
            create_at: null,
        }
        this.renderDate = this.renderDate.bind(this);
    }
    renderDate(value) {
        const Datenew = new Date(Date.parse(value))
        return Datenew.getDate() + "/" + (Datenew.getMonth() + 1) + "/" + Datenew.getFullYear() + "  " + Datenew.getHours() + ":" + Datenew.getMinutes();
    }
    componentDidMount() {
        axios({
            method: "GET",
            url: '/post/postnewid',
            params: { id: this.props.match.params.post_id }
        }).then(x => {
            this.setState({
                content: x.data.info[0].content,
                tag: x.data.info[0].post_tags,
                title: x.data.info[0].title,
                author: x.data.info[0].User_login.info_author,
                create_at: this.renderDate(x.data.info[0].createdAt)
            })
        }).catch(err => console.log(err))
    }
    render() {
        return (
            <Container>
                <Col lg={8}>
                    <Col>
                        <Alert style={{ marginBottom: '0px', paddingBottom: '0px' }} variant='light'>{this.state.author} {this.state.create_at}</Alert>

                        {
                            this.state.tag.map((x, index) =>
                                <Button key={index} style={{ marginRight: '5px', marginBottom: '5px' }}>

                                    {x.Tag.tag_name}

                                </Button>

                            )
                        }
                    </Col>
                    <Alert className='h1' variant={'primary'}>
                        {this.state.title}
                    </Alert>
                    {HtmlParser(this.state.content)}
                </Col>
            </Container>
        );
    }
}

export default withRouter(Info_post);