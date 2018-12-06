/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');
const rp = require('request-promise');

// Creates a client
const storage = new Storage();

exports.httpServer = function httpServer(req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        handleUsers(req, res);
    }
};

const handleUsers = async(req, res) => {
    if (req.method === 'POST') {
        try {
            const result = await rp({
                uri: 'https://www.google.com/recaptcha/api/siteverify',
                method: 'POST',
                formData: {
                    secret: '6LfNI38UAAAAAN6epJBn7jh4dKrFnx5Ai7GSFCeW',
                    response: req.body.captchaToken
                }
            });
            if (result.success === false) {
                return res.status(404).send({ error: 'Form submission banned for bots' });

            }
            const { firstName, lastName, email } = req.body;
            const user = { firstName, lastName, email }
            user.IP = req.headers['x-appengine-user-ip'];
            user.userAgent = req.headers['user-agent'];
            const fileName = `/tmp/${user.email}.json`;
            const fileExists = await storage.bucket('compound-test').file(`${user.email}.json`).exists();
            if (fileExists[0] === true) {
                return res.status(404).send({ error: 'User Already exists' });
            }
            fs.writeFileSync(fileName, JSON.stringify(user));
            await storage.bucket('compound-test').upload(fileName, {});
            return res.status(201).send({ message: 'User Created' });
        } catch (error) {
            return res.status(500).send(error);
        }
    } else {
        return res.status(404);
    }
}