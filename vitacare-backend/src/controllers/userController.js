const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      email: req.body.email,
      'profile.firstName': req.body.firstName,
      'profile.lastName': req.body.lastName,
      'profile.dateOfBirth': req.body.dateOfBirth,
      'profile.gender': req.body.gender,
      'profile.bloodGroup': req.body.bloodGroup,
      'profile.languages': req.body.languages,
      'profile.address': req.body.address,
      preferredLanguage: req.body.preferredLanguage,
      allergies: req.body.allergies,
      chronicConditions: req.body.chronicConditions
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add emergency contact
// @route   POST /api/v1/users/emergency-contact
// @access  Private
exports.addEmergencyContact = async (req, res, next) => {
  try {
    const { name, relationship, mobile } = req.body;

    const user = await User.findById(req.user._id);

    user.emergencyContacts.push({ name, relationship, mobile });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: user.emergencyContacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove emergency contact
// @route   DELETE /api/v1/users/emergency-contact/:id
// @access  Private
exports.removeEmergencyContact = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    user.emergencyContacts = user.emergencyContacts.filter(
      contact => contact._id.toString() !== req.params.id
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Emergency contact removed successfully',
      data: user.emergencyContacts
    });
  } catch (error) {
    next(error);
  }
};
