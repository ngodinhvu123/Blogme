import express from "express";
var router = express.Router();
import User_Model from "../Model/Login.mjs";
import validator from "express-validator";
import passport_jwt from "passport-jwt";
import passport from "passport";
import bodyParser from "body-parser";
import cheerio from "cheerio";
import multer from "multer";
import path from "path";

import jwt from "jsonwebtoken";

const { Strategy, ExtractJwt } = passport_jwt;
const { body, validationResult } = validator;
const { Post, User, Comment, _Tag } = User_Model;

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage }).single("image");

const overcontent = (value) => {
  const $ = cheerio.load(value);
  if ($.text().length > 200) {
    return $.text().slice(0, 200) + "...";
  }
  return $.text();
};
const overtitile = (value) => {
  if (value.length > 80) {
    return value.slice(0, 81) + "...";
  }
  return value;
};
const renderContet = (value) => {
  return value.map((x) => {
    return {
      ...x,
      content: overcontent(x.content),
      title: overtitile(x.title),
    };
  });
};
const rootapi = {
  info: {},
  statuscode: "",
  err: "",
  desc: "",
  action: "",
};
router.use(bodyParser.json({ limit: "50mb" }));
router.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
router.get("/postnews", (req, res) => {
  let data = req.query;
  let post = new Post();

  post
    .getPost(Number(data.limit), Number(data.offset))
    .then((x) => {
      res.send({
        ...rootapi,
        info: renderContet(x.data),
        statuscode: 200,
        total_post: x.total,
        desc: "get post news",
        action: "GET",
      });
    })
    .catch((err) => res.send(err));
});

router.post("/image", (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.json({
        fileUrl: "http://localhost:3001/images/" + req.file.filename,
      });
    }
  });
});
router.post("/uploadavatar", async (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      res.send(err);
    } else {
      let user = new User();
      jwt.verify(req.body.token, "done", (err, payload) => {
        if (err) res.json(err);
        let url_avatar = `http://localhost:3001/images/${req.file.filename}`;
        user.change_avatar(url_avatar, payload.uuid).then((x) => {
          res.json(x);
        });
      });
    }
  });
});

router.post(
  "/newtag",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body);
    let tag = new _Tag(req.body.tag_name);
    tag
      .create_tag()
      .then((x) =>
        res.json({
          ...rootapi,
          info: x,
          desc: "Create Tag Successful",
          aciton: "Post",
          statuscode: 200,
        })
      )
      .catch((err) =>
        res.json({ ...rootapi, desc: err, statuscode: 500, aciton: "Post" })
      );
  }
);
router.get("/postnewid", (req, res) => {
  let data = req.query;
  console.log(data);
  let poster = new Post();
  poster
    .getPostid(data.id)
    .then((x) =>
      res.send({
        ...rootapi,
        info: x,
        desc: "Get Post",
        action: "GET",
        statuscode: 200,
      })
    )
    .catch((err) => console.log("loi\n" + err));
});
router.get("/findtag", (req, res) => {
  let data = req.query;
  let tag = new _Tag();
  tag
    .query_tag(data.query)
    .then((x) => res.json(x))
    .catch((err) => res.json(err));
});
router.post("/postcomment", (req, res) => {
  let data = req.body;
  console.log(data);
  let comment = new Comment(data.uuid, data.post_id, data.content);
  comment.post_comment().then((x) => res.send(x));
});
router.put("/updatepostnew", (req, res) => {
  let data = req.body;
  let poster = new Post(
    data.auth,
    data.title,
    data.sub_title,
    data.id_comment,
    data.content,
    data.visable
  );
  poster
    .updatepostnew(data.auth)
    .then((x) => res.send(x))
    .catch((err) => console.log("loi\n" + err));
});
router.post(
  "/postnews",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let data = req.body;
    let poster = new Post(req.user.id, data.title, data.content, data.tag_post);
    poster
      .createPost()
      .then((x) => {
        res.send({
          ...rootapi,
          statuscode: 200,
          desc: "Create blog successful",
          action: "POST",
        });
      })
      .catch((err) => console.log("loi\n" + err));
  }
);

export default router;
