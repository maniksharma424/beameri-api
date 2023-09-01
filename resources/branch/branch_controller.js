import Branch from "../branch/branch_model.js";
import User from "../user/user_model.js";
import { randomPasswordGenerator } from "../../util/passwordGenerator.js";
import { cloudinaryConfig } from "../../util/cloudinary.js";
import { sendOTPEmail } from "../../util/sendBlue.js";
import { generateUniqueUserName } from "../../util/auth.js";
import qrcode from "qrcode";
import bcrypt from "bcrypt";

class BranchController {
  // Add a branch by admin
  static addBranchToGym = async (req, res) => {
    try {
      var branchManagerData = req.body.branchManagerData;

      if (!branchManagerData.userType) {
        branchManagerData.userType = ["branchManager"];
      }
      branchManagerData["username"] = await generateUniqueUserName(
        `${branchManagerData.firstName.toLowerCase()}.${branchManagerData.lastName.toLowerCase()}`,
        branchManagerData.firstName,
        branchManagerData.lastName
      );
      console.log("branchManagerData", branchManagerData);
      var password_gen = randomPasswordGenerator();

      const hash = await bcrypt.hash(password_gen, 8);
      branchManagerData.password = hash;

      const branchManager = await User.create(branchManagerData);
      if (!branchManager) {
        return res.status(400).json({
          status: "failed",
          message: "Branch manager not created",
        });
      }

      var branchData = req.body.branchData;
      branchData.branchManagerEmail = branchManager.email;
      // const branch = new Branch(req.body.branchData);
      // const savedBranch = await branch.save();
      var savedBranch = await Branch.create(branchData);
      const url = "https://branch-ai-avatar-j9qn.vercel.app/chat";
      if (!savedBranch) {
        return res.status(400).json({
          status: "failed",
          message: "Branch not created",
        });
      }

      const qrCodeImage = await qrcode.toDataURL(url);
      const uploadResult = await cloudinaryConfig(qrCodeImage, "image");

      if (uploadResult) {
        savedBranch.qrCode = uploadResult.url;
        await savedBranch.save();
      }

      let mailData = `
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to Gold Gym - ${branchManager.firstName}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #444;
      }
      h1 {
        color: #007bff;
      }
      h2 {
        color: #007bff;
      }
      h3 {
        color: #007bff;
      }
      p {
        margin-bottom: 10px;
      }
      .highlight {
        background-color: #ffe5b4;
        padding: 5px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to Gold Gym - ${branchData.name}</h1>
    <p>Dear ${branchManager.firstName} ${branchManager.lastName},</p>
    <p>Welcome to Gold Gym! We are thrilled to have you as our Branch Manager at ${branchData.name} branch. Below are your account details:</p>
    <p><strong>Password:</strong> ${password_gen}</p>
    <p class="highlight">IMPORTANT: For security reasons, we highly recommend that you change your password after your first login.</p>
    <p>Please keep your account details safe and secure. You can use them to log in to our portal and access exclusive branch management features.</p>
    <p>If you have any questions or need assistance, don't hesitate to reach out to our support team at <a href="mailto:${process.env.SENDER_EMAIL}">support@goldgym.com</a>.</p>
    <p>Thank you for joining Gold Gym as our Branch Manager! We are looking forward to working with you to achieve great success together.</p>
    <p>Best regards,</p>
    <p>The Gold Gym Team</p>
  </body>
</html>
`

      const isSent = await sendOTPEmail(
        branchManager.email,
        mailData,
        false
      );
      if (!isSent) {
        return res.status(404).send({
          status: "failed",
          message: "Error sending credentials to email although branch created",
        });
      }

      return res.status(200).json({
        message: "Branch added successfully",
        data: savedBranch,
        status: "success",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "failed", message: "Internal server error" });
    }
  };

  // Get all branches of a gym
  static getBranches = async (req, res) => {
    try {
      var branches = await Branch.find({});
      return res.status(200).json({
        status: "success",
        data: branches,
        message: "Branches found",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "failed", message: "Internal server error" });
    }
  };

  // Get a specific branch of a gym by ID
  static getBranchById = async (req, res) => {
    try {
      const { branchId } = req.params;

      const branch = await Branch.findById(branchId);

      if (!branch) {
        return res
          .status(404)
          .json({ status: "failed", message: "Branch not found" });
      }

      return res
        .status(200)
        .json({ data: branch, status: "success", message: "Branch found" });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "failed", message: "Internal server error" });
    }
  };

  // Update a branch of a gym
  static updateBranch = async (req, res) => {
    try {
      const { branchId } = req.params;
      const { name } = req.body;

      var branch = await Branch.findById(branchId);

      if (!branch) {
        return res
          .status(404)
          .json({ status: "failed", message: "Branch not found" });
      }

      branch.name = name;

      const updatedBranch = await branch.save();

      return res.status(200).json({
        message: "Branch updated successfully",
        data: updatedBranch,
        status: "success",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "failed", message: "Internal server error" });
    }
  };

  // Delete a branch of a gym
  static deleteBranch = async (req, res) => {
    try {
      const { branchId } = req.params;

      const branch = await Branch.findById(branchId);

      if (!branch) {
        return res
          .status(404)
          .json({ status: "failed", message: "Branch not found" });
      }

      await Branch.findByIdAndDelete(branchId);

      return res
        .status(200)
        .json({ status: "success", message: "Branch deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "failed", message: "Internal server error" });
    }
  };

  // Get branch ID of a branch manager

  static getBranchId = async (req, res) => {
    try {
      const { email } = req.user.email;

      const branch = await Branch.findOne({ branchManagerEmail: email });

      if (!branch) {
        return res
          .status(404)
          .json({ status: "failed", message: "Branch not found" });
      }

      return res.status(200).json({
        status: "success",
        data: branch._id,
        message: "Branch found",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "failed", message: "Internal server error" });
    }
  };
}

export default BranchController;
