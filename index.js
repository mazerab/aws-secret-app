const express = require('express');
const app = express();
const forgeSDK = require('forge-apis');
var AWS = require('aws-sdk'),
    endpoint = "https://secretsmanager.<your AWS region>.amazonaws.com",
    region = "<your AWS region>",
    secretName = "<your secret store name>",
    secret,
    binarySecretData;

app.get('/', function(req, res) {
    // Create a Secrets Manager client
    var client = new AWS.SecretsManager({ endpoint: endpoint, region: region });
    var CLIENT_ID, CLIENT_SECRET;
    client.getSecretValue({SecretId: secretName}, function(err, data) {
        if(err) {
            console.info(`Found error: ${err}`);
            if(err.code === 'ResourceNotFoundException')
                console.error(`The requested secret ${secretName} was not found`);
            else if(err.code === 'InvalidRequestException')
                console.error(`The request was invalid due to: ${err.message}`);
            else if(err.code === 'InvalidParameterException')
                console.error(`The request had invalid params: ${err.message}`);
        } else {
            // Decrypted secret using the associated KMS CMK
            // Depending on whether the secret was a string or binary, one of these fields will be populated
            if(data.SecretString !== "") {
                secret = data.SecretString;
                var secret_json = JSON.parse(secret);
                if (Object.keys(secret_json).length === 1) {
                    CLIENT_ID = Object.keys(secret_json)[0];
                    CLIENT_SECRET = Object.values(secret_json)[0];
                    // Initialize the 2-legged oAuth2 client
                    const oAuth2TwoLegged = new forgeSDK.AuthClientTwoLegged(CLIENT_ID, CLIENT_SECRET, ['data:read', 'code:all'], true);
                    oAuth2TwoLegged.authenticate().then(function(credentials){
                        console.info('credentials = ', credentials);
                        res.status(200).send(credentials);
                    }, function(err) {
                        console.error(`Error retrieving credentials: ${JSON.stringify(err)}.`);
                        res.status(500).send(JSON.stringify(err));
                    });
                }
            } else {
                binarySecretData = data.SecretBinary;
                res.status(500).send('Unexpected binary data, exiting');
            }
        }
    });
});

app.listen(3000, function() {
   console.info('Starting node.js on port 3000...');
});
