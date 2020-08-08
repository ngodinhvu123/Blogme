import { Container, Row, Image, Col, Card, Button, Form, InputGroup, FormControl, Alert } from 'react-bootstrap';
import { MdEmail, MdLock } from 'react-icons/md';
import { RiFacebookCircleLine, RiGoogleLine } from 'react-icons/ri'
import { FaUserAlt } from 'react-icons/fa'
import { withFormik } from 'formik';
import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import * as Yup from 'yup';
import cookie from 'universal-cookie';
const Cookie = new cookie();

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            res: '',
            desc: '',
        }
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    register() {
        if (this.props.status_login === true) {
            if (Object.keys(this.props.errors).length <= 0) {
                axios({
                    url: '/user/register',

                    method: 'POST', data: {
                        "username": this.props.values.username,
                        "email": this.props.values.email,
                        "password": this.props.values.password,
                        "cookie": Cookie.get('token')
                    }
                }).then(kq => {
                    if (kq.status === 200) {
                        console.log(kq.data)
                        if (kq.data.statuscode === 200) {
                            this.setState({ res: true, desc: kq.data.desc })
                            this.props.history.push(`login`)
                        } else {
                            this.setState({ res: true, desc: kq.data.desc })
                            
                        }
                    }
                })

            }
        } else {
            this.props.history.push(`register`)
        }
    }
    login() {
        if (this.props.status_login === true) {
            this.props.history.push(`login`)
        } else {
            if (Object.keys(this.props.errors).length <= 0) {
                axios({
                    url: 'user/login',
                    method: 'POST', data: {
                        "email": this.props.values.email,
                        "password": this.props.values.password,
                    }
                }).then(kq => {
                    if (kq.status === 200) {
                        if (kq.data.statuscode !== 200) {
                            console.log(kq.data)
                            this.setState({ res: true, desc: kq.data.desc})
                        } else
                            if (kq.data.statuscode === 200) {
                                this.setState({ res: true, desc: kq.data.token })
                                Cookie.set("token", kq.data.token, {
                                    path: "/",

                                })
                                if (Cookie.get("token")) {
                                    this.props.history.push('/')
                                }

                            }

                    } else if (kq.status === 401) {
                        this.setState({ res: true, desc: "Sai tài khoản hoặc mật khẩu" })
                    }
                })
            }
        }
    }
    show(a) {
        this.setState({ ...this.state, res: a })
    }
    render() {

        const {
            status_login,
            handleChange,
            handleBlur,
            handleSubmit,
        } = this.props;
        return (
            <Container fluid className='h-100 p-0 d-flex m-auto login_background'>
                {this.state.res === true &&
                    <Alert className="position-absolute text-center" style={{ width: '100%' }} onClose={() => this.show(false)} variant="danger" dismissible >{this.state.desc}</Alert>}
                <Row className='m-auto'>

                    <Col className=' img_login p-0'>
                        <Image className='w-100  ' src="https://colorlib.com/etc/lf/Login_v18/images/bg-01.jpg" rounded></Image>
                    </Col>
                    <Col lg={6} className='p-0'>
                        <Card className='h-100 d-flex flex-row align-self-center'>
                            <Card.Body className='m-auto'>
                                <Card.Text className='text-center h4'>Đăng nhập</Card.Text>
                                <Card.Subtitle className="mb-2 text-muted text-center ">Welcome back, Vui lòng {status_login === true ? "đăng kí" : "đăng nhập"} đến tài khoản của bạn</Card.Subtitle>
                                <Form onSubmit={handleSubmit} className='w-75 m-auto form_login'>
                                    {status_login === true ?
                                        <Form.Group controlId="formBasicUserName">
                                            <InputGroup className="mb-2">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text><FaUserAlt></FaUserAlt></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl autoFocus onBlur={handleBlur} onChange={handleChange} type='text' name='username' placeholder="Username" />
                                            </InputGroup>
                                            {this.props.touched.username && <Form.Text className="h6" style={{ color: 'red' }}> {this.props.errors.username}</Form.Text>}
                                        </Form.Group> : null}
                                    <Form.Group controlId="formBasicEmail">
                                        <InputGroup className="mb-2">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text><MdEmail></MdEmail></InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl onBlur={handleBlur} onChange={handleChange} type='email' name='email' placeholder="Email" />
                                        </InputGroup>
                                        {this.props.touched.email && <Form.Text className="h6" style={{ color: 'red' }} > {this.props.errors.email}</Form.Text>}

                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <InputGroup className="mb-2">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text><MdLock></MdLock></InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl onBlur={handleBlur} onChange={handleChange} type='password' name="password" placeholder="Password" />
                                        </InputGroup>
                                        {this.props.touched.password && <Form.Text className="h6" style={{ color: 'red' }}> {this.props.errors.password}</Form.Text>}
                                    </Form.Group >

                                    {status_login === true ?
                                        <Form.Group controlId="formRepeatPassword">
                                            <InputGroup className="mb-2">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text><MdLock></MdLock></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl onBlur={handleBlur} onChange={handleChange} type='password' name="repeatpassword" placeholder="Repeat password" />
                                            </InputGroup>
                                            {this.props.touched.repeatpassword && <Form.Text className="h6" style={{ color: 'red' }}> {this.props.errors.repeatpassword}</Form.Text>}
                                        </Form.Group > : null}
                                    <Row className='justify-content-end'>
                                        <Button className='text-right  active' variant="link">Lấy lại mật khẩu</Button>
                                    </Row>
                                    <Col className='justify-content-between d-flex flex-row  mt-3'>
                                        <Button onClick={this.register} variant="outline-secondary" type="button">
                                            Đăng kí </Button>
                                        <Button onClick={this.login} variant="secondary" type="button">
                                            Đăng nhập </Button>
                                    </Col>
                                    <Row className='mt-3 border-top flex-column'>
                                        <Card.Subtitle className='pt-3 text-center'>Bạn có thể đăng nhập bằng</Card.Subtitle>
                                        <Row className=' m-auto pt-3' style={{ width: 'fit-content' }}>
                                            <RiFacebookCircleLine size={30}></RiFacebookCircleLine>
                                            <RiGoogleLine size={30}></RiGoogleLine>
                                        </Row>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container >
        )
    }
}
const FormFormik = withFormik({
    mapPropsToValues: () => ({
        username: '',
        email: '',
        password: '',
        repeatpassword: ''

    }),
    validationSchema: (props) => {
        if (props.status_login === true) {
            return Yup.object().shape({
                username: Yup.string().required("Vui lòng điền username").min(8, "username tối thiểu 8 kí tự")
                    .max(32, "Username tối đa là 32 kí tự"),
                email: Yup.string().required("Vui lòng điền email").email("Cú pháp Email bị sai"),
                password: Yup.string().required("Vui lòng điền password").matches(/^[a-zA-Z0-9]{6,32}$/i, "Vui lòng điền mật khẩu gồm a-z A-Z 0-9 từ 6-32 kí tự"),
                repeatpassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], "password ko trùng nhau")
            })
        } else {
            return Yup.object().shape({
                email: Yup.string().required("Vui lòng điền email").email("Cú pháp Email bị sai"),
                password: Yup.string().required("Vui lòng điền password").matches(/^[a-zA-Z0-9]{6,32}$/i, "Vui lòng điền mật khẩu gồm a-z A-Z 0-9 từ 6-32 kí tự"),
            })

        }
    },
})(Login)

export default withRouter(FormFormik);
