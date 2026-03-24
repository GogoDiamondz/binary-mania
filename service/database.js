const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('mania');
const userCollection = db.collection('users');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`DB connected to ${config.hostname}`);
  }
  catch (err) {
    console.error('Failed to connect to database', err);
    process.exit(1);
  }
})();

async function findUser(field, value) {
  return await userCollection.findOne({ [field]: value });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function getOnlinePlayers() {
  return await userCollection.find({ online: true }).toArray();
}

async function updateOnlineStatus(userName, online) {
  await userCollection.updateOne({ userName: userName }, { $set: { online: online } });
}

async function updateUserToken(user, newToken) {
  await userCollection.updateOne({ userName: user.userName }, { $set: { token: newToken } });
}

async function updateUserRemoveAuth(user) {
  await userCollection.updateOne({ userName: user.userName }, { $unset: { token: 1 } });
}

module.exports = {
  addUser,
  findUser,
  getOnlinePlayers,
  updateOnlineStatus,
  updateUserToken,
  updateUserRemoveAuth
}