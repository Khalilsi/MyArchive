const Document = require("../models/documentModel");
const Archive = require("../models/archiveModel");
const User = require("../models/userModel");
const Forfait = require("../models/forfaitModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads/documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and add timestamp
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9]/g, "-");
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".docx"];

    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (
      allowedTypes.includes(file.mimetype) &&
      allowedExtensions.includes(fileExtension)
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, JPG, PNG, and DOCX files are allowed."
        )
      );
    }
  },
}).single("file");

const getMimeTypeDisplay = (mimeType) => {
  const typeMap = {
    "application/pdf": "PDF",
    "image/jpeg": "JPG",
    "image/png": "PNG",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
  };
  return typeMap[mimeType] || "UNKNOWN";
};

const getFileUrl = (fileName) => {
  return `http://localhost:4000/uploads/documents/${fileName}`;
};

// Modified upload document controller
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        msg: "User not authenticated",
      });
    }

    upload(req, res, async (err) => {
      // Function to clean up uploaded file if something goes wrong
      const cleanupFile = () => {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      };

      try {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({
            success: false,
            msg: `Upload error: ${err.message}`,
          });
        } else if (err) {
          return res.status(400).json({
            success: false,
            msg: err.message,
          });
        }

        if (!req.file) {
          return res.status(400).json({
            success: false,
            msg: "No file uploaded",
          });
        }

        const { name, category, archiveId } = req.body;
        const userId = req.user.id;

        if (!name || !archiveId) {
          cleanupFile();
          return res.status(400).json({
            success: false,
            msg: "Name and archive ID are required",
          });
        }

        // Check user and forfait first
        const user = await User.findById(userId).populate("forfait");
        if (!user.forfait) {
          cleanupFile();
          return res.status(400).json({
            success: false,
            msg: "User has no storage plan assigned",
          });
        }

        // Check storage limit
        const fileSizeMB = req.file.size / (1024 * 1024);
        if (user.usedStorage + fileSizeMB > user.forfait.maxStorage) {
          cleanupFile();
          return res.status(400).json({
            success: false,
            msg: `Storage limit exceeded (${user.usedStorage.toFixed(2)}MB/${
              user.forfait.maxStorage
            }MB)`,
          });
        }

        // Check archive ownership
        const archive = await Archive.findOne({ _id: archiveId, user: userId });
        if (!archive) {
          cleanupFile();
          return res.status(404).json({
            success: false,
            msg: "Archive not found or unauthorized",
          });
        }

        const fileType = req.file.mimetype;
        const displayType = getMimeTypeDisplay(fileType);

        const document = new Document({
          name,
          type: fileType,
          displayType,
          category,
          size: fileSizeMB,
          filePath: req.file.path,
          originalName: req.file.originalname,
          archive: archiveId,
          user: userId,
        });

        const savedDocument = await document.save();

        // Update user's storage usage
        await User.findByIdAndUpdate(userId, {
          $inc: { usedStorage: fileSizeMB },
        });

        res.status(201).json({
          success: true,
          data: {
            ...savedDocument.toObject(),
            filePath: getFileUrl(path.basename(savedDocument.filePath)),
          },
        });
      } catch (error) {
        cleanupFile();
        throw error;
      }
    });
  } catch (error) {
    console.error("Document upload error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error: " + error.message,
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
      filePath: getFileUrl(path.basename(doc.filePath)),
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
      filePath: getFileUrl(path.basename(doc.filePath)),
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
