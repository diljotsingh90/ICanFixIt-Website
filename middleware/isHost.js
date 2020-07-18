module.exports = (req, res, next) => {
  if (req.user.type !== "host") {
    return res.redirect("/user/issues");
  }
  next();
};
