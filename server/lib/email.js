"use strict";
var nodemailer = require('nodemailer');
var config = require('../config');
var utils = require('./utils');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: config.smtp.service,
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
    }
});


module.exports = {

	/**
	*	Mail Templates
	*/ 
	templates: {
		inviteToOrganization: {
			subject: "Hey ! $s0 invites you to AngelPal",
		    text: "Hi !\n I have invited you to my AngelPal organization $s0.\nhttp://localhost:9000",
		    html: "<h2>Hi !</h2> I have invited you to my AngelPal organization <b><a href=\"http://localhost:9000\" target=\"_blank\">$s0</a></b>."
		}
	},


	/**
	*	Prepare Mail / Message
	*/
	prepareMail: function (to, template, input) {
		for (var i in input) {
			for (var key in template) {
				template[key] = template[key].replaceAll("$s" + i, input[i]);
			}
		}

		var mailOptions = {
			from: "AngelPal <giggs.apps@gmail.com>",
		    to: to, // list of receivers
		    subject: template.subject,
		    text: template.text, // plaintext body
		    html: template.html // html body
		}

		return mailOptions;
	},


	/**
	*	Send Mail
	*/
	sendMail: function (mailOptions) {
		// send mail with defined transport object
		smtpTransport.sendMail(mailOptions, function (error, response){
		    if (error) {
		        console.log(error);
		    } else {
		        console.log("Message sent: ".green + response.message);
		    }

		    smtpTransport.close(); // shut down the connection pool, no more messages
		});
	}

};
