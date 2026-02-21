import React from 'react';

import './friends.css';

import { Player } from './player';

export function Friends(props) {
  const userName = props.userName;
  const [friends, setFriends] = React.useState([]);
  const [onlinePlayers, setOnlinePlayers] = React.useState([]);
  const friendsRows = [];

  React.useEffect(() => {
    // Fetch friends and online players data from the server
    // For now, we will use hardcoded data for demonstration
    setFriends([
      new Player('Alice', 10, 5, true),
      new Player('Bob', 7, 8, true),
      new Player('Carlos', 15, 3, true)
    ]);

    setOnlinePlayers([
        new Player('Dave'),
        new Player('Eve'),
        new Player('Frank')
    ]);
  }, []);

  function handlePlay(friendName) {
    // Logic to start a game with the selected friend
    console.log(`Starting a game with ${friendName}`);
  }

  function handleFriendRequest(playerName) {
    // Logic to send a friend request to the selected player
    console.log(`Sending friend request to ${playerName}`);
  }

  return (
      <main>
        <h1>Your Friends</h1>
        <table className="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Your Wins</th>
                    <th>Friend's Wins</th>
                    <th>Play</th>
                </tr>
            </thead>
            <tbody>
                {friends.map(friend => (
                    <tr key={friend.name}>
                        <td>{friend.name}</td>
                        <td>{friend.yourWins}</td>
                        <td>{friend.friendWins}</td>
                        <td>
                            <button onClick={() => handlePlay(friend.name)}>
                                Play
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <h2>Players Online</h2>
        <table className="table">
            <thead>
            <tr>
                <th>Player Name</th>
                <th>Friend Request</th>
            </tr>
        </thead>
        <tbody>
            {onlinePlayers.map(player => (
                <tr key={player.name}>
                    <td>{player.name}</td>
                    <td>
                        <button onClick={() => handleFriendRequest(player.name)}>
                            Add Friend
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
        </table>
    </main>
  );
}