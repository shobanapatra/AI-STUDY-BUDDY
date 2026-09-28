const User = require('../models/User');
const Material = require('../models/Material');

// Get system analytics/stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMaterials = await Material.countDocuments();

    res.json({
      totalUsers,
      totalMaterials,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all registered users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Prevent an admin from deleting their own account
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        message: 'You cannot delete your own admin account',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};