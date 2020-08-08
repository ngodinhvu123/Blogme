import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import user_status from "./router/user.mjs";
import User_Model from "./Model/Login.mjs";
import passport_jwt from "passport-jwt";
import post_status from "./router/post.mjs";
import path from "path";

const { User } = User_Model;
const { Strategy, ExtractJwt } = passport_jwt;
const app = express();

app.use(express.static("."));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromBodyField("token"),
      secretOrKey: "done",
    },
    (payload, done) => {
      console.log(payload);
      let user = new User(payload.email, "", payload.user_name);
      user.verify_user().then((x, err) => {
        if (err) done(err, false);
        if (x) done(null, x);
        else done(null, false);
      });
    }
  )
);
app.use("/post", post_status);
app.use("/user", user_status);

app.listen(3001, () => {
  console.log("dang chay taij cong 3001");
});
