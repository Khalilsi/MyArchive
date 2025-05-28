// src/controllers/supportController.js
const SupportMessage = require("../models/supportMessageModel");

/**
 * Send a message.
 * - For users: 'senderRole' is "user"
 * - For admins replying: 'senderRole' is "admin"
 */
// supportController.js
exports.sendMessage = async (req, res) => {
  try {
    const { message, userId } = req.body;
    const senderId = req.user._id;
    const senderRole = req.user.role;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message content is required" });
    }

    let targetUserId;

    if (senderRole === "admin") {
      // Admin must specify a user to send the message to
      if (!userId) {
        return res.status(400).json({ message: "User ID is required for admin to send a message" });
      }
      targetUserId = userId;
    } else {
      // Normal users send messages to the admin — so their own ID is used
      targetUserId = senderId;
    }

    const supportMessage = new SupportMessage({
      user: targetUserId,
      message,
      senderRole,
    });

    await supportMessage.save();

    return res.status(201).json({
      message: "Message sent successfully",
      supportMessage,
    });
  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * Get conversation messages for the authenticated user.
 * For a user, this returns only his/her own messages.
 */
exports.getUserMessages = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await SupportMessage.find({
      user: userId, // Get all messages tied to this user's conversation
    }).sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while retrieving messages" });
  }
};

/**
 * Admin: Get all conversations (list of users who have sent messages)
 * Optionally, you can group messages by user.
 */
exports.getAllConversations = async (req, res) => {
  try {
    // Only allow admins
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Group messages by user id
    const conversations = await SupportMessage.aggregate([
      {
        $group: {
          _id: "$user",
          messages: { $push: "$$ROOT" },
          lastMessage: { $last: "$createdAt" },
        },
      },
      { $sort: { lastMessage: -1 } },
    ]);

    return res.status(200).json({ conversations });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while retrieving conversations" });
  }
};

/**
 * Admin: Get conversation with a specific user.
 */

exports.getConversationByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await SupportMessage.find({
      user: userId, // Do NOT filter by senderRole
    }).sort({ createdAt: 1 }); // oldest to newest

    return res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching conversation" });
  }
};
