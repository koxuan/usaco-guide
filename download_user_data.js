const serviceAccount = require('./service.json');
const admin = require('firebase-admin');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

admin
  .auth()
  .listUsers(1000)
  .then(function (listUsersResult) {
    let data = {};
    listUsersResult.users.forEach(function (userRecord) {
      data[userRecord.uid] = userRecord.toJSON();
    });
    fs.writeFile('auth_data.json', JSON.stringify(data), function (err) {
      if (err) return console.log(err);
      console.log('OK');
    });
  })
  .catch(function (error) {
    console.log('Error listing users:', error);
  });

db.collection('users')
  .get()
  .then(snapshot => {
    let data = {};
    snapshot.forEach(doc => {
      data[doc.id] = doc.data();
    });
    return data;
  })
  .then(data => {
    fs.writeFile('user_data.json', JSON.stringify(data), function (err) {
      if (err) return console.log(err);
      console.log('OK');
    });
  })
  .catch(error => {
    console.log(error);
  });
