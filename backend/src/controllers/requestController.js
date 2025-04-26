const Request = require('../models/requestModel');
const bcrypt = require("bcryptjs");
const User = require('../models/userModel');
const { generateTempPassword } = require('../utils/tempPasswordGenerator'); // Assuming you have a utility function for generating temp passwords
const { sendApprovalEmail } = require('../utils/emailService'); // Assuming you have a utility function for sending emails


// POST /api/requests
exports.submitRequest = async (req, res) => {
  try {
    const {
      nomEntreprise,
      secteurActivite,
      adresse,
      telephone,
      email,
      typeArchives,
      forfait
    } = req.body;

    // Basic validation
    if (!nomEntreprise || !secteurActivite || !adresse || !telephone || !email || !typeArchives || !forfait) {
      return res.status(400).json({ success: false, msg: 'Veuillez remplir tous les champs obligatoires' });
    }

    const request = await Request.create({
      nomEntreprise,
      secteurActivite,
      adresse,
      telephone,
      email,
      typeArchives,
      forfait
    });

    res.status(201).json({
      success: true,
      msg: 'Demande soumise avec succès',
      data: request
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};

// GET /api/requests
exports.getRequests = async (req, res) => {
  try {
    // Check if user is admin (assuming role is stored in req.user)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Accès refusé. Admin requis.' });
    }

    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};

// GET /api/requests/:id
exports.getRequest = async (req, res) => {
    try {
      const request = await Request.findById(req.params.id);
  
      if (!request) {
        return res.status(404).json({ 
          success: false, 
          msg: 'Demande non trouvée' 
        });
      }
  
      // Optional: Restrict access to admins or the requester themselves
      if (req.user.role !== 'admin' && request.email !== req.user.email) {
        return res.status(403).json({ 
          success: false, 
          msg: 'Non autorisé' 
        });
      }
  
      res.status(200).json({ 
        success: true, 
        data: request 
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        success: false, 
        msg: 'Erreur serveur' 
      });
    }
  };

 // PATCH /api/requests/:id/status
 exports.updateRequestStatus = async (req, res) => {
    try {
      const { status, adminNotes } = req.body; // Make sure to destructure status from req.body
      const requestId = req.params.id;
  
      // Validate status against your enum values
      if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ 
          success: false,
          msg: "Le statut doit être 'accepted' ou 'rejected'" 
        });
      }
  
      const updatedRequest = await Request.findByIdAndUpdate(
        requestId,
        { 
          status, // This will be either "accepted" or "rejected"
          adminNotes,
          assignedTo: req.user._id,
          processedAt: new Date() 
        },
        { new: true }
      );
  
      if (!updatedRequest) {
        return res.status(404).json({
          success: false,
          msg: "Demande non trouvée"
        });
      }
  
      if (status === 'accepted') {
        const userExists = await User.findOne({ email: updatedRequest.email });
        if (!userExists) {
          const tempPassword = generateTempPassword();
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(tempPassword, salt);
  
          const newUser = new User({
            username: updatedRequest.email.split('@')[0],
            email: updatedRequest.email,
            password: hashedPassword,
            role: 'user',
            isApproved: true
          });
          await newUser.save();
          await sendApprovalEmail(updatedRequest.email, tempPassword); 
        }
      }
  
      res.status(200).json({
        success: true,
        msg: `Demande ${status === 'accepted' ? 'acceptée' : 'rejetée'}`, // Fixed message
        data: updatedRequest
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        msg: "Erreur serveur"
      });
    }
  };;