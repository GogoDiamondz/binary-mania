import React from 'react';
import { useNavigate } from "react-router-dom";

import './friends.css';

import { Player } from './player';

export function Friends(props) {
    const navigate = useNavigate();
    const userName = props.userName;
    const [friends, setFriends] = React.useState([]);
    const [onlinePlayers, setOnlinePlayers] = React.useState([]);
    const [friendRequests, setFriendRequests] = React.useState([]);

    React.useEffect(() => {
        setFriends([
        new Player('Alice', 'friend', 10, 5),
        new Player('Bob', 'friend', 7, 8),
        new Player('Carlos', 'friend', 15, 3)
        ]);

        setOnlinePlayers([
            new Player('Dave', 'none'),
            new Player('Eve', 'none'),
            new Player('Frank', 'none')
        ]);

        fetch('/api/players/online')
            .then(res => res.json())
            .then(onlinePlayers => setOnlinePlayers(
                prev => [...prev, ...onlinePlayers.map(p => new Player(p.userName))]
            ));

        setFriendRequests([
            new Player('Grace', 'pending'),
            new Player('Heidi', 'pending')
        ]);
    }, []);

    function handlePlay(friendName) {
        // Logic to start a game with the selected friend
        console.log(`Starting a game with ${friendName}`);
        navigate("/game", { state: { friendName } });
    }

    function handleSendRequest(playerName) {
        // Mock sending a friend request to the player
        console.log(`Sending friend request to ${playerName}`);
        setOnlinePlayers(prev =>
        prev.map(player =>
            player.name === playerName
                ? { ...player, friendStatus: "pending" }
                : player
            )
        );

        setTimeout(() => {
            console.log(`${playerName} accepted your friend request!`);
            setFriendRequests(prev => prev.filter(name => name !== playerName));
            setFriends(prev => [...prev, new Player(playerName, 'friend')]);
            setOnlinePlayers(prev =>
                prev.map(player =>
                    player.name === playerName
                    ? { ...player, friendStatus: "friend" }
                    : player
                )
            );
        }, 2000);
    }

    function handleAcceptRequest(requestName) {
        // Mock accepting a friend request
        setFriendRequests(prev => prev.filter(request => request.name !== requestName));
        setFriends(prev => [...prev, new Player(requestName, 'friend')]);
        console.log(`Accepted friend request from ${requestName}`);
    }

    function handleDeclineRequest(requestName) {
        // Mock declining a friend request
        setFriendRequests(prev => prev.filter(request => request.name !== requestName));
        console.log(`Declined friend request from ${requestName}`);
    }
        

    return (
        <main>
            <div className="top-bar">
                <button id="home" onClick={() => navigate("/")}>Home</button>
            </div>

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

            <h2>Your Friend Requests</h2>
            <table className="table" id="friend-requests">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Request</th>
                    </tr>
                </thead>
                <tbody>
                    {friendRequests.map(request => (
                        <tr key={request.name}>
                            <td>{request.name}</td>
                            <td>
                                <button onClick={() => handleAcceptRequest(request.name)}>
                                    Accept
                                </button>
                                <button onClick={() => handleDeclineRequest(request.name)}>
                                    Decline
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
                            {player.friendStatus === 'none' && (
                            <button onClick={() => handleSendRequest(player.name)}>
                                Add Friend
                            </button>
                            )}
                            {player.friendStatus === 'pending' && <span>Pending...</span>}
                            {player.friendStatus === 'friend' && <span>Friend</span>}
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </main>
    );
}