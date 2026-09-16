import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { z } from 'zod';

type RequestPart = 'body' | 'query' | 'params';

export function validate(schema: ZodType, part: RequestPart = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: z.treeifyError(result.error),
      });
      return;
    }

    if (part === 'body') {
      req.body = result.data;
    } else {
      Object.defineProperty(req, part, { value: result.data, writable: true });
    }

    next();
  };
}
