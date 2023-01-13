import { NextFunction, Request, Response } from "express";
import { UserRole } from "../enums/UserRole";

const requireAuthentication = (roleList: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      !req.isAuthenticated() ||
      (req.isAuthenticated() &&
        !Object.values(roleList).includes(req.user.roleType))
    ) {
      // req.flash('error_msg', 'Please log in to view that resource');
      // console.log(req.user)
      // console.log(roleList,req.user.roleTyp)
      return res
        .status(401)
        .json({ message: "Please log in to view that resource" });
    }
    next();
  };
};

const forwardAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};

export { requireAuthentication, forwardAuthenticated };
