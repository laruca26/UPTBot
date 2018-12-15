const admin = require('firebase-admin');
const express = require('express');

const serviceAccount = {
  "type": "service_account",
  "project_id": "faculty-bot",
  "private_key_id": "470152e682a73157a6f603f9fd2929b575388670",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDihOyDZJ4NGd70\nY8vtzuWtEg9lKA8q/ONb+CtNvNJbYF8ggZUwVhR4ootxr2f9Dxn9U+sqyj0r1X0m\nSpUxEXOoChBitlWzfzqaATt44XE4BaVHOLiRVadgq7NbA0BIZhIM6IPNU7y0txol\nYyTOYm3Mc9ZhSSuNpTgxnYel1bUAoWcBHvIyrTmjnlLkkDtXmtB0yA78j1kE5mYE\nc3O9XpseL7HMkGAMYfcqPezOQLGih5crQKdU3DdYhMjw62c/OzU7A5fH5tNJx4Rl\nCTToZ5Ptqm9rq3zTarXzZRiO4pRjWUp5s7bm2touP+nIRb8/4S0YN4PIZACqdRh4\n0IqXrLzhAgMBAAECggEAEoF5yZe9JlSaX4SuLsbYAnpO3eymhZRstjEph4OxO1Qd\nnWwcvjrQGBVudzqVcCoNTWIPXLryQawiue++rcgvVteApHHhQUV4Cggm/c6MN3+V\nk8KdaIkzAA2y/NDgjfGh0KJnzyzjxi9N0GdfxMkrj3gYt/C4gU1R0JLeN8UEcTE3\nEiCL/FdcxOuxpwn1hqIPeszfGOXwacUxiGGZ8P2G2q1mz6GMjyQnB1uKjI5Z5iUw\n5AXLa5Bc0sXXNjpTX0VEfWfi1fdZs0MYbquFcUKw1L6bVxUTXOdz1o1vCko1Wa3H\n7ydZOD85S/KP9Vg0Goira7kdOe0nHNOR8P96YQTjGQKBgQD8+7surm57+Pgnct4Q\nkLf557kgjESKnWomMLqOj3zRKfihlBS43q0QptucN1BUHg/7NCDPOdjJbSIRTTEK\nraCUhJSOV/M3nM8utx1aATWRcoHkvHZ/UFWcESJOHGCV3ARpJSGM777oYpMDcvof\nDmWthOaRuH2lLOtD7wy0rmxpWQKBgQDlOGg8Ibn4HHWNPd9lSlVgS/SMllByAaMk\npbyxZIjSONC8oQKfKqkNbtnJm26kpv2FfqMgB6jGMeEBePHpBcjNox3zjT2P0xA4\nYX/c2ZkUWTnDNX7aW6m31fjFWz2Vjyw1lkb4nHB4jNAvSIP1aOEcQoDpNvOO3HIV\nfVrwPRd2yQKBgC/4X88DPmn9lLiOPHNxraESgnUcg+aw4K7rMITVynoy9jVVSfSg\nLLrqmNvvVSkOJkOg59PDiUrwibQ0Ked3cuqWlUDEhpb2Agc+q68kaY7x4pWH8wRD\nLGiSiym6kcn41VFGvCzoTQ/tmSjfRXRcG4WinMHm9NQ8R0QzcPpV1LLJAoGAAMtA\nOS0Yus5GbfXP50bposrAjxgaMTrmOMNGMwsZGjlOJ8ka/Dgmm8BNitA6AuH9MNAu\nenbsU7tqfxnPJLJ7bpLpEKXll7DwdnGIAtjSGerxM0blKJZ2sQdRtEVLok/7pDfg\nCQ5pqVE7i15h7qCtXu6wCZ7CGzWSQ5bKkNh1U1kCgYEAq7taGcrBrbu+y0DPbBE2\nyqrpqUshns981Xncnh5tnPpwkOhwAbT1yGWtwddTHcQ7cpvXpv/qOwemcGbsKOJZ\nNN1CsFHWo2bSk/WKKU7e4J+T0hLL2QbYwUQaNQ5fRqiBUR/B2duQJGuv0gB0R+3Z\nRqQW01/6I+GkwlvxVe9AdCs=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-tjcpk@faculty-bot.iam.gserviceaccount.com",
  "client_id": "108292276574480816670",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tjcpk%40faculty-bot.iam.gserviceaccount.com"
};

const config = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://faculty-bot.firebaseio.com/',
    storageBucket: 'bot-faculty-api.appspot.com'
}

admin.initializeApp(config);
const database  = admin.database();
const app = express();

app.get('/test', (req, res) => {
    res.send('Hello World');
});

app.post('/webhook', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var faculties = undefined;
    database.ref('/faculties/').once('value').then(function(snapshot) {
        faculties = snapshot;
        console.log(faculties.child('AC').child('Name').val());
        res.send(JSON.stringify({
            "fulfillmentText" : faculties.child('AC').child('Name').val()
        })); 
    });
});

function readFormDB(collection, collectionObjects) {
    return database.ref(`/${collection}/`).once('value').then(function(snapshot) {
         var project = (snapshot.val() && snapshot.val()[collectionObjects.project]) || 'Anonymous';
         var required = (snapshot.val() && snapshot.val()[collectionObjects.requiredExp]) || 'Anonymous';
         var technology = (snapshot.val() && snapshot.val()[collectionObjects.technology]) || 'Anonymous';
 
         console.log(project);
         console.log(required);
         console.log(technology);
     });
 }

const port = 8000;
app.listen(process.env.PORT || port, () => {
    console.log('We are live on ' + port);
});