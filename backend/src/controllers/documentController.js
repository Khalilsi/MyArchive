const Document = require("../models/documentModel");
const Archive = require("../models/archiveModel");
const User = require("../models/userModel");
const Forfait = require("../models/forfaitModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { storage } = require("../config/cloudinary"); // Assuming you have a storage config file
const { cloudinary } = require("../config/cloudinary"); // Assuming you have a cloudinary config file

// Ensure uploads directory exists
// const uploadDir = path.join(__dirname, "../uploads/documents");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// Configure Multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     // Sanitize filename and add timestamp
//     const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9]/g, "-");
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     cb(null, `${uniqueSuffix}-${sanitizedName}`);
//   },
// });

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, Word, PNG, and JPG files are allowed."));
    }
  },
});

exports.upload = upload.single("file");

// Add this helper function at the top with other functions
const getDisplayType = (mimeType) => {
  const typeMap = {
    "application/pdf": "PDF",
    "image/jpeg": "JPG",
    "image/png": "PNG",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
  };
  return typeMap[mimeType] || "UNKNOWN";
};

// const getMimeTypeDisplay = (mimeType) => {
//   const typeMap = {
//     "application/pdf": "PDF",
//     "image/jpeg": "JPG",
//     "image/png": "PNG",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//       "DOCX",
//   };
//   return typeMap[mimeType] || "UNKNOWN";
// };

const getFileUrl = (fileName) => {
  return `http://localhost:4000/uploads/documents/${fileName}`;
};

// Modified upload document controller
exports.uploadDocument = async (req, res) => {
  try {
    // Extract data from request
    const { name, category, archive } = req.body;
    const user = req.user.id;

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Validate required fields
    if (!name || !archive || !user) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Find user and validate
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find archive and validate
    const foundArchive = await Archive.findById(archive);
    if (!foundArchive) {
      return res.status(404).json({
        success: false,
        message: "Archive not found",
      });
    }

    // Get user's forfait
    let userForfait = await Forfait.findById(foundUser.forfait);
    console.log("User forfait ID:", foundUser.forfait);

    if (!userForfait) {
      // Try to find default Freemium plan
      userForfait = await Forfait.findOne({ name: "Freemium" });

      if (!userForfait) {
        return res.status(400).json({
          success: false,
          message: "Default subscription plan not found",
        });
      }

      // Update user with Freemium plan
      await User.findByIdAndUpdate(foundUser._id, {
        forfait: userForfait._id,
      });

      console.log("Assigned default Freemium plan:", userForfait._id);
    }

    // Check monthly document limit
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const monthlyDocsCount = await Document.countDocuments({
      user,
      createdAt: { $gte: startOfMonth },
    });

    if (monthlyDocsCount >= userForfait.maxDocumentsPerMonth) {
      return res.status(403).json({
        success: false,
        message: `Monthly document limit (${userForfait.maxDocumentsPerMonth}) reached for your subscription`,
      });
    }

    // Check yearly document limit
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const yearlyDocsCount = await Document.countDocuments({
      user,
      createdAt: { $gte: startOfYear },
    });

    if (yearlyDocsCount >= userForfait.maxDocumentsPerYear) {
      return res.status(403).json({
        success: false,
        message: `Yearly document limit (${userForfait.maxDocumentsPerYear}) reached for your subscription`,
      });
    }

    // Create new document
    const newDocument = new Document({
      name,
      category,
      user,
      archive,
      type: req.file.mimetype,
      displayType: getDisplayType(req.file.mimetype), // Add this line
      filePath: req.file.path, // Cloudinary URL
      size: req.file.size / (1024 * 1024), // Convert to MB
      originalName: req.file.originalname,
    });

    await newDocument.save();

    res.status(201).json({
      success: true,
      data: newDocument,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// Modified delete document controller
exports.deleteDocument = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        msg: "User not authenticated",
      });
    }

    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await Document.findOne({ _id: documentId, user: userId });
    if (!document) {
      return res.status(404).json({
        success: false,
        msg: "Document not found or unauthorized",
      });
    }

    // Delete physical file
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Update storage usage
    await User.findByIdAndUpdate(userId, {
      $inc: { usedStorage: -document.size },
    });

    await Document.findByIdAndDelete(documentId);

    res.status(200).json({
      success: true,
      msg: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error: " + error.message,
    });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        msg: "User not authenticated",
      });
    }

    const userId = req.user.id;

    // Find all documents for the user and populate the archive field
    const documents = await Document.find({ user: userId })
      .populate("archive", "name") // This will get the archive name
      .select(
        "name type displayType category size originalName createdAt archive filePath"
      )
      .sort({ createdAt: -1 }); // Sort by newest first

    // Format the response
    const formattedDocuments = documents.map((doc) => ({
      id: doc._id,
      name: doc.name,
      type: doc.type,
      displayType: doc.displayType,
      category: doc.category,
      size: doc.size.toFixed(2), // Size in MB with 2 decimal places
      originalName: doc.originalName,
      createdAt: doc.createdAt,
      filePath: doc.filePath,
      archive: {
        id: doc.archive._id,
        name: doc.archive.name,
      },
    }));

    res.status(200).json({
      success: true,
      count: documents.length,
      data: formattedDocuments,
    });
  } catch (error) {
    console.error("Fetch documents error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error: " + error.message,
    });
  }
};

exports.getDocumentsByArchive = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        msg: "User not authenticated",
      });
    }

    const userId = req.user.id;
    const { archiveId } = req.params;

    // Verify archive ownership
    const archive = await Archive.findOne({ _id: archiveId, user: userId });
    if (!archive) {
      return res.status(404).json({
        success: false,
        msg: "Archive not found or unauthorized",
      });
    }

    // Find documents in the specific archive
    const documents = await Document.find({
      user: userId,
      archive: archiveId,
    }).select(
      "name type displayType category size originalName createdAt filePath"
    );

    const formattedDocuments = documents.map((doc) => ({
      id: doc._id,
      name: doc.name,
      type: doc.type,
      displayType: doc.displayType,
      category: doc.category,
      size: doc.size.toFixed(2),
      originalName: doc.originalName,
      createdAt: doc.createdAt,
      filePath: doc.filePath,
    }));

    res.status(200).json({
      success: true,
      archiveName: archive.name,
      count: documents.length,
      data: formattedDocuments,
    });
  } catch (error) {
    console.error("Fetch archive documents error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error: " + error.message,
    });
  }
};

exports.getSecureUrl = async (req, res) => {
  try {
    let { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL parameter is required",
      });
    }

    url = decodeURIComponent(url);

    const match = url.match(/\/v(\d+)\/(.+)\.pdf$/);
    if (!match) {
      throw new Error("Invalid Cloudinary URL format");
    }

    const version = match[1];
    const publicId = match[2]; // no .pdf at the end

    const timestamp = Math.round(new Date().getTime() / 1000);

    const secureUrl = cloudinary.url(`${publicId}.pdf`, {
      resource_type: "raw",
      type: "upload",
      secure: true,
      sign_url: true,
      version,
      timestamp,
    });

    return res.json({
      success: true,
      secureUrl,
    });
  } catch (error) {
    console.error("Error in getSecureUrl:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to generate secure URL: ${error.message}`,
    });
  }
};
