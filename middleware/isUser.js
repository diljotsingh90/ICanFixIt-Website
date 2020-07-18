module.exports = (req, res, next) => {
  if (req.user.type !== "user") {
    return res.redirect("/host/issues");
  }
  next();
};
