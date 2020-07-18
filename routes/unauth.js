const router = require("express").Router();
const controller = require("../controller/unauth");
router.use((req, res, next) => {
  if (req.user) {
    return res.redirect("/" + req.user.type + "/issues");
  }
  next();
});
router.get("/", controller.getIndex);
router.get("/signup", controller.getSignup);
router.post("/signup", controller.postSignup);
router.get("/login", controller.getLogin);
router.post("/login", controller.postLogin);

module.exports = router;
