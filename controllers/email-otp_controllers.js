const nodeMailer = require("nodemailer");
const otpModel = require("../schema/OTP_schema");
const userModel = require("../schema/User_schema");

const transporter = nodeMailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

// const email_transporter =async (email, otp) => {

// const mailOptions = {
//     from: 'NewslyDigial@gmail.com',
//     to: email,
//     subject: "sending otp for verification",
//     text: `OTP:${otp}`
// }
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         console.log("sending email interupted is__", error)
//         return res.send({
//             message: "email sending was unsuccessful due to an error",
//             success: false
//         })
//     } else {
//         console.log("email sent", info.response)
//         return res.send({
//             message: "email sent successfully",
//             success: true
//         })
//     }
// })
//return Email_response
//}

//send otp...
exports.send_OTP = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const existingEmail = await userModel.findOne({ email });
    if(existingEmail){return res.json({message:"Email already exist",success:false})}
    
    //todo ____generating OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const previousOtp = await otpModel.findOne({ email });
    if (previousOtp) {
      const updateData = await otpModel.findOneAndUpdate(
        { email },
        { OTP: otp },
        { new: true }
      );
      await updateData.save();

      //todo _____ sending email
      // email_transporter(email, otp)

      const mailOptions = {
        from: "NewslyDigial@gmail.com",
        to: email,
        subject: "sending otp for verification",
        text: `OTP:${otp}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("sending email interupted is__", error);
          return res.send({
            message: "email sending was unsuccessful due to an error",
            success: false,
          });
        } else {
          console.log("email sent", info.response);
          return res.send({
            message: "email sent successfully",
            success: true,
          });
        }
      });
    } else {
      const newUserOtp = new otpModel({
        email,
        OTP: otp,
      });
      await newUserOtp.save();

      //todo _____ sending email
      // email_transporter(email,otp)
      const mailOptions = {
        from: "NewslyDigial@gmail.com",
        to: email,
        subject: "sending otp for verification",
        text: `OTP:${otp}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("sending email interupted is__", error);
          return res.send({
            message: "email sending was unsuccessful due to an error",
            success: false,
          });
        } else {
          console.log("email sent", info.response);
          return res.send({
            message: "email sent successfully",
            success: true,
          });
        }
      });
    }
  } catch (error) {
    console.log("catch bloack active due to__", error);
    return res.json(`catch bloack active due to__${error}`);
  }
};

//verify otp...
exports.verify_OTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.send({ message: "please enter your otp" });
  }
  try {
    const otpVerification = await otpModel.findOne({ email });
    if (!otpVerification) {
      return res.json({
        message: "Email not found",
        success: false,
      });
    }
    if (otpVerification.OTP == otp) {
      return res.json({
        message: "otp verification successful",
        success: true,
      });
    } else {
      return res.json({
        message: "invalid otp",
        success: false,
      });
    }
  } catch (error) {
    console.log("catch bloack active due to__", error);
    return res.json(`catch bloack active due to__${error}`);
  }
};
