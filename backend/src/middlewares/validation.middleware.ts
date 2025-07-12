import { Request, Response, NextFunction } from 'express';
import { ValidationError, validationResult } from 'express-validator';

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const errorMessages = errors.array()
      .map((err: ValidationError) => err.msg);
    
    res.status(400).json({ errors: errorMessages });
  };
};