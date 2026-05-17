export const validateSchemaMiddleware =
  (schema: any) => (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error);
    }

    next();
  };
