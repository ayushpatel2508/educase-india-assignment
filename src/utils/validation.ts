import { z, ZodError } from "zod";

interface SchoolData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface ListSchoolsParams {
  latitude: number;
  longitude: number;
}

const schoolSchema = z.object({
  name: z
    .string()
    .min(2, "School name must be at least 2 characters")
    .max(255, "School name cannot exceed 255 characters")
    .trim(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address cannot exceed 500 characters")
    .trim(),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

const listSchoolsSchema = z.object({
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

type ValidationResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: ZodError };

const validateSchool = (data: unknown): ValidationResult<SchoolData> => {
  try {
    const validatedData = schoolSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

const validateListSchools = (
  data: unknown
): ValidationResult<ListSchoolsParams> => {
  try {
    const validatedData = listSchoolsSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

export { validateSchool, validateListSchools, SchoolData, ListSchoolsParams };
