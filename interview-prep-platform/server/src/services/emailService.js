const nodemailer = require('nodemailer');

const emailService = {
    transporter: null,

    init: function() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password
            },
        });
    },

    sendEmail: function(to, subject, text) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        return this.transporter.sendMail(mailOptions)
            .then(info => {
                console.log('Email sent: ' + info.response);
                return info;
            })
            .catch(error => {
                console.error('Error sending email: ', error);
                throw error;
            });
    },
};

module.exports = emailService;