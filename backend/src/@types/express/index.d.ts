/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: { id: Types.ObjectId };
    }
  }
}
