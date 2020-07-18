const router = require("express").Router();
const controller = require("../controller/user");
const isAuth = require("../middleware/isAuth");
const isUser = require("../middleware/isUser");
router.use(isAuth);
router.use(isUser);

router.get("/issues", controller.getIssues);
router.get("/newissue", controller.newIssue);
router.post("/newissue", controller.postNewIssue);
router.get("/signout", controller.getSignOut);
router.get("/messages/:issueId", controller.getMessages);
router.post("/createmessage", controller.postMessage);
 router.post("/deletemessage", controller.deleteMessage); 
 router.post("/deleteissue", controller.deleteIssue); 
module.exports = router;
