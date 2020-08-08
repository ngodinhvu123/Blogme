import React, { Component } from "react";
import { Row, Image, Col, Dropdown, Card, Button } from "react-bootstrap";
import { TiInfoLarge, TiPencil } from "react-icons/ti";
import { BsFillCircleFill } from "react-icons/bs";
import { Link, withRouter } from "react-router-dom";

class Info_user extends Component {
  constructor(props) {
    super(props);
    this.state = { status: false };
    this.show = this.show.bind(this);
  }
  show(a) {
    this.setState({ status: a });
  }

  render() {
    return (
      <Row className="pl-4 align-items-center">
        <Col className="pl-4 pr-1">
          <TiPencil size={20} onClick={()=>this.props.history.push('/post')}></TiPencil>
        </Col>

        <Dropdown>
          <Col className="p-0" onClick={() => this.show(false)}>
            <Dropdown.Toggle
              style={{
                backgroundColor: "transparent",
                borderColor: "transparent",
              }}
              color="white"
            >
              <Image
                style={{ height: "37px", width: "37px" }}
                roundedCircle
                src={this.props.data.image_user}
              ></Image>
            </Dropdown.Toggle>
          </Col>
          <Dropdown.Menu
            className={`pt-0 ${this.state.status ? "d-none" : "d-block"}`}
            style={{ width: "max-content", right: "0%", left: "unset" }}
          >
            <Col className="pl-0 pr-0">
              <Card bg="light pt-0" style={{ maxWidth: "200px" }}>
                <Card.Header>
                  <Row>
                    <Col xs={3} className="m-auto">
                      <Image
                        style={{ height: "37px", width: "37px" }}
                        roundedCircle
                        src={this.props.data.image_user}
                      ></Image>
                    </Col>
                    <Col xs={9} className="text-left">
                      <p className="alert-link">{this.props.data.user_name}</p>
                      <p className=" h6 text-muted text-break">{`@${this.props.data.email}`}</p>
                    </Col>
                  </Row>
                </Card.Header>
              </Card>
            </Col>
            <Col className="dropdown-item">
              {" "}
              <Link
                onClick={() => this.show(true)}
                to={`/user/${this.props.data.user_name}`}
              >
                {" "}
                Profile
              </Link>
            </Col>
            <Col className="dropdown-item">
              <Link onClick={() => this.show(true)} to="/public/post">
                {" "}
                My Content
              </Link>
            </Col>
            <Col className="dropdown-item">
              {" "}
              <Link onClick={() => this.show(true)} to="/logout">
                {" "}
                Log out
              </Link>
            </Col>
          </Dropdown.Menu>
        </Dropdown>
      </Row>
    );
  }
}

export default withRouter(Info_user);
