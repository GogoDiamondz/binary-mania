import React from 'react';
import { useNavigate } from "react-router-dom";

import './friends.css';

import { Player } from './player';

export function Friends(props) {
    const navigate = useNavigate();
    const [userName, setUserName] = React.useState('');
    const [friends, setFriends] = React.useState([]);
    const [onlinePlayers, setOnlinePlayers] = React.useState([]);
    const [friendRequests, setFriendRequests] = React.useState([]);

    React.useEffect(() => {
        async function loadData() {
            try {
                const userRes = await fetch('/api/user');
                if (!userRes.ok) throw new Error(`Failed to load user (${userRes.status})`);
                const userData = await userRes.json();
                setUserName(userData.userName);
                
                const friendsRes = await fetch('/api/friends');
                if (!friendsRes.ok) throw new Error(`Failed to load friends (${friendsRes.status})`);
                const friendsData = await friendsRes.json();
                setFriends(friendsData.map(name => new Player(name, 'friend')));
                const friendNames = new Set(friendsData);

                const onlineRes = await fetch('/api/players/online');
                if (!onlineRes.ok) throw new Error(`Failed to load online players (${onlineRes.status})`);
                const onlineData = await onlineRes.json();
                setOnlinePlayers(
                    onlineData
                        .filter(p => p.userName !== userName)
                        .map(p => new Player(p.userName, friendNames.has(p.userName) ? 'friend' : 'none'))
                );
            } catch (err) {
                console.error(err);
            }
        }

        loadData();

        setFriendRequests([
            new Player('Grace', 'pending'),
            new Player('Heidi', 'pending')
        ]);
    }, [userName]);

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
            setFriendRequests(prev => prev.filter(request => request.name !== playerName));
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

    async function handleAcceptRequest(requestName) {
        // Mock accepting a friend request
        setFriendRequests(prev => prev.filter(request => request.name !== requestName));
        await fetch('/api/friends', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(new Player(requestName, 'friend')),
        });
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