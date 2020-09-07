/*
SERVICE TYPES:
  1: Welcome Email
  2: Password Reset Request
  3: Password Reset Acknowledgement
  4: Password Change Acknowledgement
  5: Email Verification
  6: Email Verification Acknowledgement
*/
const nodemailer = require('nodemailer');

module.exports = (req,res,next) => {
  let htmlContent;
  const emailServiceData = req.emailServiceData;
  console.log('emailServiceData',emailServiceData);
  switch(emailServiceData.serviceType) {
    case 1:
      htmlContent = `
                    <!DOCTYPE html>
                    <html lang="en">

                    <head>
                      <style>
                        .container {
                          width: 500px;
                          margin: auto;
                          margin-top: 10px;
                          border-style: solid;
                          border-color: #673ab7;
                          border-width: 5px;
                          border-radius: 5px;
                        }

                        body {
                          margin: 0;
                          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                          font-size: 1rem;
                          font-weight: 400;
                          line-height: 1.5;
                          color: #212529;
                          text-align: left;
                          background-color: #fff;
                        }

                        .panel-title {
                          margin: 0 15px;
                          color: white;
                          padding: 20px 20px;
                          background-color: #673ab7;
                        }

                        .panel-body,
                        .panel-heading {
                          padding: 15px;
                        }

                        h3 {
                          border-radius: 5px;
                          font: sans-serif;
                        }

                        p {
                          font: 20px sans-serif;
                        }

                        @media only screen and (max-width: 600px) {
                          .container {
                            max-width: 300px;
                          }

                          p {
                            font: 16px sans-serif;
                          }
                        }
                      </style>
                    </head>

                    <body>
                      <div class="container">
                        <div class="panel panel-default">
                          <div class="panel-heading">
                            <h3 class="panel-title">Locationist</h3>
                          </div>
                          <hr>
                          <div class="panel-body">
                            <p>Hi ${emailServiceData.userName},</p>
                            <p>We Welcome you to Locationist.</p>
                            <p>Have a great time here!!</p>
                          </div>
                        </div>
                      </div>
                    </body>

                    </html>`
      break;

    case 2:
      htmlContent = `
                    <!DOCTYPE html>
                    <html lang="en">

                    <head>
                      <style>
                        .container {
                          width: 500px;
                          margin: auto;
                          margin-top: 10px;
                          border-style: solid;
                          border-color: #673ab7;
                          border-width: 5px;
                          border-radius: 5px;
                        }

                        .btn {
                          display: block;
                          margin: auto;
                          width: 35%;
                          text-decoration: none;
                          color: white;
                          background-color: #673ab7;
                          border: solid #673ab7;
                          border-width: 10px 20px;
                          line-height: 2;
                          font-weight: bold;
                          text-align: center;
                          cursor: pointer;
                          border-radius: 5px;
                          text-transform: capitalize;
                        }

                        body {
                          margin: 0;
                          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                          font-size: 1rem;
                          font-weight: 400;
                          line-height: 1.5;
                          color: #212529;
                          text-align: left;
                          background-color: #fff;
                        }

                        .panel-title {
                          margin: 0 15px;
                          color: white;
                          padding: 20px 20px;
                          background-color: #673ab7;
                        }

                        .panel-body,
                        .panel-heading {
                          padding: 15px;
                        }

                        h3 {
                          border-radius: 5px;
                          font: sans-serif;
                        }

                        p {
                          font: 20px sans-serif;
                        }

                        @media only screen and (max-width: 600px) {
                          .container {
                            max-width: 300px;
                          }

                          p {
                            font: 16px sans-serif;
                          }
                        }
                      </style>
                    </head>

                    <body>
                      <div class="container">
                        <div class="panel panel-default">
                          <div class="panel-heading">
                            <h3 class="panel-title">Locationist</h3>
                          </div>
                          <hr>
                          <div class="panel-body">
                            <p>Hi ${emailServiceData.userName}, </p>
                            <p>This email is regarding your password reset request</p>
                            <p>Please click on the button below to reset your password</p>
                            <p>Note:<br>This link is only valid for <strong>24 hrs</strong>.<br><br> After the time limit you have to submit
                              a new request to reset your password.</p>
                            <a href="${emailServiceData.resetPasswordUrl}" class="btn" style="color: white;">Change Password</a>
                          </div>
                        </div>
                      </div>
                    </body>

                    </html>`
      break;

    case 3:
      htmlContent = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <style>
                        .container {
                          width: 500px;
                          margin: auto;
                          margin-top: 10px;
                          border-style: solid;
                          border-color: #673ab7;
                          border-width: 5px;
                          border-radius: 5px;
                        }

                        body {
                          margin: 0;
                          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                          font-size: 1rem;
                          font-weight: 400;
                          line-height: 1.5;
                          color: #212529;
                          text-align: left;
                          background-color: #fff;
                        }

                        .panel-title {
                          margin: 0 15px;
                          color: white;
                          padding: 20px 20px;
                          background-color: #673ab7;
                        }

                        .panel-body,
                        .panel-heading {
                          padding: 15px;
                        }

                        h3 {
                          border-radius: 5px;
                          font: sans-serif;
                        }

                        p {
                          font: 20px sans-serif;
                        }

                        @media only screen and (max-width: 600px) {
                          .container {
                            max-width: 300px;
                          }

                          p {
                            font: 16px sans-serif;
                          }
                        }
                      </style>
                    </head>

                    <body>
                      <div class="container">
                        <div class="panel panel-default">
                          <div class="panel-heading">
                            <h3 class="panel-title">Locationist</h3>
                          </div>
                          <hr>
                          <div class="panel-body">
                            <p>Hi ${emailServiceData.userName},</p>
                            <p>This mail is regarding to your reset password request's response</p>
                            <p>You have successfully reset your password.</p>
                          </div>
                        </div>
                      </div>
                    </body>

                    </html>`
      break;

    case 4:
      htmlContent = `
                    <!DOCTYPE html>
                    <html lang="en">

                    <head>
                      <style>
                        .container {
                          width: 500px;
                          margin: auto;
                          margin-top: 10px;
                          border-style: solid;
                          border-color: #673ab7;
                          border-width: 5px;
                          border-radius: 5px;
                        }

                        body {
                          margin: 0;
                          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                          font-size: 1rem;
                          font-weight: 400;
                          line-height: 1.5;
                          color: #212529;
                          text-align: left;
                          background-color: #fff;
                        }

                        .panel-title {
                          margin: 0 15px;
                          color: white;
                          padding: 20px 20px;
                          background-color: #673ab7;
                        }

                        .panel-body,
                        .panel-heading {
                          padding: 15px;
                        }

                        h3 {
                          border-radius: 5px;
                          font: sans-serif;
                        }

                        p {
                          font: 20px sans-serif;
                        }

                        @media only screen and (max-width: 600px) {
                          .container {
                            max-width: 300px;
                          }

                          p {
                            font: 16px sans-serif;
                          }
                        }
                      </style>
                    </head>

                    <body>
                      <div class="container">
                        <div class="panel panel-default">
                          <div class="panel-heading">
                            <h3 class="panel-title">Locationist</h3>
                          </div>
                          <hr>
                          <div class="panel-body">
                            <p>Hi ${emailServiceData.userName},</p>
                            <p>This mail is regarding the changes made to your account.</p>
                            <p>You have successfully changed your password.</p>
                          </div>
                        </div>
                      </div>
                    </body>

                    </html>`
      break;

    case 5:
      htmlContent = `
                    <!DOCTYPE html>
                    <html lang="en">

                      <head>
                      <style>
                        .container {
                          width: 500px;
                          margin: auto;
                          margin-top: 10px;
                          border-style: solid;
                          border-color: #673ab7;
                          border-width: 5px;
                          border-radius: 5px;
                        }

                        .btn {
                          display: block;
                          margin: auto;
                          width: 35%;
                          text-decoration: none;
                          color: white;
                          background-color: #673ab7;
                          border: solid #673ab7;
                          border-width: 10px 20px;
                          line-height: 2;
                          font-weight: bold;
                          text-align: center;
                          cursor: pointer;
                          border-radius: 5px;
                          text-transform: capitalize;
                        }

                        body {
                          margin: 0;
                          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                          font-size: 1rem;
                          font-weight: 400;
                          line-height: 1.5;
                          color: #212529;
                          text-align: left;
                          background-color: #fff;
                        }

                        .panel-title {
                          margin: 0 15px;
                          color: white;
                          padding: 20px 20px;
                          background-color: #673ab7;
                        }

                        .panel-body,
                        .panel-heading {
                          padding: 15px;
                        }

                        h3 {
                          border-radius: 5px;
                          font: sans-serif;
                        }

                        p {
                          font: 20px sans-serif;
                        }

                        @media only screen and (max-width: 600px) {
                          .container {
                            max-width: 300px;
                          }

                          p {
                            font: 16px sans-serif;
                          }
                        }
                      </style>
                    </head>

                    <body>
                      <div class="container">
                        <div class="panel panel-default">
                          <div class="panel-heading">
                            <h3 class="panel-title">Locationist</h3>
                          </div>
                          <hr>
                          <div class="panel-body">
                            <p>Hi ${emailServiceData.userName},</p>
                            <p>Please Click on the button below to verify your Locationist Account</p>
                            <p>Note:<br>This link is only valid for <strong>24 hrs</strong>.<br><br> After the time limit you have to submit
                              a new request to verify your account.</p>
                            <a href="${emailServiceData.emailVeficiationUrl}" class="btn" style="color: white;">Verify</a>
                          </div>
                        </div>
                      </div>
                    </body>

                    </html>`
      break;

    case 6:
      htmlContent = `
                    <!DOCTYPE html>
                    <html lang="en">

                    <head>
                      <style>
                        .container {
                          width: 500px;
                          margin: auto;
                          margin-top: 10px;
                          border-style: solid;
                          border-color: #673ab7;
                          border-width: 5px;
                          border-radius: 5px;
                        }

                        body {
                          margin: 0;
                          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                          font-size: 1rem;
                          font-weight: 400;
                          line-height: 1.5;
                          color: #212529;
                          text-align: left;
                          background-color: #fff;
                        }

                        .panel-title {
                          margin: 0 15px;
                          color: white;
                          padding: 20px 20px;
                          background-color: #673ab7;
                        }

                        .panel-body,
                        .panel-heading {
                          padding: 15px;
                        }

                        h3 {
                          border-radius: 5px;
                          font: sans-serif;
                        }

                        p {
                          font: 20px sans-serif;
                        }

                        @media only screen and (max-width: 600px) {
                          .container {
                            max-width: 300px;
                          }

                          p {
                            font: 16px sans-serif;
                          }
                        }
                      </style>
                    </head>

                    <body>
                      <div class="container">
                        <div class="panel panel-default">
                          <div class="panel-heading">
                            <h3 class="panel-title">Locationist</h3>
                          </div>
                          <hr>
                          <div class="panel-body">
                            <p>Hi ${emailServiceData.userName},</p>
                            <p>This email is regarding your Locationist account verification.</p>
                            <p>Your have successfully verified your Locationist Account</p>
                          </div>
                        </div>
                      </div>
                    </body>

                    </html>`
      break;
  }

  // res.status(200).json({success: true, message: 'You should soon receive an email allowing you to reset your password. Link will expires in 24hrs Please make sure to check your spam and trash if you can\'t find the email.'});
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:'your_email@your_email.com',
      pass:'Your Password'
    }
  });

  var mailOptions = {
    from: 'Locationist <srk8460@gmail.com>',
    to: emailServiceData.userEmail,
    subject: emailServiceData.subject,
    html : htmlContent
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if(error){
      console.log('error', error)
    }
    else{
      console.log('info',info)
    }
  });
}
