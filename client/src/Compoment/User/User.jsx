import React, { Component } from "react";
import {
  Container,
  Alert,
  Card,
  Image,
  Form,
  InputGroup,
  Col,
  Row,
} from "react-bootstrap";
import axios from "axios";
import cookie from "universal-cookie";
import "./user.css";
import { Link } from "react-router-dom";
import FormData from "form-data";
const Cookie = new cookie();

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      user_name: "",
      user_name_enable: true,
      email_enable: true,
      url_image_avatar: "",
    };
    this.handEmailOnChange = this.handEmailOnChange.bind(this);
    this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
  }
  handleChangeAvatar(e) {
    let file = e.target.files[0];
    console.log(file);
    let formData = new FormData();
    formData.append("image", file);
    formData.append("token", Cookie.get("token"));
    axios({
      url: "/post/uploadavatar",
      method: "POST",
      data: formData,
    }).then((x) => {
      console.log(x.data)
      this.setState({ url_image_avatar: x.data.image_user });
    });
  }
  componentDidMount() {
    axios
      .post("/user/verify", { token: Cookie.get("token") })
      .then((x) => {
        this.setState({
          email: x.data.email,
          user_name: x.data.user_name,
          url_image_avatar: x.data.image_user,
        });
        console.log(x.data);
      })
      .catch((err) => this.props.history.push("/badrequest"));
  }
  handEmailOnChange(e) {
    this.setState({ email: e.target.value });
  }
  render() {
    console.log(this.state);
    return (
      <Container fluid>
        <Card className="mt-3">
          <Card.Body>
            <Alert className="h3" variant="primary">
              Thông tin tài khoản
              <Link to={this.props.match.url}>
                {" " + this.props.match.params.user_id}
              </Link>
            </Alert>
            <Alert variant="info" className="h3">
              <p className="text-center">Ảnh đại diện</p>
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  justifyContent: "center",
                }}
              >
                <Image
                  roundedCircle
                  style={{ height: "150px", width: "150px" }}
                  src={this.state.url_image_avatar}
                ></Image>
                <label
                  className="btn btn-primary pb-0 mb-0"
                  style={{
                    height: "fit-content",
                    position: "absolute",
                    bottom: 0,
                  }}
                >
                  <input
                    max={1}
                    type="file"
                    accept="image/*"
                    onChange={this.handleChangeAvatar}
                  />
                  Custom Upload
                </label>
              </div>
              <Row className="mt-3">
                <Col lg={6} xs={12}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Text>Email address</Form.Text>
                    <Form.Control
                      type="email"
                      value={this.state.email}
                      placeholder="Enter email"
                      disabled={this.state.email_enable}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col lg={6} xs={12}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Text>User Name</Form.Text>
                    <Form.Control
                      type="email"
                      value={this.state.user_name}
                      placeholder="Enter Username"
                      disabled={this.state.email_enable}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Alert>{" "}
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default User;
