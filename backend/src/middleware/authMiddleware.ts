import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token as string,
        process.env.JWT_SECRET || ""
      ) as unknown as JwtPayload;

      req.user = await User.findById(
        decoded.id as string
      ).select("-password");

      next();
      return;
    }

    res.status(401).json({
      message: "No token, authorization denied",
    });
  } catch (error) {
    res.status(401).json({
      message: "Token failed",
    });
  }
};
export const authorizeRoles = (
  ...roles: string[]
) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};