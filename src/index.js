// import the mountebank helper library
const mbHelper = require('mountebank-helper');
const fs = require('fs');

// create the skeleton for the imposter (does not post to MB)
const firstImposter = new mbHelper.Imposter({'imposterPort': 3000});
const secondImposter = new mbHelper.Imposter({'imposterPort': 9000});

// construct sample responses and conditions on which to send it
const sample_response = {
    'uri': '/hello',
    'verb': 'GET',
    'res': {
        'statusCode': 200,
        'responseHeaders': {'Content-Type': 'application/json'},
        'responseBody': JSON.stringify({'hello': 'world'})
    }
};

const another_response = {
    'uri': '/pets/123',
    'verb': 'PUT',
    'res': {
        'statusCode': 200,
        'responseHeaders': {'Content-Type': 'application/json'},
        'responseBody': JSON.stringify({'somePetAttribute': 'somePetValue'})
    }
};

const imposter_2_response_1 = {
    'uri': '/articles/123',
    'verb': 'GET',
    'res': {
        'statusCode': 200,
        'responseHeaders': {'Content-Type': 'application/json'},
        'responseBody': JSON.stringify({'somePetAttribute': 'somePetValue'})
    }
};


// add our responses to our imposter
firstImposter.addRoute(sample_response);
firstImposter.addRoute(another_response);

// add our responses to our second imposter
secondImposter.addRoute(imposter_2_response_1);

// start the MB server  and post our Imposter to listen!
mbHelper.startMbServer(2525)
    .then(function () {
        return firstImposter.postToMountebank();
    })
    .then(() => {
        console.log('Imposter Posted! Go to http://localhost:3000/hello');
        return secondImposter.postToMountebank();
    })
    .then(() => {
        console.log('Second Imposter Posted! Go to http://localhost:9000/articles/123');
    });