
import express from 'express';
var router = express.Router();
import User_Model from '../Model/Login.mjs';
import validator from 'express-validator';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import nodemailer from 'nodemailer';
const { body, validationResult } = validator;
const { User } = User_Model;
const rootapi = {
    info: {},
    statuscode: '',
    err: '',
    desc: '',
    action: ''
}
async function main(email, domain) {
    var transporter = nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: 'ngodinhvuluan@gmail.com',
            pass: '@dinhvu13'
        }
    });
    let token = jwt.sign({ emailAuth: email }, 'done', { expiresIn: '5m' })
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Thanh Batmon',
        to: email,
        subject: 'Test Nodemailer',
        text: 'You recieved message from ',
        html: `<a href=${domain}/user/verify?token=${token}>Kích hoạt Email</a>`
    }
    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            console.log(err);

        } else {
            console.log('Message sent: ');

        }
    });


}
router.get('/verify', (req, res) => {
    let data = req.query;
    let user = new User();
    let value = jwt.verify(data.token, 'done')
    user.active_user(value.emailAuth).then(x => res.json(x)).catch(err => res.json(err))
})
router.post('/verify', passport.authenticate('jwt', { session: false }), (req, res) => {
    let data = req.user;
    res.send(data)
})
router.post('/login',
    [body('email').notEmpty().isEmail().withMessage("Invalid Email"),
    body('password').isAlphanumeric().withMessage("Invalid Password")],
    (req, res) => {
        const errors = validationResult(req);
        let obj = (req.body)
        if (!errors.isEmpty()) {
            res.status(200).json({
                ...rootapi,
                statuscode: 500,
                desc: "Invalid",
                err: errors.errors.map(x => { return x.msg }),
                action: "POST"
            })
        } else {
            let user = new User(obj.email, obj.password)
            user.login().then((res_user) => {
                console.log(res_user)
                if (res_user.length > 0)
                    if (res_user[0].status === true) {
                        res.status(200).json({
                            ...rootapi,
                            statuscode: 205,
                            info: { info_user: res_user[0] },
                            desc: res_user[0].desc,
                            action: "POST",
                        })
                    } else
                        res.status(200).json({
                            ...rootapi,
                            statuscode: 200,
                            info: { info_user: res_user },
                            desc: 'Login Successful',
                            action: "POST",
                            token: jwt.sign(res_user[0], 'done', { expiresIn: '2h' })
                        })
                else {
                    res.status(200).json({
                        ...rootapi,
                        err: ["Not found account"],
                        desc: "Login Fail",
                        action: "POST",
                        statuscode: 500
                    })
                }
            }).catch(err_user => console.log("loi\n" + err_user))
        }
    })


router.post('/register', (req, res) => {
    let obj = (req.body)
    if (obj.username) {
        let user = new User(obj.email, obj.password, obj.username)
        main(obj.email, req.hostname).then(() => {
            user.registration().then((res_user) => {

                res.send({ ...rootapi, statuscode: 200, info: { info_user: res_user }, action: "POST", desc: "Registor Successful" })
            }).catch(err_user => {
                res.status(200).send({ ...rootapi, statuscode: 500, err: [err_user.type], desc: err_user.msg, action: 'POST' })
            })
        }).catch(console.error);

    }
})
router.post('/changepass', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.body)
    let info_user = (jwt.decode(req.body.token))
    let user = new User(info_user.email, '', info_user.user_name)
    user.changepassword(req.body.newpass).then(x => {
        res.status(200).json({ ...rootapi, statuscode: 200, desc: "Update Password", action: "POST", info: x })
    }).catch(err => console.log(err))


})
export default router;