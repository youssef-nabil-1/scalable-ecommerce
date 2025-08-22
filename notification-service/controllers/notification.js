const sgMail = require("@sendgrid/mail");

exports.sendEmail = async (req, res, next) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const { to, subject, text } = req.body;
    const msg = {
        to,
        from: process.env.SENDGRID_EMAIL,
        subject,
        text,
    };

    try {
        await sgMail.send(msg);
        console.log("Email sent successfully");
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body);
        }
    }
};
