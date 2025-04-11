const User = require('../models/user');

const permissionMessages = {
  create: "You do not have permission to create tasks",
  view: "You do not have permission to view this task",
  edit: "You do not have permission to edit tasks",
  delete: "You do not have permission to delete tasks",
  list: "You do not have permission to view task list"
};

module.exports = function (requiredPermission) {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user || !user.permission.includes(requiredPermission)) {
        return res.status(403).json({
          status: false,
          message: permissionMessages[requiredPermission] || "Permission denied",
          result: null
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error.message);
      return res.status(500).json({
        status: false,
        message: "Server error during permission check",
        result: null
      });
    }
  };
};
