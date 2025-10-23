const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Trigger emergency SOS
// @route   POST /api/emergency/sos
// @access  Private
const triggerSOS = async (req, res) => {
  try {
    const { location, emergency_type } = req.body;

    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({
        success: false,
        message: 'Location data is required'
      });
    }

    const user = await User.findById(req.user._id).populate('emergencyContacts');

    // Create critical notification for the user
    const notification = await Notification.create({
      user: user._id,
      type: 'emergency',
      severity: 'critical',
      title: '🚨 Emergency SOS Activated',
      message: `Emergency assistance requested at ${location.address || 'your location'}`,
      data: {
        location,
        emergency_type: emergency_type || 'general',
        activatedAt: new Date()
      },
      metadata: {
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        }
      }
    });

    // Emit socket event to user
    const io = req.app.get('io');
    if (io) {
      io.to(user._id.toString()).emit('notification', notification);
    }

    // In a real application, you would:
    // 1. Alert emergency contacts via SMS/call
    // 2. Notify nearby hospitals
    // 3. Alert emergency services (108 in India)
    // 4. Send location to emergency response team
    
    // Simulate sending alerts to emergency contacts
    const emergencyContactIds = user.emergencyContacts.map(contact => ({
      name: contact.name,
      mobile: contact.mobile,
      relationship: contact.relationship
    }));

    // Log emergency event
    console.log(`🚨 EMERGENCY SOS TRIGGERED:
      User: ${user.profile.firstName} ${user.profile.lastName} (${user.healthId})
      Location: ${location.latitude}, ${location.longitude}
      Address: ${location.address || 'Not provided'}
      Emergency Contacts Alerted: ${emergencyContactIds.length}
      Time: ${new Date().toISOString()}
    `);

    res.status(200).json({
      success: true,
      message: 'Emergency SOS activated successfully',
      data: {
        notification,
        location,
        emergencyContactsNotified: emergencyContactIds.length,
        emergencyContacts: emergencyContactIds,
        instructions: [
          'Emergency services have been notified',
          'Your location has been shared',
          'Help is on the way',
          'Stay calm and stay at your current location if safe'
        ]
      }
    });

  } catch (error) {
    console.error('Emergency SOS error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate emergency SOS',
      error: error.message
    });
  }
};

// @desc    Get emergency contacts
// @route   GET /api/emergency/contacts
// @access  Private
const getEmergencyContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('emergencyContacts');

    res.status(200).json({
      success: true,
      data: {
        contacts: user.emergencyContacts || []
      }
    });

  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve emergency contacts',
      error: error.message
    });
  }
};

// @desc    Add emergency contact
// @route   POST /api/emergency/contacts
// @access  Private
const addEmergencyContact = async (req, res) => {
  try {
    const { name, relationship, mobile } = req.body;

    if (!name || !relationship || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Name, relationship, and mobile number are required'
      });
    }

    const user = await User.findById(req.user._id);

    // Check if contact already exists
    const existingContact = user.emergencyContacts.find(
      contact => contact.mobile === mobile
    );

    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'This contact already exists'
      });
    }

    // Add new contact
    user.emergencyContacts.push({ name, relationship, mobile });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: {
        contacts: user.emergencyContacts
      }
    });

  } catch (error) {
    console.error('Add emergency contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add emergency contact',
      error: error.message
    });
  }
};

// @desc    Delete emergency contact
// @route   DELETE /api/emergency/contacts/:contactId
// @access  Private
const deleteEmergencyContact = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.emergencyContacts = user.emergencyContacts.filter(
      contact => contact._id.toString() !== req.params.contactId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Emergency contact deleted successfully',
      data: {
        contacts: user.emergencyContacts
      }
    });

  } catch (error) {
    console.error('Delete emergency contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete emergency contact',
      error: error.message
    });
  }
};

module.exports = {
  triggerSOS,
  getEmergencyContacts,
  addEmergencyContact,
  deleteEmergencyContact
};
