const express = require('express');
const { 
    userRegisterCtrl,
    userLoginCtrl,
    userListCtrl,
    userDeleteCtrl,
    fetchUserDetailCtrl,
    fetchUserProfileCtrl,
    updateUserCtrl,
    updatePasswordCtrl,
    blockUserCtrl,
    unBlockUserCtrl,
    generateVerificationTokenCtrl,
    accountVerificationCtrl,
    forgetPasswordCtrl,
    passwordResetCtrl,
    photoUploadCtrl
} = require('../../controllers/users/usersCtrl');
const authMiddleware = require('../../middlewares/auth/auth')
const { profilePhotoUpload, profilePhotoResize } = require('../../middlewares/uploads/profilePhotoUpload')
const userRoutes = express.Router();

userRoutes.post('/register', userRegisterCtrl);
userRoutes.post("/login", userLoginCtrl);
userRoutes.post(
    "/profile-photo-upload",
    authMiddleware,
    profilePhotoUpload.single("Image"),
    profilePhotoResize,
    photoUploadCtrl
);
userRoutes.put("/unblock-user/:id", authMiddleware, unBlockUserCtrl);
userRoutes.post("/generate-verify-email-token", authMiddleware, generateVerificationTokenCtrl);
userRoutes.put("/verify-account", authMiddleware, accountVerificationCtrl);
userRoutes.post("/forget-password-token", forgetPasswordCtrl);
userRoutes.put("/reset-password", passwordResetCtrl);
userRoutes.get("/profile/:id", authMiddleware, fetchUserProfileCtrl);
userRoutes.put("/password/:id", authMiddleware, updatePasswordCtrl);
userRoutes.put("/block-user/:id", authMiddleware, blockUserCtrl);
userRoutes.delete("/:id", userDeleteCtrl);
userRoutes.get("/:id", fetchUserDetailCtrl);
userRoutes.put("/:id", authMiddleware, updateUserCtrl);
userRoutes.get("/", authMiddleware, userListCtrl);

module.exports = userRoutes;