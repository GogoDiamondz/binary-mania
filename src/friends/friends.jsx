import React from 'react';
import { useNavigate } from "react-router-dom";

import './friends.css';

import { Player } from './player';

export function Friends(props) {
    const navigate = useNavigate();
    const userName = props.userName;
    const [friends, setFriends] = React.useState([]);
    const [onlinePlayers, setOnlinePlayers] = React.useState([]);
    const [pendingRequests, setPendingRequests] = React.useState([]);

    React.useEffect(() => {
        // Fetch friends and online players data from the server
        // For now, we will use hardcoded data for demonstration
        setFriends([
        new Player('Alice', 'friend', 10, 5),
        new Player('Bob', 'friend', 7, 8),
        new Player('Carlos', 'friend', 15, 3)
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
        navigate("/game", { state: { friendName } });
    }

    function handleFriendRequest(playerName) {
        // Mock sending a friend request to the player
        console.log(`Sending friend request to ${playerName}`);
        setPendingRequests(prev => [...prev, playerName]);
        setOnlinePlayers(prev =>
        prev.map(player =>
            player.name === playerName
                ? { ...player, friendStatus: "pending" }
                : player
            )
        );

        setTimeout(() => {
            console.log(`${playerName} accepted your friend request!`);
            setPendingRequests(prev => prev.filter(name => name !== playerName));
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
                            {player.friendStatus === 'none' && (
                            <button onClick={() => handleFriendRequest(player.name)}>
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