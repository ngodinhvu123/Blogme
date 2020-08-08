import React, { Component } from 'react';
import { Navbar, NavItem, Nav, NavDropdown, Form, FormControl, Button, Container, Row, InputGroup, Image, ListGroup } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import cookie from 'universal-cookie';
import { GoSearch } from 'react-icons/go'
import axios from 'axios';
import Info_user from './Info_user';
import { useSelector } from 'react-redux';


const Cookie = new cookie();


class Navbar_Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status_login: false,
            info_user: null,
            image_user:null
        }
    }
    async componentDidMount() {
        if (Cookie.get('token')) {
            const post = await axios({
                method: 'post',
                url: '/user/verify',
                data: { "token": Cookie.get('token') }
            }).then(x => this.setState({ status_login: true, info_user: x.data,image_user:x.data.image_user }))
                .catch(err => {
                    console.log(err)
                })
        } else {
            this.setState({ status_login: false })
        }
    }
    render() {
        return (
            <Container fluid>
                <Container>
                    <Navbar expand="lg">
                        <Link to='/' > <Navbar.Brand>Blog Vũ</Navbar.Brand></Link>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto  align-items-center">
                                <Nav.Item  ><Link style={{color:'rgba(0,0,0,.9)'}} to='/'>News</Link></Nav.Item>
                                <Nav.Item className='pl-2' ><Link style={{color:'rgba(0,0,0,.9)'}}  to='/mycv'>MY CV</Link></Nav.Item>
                                <NavDropdown title="Lĩnh vực" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            <Form inline>

                                <InputGroup>
                                    <FormControl placeholder="Tìm kiếm" />
                                    <InputGroup.Prepend>
                                        <Button className='border' style={{ backgroundColor: '#5488c7' }}><GoSearch className='text-white'></GoSearch></Button>
                                    </InputGroup.Prepend>
                                </InputGroup>
                            </Form>

                        </Navbar.Collapse>
                        {!this.state.status_login ?
                            <Link to='/login'>
                                <NavItem href='/login' className='pl-1'>Login/Registor</NavItem>
                            </Link> :
                            <Info_user data={this.state.info_user} />}
                    </Navbar>
                </Container>
                <Row>
                    <Image fluid src='https://images.viblo.asia/full/5ce3a357-fe69-4a26-8b31-be94aabbf254.png' rounded />
                </Row>

                <Row className=' d-flex flex-nowrap justify-content-around text-center ' style={{ backgroundColor: '#0b1a33' }}>
                    <ListGroup horizontal className='overflow-auto'>
                        <ListGroup.Item className='bg-transparent' active>
                            <Link className='text-white text-uppercase' to='/'>News</Link>
                        </ListGroup.Item>

                        <ListGroup.Item className='bg-transparent'>
                            <Link className='text-white text-uppercase' to='/series'>Series</Link>
                        </ListGroup.Item>

                        <ListGroup.Item className='bg-transparent'>
                            <Link className='text-white text-uppercase' to='/trending'>Trending</Link>
                        </ListGroup.Item>

                        <ListGroup.Item className='bg-transparent'>
                            <Link className='text-white text-uppercase' to='/post'>Create Post!</Link>
                        </ListGroup.Item>
                    </ListGroup >
                </Row >
                <Container fluid>
                    {this.props.children}
                </Container>
            </Container >

        );
    }
}

export default Navbar_Menu;