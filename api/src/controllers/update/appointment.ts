import { Request, Response } from "express";
import { supabase } from "../../db/db_config";
import { z } from "zod";

// Validation schema for update data
const appointmentUpdateSchema = z.object({
  name: z.string().min(5).max(255).optional(),
  description: z.string().min(5).max(255).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
  status: z.string().min(3).max(255).optional(),
  doctor_id: z.number().positive().optional(),
  patient_id: z.number().positive().optional(),
});

/**
 * Update Appointment
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate request body
    const validation = appointmentUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => issue.message);
      res.status(400).json({ errors });
      return;
    }

    const updateData = validation.data;

    // Check if the appointment exists
    const { data: existingAppointment, error: checkError } = await supabase
      .from("appointments")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existingAppointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    // Update appointment in the database
    const { error: updateError } = await supabase
      .from("appointments")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating appointment:", updateError.message);
      res.status(500).json({ error: "An error occurred while updating the appointment" });
      return;
    }

    // Successful update
    res.status(200).json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
};
