import userModal from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";
import dotenv from "dotenv";
dotenv.config();

// register new user...
const userRegistration = async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  const user = await userModal.findOne({ email: email });
  if (user) {
    res.status(400).json({ status: "failed", message: "Email already exists" });
  } else {
    if (name && email && password && cpassword) {
      if (password === cpassword) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
          const createUser = new userModal({
            name: name,
            email: email,
            password: hashPassword,
          });

          const newUser = await createUser.save();
          // Now generate JWT
          const token = jwt.sign(
            { userID: newUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.status(201).json({ user: newUser, token, status: "successful" });
        } catch (error) {
          res.status(500).json({ message: "Internal server error! try later" });
        }
      } else {
        res
          .status(400)
          .json({ message: "password and confirm password not matched" });
      }
    } else {
      res.status(400).json({ message: "All Fields are required" });
    }
  }
};

//  user login..
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await userModal.findOne({ email: email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          // Now generate JWT
          const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.status(200).json({ user, token, status: "successful" });
        } else {
          res.status(400).json({ message: "invalid email or password" });
        }
      } else {
        res.status(404).json({ message: "You are not registered" });
      }
    } else {
      res.status(400).json({ message: "All Fields are required" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error! try later" });
  }
};

// forget password to send email...
const sendEmailResetPassword = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await userModal.findOne({ email: email });
    if (user) {
      // create otp
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      user.otpCode = otpCode;
      user.otpExpire = Date.now() + 600000;
      console.log(otpCode, "code here otp.....");
      // send email...
      let info = await transporter.sendMail({
        from: "duetaichatbot@gmail.com",
        to: user.email,
        subject: "Password Reset Link",
        html: `<!DOCTYPE html>
        <html>
        <head>
            <title>OTP Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; text-align: center; padding: 20px;">
            <div style="background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #007BFF;">Contract Management System</h1>
                <p style="font-size: 25px; margin: 20px 0;">Confirm Your OTP <strong style="color: #007BFF;">${otpCode}</strong></p>
                <p style="font-size: 16px;">Please enter the OTP code above to complete your verification.</p>
                <p style="font-size: 16px;">If you didn't request this OTP, please ignore this email.</p>
            </div>
        </body>
        </html>
        `,
      });

      // save otp in user schema...
      await user.save();

      res.status(200).json({
        status: "success",
        message: "OTP Sent.. Check Your Email",
        info: info,
      });
    } else {
      res
        .status(404)
        .json({ status: "failed", message: "Email does not exist" });
    }
  } else {
    res.status(500).json({ status: "failed", message: "Email is required" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const otp = req.body.otp;
    const email = req.body.email;

    const findUser = await userModal.findOne({ email: email });

    if (!findUser) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found!" });
    }

    if (findUser.otpExpire < Date.now()) {
      return res.status(400).json({
        status: "failed",
        message: "Your OTP code is expired, resend otp",
      });
    }

    if (findUser.otpCode.toString() === otp.toString()) {
      return res
        .status(200)
        .json({ status: "successful", message: "OTP verified!" });
    }

    res.status(400).json({ status: "failed", message: "Invalid code" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

const userPasswordReset = async (req, res) => {
  try {
    const { password, cpassword, email } = req.body;
    console.log(email, "sdsdf");
    const user = await userModal.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found!" });
    }

    if (password === cpassword) {
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);
      await userModal.findByIdAndUpdate(user._id, {
        $set: { password: newHashPassword },
      });
      res
        .status(200)
        .json({ status: "successful", message: "Password reset successfully" });
    } else {
      res
        .status(400)
        .json({ status: "failed", message: "Passwords do not match" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await userModal.findOne({ email: email });
    if (user) {
      // create otp
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      user.otpCode = otpCode;
      user.otpExpire = Date.now() + 600000;
      console.log(otpCode, "code here otp.....");
      // send email...
      let info = await transporter.sendMail({
        from: "duetaichatbot@gmail.com",
        to: user.email,
        subject: "Password Reset Link",
        html: `<p>Confirm Your OTP ${otpCode}</p>`,
      });

      // save otp in user schema...
      await user.save();

      res.status(200).json({
        status: "success",
        message: "OTP Sent.. Check Your Email",
        info: info,
      });
    } else {
      res
        .status(404)
        .json({ status: "failed", message: "Email does not exist" });
    }
  } else {
    res.status(400).json({ status: "failed", message: "Email is required" });
  }
};


const blockUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const existsUser = await userModal.findById(user_id);
    if (!existsUser) {
      return res.status(404).json({ status: "failed", message: "User not found" });
    }

    existsUser.status = "blocked";
    const blockedUser = await existsUser.save();
    res.status(200).json({ blockedUser, message: "User blocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Internal server error" });
  }
};



const enableUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const existsUser = await userModal.findById(user_id);
    if (!existsUser) {
      return res.status(404).json({ status: "failed", message: "User not found" });
    }

    existsUser.status = "active";
    const blockedUser = await existsUser.save();
    res.status(200).json({ blockedUser, message: "User active successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Internal server error" });
  }
}


export {
  userRegistration,
  userLogin,
  sendEmailResetPassword,
  userPasswordReset,
  verifyOtp,
  resendOtp,
  blockUser,
  enableUser
};
