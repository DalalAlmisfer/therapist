//express
const express = require('express');
const app = express();

const router = express.Router();

const { isAuthenticated } = require('../../config/auth');

const therapist = require('../../models/User');

const nodemailer = require("nodemailer");

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
  auth: {
    user: "aneesksuteam@gmail.com",
    pass: "0504258108",
  },
});

// router.get('/home', isAuthenticated, (req,res) => {
//     // if a callback is specified, the rendered HTML string has to be sent explicitly
//      res.render('index', function (err, html) {
//      res.send(html);
//   });
// });

router.get('/addtherapist', (req,res) => {
    therapist.findAll({ raw : true,
    where: 
       {admains_FK: 1}
     })
    .then( (result ) => {
        console.log(result);
        res.render("addTherapist", {layout: "admainLayout" , data:result });

    }).catch( err => console.log(err));
});

router.get('/:id/profile', (req, res) => {
    var id = req.params.id;
    console.log('this is id', id);
    var sub = id.substring(1, 4);
    console.log('this is sub',sub);
    var subint = parseInt(sub);
    console.log('this is sub',subint);

    therapist.findOne({
        where: {
            therapist_id: subint
        }
    }).then((data) => {
        res.render('therapistProfile',  {layout: "admainLayout" , data:data})

    }).catch(err => console.log(err));
});

router.get('/:id/decision/accept', async (req,res) => {

    var id = req.params.id;
    console.log('this is id', id);
    var sub = id.substring(1, 4);
    console.log('this is sub',sub);
    var subint = parseInt(sub);
    console.log('this is sub',subint);

    await therapist.update(
        {accepted: 1} , 

        {
            where: 
            {
                therapist_id: subint
            }

        }
    )
    .then( (result) => {
        therapist.findAll({ raw : true,
            where: 
               {admains_FK: 1}
             })
            .then( (result ) => {

                 therapist.findOne({ raw: true,
                    where: { therapist_id: subint}

                 }).then((data) => {

                  mail( data.email, data.first_name)
                  .then((r) =>{
                      console.log('mail sent');
                  }).catch((err) =>{
                   console.log('err from mail', err);
                });


                 })

                res.render("addTherapist", {layout: "admainLayout" , data:result, status: 'accepted'});
        
            });
    })
    .catch( err => {
        console.log(err);

    });

    async function mail(email, name) {
        // create a message for register request confirmation
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: 'aneesksuteam@gmail.com', // sender address
          to: email, // list of receivers
          subject: "Anees Team - Registration Is Accepted", // Subject line
          text: ` Hello, Dr. ${name}. We received Your Request Is Received, Please Wait For The Admain to Accept Your Request. You Will Recive An Email If Your Request Is Accepted.`, // plain text body
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
          <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title> Confirmation Email  </title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          
          <style type="text/css">
          a[x-apple-data-detectors] {color: inherit !important;}
          </style>
          
          </head>
          <body style="margin: 0; padding: 0;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
          <td style="padding: 20px 0 30px 0;">
          
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc;">
          <tr>
          <td align="center" bgcolor="#0000" style="padding: 40px 0 30px 0;">
              <img src="/images/Anees logo.png" alt="logo" class="logo"/>
          </td>
          </tr>
          <tr>
          <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
          <tr>
          <td style="color: #153643; font-family: Arial, sans-serif;">
          <h1 style="font-size: 24px; margin: 0;">
              Hello, Dr. ${name}.  </h1>
          </td>
          </tr>
          <tr>
          <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 20px 0 30px 0;">
          <p style="margin: 0;">
               Your Request Is Accepted,You Can Use Anees Dashboard.
          </p>
          </td>
          </tr>
          </table>
          
          </td>
          </tr>
          </table>
          
          </td>
          </tr>
          <tr>
          <td bgcolor="#0000" style="padding: 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
          <tr>
          <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
          <p style="margin: 0;">&reg; Anees 2020 <br/>
           <a href="#" style="color: #ffffff;"></a> King Saud University. </p>
          </td>
          <td align="right">
          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          </table>
          
          </td>
          </tr>
          </table>
          </td>
          </tr>
          </table>
          
          
          </body>
          </html>`, // html body
        });

        // transporter.sendMail(info, function(err, info){
        //     if(err) {
        //         console.log(err)
        //     } else {
        //         console.log('email sent');
        //     }
        // });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }

});


router.get('/:id/decision/reject', async (req,res) => {

    var id = req.params.id;
    console.log('this is id', id);
    var sub = id.substring(1, 4);
    console.log('this is sub',sub);
    var subint = parseInt(sub);
    console.log('this is sub',subint);

    await therapist.update(
        {accepted: 0} , 
        {
            where: {
                therapist_id: subint
            }

        },
    )
    .then( (result) => {
        therapist.findAll({ raw : true,
            where: 
               {admains_FK: 1}
             })
            .then( (result ) => {
                
                mail( data.email, data.first_name)
                .then((r) =>{
                    console.log('mail sent');
                }).catch((err) =>{
                 console.log('err from mail', err);
              });

                res.render("addTherapist", {layout: "admainLayout" , data:result, status: 'rejected'});
        
            });
    }).catch( err => {
        console.log(err);

    });


    async function mail(email, name) {
        // create a message for register request confirmation
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: 'aneesksuteam@gmail.com', // sender address
          to: email, // list of receivers
          subject: "Anees Team - Registration Is Rejected or enabled to access", // Subject line
          text: ` Hello, Dr. ${name}. We received Your Request Is rejected or you are being diabled to access the dashboard.`, // plain text body
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
          <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title> Confirmation Email  </title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          
          <style type="text/css">
          a[x-apple-data-detectors] {color: inherit !important;}
          </style>
          
          </head>
          <body style="margin: 0; padding: 0;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
          <td style="padding: 20px 0 30px 0;">
          
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc;">
          <tr>
          <td align="center" bgcolor="#0000" style="padding: 40px 0 30px 0;">
              <img src="/images/Anees logo.png" alt="logo" class="logo"/>
          </td>
          </tr>
          <tr>
          <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
          <tr>
          <td style="color: #153643; font-family: Arial, sans-serif;">
          <h1 style="font-size: 24px; margin: 0;">
              Hello, Dr. ${name}.  </h1>
          </td>
          </tr>
          <tr>
          <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 20px 0 30px 0;">
          <p style="margin: 0;">
            We received Your Request Is rejected or you are being diabled to access the dashboard          </p>
          </td>
          </tr>
          </table>
          
          </td>
          </tr>
          </table>
          
          </td>
          </tr>
          <tr>
          <td bgcolor="#0000" style="padding: 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
          <tr>
          <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
          <p style="margin: 0;">&reg; Anees 2020 <br/>
           <a href="#" style="color: #ffffff;"></a> King Saud University. </p>
          </td>
          <td align="right">
          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          </table>
          
          </td>
          </tr>
          </table>
          </td>
          </tr>
          </table>
          
          
          </body>
          </html>`, // html body
        });

        // transporter.sendMail(info, function(err, info){
        //     if(err) {
        //         console.log(err)
        //     } else {
        //         console.log('email sent');
        //     }
        // });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }


  
});


module.exports = router;