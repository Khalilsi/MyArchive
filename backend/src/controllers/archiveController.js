const Archive = require('../models/archiveModel');
const Document = require('../models/documentModel');

exports.createArchive = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false,
        msg: 'User not authenticated' 
      });
    }

    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ 
        success: false,
        msg: 'Archive name is required' 
      });
    }

    const archive = new Archive({
      name,
      user: userId,
    });

    const savedArchive = await archive.save();
    
    res.status(201).json({
      success: true,
      data: savedArchive
    });
  } catch (error) {
    console.error('Archive creation error:', error);
    res.status(500).json({ 
      success: false,
      msg: 'Server error: ' + error.message 
    });
  }
};

exports.getUserArchives = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false,
        msg: 'User not authenticated' 
      });
    }

    const userId = req.user.id; 
    const archives = await Archive.find({ user: userId });

    res.status(200).json({
      success: true,
      data: archives,
      count: archives.length
    });

  } catch (error) {
    console.error('Get archives error:', error);
    res.status(500).json({ 
      success: false,
      msg: 'Server error: ' + error.message 
    });
  }
};

exports.deleteArchive = async (req, res) => {
  try {
   
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false,
        msg: 'User not authenticated' 
      });
    }

    const { archiveId } = req.params;

    const archive = await Archive.findOne({
      _id: archiveId,
      user: req.user.id
    });

    if (!archive) {
      return res.status(404).json({
        success: false,
        msg: 'Archive not found or unauthorized'
      });
    }

    // Delete all documents associated with this archive first
    await Document.deleteMany({ archive: archiveId });

    // Delete the archive
    await Archive.findByIdAndDelete(archiveId);

    res.status(200).json({
      success: true,
      msg: 'Archive and associated documents deleted successfully'
    });

  } catch (error) {
    console.error('Delete archive error:', error);
    res.status(500).json({ 
      success: false,
      msg: 'Server error: ' + error.message 
    });
  }
};