const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const Notification = require("../models/Notification");

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ participantA: req.user.id }, { participantB: req.user.id }],
    })
      .populate({
        path: "participantA",
        select: "name profilePhoto",
      })
      .populate({
        path: "participantB",
        select: "name profilePhoto",
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/conversations/:conversationId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    // Check if conversationId is valid
    if (
      !req.params.conversationId ||
      req.params.conversationId === "undefined"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Check if user is part of the conversation
    if (
      conversation.participantA.toString() !== req.user.id &&
      conversation.participantB.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this conversation",
      });
    }

    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ timestamp: 1 });

    // Mark messages as read
    if (conversation.participantA.toString() === req.user.id) {
      await Conversation.findByIdAndUpdate(req.params.conversationId, {
        unreadCountA: 0,
      });
    } else {
      await Conversation.findByIdAndUpdate(req.params.conversationId, {
        unreadCountB: 0,
      });
    }

    // Mark all messages as read
    await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        receiverId: req.user.id,
        isRead: false,
      },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      $or: [
        { participantA: req.user.id, participantB: receiverId },
        { participantA: receiverId, participantB: req.user.id },
      ],
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participantA: req.user.id,
        participantB: receiverId,
        lastMessage: content,
      });
    } else {
      // Update conversation
      conversation.lastMessage = content;
      conversation.updatedAt = Date.now();

      // Increment unread count for receiver
      if (conversation.participantA.toString() === receiverId) {
        conversation.unreadCountA += 1;
      } else {
        conversation.unreadCountB += 1;
      }

      await conversation.save();
    }

    // Create message
    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      conversationId: conversation._id,
      content,
    });

    // Create notification
    await Notification.create({
      userId: receiverId,
      type: "message",
      message: `New message from ${req.user.name}`,
      relatedId: message._id,
      onModel: "Message",
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check if user is the sender
    if (message.senderId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this message",
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
