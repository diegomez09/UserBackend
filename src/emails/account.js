const sgMail = require('@sendgrid/mail');

//const sendGridAPIKey = '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'

sgMail.setApiKey(process.env.SENDGRIDAPI);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'diego@node.io',
        subject: 'Weolcome to Task Node',
        text: `Welcome to the app, ${name}. Let me know how u doin.`
    }).then(res => console.log(res)) // see the response
        .catch(e => console.log(e)) // see the error if
}

module.exports = sendWelcomeEmail