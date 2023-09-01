import { newToken } from "./jwt.js";
import OTP from "../resources/otp/otp_model.js";
import { sendOTPEmail } from "./sendBlue.js";
import bcrypt from "bcrypt";
import User from "../resources/user/user_model.js";
import Branch from "../resources/branch/branch_model.js";
import md5 from "md5";
const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export const generateUniqueUserName = async (
  proposedName,
  firstName,
  lastName
) => {
  const doc = await User.findOne({ username: proposedName });
  if (doc) {
    const name = `${proposedName}.${md5([
      firstName,
      lastName,
      Date.now(),
    ]).slice(0, 5)}`;
    console.log("GENERATING NEW USERNAME", name);
    return await generateUniqueUserName(name, firstName, lastName);
  }
  console.log(proposedName, firstName, lastName);
  return proposedName;
};

class AuthUserServices {
  static forgotPassOtp = async (req, res) => {
    const Model = req.model;

    if (!req.body.email) {
      return res.status(400).send({
        message: "Required fields missing",
      });
    }
    const user = await Model.findOne({ email: req.body.email });

    if (!user)
      return res
        .status(200)
        .send({ status: "failed", message: "User not found" });
    else {
      try {
        const otp = generateOTP();
        const email = req.body.email;
        const isSent = await sendOTPEmail(email, { otp: otp }, true);
        if (!isSent) {
          return res.status(404).send({
            status: "failed",
            message: "Error sending OTP email",
          });
        }
        var otpData = await OTP.findOne({ email: email });

        if (otpData) {
          await OTP.findOneAndUpdate(
            { email: email },
            { otp: otp, verified: false },
            { new: true }
          );
        } else {
          otpData = await OTP.create({
            email,
            otp,
          });
        }

        return res
          .status(201)
          .send({ status: "ok", message: "OTP sent successfully" });
      } catch (e) {
        return res.status(500).send({ status: "failed", message: e.message });
      }
    }
  };

  static updatePassword = async (req, res) => {
    const Modal = req.model;
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    try {
      const hash = await bcrypt.hash(newPassword, 8);
      await Modal.findOneAndUpdate(
        req.user._id,
        { password: hash },
        { new: true }
      );

      res.status(200).send({
        status: "ok",
        message: "New password generated successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "failed", message: "error.message" });
    }
  };
  static signup = async (req, res) => {
    const Model = req.model;
    if (!req.body.email || !req.body.password) {
      return res.status(401).send({
        message: "Required fields missing",
      });
    }

    const user = await Model.findOne({ email: req.body.email });
    if (user)
      return res
        .status(401)
        .send({ status: "failed", message: "Email is already in use" });
    else {
      try {
        var userData = req.body;
        if (req.body.userType === "admin") {
          userData.rights = {
            read: true,
            create: true,
            update: true,
            delete: true,
          };
        }
        userData["username"] = await generateUniqueUserName(
          `${userData.firstName.toLowerCase()}.${userData.lastName.toLowerCase()}`,
          userData.firstName,
          userData.lastName
        );

        const hash = await bcrypt.hash(userData.password, 8);
        userData.password = hash;
        const user = await Model.create(userData);

        // const emailTemplate=await Email.findOne({"title":"When a new user registers"})
        // EmailService(user,emailTemplate.content,emailTemplate.subject)
        // send_email("Pop_Welcome", user);

        return res.status(201).send({ status: "ok", data: user });
      } catch (e) {
        return res
          .status(500)
          .send({ status: "Error Communicating with server" });
      }
    }
  };
  static signin = async (req, res) => {
    const Model = req.model;

    if (!req.body.email || !req.body.password)
      return res.status(401).send({ message: "Email and password required" });
    const user = await Model.findOne({
      email: req.body.email,
      userType: { $all: req.body.userType },
    }).exec();
    if (!user) {
      return res.status(401).send({
        status: "failed",
        message: "Email not registered with this previlage",
      });
    }

    try {
      console.log("user", user);
      const match = await user.checkPassword(req.body.password);
      console.log("match", match);
      if (!match) {
        return res
          .status(401)
          .send({ status: "failed", message: "Invalid Email or Password" });
      }
      var data = {
        userData: user,
      };
      if (user.userType.includes("branchManager")) {
        const branch = await Branch.findOne({ branchManagerEmail: user.email });
        data.branchData = branch;
      }
      const token = newToken(user);

      return res.status(201).send({ status: "ok", token: token, data: data });
    } catch (e) {
      console.error(e);
      return res.status(401).send({ message: "Not Authorized" });
    }
  };

  static verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).send({
        status: "failed",
        message: "Required fields missing",
      });
    }
    try {
      const otpData = await OTP.findOne({ email: email });
      if (!otpData) {
        return res.status(404).send({
          status: "failed",
          message: "OTP not found",
        });
      }
      if (otpData.otp !== otp) {
        return res.status(404).send({
          status: "failed",
          message: "Invalid OTP",
        });
      }
      otpData.verified = true;
      otpData.save();
      return res.status(200).send({
        status: "ok",
        message: "OTP verified successfully",
      });
    } catch (e) {
      return res.status(500).send({ status: "failed", message: e.message });
    }
  };

  static changePasswordOtp = async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).send({
        status: "failed",
        message: "Required fields missing",
      });
    }
    try {
      const otpData = await OTP.findOne({ email });
      if (!otpData) {
        return res.status(404).send({
          status: "failed",
          message: "OTP not found",
        });
      }
      if (!otpData.verified) {
        return res.status(404).send({
          status: "failed",
          message: "OTP not verified",
        });
      }
      const hash = await bcrypt.hash(newPassword, 8);

      var user = await User.findOneAndUpdate({ email }, { password: hash });
      if (!user) {
        return res.status(404).send({
          status: "failed",
          message: "User not found",
        });
      }
      await OTP.findOneAndDelete({ email });
      return res.status(200).send({
        status: "ok",
        message: "Password changed successfully",
      });
    } catch (e) {
      return res.status(500).send({ status: "failed", message: e.message });
    }
  };
}
export default AuthUserServices;
