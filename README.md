# aws-secret-app
A Node.js express app demonstrating how to use AWS Secret Manager with Forge Authentication API

## Create a new Forge App

Follow the instructions documented in [this blog post](https://developer.autodesk.com/en/docs/oauth/v2/tutorials/create-app/).

## Create a new secret store

1. Login to your AWS console
2. Navigate to AWS Secret Manager
3. Store a new secret
4. Select "Other type of secrets (e.g. API key)
5. Input your Forge App ID and secret under Secret key/value
6. Give your secret store a name 
7. Save the secret

## Setup the Node.js Express App

1. Download the files from this repository
2. Edit index.js in your favorite text editor
3. Change the 
