const { post } = require("../routes/user");
const Issue = require("../models/issue");
const Message = require("../models/message");
module.exports.getIssues = async (req, res, next) => {
  const results = await Issue.find({ hostId: req.user._id })
  .sort({latestActivity:-1})
  .populate("userId");

  const issues = results.map((result) => {
    return {
      _id: result._id,
      title: result.title,
      status: result.status,
      hostId: req.user._id,

      userId: result.userId,
      userType: req.user.type,
    };
  });

  return res.render("user/userHome", {
    pageTitle: "Dashboard",
    user: req.user,
    issues: issues,
  });
};
module.exports.getSignOut = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
module.exports.postAcceptIssue = async (req, res, next) => {
  const issue = await Issue.findById(req.body.issueId);
  issue.latestActivity = Date();
  issue.status = "active";
  issue.hostId = req.user._id;
  await issue.save();
  return res.redirect("/host/issues");
};
module.exports.getNewIssue = async (req, res, next) => {
  const results = await Issue.find({ status: ["fresh", "re-raised"] }).populate(
    "userId"
  );

  const issues = results.map((result) => {
    return {
      _id: result._id,
      title: result.title,
      status: result.status,
      hostId: req.user._id,

      userId: result.userId,
      userType: req.user.type,
    };
  });
  return res.render("host/newIssues", {
    pageTitle: "New Issues",
    user: req.user,
    issues: issues,
  });
};
module.exports.postNewIssue = async (req, res, next) => {
  try {
    const issue = new Issue({
      title: req.body.title,
      status: "fresh",
      userId: req.user._id,
      latestActivity:Date()
    });
    const result = await issue.save();
    const message = new Message({
      content: req.body.message,
      issueId: result._id,
      senderId: req.user._id,
    });
    await message.save();
    return res.redirect("/user/issues");
  } catch (err) {
    next(err);
  }
};
module.exports.getMessages = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.issueId);

    if (issue.hostId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "user not authorised",
      });
    }
    let result = await Message.find({ issueId: req.params.issueId }).populate(
      "senderId"
    );
    result = result.map((message) => {
      return {
        _id: message._id,
        content: message.content,
        sender: message.senderId.username,
        sender_id: message.senderId._id,
      };
    });

    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
module.exports.postMessage = async (req, res, next) => {
  const message = new Message({
    content: req.body.message,
    senderId: req.user._id,
    issueId: req.body.issueId,
  });
  try {

    const messageRes = await message.save();
    res.status(201).json({
      message: "Message posted",
      data: messageRes,
    });
    const issueId = req.body.issueId
    const issue = Issue.findById(issueId);
    issue.latestActivity = Date();
    console.log(issue);
    /* await issue.save(); */
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: err,
    });
  }
};
module.exports.deleteMessage = async (req, res, next) => {
  
  try {
    const message =await Message.findById(req.body.id);
    if(message.senderId.toString()!==req.user._id.toString()){
      return res.status(400).json({
        message: "Not authorized",
      });
    }
    await message.remove();
    return res.status(200).json({
      message: "Message Deleted",
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      message: err,
    });
  }
};

module.exports.raiseIssueAgain = async (req, res, next) => {
  try {
const issueId = req.body.issueId;
    const issue = await Issue.findById(issueId);
    if (issue.hostId.toString() != req.user._id) {
      return res.status(400).json({
        message: "Not authorised",
      });
    }
    issue.status = "re-raised";
    issue.latestActivity = Date();
    issue.hostId = null;
    const result = await issue.save();
    return res.status(200).json({
      message: "Re-raised Succesfully",
    });
  } catch (err) {
    next(err);
  }
};
