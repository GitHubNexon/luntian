const { baseModel, insertDefaultValues } = require('../models/baseModel');
const mongoose = require("mongoose");

// Initialize default values in the database
function initializeDefaults() {
    insertDefaultValues();
}

// Read base data
async function readBase(req, res) {
    try {
        const base = await baseModel.findOne();
        if (!base) return res.status(404).json({ message: 'Base data not found' });
        res.status(200).json(base);
    } catch (error) {
        console.error('Error reading base data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get base data for internal use
async function getBase() {
    try {
        const base = await baseModel.findOne();
        return base;
    } catch (error) {
        console.error('Error trying to read base data:', error);
        throw new Error('Internal server error');
    }
}

// Create a new user type
async function createUserType(req, res) {
    try {
        await baseModel.updateMany({}, { $push: { userTypes: req.body } }, { new: true });
        res.json({ message: 'User type created' });
    } catch (error) {
        console.error('Error on inserting new user type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update an existing user type
async function updateUserType(req, res) {
    try {
        const userType = req.body; // New user type data
        const _id = mongoose.Types.ObjectId.createFromHexString(req.params._id);

        const result = await baseModel.updateMany(
            { 'userTypes._id': _id }, 
            { $set: { 'userTypes.$': userType } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'User type not found or no changes made' });
        }

        res.json({ message: 'User type updated' });
    } catch (error) {
        console.error('Error updating user type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete a user type
async function deleteUserType(req, res) {
    try {
        const userType = req.params.user; // The user type to delete

        const result = await baseModel.updateMany({}, {
            $pull: { userTypes: { user: userType } } // Use 'user' field for matching
        });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'User type not found' });
        }

        res.json({ message: 'User type deleted' });
    } catch (error) {
        console.error('Error deleting user type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    initializeDefaults,
    readBase,
    getBase,
    createUserType,
    updateUserType,
    deleteUserType
};
