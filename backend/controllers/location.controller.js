import { ExamLocation } from "../models/examLocation.model.js";
import multer from "multer";
import xlsx from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const upload = multer({ dest: path.join(__dirname, "../uploads") });

// Upload and process Excel file
export const uploadExamLocation = async (req, res) => {
  try {
    // Validate file
    if (!req.file) {
      return res.status(400).json({
        message: "File is missing.",
        success: false,
      });
    }

    // Delete all existing data in the ExamLocation collection
    await ExamLocation.deleteMany();

    // Read the uploaded Excel file
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Map and save data to MongoDB
    const bulkOperations = sheetData.map((row) => ({
      updateOne: {
        filter: { studentId: row["Student ID"] }, // Match by studentId
        update: {
          $set: {
            studentName: row["Student Name"],
            branch: row["Branch"],
            location: row["Location"],
          },
        },
        upsert: true, // Insert if not found
      },
    }));

    // Perform bulk write operation
    const result = await ExamLocation.bulkWrite(bulkOperations);

    // Delete the uploaded file after processing
    fs.unlinkSync(filePath);

    return res.status(201).json({
      message: "Exam locations uploaded successfully.",
      success: true,
      result,
    });
  } catch (error) {
    console.error("Error uploading exam locations:", error);
    return res.status(500).json({
      message: "Something went wrong.",
      success: false,
    });
  }
};

// Fetch exam location for a specific student
export const getExamLocationByStudentId = async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID is required.",
        success: false,
      });
    }

    const examLocation = await ExamLocation.findOne({ studentId });

    if (!examLocation) {
      return res.status(404).json({
        message: "No exam location found for the given Student ID.",
        success: false,
      });
    }

    return res.status(200).json({
      examLocation,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching exam location:", error);
    return res.status(500).json({
      message: "Something went wrong.",
      success: false,
    });
  }
};

// Fetch all exam locations for all students
export const getAllExamLocations = async (req, res) => {
  try {
    const examLocations = await ExamLocation.find();

    if (!examLocations || examLocations.length === 0) {
      return res.status(404).json({
        message: "No exam locations found.",
        success: false,
      });
    }

    return res.status(200).json({
      examLocations,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching all exam locations:", error);
    return res.status(500).json({
      message: "Something went wrong.",
      success: false,
    });
  }
};

// Delete all exam locations
export const deleteAllExamLocations = async (req, res) => {
  try {
    const result = await ExamLocation.deleteMany(); // Deletes all documents in the collection

    return res.status(200).json({
      message: "All exam locations have been deleted successfully.",
      deletedCount: result.deletedCount, // Number of deleted documents
      success: true,
    });
  } catch (error) {
    console.error("Error deleting all exam locations:", error);
    return res.status(500).json({
      message: "Something went wrong while deleting exam locations.",
      success: false,
    });
  }
};
