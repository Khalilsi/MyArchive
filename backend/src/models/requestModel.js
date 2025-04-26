const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    // User/Organization Details
    nomEntreprise: { 
        type: String, 
        required: true 
    },
    secteurActivite: { 
        type: String, 
        required: true,
        enum: ["Santé", "Éducation", "Finance", "Agriculture", "Technologie", "Autre"] // Static list (update later)
    },
    adresse: { 
        type: String, 
        required: true 
    },
    telephone: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
        match: [/.+\@.+\..+/, "Veuillez entrer un email valide"]
    },

    // Archive Details
    typeArchives: { 
        type: [String], 
        required: true,
        enum: ["Factures", "Contrats", "Photos", "Documents légaux", "Correspondance", "Autre"] // Static list (update later)
    },
    forfait: { 
        type: String, 
        required: true 
    }, // Will refine later (e.g., "Basic", "Premium")

    // Admin Control
    status: { 
        type: String, 
        enum: ["waiting", "accepted", "rejected"], 
        default: "waiting" 
    },
    adminNotes: { 
        type: String 
    },
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;