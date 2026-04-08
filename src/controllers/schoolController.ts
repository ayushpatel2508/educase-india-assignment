import { Request, Response } from "express";
import pool from "../db/connection";
import {
  validateSchool,
  validateListSchools,
  SchoolData,
} from "../utils/validation";
import { calculateDistance } from "../utils/distance";

interface School extends SchoolData {
  id: number;
  created_at: string;
  updated_at: string;
}

interface SchoolWithDistance extends School {
  distance: number;
}

interface PgError extends Error {
  code?: string;
}

/**
 * Add a new school to the database
 * @route POST /api/schools/add
 */
export const addSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validate input
    const validation = validateSchool({
      name,
      address,
      latitude: Number(latitude),
      longitude: Number(longitude),
    });

    if (!validation.success) {
      const errorMessages =
        validation.error?.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })) || [];
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorMessages,
      });
      return;
    }

    const value = validation.data;

    // Insert school into database
    const query: string =
      "INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *";
    const result = await pool.query(query, [
      value.name,
      value.address,
      value.latitude,
      value.longitude,
    ]);

    res.status(201).json({
      success: true,
      message: "School added successfully",
      data: result.rows[0],
    });
  } catch (error) {
    const err = error as PgError;
    if (err.code === "23505") {
      res.status(409).json({
        success: false,
        message: "School with same name and address already exists",
      });
      return;
    }
    console.error("Error adding school:", err);
    res.status(500).json({
      success: false,
      message: "Error adding school",
      error: err.message,
    });
  }
};

/**
 * Get all schools sorted by proximity to user location
 * @route GET /api/schools/list
 */
export const listSchools = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { latitude, longitude } = req.query;

    // Validate query parameters
    const validation = validateListSchools({
      latitude: Number(latitude),
      longitude: Number(longitude),
    });

    if (!validation.success) {
      const errorMessages =
        validation.error?.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })) || [];
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorMessages,
      });
      return;
    }

    const value = validation.data;

    // Fetch all schools from database
    const query: string = "SELECT * FROM schools ORDER BY id DESC";
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      res.status(200).json({
        success: true,
        message: "No schools found",
        data: [],
      });
      return;
    }

    // Calculate distance for each school and sort by proximity
    const schoolsWithDistance: SchoolWithDistance[] = result.rows.map(
      (school: School) => ({
        ...school,
        distance: calculateDistance(
          value.latitude,
          value.longitude,
          school.latitude,
          school.longitude
        ),
      })
    );

    // Sort by distance (nearest first)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      message: "Schools retrieved and sorted by proximity",
      count: schoolsWithDistance.length,
      userLocation: {
        latitude: value.latitude,
        longitude: value.longitude,
      },
      data: schoolsWithDistance,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Error listing schools:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving schools",
      error: err.message,
    });
  }
};

/**
 * Get a single school by ID
 * @route GET /api/schools/:id
 */
export const getSchoolById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        success: false,
        message: "Invalid school ID",
      });
      return;
    }

    const query: string = "SELECT * FROM schools WHERE id = $1";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "School not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "School retrieved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    const err = error as Error;
    console.error("Error fetching school:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving school",
      error: err.message,
    });
  }
};

/**
 * Update a school
 * @route PUT /api/schools/:id
 */
export const updateSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, address, latitude, longitude } = req.body;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        success: false,
        message: "Invalid school ID",
      });
      return;
    }

    // Validate input
    const validation = validateSchool({
      name,
      address,
      latitude: Number(latitude),
      longitude: Number(longitude),
    });

    if (!validation.success) {
      const errorMessages =
        validation.error?.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })) || [];
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorMessages,
      });
      return;
    }

    const value = validation.data;

    const query: string =
      "UPDATE schools SET name = $1, address = $2, latitude = $3, longitude = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *";
    const result = await pool.query(query, [
      value.name,
      value.address,
      value.latitude,
      value.longitude,
      id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "School not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "School updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    const err = error as PgError;
    console.error("Error updating school:", err);
    res.status(500).json({
      success: false,
      message: "Error updating school",
      error: err.message,
    });
  }
};

/**
 * Delete a school
 * @route DELETE /api/schools/:id
 */
export const deleteSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        success: false,
        message: "Invalid school ID",
      });
      return;
    }

    const query: string = "DELETE FROM schools WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "School not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "School deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    const err = error as Error;
    console.error("Error deleting school:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting school",
      error: err.message,
    });
  }
};
