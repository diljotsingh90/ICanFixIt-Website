const router = require("express").Router();
const controller = require("../controller/host");
const isAuth = require("../middleware/isAuth");
const isHost = require("../middleware/isHost");
router.use(isAuth);
router.use(isHost);

router.get("/issues", controller.getIssues);
router.post("/raiseAgain", controller.raiseIssueAgain);
router.get("/signout", controller.getSignOut);
router.get("/messages/:issueId", controller.getMessages);
router.post("/createmessage", controller.postMessage);
router.post("/acceptIssue", controller.postAcceptIssue);
router.get("/newissues", controller.getNewIssue);
router.post("/deletemessage", controller.deleteMessage);
module.exports = router;
