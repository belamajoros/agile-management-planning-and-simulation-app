const { sendMessage, getMessages, createGroupChat } = require("../controllers/groupChatController");
const router = require("express").Router();

router.post("/sendMessage", sendMessage);
router.get("/getMessages/:chatId", getMessages);
router.post("/createGroupChat", createGroupChat);

module.exports = router;