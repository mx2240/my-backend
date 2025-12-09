// Looking to send emails in production? Check out our Email API/SMTP product!
const nodemailer = require("nodemailer");
const { MiltrapTransport } = require("mailtrap");

// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "8d67879ff1b33c",
        pass: "0f88feb071b5eb"
    }
});


const SendMyEmail = (email) => {


    const sender = {
        address: "hello@example.com",
        name: "Mailtrap Test",
    };
    const recipients = [
        email,
    ];

    transport
        .sendMail({
            from: sender,
            to: recipients,
            subject: "You are awesome!",
            text: "Congrats for sending test email with Mailtrap!",
            category: "Integration Test",
            sandbox: true
        })
        .then(console.log, console.error);
};




module.exports = {
    SendMyEmail
}