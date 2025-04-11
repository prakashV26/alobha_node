const User = require('../models/user');
const Helper = require('../config/helper');
const Task = require('../models/taskManagement'); 


// ======= User ====================================================================
exports.userRegister = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
        result: null
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: "User already exists with this email",
        result: null
      });
    }

    const hashedPassword = await Helper.hashPassword(password);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      result: savedUser
    });

  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error. Please try again.",
      result: null
    });
  }
};
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
        result: null
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        result: null
      });
    }

    const isMatch = await Helper.comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid credentials",
        result: null
      });
    }

    const token = Helper.generateToken(user);

    return res.status(200).json({
      status: true,
      message: "Login successful",
      result: {
        token,
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email
        }
      }
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error. Please try again.",
      result: null
    });
  }
};

// assign role =====================================================================
exports.assignRole = async (req, res) => {
  try {
    const { userId, role, permission } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        status: false,
        message: "userId and role are required",
        result: null
      });
    }

    const validRoles = ['admin', 'user', 'sales', 'manager'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        status: false,
        message: "Invalid role specified",
        result: null
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role,
        ...(permission && { permission })
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        result: null
      });
    }

    return res.status(200).json({
      status: true,
      message: "Role assigned successfully",
      result: updatedUser
    });

  } catch (error) {
    console.error("Assign Role Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error while assigning role",
      result: null
    });
  }
};

// ====== Taskk ====================================================================
exports.addTask = async (req, res) => {
  try {
    const { title, desc, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Title is required",
        result: null
      });
    }

    if (!desc) {
      return res.status(400).json({
        status: false,
        message: "desc is required",
        result: null
      });
    }

    const newTask = new Task({
      user: req.user.id,
      title,
      desc,
      priority,
      dueDate
    });

    const savedTask = await newTask.save();

    return res.status(201).json({
      status: true,
      message: "Task created successfully",
      result: savedTask
    });

  } catch (error) {
    console.error("Add Task Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error while adding task",
      result: null
    });
  }
};
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Tasks fetched successfully",
      result: tasks
    });

  } catch (error) {
    console.error("Get Tasks Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error while fetching tasks",
      result: null
    });
  }
};
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
        result: null
      });
    }

    return res.status(200).json({
      status: true,
      message: "Task fetched successfully",
      result: task
    });

  } catch (error) {
    console.error("Get Task Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error while fetching task",
      result: null
    });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const { title, desc, status, priority, dueDate } = req.body;

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, desc, status, priority, dueDate },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Task not found or not authorized",
        result: null
      });
    }

    return res.status(200).json({
      status: true,
      message: "Task updated successfully",
      result: updated
    });

  } catch (error) {
    console.error("Update Task Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error while updating task",
      result: null
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Task not found or not authorized",
        result: null
      });
    }

    return res.status(200).json({
      status: true,
      message: "Task deleted successfully",
      result: deleted
    });

  } catch (error) {
    console.error("Delete Task Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error while deleting task",
      result: null
    });
  }
};

// Smart Search =============
exports.searchTasks = async (req, res) => {
  try {
    const { search, status, priority, dueDate } = req.query;
    const userId = req.user.id;

    const query = { user: userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (dueDate) {
      query.dueDate = dueDate ;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Tasks fetched successfully",
      result: tasks
    });

  } catch (error) {
    console.error("Search Task Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error while searching tasks",
      result: null
    });
  }
};



