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

async function addPendingRequest(user, friendName) {
  await userCollection.updateOne({ userName: user.userName }, { $push: { pendingRequests: friendName } });
}

async function addFriendRequest(user, friendName) {
  await userCollection.updateOne({ userName: user.userName }, { $push: { friendRequests: friendName } });
}

async function addFriend(user, friend) {
  await userCollection.updateOne({ userName: user.userName }, { $push: { friends: friend } });
}

async function removeFriendRequest(user, friendName) {
  await userCollection.updateOne({ userName: user.userName }, { $pull: { friendRequests: friendName } });
}

async function removePendingRequest(user, friendName) {
  await userCollection.updateOne({ userName: user.userName }, { $pull: { pendingRequests: friendName } });
}

async function addGameRequest(user, friendName) {
  await userCollection.updateOne({ userName: user.userName }, { $push: { gameRequests: friendName } });
}

async function setGameRequest(friend, friendUser, value) {
  // Access the friend's friend list, find the friend object for the user, and change the gameRequest boolean
  const friendItem = await userCollection.findOne({ userName: friend.userName });
  const friendUserIndex = friendItem.friends.findIndex(f => f.name === friendUser.name);
  friendItem.friends[friendUserIndex].gameRequest = value;
  await userCollection.updateOne({ userName: friend.userName }, { $set: { friends: friendItem.friends } });
}

async function updateMultiplayerWins(user, friendName, userWinsInc, friendWinsInc) {
  const userItem = await userCollection.findOne({ userName: user.userName });
  if (userItem) {
    const friendIndex = userItem.friends.findIndex(f => f.name === friendName);
    if (friendIndex !== -1) {
      userItem.friends[friendIndex].yourWins += userWinsInc;
      userItem.friends[friendIndex].friendWins += friendWinsInc;
      await userCollection.updateOne({ userName: user.userName }, { $set: { friends: userItem.friends } });
    }
  }
}

async function removeGameRequest(user, friendName) {
  await userCollection.updateOne({ userName: user.userName }, { $pull: { gameRequests: friendName } });
}

async function updateBestTime(user, bestTime) {
  await userCollection.updateOne({ userName: user.userName }, { $set: { bestTime: bestTime } });
}

module.exports = {
  addUser,
  findUser,
  getOnlinePlayers,
  updateOnlineStatus,
  updateUserToken,
  updateUserRemoveAuth,
  addPendingRequest,
  addFriendRequest,
  addFriend,
  removeFriendRequest,
  removePendingRequest,
  addGameRequest,
  setGameRequest,
  updateMultiplayerWins,
  removeGameRequest,
  updateBestTime
}