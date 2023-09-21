const mongoose = require('mongoose');
const GroupChat = require("../models/groupChatModel");


module.exports.getMessages = async (req, res, next) => {
  try {
    const chatId = req.params.chatId;

    await GroupChat.find({ _id: mongoose.Types.ObjectId(chatId) })
      .exec()
      .then((data) => {
        if (data.length >= 0) {
          res.status(200).json(data);
        } else {
          res.status(404).json({
            message: 'No entries found',
          });
        }
      });
  } catch (ex) {
    next(ex);
  }
};

module.exports.sendMessage = async (req, res, next) => {
  try {
    const { chatId, msg, userName, id } = req.body;
    const message = {
      content: msg,
      username: userName,
      senderId: mongoose.Types.ObjectId(id)
    };

    GroupChat.findOneAndUpdate({_id: mongoose.Types.ObjectId(chatId)}, {$push: {messages: message}}, {new: true}).exec()
    .then((updated) => {
        if (updated) {
            return res.status(200).json(updated);
        } else {
            return res.status(404).json({message: "Failed to send message"});
        }
    })
    .catch((error) => {
        return res.status(500).json({
            message: error.message,
            error
        });
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.createGroupChat = async (req, res, next) => {
  try {
    const { chatId } = req.body;

    const id = new mongoose.Types.ObjectId(chatId)

    const created_at = new Date();
    const updated_at = new Date();
    const messages = []
    const groupChat = new GroupChat({
      _id: id,
      messages,
      created_at,
      updated_at,
    });

    groupChat.save().then((doc) => {
      return res.status(200).send({ doc, message: 'Group chat succesfully created!' });
    }).catch((error) => {
      return res.status(500).json({
          message: error.message,
          error
      });
    });
  } catch (ex) {
    next(ex);
  }
}
