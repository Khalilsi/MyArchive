const Request = require('../models/requestModel');
const Company = require('../models/companyModel');
const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose"); // Added mongoose for session management
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
  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status, adminNotes } = req.body;
    const requestId = req.params.id;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        msg: "Le statut doit être 'accepted' ou 'rejected'" 
      });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        msg: "Demande non trouvée"
      });
    }

    if (status === 'accepted') {
      // Create company with initial request data only
      const company = new Company({
        nomEntreprise: request.nomEntreprise,
        secteurActivite: request.secteurActivite,
        adresse: request.adresse,
        telephone: request.telephone,
        typeArchives: request.typeArchives,
        forfait: request.forfait,
        isApproved: true
      });
      await company.save({ session });

      // Create or update user
      let user = await User.findOne({ email: request.email });
      if (!user) {
        const tempPassword = generateTempPassword();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);

        const baseUsername = request.nomEntreprise.toLowerCase().replace(/\s+/g, '');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const username = `${baseUsername}${randomSuffix}`;

        user = new User({
          email: request.email,
          username: username,
          password: hashedPassword,
          role: 'user',
          company: company._id,
          isApproved: true
        });
        await user.save({ session });

        // Send credentials email with username
        await sendApprovalEmail(request.email, tempPassword, username);
      } else {
        user.company = company._id;
        user.isApproved = true;
        await user.save({ session });
      }

      // Add user to company
      company.users.push(user._id);
      await company.save({ session });

      // Only update request status after everything succeeds
      request.status = status;
      request.adminNotes = adminNotes;
      request.assignedTo = req.user._id;
      request.processedAt = new Date();
      await request.save({ session });

      // Commit the transaction
      await session.commitTransaction();
    } else {
      // For rejection, simply update the request
      request.status = status;
      request.adminNotes = adminNotes;
      request.assignedTo = req.user._id;
      request.processedAt = new Date();
      await request.save();
    }

    res.status(200).json({
      success: true,
      msg: `Demande ${status === 'accepted' ? 'acceptée' : 'rejetée'}`,
      data: request
    });

  } catch (err) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Erreur serveur"
    });
  } finally {
    // End the session
    session.endSession();
  }
};

exports.getCompanyInfo = async (req, res) => {
    exports.getCompanyInfo = async (req, res) => {
        try {
            // Get user info from the authenticated request
            const userId = req.user._id;
    
            // Find the user and populate company information if not already populated
            const user = req.user.company ? req.user : await User.findById(userId).populate('company');
    
            if (!user) {
                return res.status(404).json({
                    success: false,
                    msg: "Utilisateur non trouvé"
                });
            }
    
            if (!user.company) {
                return res.status(404).json({
                    success: false,
                    msg: "Aucune entreprise associée à cet utilisateur"
                });
            }
    
            res.status(200).json({
                success: true,
                data: user.company
            });
    
        } catch (err) {
            res.status(500).json({
                success: false,
                msg: "Erreur lors de la récupération des informations de l'entreprise"
            });
        }
    };    try {
        // Get user info from the authenticated request
        const userId = req.user._id;
        
        console.log('Searching for user ID:', userId);

        // Find the user and populate company information if not already populated
        const user = req.user.company ? req.user : await User.findById(userId).populate('company');
        
        console.log('Found user:', user);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Utilisateur non trouvé"
            });
        }

        if (!user.company) {
            return res.status(404).json({
                success: false,
                msg: "Aucune entreprise associée à cet utilisateur"
            });
        }

        res.status(200).json({
            success: true,
            data: user.company
        });

    } catch (err) {
        console.error('Error details:', err);
        res.status(500).json({
            success: false,
            msg: "Erreur lors de la récupération des informations de l'entreprise",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

exports.updateCompanyInfo = async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;

        // Find user and populate company
        const user = await User.findById(userId).populate('company');

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Utilisateur non trouvé"
            });
        }

        if (!user.company) {
            return res.status(404).json({
                success: false,
                msg: "Aucune entreprise associée à cet utilisateur"
            });
        }

        // Fields that can be updated
        const allowedUpdates = [
            'typeEntreprise',
            'numeroIdentificationFiscale',
            'siteWeb',
            'telephone',
            'adresse'
        ];

        // Filter out unwanted updates
        const filteredUpdates = {};
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        });

        // Update company information
        const updatedCompany = await Company.findByIdAndUpdate(
            user.company._id,
            { $set: filteredUpdates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            msg: "Informations de l'entreprise mises à jour avec succès",
            data: updatedCompany
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Erreur lors de la mise à jour des informations de l'entreprise"
        });
    }
};