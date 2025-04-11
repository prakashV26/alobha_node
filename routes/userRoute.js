const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const verifyToken = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');
// ========= user ========================================================
router.post('/user_register', UserController.userRegister);
router.post('/user_login', UserController.userLogin);

// assign role =========================================================
router.put('/assign_role', verifyToken, UserController.assignRole);


// ==== task ===============================================================
router.post('/add_task', verifyToken,checkPermission('create'), UserController.addTask);
router.get('/view_task', verifyToken,checkPermission('list'), UserController.getTasks);
router.get('/view_taskbyId/:id', verifyToken,checkPermission('view'), UserController.getTaskById);
router.put('/update_task/:id', verifyToken, checkPermission('edit'), UserController.updateTask);
router.delete('/delete_task/:id', verifyToken, checkPermission('delete'), UserController.deleteTask);

// smart search 
router.get('/smart_search', verifyToken, UserController.searchTasks);


module.exports = router ; 