import seq from "sequelize";
import bcrypt from "bcrypt-nodejs";
const { DataTypes, Op, Sequelize } = seq;

const key = "NZTW6ZDJNZUHM5LMOVQW4===";

const sequelize = new Sequelize("blog_me", "postgres", "p@ss123", {
  host: "localhost",
  dialect: "postgres",
  pool: {
    max: 10,
    min: 0,
    idle: 10000,
  },
});

const user_login = sequelize.define(
  "User_login",
  {
    user_name: {
      type: DataTypes.STRING,
      unique: { msg: "user name already exist" },
      allowNull: false,
      validate: {
        is: {
          args: /^[a-zA-Z0-9_]{6,32}$/i,
          msg: "Username must have a-z A-Z 0-9 have 6-32 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "email already exist" },
      validate: {
        isEmail: { msg: "Not is email" },
      },
    },
    image_user: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[a-zA-Z0-9]{6,32}$/i,
          msg: "Password must have a-z A-Z 0-9 have 6-32 characters",
        },
      },
    },
    authorization: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^[a-zA-Z]{0,20}$/i,
          msg: "Some Things Wrong",
        },
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rule: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
  },
  {
    getterMethods: {
      info_user() {
        return {
          uuid: this.id,
          user_name: this.user_name,
          email: this.email,
          rule: this.rule,
          authorization: this.authorization,
        };
      },
    },
    hooks: {
      beforeSave: function (user) {
        user.password = bcrypt.hashSync(
          user.password,
          bcrypt.genSaltSync(10),
          null
        );
      },
      beforeBulkUpdate: function (user) {
        user.password = bcrypt.hashSync(
          user.password,
          bcrypt.genSaltSync(10),
          null
        );
      },
    },
  }
);

const Post_page = sequelize.define(
  "Post",
  {
    title: {
      type: DataTypes.TEXT,
    },
    sub_title: { type: DataTypes.TEXT },
    id_comment: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT,
    },
    visable: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    getterMethods: {
      getpostnews() {
        return {
          title: this.title,
          content: this.content,
          createat: this.createdAt,
        };
      },
    },
  }
);
const Post_comment = sequelize.define(
  "Post_comment",
  {
    user_id: { type: DataTypes.TEXT },
    content: { type: DataTypes.TEXT },
  },
  {
    getterMethods: {
      getcomment() {
        return {
          user_id: this.user_id,
          content: this.content,
        };
      },
    },
  }
);
const Post_tag = sequelize.define("post_tag", {});
const Tag = sequelize.define(
  "Tag",
  {
    tag_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tag_name: {
      type: DataTypes.TEXT,
    },
  },
  {
    getterMethods: {
      value_query() {
        return {
          value: this.tag_id,
          label: this.tag_name,
        };
      },
    },
  }
);

sequelize.sync();
///////////////////
Tag.hasMany(Post_tag, {
  foreignKey: { name: "tag_id" },
});
Post_tag.belongsTo(Tag, {
  foreignKey: { name: "tag_id" },
});
///////////////////////
Post_tag.belongsTo(Post_page, {
  foreignKey: {
    name: "post_id",
  },
});
Post_page.hasMany(Post_tag, {
  foreignKey: "post_id",
});
////////////////////
Post_page.hasMany(Post_comment, {
  foreignKey: { name: "post_id" },
}),
  Post_comment.belongsTo(Post_page, {
    foreignKey: { name: "post_id" },
  });
///////////////
user_login.hasMany(Post_page, {
  foreignKey: {
    name: "uuid",
  },
});
Post_page.belongsTo(user_login, {
  foreignKey: {
    name: "uuid",
  },
});
//////////////////////////////

class User {
  constructor(email, password, username) {
    this.email = email;
    this.user_name = username;
    this.password = password;
    this.user_login = user_login;
  }

  login() {
    return new Promise(async (resolve, reject) => {
      let user = await user_login
        .findOne({
          where: { email: this.email },
          benchmark: true,
        })
        .catch((err) => {
          reject(err);
        });
      if (user !== null) {
        console.log(user.info_user);
        if (bcrypt.compareSync(this.password, user.dataValues.password)) {
          if (user.dataValues.active === true) resolve([user.info_user]);
          else
            resolve([{ status: true, desc: "Vui lòng kích hoạt tài khoản" }]);
        } else {
          resolve([]);
        }
      }
      resolve([]);
    });
  }
  change_avatar(url, id) {
    return new Promise((resolve, reject) => {
      user_login
        .update({ image_user: url }, { where: { id: id } })
        .then((x) => resolve(x))
        .catch((err) => reject(err));
    });
  }
  registration() {
    return new Promise(async (resolve, reject) => {
      const user = await user_login
        .create(
          {
            user_name: this.user_name,
            email: this.email,
            password: this.password,
            authorization: "Email",
          },
          {}
        )
        .catch((err) => {
          err.errors.map((x) => {
            reject({ msg: x.message, type: x.type });
          });
        });
      if (user) resolve(user.info_user);
    });
  }
  active_user(email) {
    return new Promise((resolve, reject) => {
      user_login
        .update(
          { active: true },
          {
            where: {
              email: email,
            },
          }
        )
        .then((x) => {
          resolve({ status: true, desc: "Active Email Sucessful" });
        })
        .catch((err) => reject({ status: false, desc: new Error(err) }));
    });
  }
  verify_user() {
    return new Promise((resolve, reject) => {
      user_login
        .findOne({
          attributes: [
            "id",
            "image_user",
            "user_name",
            "email",
            "active",
            "rule",
          ],
          where: {
            email: this.email,
            user_name: this.user_name,
          },
          raw: true,
        })
        .then((x) => {
          if (x) resolve(x);
          else resolve(null);
        })
        .catch((err) => reject(err));
    });
  }
  changepassword(new_password) {
    return new Promise((resolve, reject) => {
      user_login
        .findOne({
          where: {
            user_name: this.user_name,
            email: this.email,
          },
          attributes: ["user_name", "email", "password"],
          raw: true,
        })
        .then(async (x) => {
          if (!bcrypt.compareSync(new_password, x.password)) {
            let user = await user_login.update(
              { password: new_password },
              {
                where: {
                  user_name: this.user_name,
                  email: this.email,
                },
                individualHooks: true,
              }
            );
            resolve({ status: true, desc: "Update Successful" });
          } else {
            resolve({ status: false, desc: "Password not change" });
          }
        })
        .catch((err) => reject(err));
    });
  }
}
class Post {
  constructor(author, title, content, tag_post) {
    this.author = author;
    this.title = title;
    this.content = content;
    this.tag_post = tag_post;
    this.sequelize = sequelize;
  }
  createPost() {
    return new Promise(async (resolve, reject) => {
      await Post_page.create(
        {
          uuid: this.author,
          title: this.title,
          content: this.content,
        },
        { benchmark: true }
      )
        .then((x) => {
          //console.log(x.dataValues)
          this.tag_post.map((y) => {
            Post_tag.create(
              {
                post_id: x.dataValues.id,
                tag_id: y.value,
              },
              { raw: true }
            ).then((res) => console.log(res));
          });
          resolve(x.getpostnews);
        })
        .catch((err) => {
          reject(err);
        });

      /*
            if (this.tag_post.length > 0)
                this.tag_post.map(x => {
                    Post_page.create({
                        post_id: post.dataValues.tag_id,
                        tag_id: x.value
                    }, { benchmark: true })
                })*/
    });
  }
  updatepostnew(id) {
    return new Promise(async (resolve, reject) => {
      const post = await Post_page.update(
        {
          title: this.title,
          content: this.content,
        },
        { where: { id: id } }
      ).catch((err) => {
        console.log(err);
        reject(err);
      });
      if (post) {
        resolve(post);
      } else resolve([]);
    });
  }
  getPostid(id) {
    return new Promise(async (resolve, reject) => {
      const post = await Post_page.findAll({
        include: [
          {
            model: user_login,
            attributes: [["user_name", "info_author"]],
            as: "User_login",
          },
          {
            model: Post_comment,
            attributes: ["user_id", "content"],
          },
          {
            model: Post_tag,
            attributes: ["tag_id"],
            include: [
              {
                model: Tag,
                attributes: ["tag_name"],
              },
            ],
          },
        ],
        where: { id: id },
        order: [["id", "DESC"]],
        attributes: ["id", "title", "id_comment", "content", "createdAt"],
        benchmark: true,
      })
        .then((x) => resolve(x))
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
  getPost(_limit, _offset) {
    return new Promise(async (resolve, reject) => {
      await Post_page.findAndCountAll({
        include: [
          {
            model: user_login,
            attributes: [["user_name", "info_author"],'image_user'],
          },
        ],
        order: [["id", "DESC"]],
        limit: _limit,
        offset: _offset,
        attributes: [
          "Post.id",
          "title",
          "Post.id_comment",
          "Post.content",
          "Post.createdAt",
        ],
        benchmark: true,
        raw: true,
      })
        .then((x, y) => {
          resolve({ data: x.rows, total: x.count });
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
}
class Comment {
  constructor(user, post_id, comment) {
    this.user = user;
    this.post_id = post_id;
    this.comment = comment;
  }
  post_comment() {
    return new Promise((resolve, reject) => {
      let comment = Post_comment.create(
        {
          user_id: this.user,
          post_id: this.post_id,
          content: this.comment,
        },
        { benchmark: true }
      )
        .then((x) => resolve(x.getcomment))
        .catch((err) => reject(err));
    });
  }
}
class _Tag {
  constructor(tag_name) {
    this.tag_name = tag_name;
  }
  create_tag() {
    return new Promise((resolve, reject) => {
      Tag.create({ tag_name: this.tag_name })
        .then((x) => resolve(x.value_query))
        .catch((err) => new Error(err));
    });
  }
  query_tag(finder) {
    return new Promise((resolve, reject) => {
      Tag.findAll({
        where: {
          tag_name: {
            [Op.iLike]: `%${finder}%`,
          },
        },
        attributes: ["tag_id", "tag_name"],
      })
        .then((x) =>
          resolve(
            x.map((x) => {
              return x.value_query;
            })
          )
        )
        .catch((err) => reject(err));
    });
  }
}
export default { User, Post, Comment, _Tag };
