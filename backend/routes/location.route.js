import express from "express";
import {
  uploadExamLocation,
  getExamLocationByStudentId,
  getAllExamLocations,
  deleteAllExamLocations,
} from "../controllers/location.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

// Route to upload exam locations
router.post("/upload", upload.single("file"), uploadExamLocation);

// Route to fetch exam location by Student ID
router.get("/", getExamLocationByStudentId);

// Route to fetch all exam locations
router.get("/all", getAllExamLocations);

// Route to delete all exam locations
router.delete("/all", deleteAllExamLocations);

export default router;
