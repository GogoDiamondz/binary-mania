const port = process.argv.length > 2 ? process.argv[2] : 4000;

const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const Friend = require('./friend.js');

const authCookieName = 'token';

let users = [];

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('userName', req.body.userName)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.userName, req.body.password);
    user.online = true;
    setAuthCookie(res, user.token);
    res.send({ userName: user.userName });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('userName', req.body.userName);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      user.online = true;
      setAuthCookie(res, user.token);
      res.send({ userName: user.userName });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
    //FIXME: uncomment this
    //user.online = false;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// Get online players
apiRouter.get('/players/online', verifyAuth, (req, res) => {
  const onlinePlayers = users.filter(u => u.online);
  res.send(onlinePlayers);
});

// Get friends list
apiRouter.get('/friends', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    res.send(user.friends);
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Add a friend
apiRouter.put('/friends', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const friend = await findUser('userName', req.body.name);
  if (user && friend) {
    if (!user.friends.map(f => f.name).includes(req.body.name)) {
      user.friends.push(new Friend(friend.userName));
      friend.friends.push(new Friend(user.userName));
      res.send({ msg: 'Friend added' });
    } else {
      res.status(409).send({ msg: 'Already friends' });
    }
  } else {
    res.status(404).send({ msg: 'User or friend not found' });
  }
});

apiRouter.put('/friends/request', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const friend = await findUser('userName', req.body.name);
  if (user && friend) {
    if (!user.pendingRequests.includes(req.body.name) && !user.friends.includes(req.body.name)) {
      user.pendingRequests.push(friend.userName);
      friend.friendRequests.push(user.userName);
      res.send({ msg: 'Friend request sent' });
    } else {
      res.status(409).send({ msg: 'Request already sent or already friends' });
    }
  } else {
    res.status(404).send({ msg: 'User or friend not found' });
  }
});

apiRouter.delete('/friends/request/remove', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const friend = await findUser('userName', req.body.name);
  if (user && friend) {
    if (user.friendRequests.includes(req.body.name)) {
      user.friendRequests = user.friendRequests.filter(name => name !== req.body.name);
      res.send({ msg: 'Friend request removed' });
    } else {
      res.status(404).send({ msg: 'Friend request not found' });
    }
  } else {
    res.status(404).send({ msg: 'User or friend not found' });
  }
});

// Remove a pending request
apiRouter.delete('/friends/request/pending/remove', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const friend = await findUser('userName', req.body.name);
  if (user && friend) {
    if (friend.pendingRequests.includes(user.userName)) {
      friend.pendingRequests = friend.pendingRequests.filter(name => name !== user.userName);
      res.send({ msg: `${user.userName} removed from ${friend.userName}'s pending requests` });
    } else {
      res.status(404).send({ msg: 'Pending request not found' });
    }
  } else {
    res.status(404).send({ msg: 'User or friend not found' });
  }
});

// Remove a friend
apiRouter.delete('/friends/:friendName', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    const index = user.friends.indexOf(req.params.friendName);
    if (index > -1) {
      user.friends.splice(index, 1);
      res.send({ msg: 'Friend removed' });
    } else {
      res.status(404).send({ msg: 'Friend not found' });
    }
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Get user
apiRouter.get('/user', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  res.send({
    userName: user.userName,
    bestTime: user.bestTime,
    friends: user.friends,
    pendingRequests: user.pendingRequests,
    friendRequests: user.friendRequests,
    gameRequest: user.gameRequest,
  });
});

// Get best time score
apiRouter.get('/singleplayer/score', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  res.send({ bestTime: user.bestTime });
});


// Update best time score
apiRouter.put('/singleplayer/score', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    user.bestTime = req.body.bestTime;
    res.send({ msg: 'Best time updated' });
  } else {
    res.status(404).send({ msg: 'User not found' });
  }
});

// Update multiplayer score
apiRouter.put('/multiplayer/score', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const friend = await findUser('userName', req.body.friendName);
  if (user && friend) {
    const userFriend = user.friends.find(f => f.name === req.body.friendName);
    const friendUser = friend.friends.find(f => f.name === user.userName);
    if (userFriend && friendUser) {
      if (req.body.winner === 'user') {
        userFriend.yourWins += 1;
        friendUser.friendWins += 1;
      } else if (req.body.winner === 'friend') {
        userFriend.friendWins += 1;
        friendUser.yourWins += 1;
      }
      res.send({ msg: 'Multiplayer score updated' });
    } else {
      res.status(404).send({ msg: 'Friend relationship not found' });
    }
  } else {
    res.status(404).send({ msg: 'User or friend not found' });
  }
});


// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

async function createUser(userName, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    userName: userName,
    password: passwordHash,
    token: uuid.v4(),
    online: false,
    bestTime: 'None',
    friends: [],
    friendRequests: [],
    pendingRequests: [],
    gameRequest: null,
  };
  users.push(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
