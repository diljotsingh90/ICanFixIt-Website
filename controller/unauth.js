const bcrypt = require("bcryptjs");
const User = require("../models/user");

const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);

module.exports.getIndex = (req, res, next) => {
  res.render("unauth/index", {
    pageTitle: "ICanFixit",
  });
};
module.exports.getSignup = (req, res, next) => {
  res.render("unauth/signup", {
    pageTitle: "Signup",
    error: "",
  });
};

module.exports.postSignup = async (req, res, next) => {
  try {
    const username = req.body.username;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      username: username,
      mobile: mobile,
      email: email,
      password: password,
      type: "user",
    });
    await user.save();
    return res.redirect("/login");
  } catch (err) {
    next(err);
  }
};
module.exports.getLogin = (req, res, next) => {
  res.render("unauth/login", {
    pageTitle: "Login",
    error: "",
    errorPassword: "",
  });
};
module.exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    if (req.body.googleIdToken) {
    const username = req.body.username;
      const ticket = await client.verifyIdToken({
        idToken: req.body.googleIdToken,
        audience: process.env.CLIENT_ID,
      });
      const payload = ticket.getPayload();
      console.log(payload);
      let user = await User.findOne({
        email: req.body.email,
      });
      if (user === null) {
        const user = new User({
          email: email,
          type: "user",
          username:username
        });
        await user.save();
      }
      req.session.user = user;
      await req.session.save((err) => {
        console.log("Successful");
        return res.status(201).json({
          message:"Authentication Succesful",
          type:user.type
        });
      });
    } else {
      
      const password = req.body.password;

      const result = await User.findOne({ email: email });
      if (!result) {
        return res.render("unauth/login", {
          pageTitle: "Login",
          error: "Incorrect Email",
          errorPassword: "",
        });
      }
      const same = await bcrypt.compare(password, result.password);
      if (!same) {
        return res.render("unauth/login", {
          pageTitle: "Login",
          error: "",
          errorPassword: "Incorrect Password",
        });
      }
      req.session.user = result;

      return res.redirect(`/${result.type}/issues`);
    }
  } catch (err) {
    next(err);
  }
};
