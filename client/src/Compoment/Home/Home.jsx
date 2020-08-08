import React, { Component } from 'react';
import { Col, Container, Image, Pagination } from 'react-bootstrap'
import axios from 'axios';
import cookie from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Info_post from './Info_post';
import loading_img from './../../asset/image/loading.gif';
import { Row } from 'react-bootstrap';
const Cookie = new cookie();


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info_post: [],
            loading: true,
            total_post: 0,
            active_page: 1
        }
        this.pagination_post = this.pagination_post.bind(this)
        this.handPagination = this.handPagination.bind(this)
    }
    pagination_post() {
        let arr = [];
        for (let i = this.state.active_page-3; i <= this.state.active_page +3; i++) {
            if(i>0)
            arr.push(<Pagination.Item active={i === this.state.active_page} key={i}>{i}</Pagination.Item>)
        }
        return [<Pagination.Item key={0}>{`<<`}</Pagination.Item>, ...arr];

    }
    async handPagination(e) {
        let data = e.target.text;
        if (data === '<<') {
            await this.setState({ active_page: 1 })
            let poster = await axios.get('/post/postnews', {
                params: {
                    limit: 5,
                    offset: 0,
                }
            })
            if (poster.status === 200) {
                this.setState({ info_post: poster.data.info, loading: false, total_post: poster.data.total_post })
            }
        }
        if (!isNaN(data) && data != undefined) {
            await this.setState({ active_page: Number(data) })
            await axios.get('/post/postnews', {
                params: {
                    limit: 5,
                    offset: this.state.active_page === 1 ? 0 : (this.state.active_page - 1) * 5,
                }
            }).then(poster => {
                this.setState({ info_post: poster.data.info, loading: false, total_post: poster.data.total_post })
            })
        }
    }
    async componentDidMount() {
        let poster = await axios.get('/post/postnews', {
            params: {
                limit: 5,
                offset: 0,
            }
        })
        if (poster.status === 200) {
            this.setState({ info_post: poster.data.info, loading: false, total_post: poster.data.total_post })
        }
        else
            this.props.history.push('/badrequest')
    }
    render() {
        console.log(this.state)
        return (
            <Container >
                <Row className='flex-column mt-3'>

                    {!this.state.loading ?
                        <Col>
                            {
                                this.state.info_post.map((x) => <Info_post
                                    key={x.id} title={x.title}
                                    id={x.id} author={x['User_login.info_author']}
                                    content={x.content}
                                    image_user={x['User_login.image_user']}
                                    create_at={x.createdAt}
                                ></Info_post>)
                            }
                        </Col> : <Image src={loading_img}></Image>
                    }

                </Row>

                <Pagination style={{ width: 'fit-content', margin: 'auto' }} onClick={this.handPagination}>

                    {
                        this.pagination_post().map(x => x)
                    }

                </Pagination>

            </Container>
        );
    }
}
export default Home;