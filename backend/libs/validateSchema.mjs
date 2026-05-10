// middlewares/validateSchema.js
import { ZodError } from "zod";

export const validateSchema =
  ({ body, params, query }) =>
  (req, res, next) => {
    try {
      if (body) body.parse(req.body);
      if (params) params.parse(req.params);
      if (query) query.parse(req.query);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: err.issues[0].message,
          field: err.issues[0].path.join("."),
        });
      }
      next(err);
    }
  };

  