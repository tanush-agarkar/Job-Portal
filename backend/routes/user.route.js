import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  deleteAllUsers,
  getAllUsers,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);

// Route to delete all users
router.delete("/all", deleteAllUsers);

// Route to fetch all users
router.get("/all", getAllUsers);

export default router;
