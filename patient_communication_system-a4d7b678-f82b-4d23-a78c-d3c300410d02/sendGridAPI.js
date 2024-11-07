// Dependancy script for SendGrid API

const https = require('https');
const querystring = require('querystring');
const Email = require('./email.js');

class SendGridAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    sendEmail(emailData) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(emailData);

            const options = {
                hostname: 'api.sendgrid.com',
                port: 443,
                path: '/v3/mail/send',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };

            const req = https.request(options, (res) => {
                res.setEncoding('utf8');
                let responseBody = '';

                res.on('data', (chunk) => {
                    responseBody += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 202) {
                        resolve('Email sent successfully');
                    } else {
                        reject(new Error(`Failed to send email: ${responseBody}`));
                    }
                });
            });

            req.on('error', (e) => {
                reject(`Problem with request: ${e.message}`);
            });

            req.write(data);
            req.end();
        });
    }
}

const sendGridAPI = new SendGridAPI('YOUR_SENDGRID_API_KEY');

const emailData = {
    personalizations: [
        {
            to: [
                {
                    email: 'patient@example.com'
                }
            ],
            subject: 'Appointment Reminder'
        }
    ],
    from: {
        email: 'no-reply@yourdomain.com'
    },
    content: [
        {
            type: 'text/plain',
            value: 'This is your appointment reminder.'
        }
    ]
};

sendGridAPI.sendEmail(emailData)
    .then(result => console.log(result))
    .catch(err => console.error(err));