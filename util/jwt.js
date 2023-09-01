import jwt from "jsonwebtoken";
import { SECRETS } from "./config.js";
import User from "../resources/user/user_model.js";

export const newToken = (user) => {
  return jwt.sign({ id: user._id }, SECRETS.jwt, {
    expiresIn: SECRETS.jwtExp,
  });
};

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, SECRETS.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

export const checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];

      const userId = jwt.verify(token, process.env.JWT_SECRET).id;

      req.user = await User.findById(userId).select("-password");
      if (!req.user) {
        return res
          .status(404)
          .send({
            status: "failed",
            message: "User not found or Invalid token",
          });
      }
      next();
    } catch (error) {
      res.status(401).send({ status: "failed", message: "Unauthorized User" });
    }
  }
  if (!token) {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized User No Token" });
  }
};
