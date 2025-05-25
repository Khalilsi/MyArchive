const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const ConnectionHistory = require('../models/connectionHistoryModel');
const UAParser = require('ua-parser-js');


exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.updateProfile = async (req, res) => {
    const { username, email } = req.body;

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                msg: "Les mots de passe actuel et nouveau sont requis"
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Utilisateur non trouvé"
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: "Mot de passe actuel incorrect"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Mot de passe modifié avec succès"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: "Erreur lors du changement de mot de passe"
        });
    }
};

exports.recordConnection = async (req, userId) => {
    try {
        const parser = new UAParser(req.headers['user-agent']);
        const device = parser.getDevice().type || 'Desktop';

        const connection = new ConnectionHistory({
            user: userId,
            ip: req.ip,
            device: device
        });

        await connection.save();

        // Keep only last 10 connections
        const connections = await ConnectionHistory.find({ user: userId })
            .sort({ date: -1 })
            .skip(10);
            
        if (connections.length > 0) {
            await ConnectionHistory.deleteMany({ 
                _id: { $in: connections.map(c => c._id) } 
            });
        }
    } catch (err) {
        console.error('Error recording connection:', err);
    }
};

exports.getConnectionHistory = async (req, res) => {
    try {
        const connections = await ConnectionHistory.find({ user: req.user._id })
            .sort({ date: -1 })
            .limit(10);

        const formattedConnections = connections.map(conn => ({
            key: conn._id,
            ip: conn.ip,
            date: new Date(conn.date).toLocaleString('fr-FR'),
            device: conn.device
        }));

        res.status(200).json({
            success: true,
            data: formattedConnections
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: "Erreur lors de la récupération de l'historique des connexions"
        });
    }
};