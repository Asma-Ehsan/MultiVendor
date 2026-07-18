const nodemailer = require("nodemailer")
const sendMail = async(options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;

/*
===========================================
Understanding Transporter
===========================================

What is a Transporter?

A transporter is an object created by Nodemailer.

It acts as a connection between the Node.js application and the email service
(e.g., Gmail, Outlook, Yahoo).

Purpose:
- Stores the email service configuration.
- Stores authentication credentials.
- Provides methods to send emails.

-------------------------------------------

Creating a Transporter

Code:

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "example@gmail.com",
        pass: "app-password"
    }
});

createTransport() does NOT send an email.

It only creates and returns a transporter object.

Conceptually, it returns an object like:

transporter = {
    sendMail(),
    verify(),
    close(),
    ...
}
-------------------------------------------

Why do we need a Transporter?

Before sending an email, Nodemailer needs to know:

- Which email service to use.
- Which email account to use.
- Which password/app password to use.

The transporter stores all this information and uses it whenever an email is sent.

===========================================
Understanding transporter.sendMail()
===========================================

Code:

await transporter.sendMail(mailOptions);

The sendMail() used here is NOT our own sendMail() function.

There are two different sendMail() functions in this file.

1. Our Function

const sendMail = async (options) => {

}

- Created by us.
- Called from controllers.
- Responsible for preparing and sending an email.

Example:

await sendMail({
    email,
    subject,
    message
});

-------------------------------------------

2. Nodemailer's Method

transporter.sendMail(mailOptions);

- sendMail() is a built-in method of the transporter object.
- It is provided by the Nodemailer library.
- It actually sends the email using the configured SMTP service.

-------------------------------------------

Difference

sendMail()

- Our standalone function.

transporter.sendMail()

- Nodemailer's method belonging to the transporter object.

Because one is a standalone function and the other is an object method, JavaScript treats them as completely different functions.

===========================================
Flow
===========================================

Controller
    |
    ▼
Our sendMail(options)
    |
    ▼
nodemailer.createTransport()
    |
    ▼
Returns Transporter Object
    |
    ▼
transporter.sendMail(mailOptions)
    |
    ▼
Gmail SMTP Server
    |
    ▼
Recipient Receives Email

===========================================
*/