import Branch from "../branch/branch_model.js";
import User from "./user_model.js";
import Member from "../member/member_model.js";
import Article from "../article/article_model.js";
import Exercise from "../exercise/exercise_model.js";
import { randomPasswordGenerator } from "../../util/passwordGenerator.js";
import { sendOTPEmail } from "../../util/sendBlue.js";
import bcrypt from "bcrypt";
import { generateUniqueUserName } from "../../util/auth.js";
import Audio from "../audio/audio_model.js";
import Avatar from "../avatar/avatar_model.js";

class UserController {
  // update user
  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
        new: true,
      });
      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      }

      await user.save();
      return res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: user,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "failed",
        message: "Server Error",
      });
    }
  }

  static async fetchUser(req, res) {
    try {
      const { userId, email } = req.body;
      const user = await User.findOne({
        $or: [{ _id: userId }, { email: email }],
      });
      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "User found",
        data: user,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "failed",
        message: "Server Error",
        error: err.message,
      });
    }
  }
  static async dashboardDetails(req, res) {
    try {
      const users = await User.find();
      const branch = await Branch.find();
      const articles = await Article.find();
      const members = await Member.find();
      const exercises = await Exercise.find();
      const voices = await Audio.find();
      const avatar = await Avatar.find();

      return res.status(200).json({
        status: "success",
        message: "Dashboard data found",
        data: {
          userCount: users.length,
          branchCount: branch.length,
          articleCount: articles.length,
          memberCount: members.length,
          exerciseCount: exercises.length,
          voiceCount: voices.length,
          avatarCount: avatar.length,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: "Server Error",
        error: err.message,
      });
    }
  }

  static createUserByAdmin = async (req, res) => {
    try {
      var userData = req.body;
      if (!userData.email) {
        return res.status(401).send({
          message: "Required fields missing",
        });
      }

      const checkUser = await User.findOne({ email: userData.email });
      if (checkUser)
        return res
          .status(401)
          .send({ status: "failed", message: "Email is already in use" });

      userData["username"] = await generateUniqueUserName(
        `${userData.firstName.toLowerCase()}.${userData.lastName.toLowerCase()}`,
        userData.firstName,
        userData.lastName
      );
      console.log("userData", userData);
      var password_gen = randomPasswordGenerator();

      const hash = await bcrypt.hash(password_gen, 8);
      userData.password = hash;

      const user = await User.create(userData);
      if (!user) {
        return res.status(400).json({
          status: "failed",
          message: "User not created",
        });
      }

      let mailData = `
      <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to Gold Gym - ${user.firstName}</title>
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
    <h1>Welcome to Gold Gym</h1>
    <p>Dear ${user.firstName} ${user.lastName},</p>
    <p>Welcome to Gold Gym! We are excited to have you as a new member of our fitness community. Below are your account details:</p>
    <p><strong>Password:</strong> ${password_gen}</p>
    <p class="highlight">IMPORTANT: For your security, we highly recommend that you change your password after your first login.</p>
    <p>Please keep your account details safe and secure. You can use them to log in to our website and access exclusive gym features.</p>
    <p>If you have any questions or need assistance, don't hesitate to reach out to our support team at <a href="mailto:${process.env.SENDER_EMAIL}">support@goldgym.com</a>.</p>
    <p>Thank you for choosing Gold Gym! We look forward to seeing you achieve your fitness goals with us.</p>
    <p>Best regards,</p>
    <p>The Gold Gym Team</p>
  </body>
</html>
`;

      const isSent = await sendOTPEmail(userData.email, mailData, false);
      if (!isSent) {
        return res.status(404).send({
          status: "failed",
          message: "Error sending credentials to email although branch created",
        });
      }

      return res.status(200).json({
        message: "User added successfully",
        status: "success",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "failed", message: "Internal server error" });
    }
  };
}

export default UserController;
