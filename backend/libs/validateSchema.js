// middlewares/validateSchema.js
import { ZodError } from "zod";

export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // validate body
    next(); // proceed if valid
  } catch (err) {
    if (err instanceof ZodError) {
      const issues = err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: issues[0].message,
      });
    }
    next(err);
  }
};
