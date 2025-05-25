const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');

        if (!token) {
            return res.status(401).json({
                success: false,
                msg: 'Accès non autorisé, token manquant'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

        // Get user from database with populated company
        const user = await User.findById(decoded.user.id)
            .populate('company');
        

        if (!user) {
            return res.status(401).json({
                success: false,
                msg: 'Utilisateur non trouvé'
            });
        }

        // Add complete user object to request
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(401).json({
            success: false,
            msg: 'Token non valide'
        });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied: admin role required' });
    }
};