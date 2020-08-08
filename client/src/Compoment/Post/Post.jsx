import React, { Component } from 'react';
import 'quill/dist/quill'
import { Card, Button, Col, Alert, Row, Form, ListGroup } from 'react-bootstrap';
import ReactQuill, { Quill } from 'react-quill';
import ImageUpload from 'quill-image-uploader';
import 'react-quill/dist/quill.snow.css'
import ImageResize from 'quill-image-resize'
import axios from 'axios';
import { withFormik } from 'formik';
import cookie from 'universal-cookie';
import { withRouter } from 'react-router-dom';
import * as Yup from 'yup';
import FormData from 'form-data'
import Selector from 'react-select/creatable';

const Cookie = new cookie();
Quill.register('modules/imageUpload', ImageUpload);
Quill.register('modules/imageResize', ImageResize);
const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

class Post extends Component {
    constructor(props) {
        super(props);
        this.updateContent = this.updateContent.bind(this);
        this.pushpost = this.pushpost.bind(this);
        this.state = {
            title: '',
            content: '',
            tag: [],
            selector: []
        }
    }
    async pushpost() {
        if (Object.keys(this.props.errors).length <= 0) {
            await axios({
                method: 'POST',
                url: '/post/postnews',
                data: {
                    title: this.props.values.title,
                    content: this.state.content,
                    tag_post: this.state.selector,
                    token: Cookie.get('token')
                }
            }).then(x => {
                if (x.data.statuscode === 200) {
                    this.props.history.push('/')
                }
            })
                .catch(err => {
                    console.log(err)
                    this.setState({ res: true, desc: 'Có lỗi xảy ra' })
                })
        }

    }

    handleOnChange = value => {
        if (value)
            value.map(x => {
                if (x.__isNew__) {
                    axios.post('/post/newtag', { token: Cookie.get('token'), tag_name: x.value })
                        .then(result => {
                            delete x.__isNew__
                            x.value = result.data.info.value
                        })
                    console.log(x)
                }
            })
        this.setState({ selector: value })
    }
    handleChange = (selectedOption) => {
        if (selectedOption.length > 2) {
            axios.get('/post/findtag', { params: { query: selectedOption } })
                .then(x => {
                    this.setState({ tag: x.data })
                })

        }
        return selectedOption;
    };
    updateContent = (value) => {
        this.setState({ content: value });
    }

    show(a) {
        this.setState({ ...this.state, res: a })
    }
    render() {
        console.log(this.state)

        const {
            handleChange,
            handleBlur,
            handleSubmit,
        } = this.props;
        return (
            <Form>
                {this.state.res === true &&
                    <Alert className="position-relative text-center"
                        style={{ width: '100%', zIndex: 10 }} onClose={() => this.show(false)} variant="danger" dismissible >{this.state.desc}</Alert>}
                <Card>
                    <Card.Header>
                        <Form.Control onChange={handleChange} onBlur={handleBlur} name='title' type="text" placeholder="Title" />
                        {this.props.touched.title && <Form.Text className="h6" style={{ color: 'red' }}> {this.props.errors.title}</Form.Text>}
                        <Row className='mt-3 m-0'>
                            <Col xs={11} className='p-0'>
                                <Selector
                                    onInputChange={this.handleChange}
                                    isMulti
                                    isClearable
                                    onChange={this.handleOnChange}
                                    options={this.state.tag}
                                />
                            </Col>
                            <Col xs={1} className='p-0 pl-2'>
                                <Button onClick={this.pushpost} variant="primary">Đăng bài</Button>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body className='h-100'>
                        <ReactQuill value={this.state.content}
                            onChange={this.updateContent}
                            modules={ReactQuill.modules}
                            formats={ReactQuill.formats}
                            placeholder={'Nhập nội dung bài viết ở đây'} />
                    </Card.Body>
                </Card>
            </Form >
        );
    }
}
ReactQuill.modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
    ],
    imageResize: {
        parchment: Quill.import('parchment')
        // See optional "config" below
    },
    imageUpload: {
        upload: file => {
            // return a Promise that resolves in a link to the uploaded image
            return new Promise((resolve, reject) => {
                let formData = new FormData()
                formData.append('image', file)
                axios({ url: '/post/image', method: 'POST', data: formData }).then(x => {
                    resolve(x.data.fileUrl)
                })

            });
        }
    },
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
ReactQuill.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]

/* 
 * PropType validation
 */
const FormFormik = withFormik({
    mapPropsToValues: () => ({
        title: '',
        tag: '',
    }),
    validationSchema: (props) => {
        return Yup.object().shape({
            title: Yup.string().required("Vui lòng điền Title vào").min(5, "Title ít nhất 5 kí tự"),
        })
    }
})(Post)
export default withRouter(FormFormik);