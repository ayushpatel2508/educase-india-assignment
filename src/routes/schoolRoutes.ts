import { Router } from "express";
import {
  addSchool,
  listSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
} from "../controllers/schoolController";

const router: Router = Router();

// Add a new school
router.post("/add", addSchool);

// Get all schools sorted by proximity (with user coordinates as query params)
router.get("/list", listSchools);

// Get a specific school by ID
router.get("/:id", getSchoolById);

// Update a school
router.put("/:id", updateSchool);

// Delete a school
router.delete("/:id", deleteSchool);

export default router;
