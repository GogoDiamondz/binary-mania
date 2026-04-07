import React from 'react';
import { useNavigate } from "react-router-dom";

import './friends.css';
import { useWebSocket } from '../hooks/useWebSocket.js';

export function Friends(props) {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [friends, setFriends] = React.useState([]);
    const [onlinePlayers, setOnlinePlayers] = React.useState([]);
    const [gameRequests, setGameRequests] = React.useState([]);

    // Initialize WebSocket connection
    const { isConnected, messages, sendMessage, clearMessages } = useWebSocket(user?.userName);

    const loadData = React.useCallback(async () => {
        try {
            const userRes = await fetch('/api/user');
            if (!userRes.ok) throw new Error(`Failed to load user (${userRes.status})`);
            const userData = await userRes.json();
            setUser(userData);
            
            const friendsRes = await fetch('/api/friends');
            if (!friendsRes.ok) throw new Error(`Failed to load friends (${friendsRes.status})`);
            const friendsData = await friendsRes.json();
            setFriends(friendsData);

            const gameReqRes = await fetch('/api/game/requests');
            if (!gameReqRes.ok) throw new Error(`Failed to load game requests (${gameReqRes.status})`);
            const gameReqData = await gameReqRes.json();
            setGameRequests(gameReqData);

            const onlineRes = await fetch('/api/players/online');
            if (!onlineRes.ok) throw new Error(`Failed to load online players (${onlineRes.status})`);
            const onlineData = await onlineRes.json();
            setOnlinePlayers(onlineData.filter(p => p.userName !== userData.userName));
        } catch (err) {
        console.error(err);
        }
    }, []);

    React.useEffect(() => {
        loadData();
     }, [loadData]);

    // Handle incoming WebSocket messages
    React.useEffect(() => {
        if (messages.length > 0) {
            messages.forEach(message => {
                switch (message.type) {
                    case 'friend-request-sent':
                        // Someone sent you a friend request - refresh data
                        loadData();
                        break;
                    case 'friend-request-accepted':
                        // Your friend request was accepted - refresh data
                        loadData();
                        break;
                    case 'friend-request-declined':
                        // Your friend request was declined - refresh data
                        loadData();
                        break;
                    case 'friend-removed':
                        // You've been unfriended - refresh data
                        loadData();
                        break;
                    case 'game-request-sent':
                        // Someone sent you a game request - refresh data
                        loadData();
                        break;
                    case 'game-accepted':
                        // Game was accepted - navigate to game with goal number
                        navigate("/game", {
                            state: {
                                friendName: message.from,
                                secretNumber: message.data.secretNumber
                            }
                        });
                        break;
                    case 'game-request-declined':
                        // Your game request was declined - refresh data
                        loadData();
                        break;
                    case 'game-over':
                        // Game ended - could show notification
                        console.log('Game over:', message);
                        break;
                }
            });
            clearMessages(); // Clear processed messages
        }
    }, [messages, loadData, navigate, clearMessages]);

    async function handlePlay(friendName) {
        const friendRes = await fetch(`/api/user/${friendName}`);
        const friend = await friendRes.json();
        if (friend.inGame) {
            alert('Friend is already in a game.'); //FIXME: change this to Message Dialogue
            return;
        }

        // Generate a random secret number for the game
        const secretNumber = Math.floor(Math.random() * 100) + 1;

        await fetch('/api/game/start', {
            method: 'POST',
        });

        await fetch('/api/game/request/remove', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: friendName })
        });

        await loadData();

        // Notify both players to start the game with the same goal number
        sendMessage({
            type: 'game-accepted',
            from: user.userName,
            targetUser: friendName,
            data: { secretNumber }
        });

        navigate("/game", { state: { friendName, secretNumber } });
    }

    async function handleSendRequest(playerName) {
        await fetch('/api/friends/request', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: playerName })
        });
        await loadData();

        // Notify the target user about the friend request
        sendMessage({
            type: 'friend-request-sent',
            from: user.userName,
            targetUser: playerName
        });
    }

    async function handleAcceptRequest(requestName) {
        await fetch('/api/friends', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: requestName })
        });
        await fetch('/api/friends/request/remove', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: requestName })
        });
        await fetch('/api/friends/request/pending/remove', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: requestName })
        });
        await loadData();

        // Notify the requester that their request was accepted
        sendMessage({
            type: 'friend-request-accepted',
            from: user.userName,
            targetUser: requestName
        });
    }

    function handleDeclineRequest(requestName) {
        fetch('/api/friends/request/remove', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: requestName })
        });
         fetch('/api/friends/request/pending/remove', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: requestName })
        });
        loadData();

        // Notify the requester that their request was declined
        sendMessage({
            type: 'friend-request-declined',
            from: user.userName,
            targetUser: requestName
        });
    }

    async function handleGameRequest(friendName) {
        await fetch('/api/game/request', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: friendName })
        });
        await loadData();

        // Notify the friend about the game request
        sendMessage({
            type: 'game-request-sent',
            from: user.userName,
            targetUser: friendName
        });
    }

    async function handleRemoveGameRequest(friendName) {
        await fetch('/api/game/request/remove', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: friendName })
        });
        await loadData();
        sendMessage({
            type: 'game-request-declined',
            from: user.userName,
            targetUser: friendName
        });
    }

    async function handleRemoveFriend(friendName) {
        await fetch(`/api/friends/${friendName}`, {
            method: 'DELETE',
        });
        await loadData();

        // Notify the friend that they've been unfriended
        sendMessage({
            type: 'friend-removed',
            from: user.userName,
            targetUser: friendName
        });
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
                            <td className="actions">
                                {!user?.gameRequests?.includes(friend.name) &&
                                    friend.gameRequest !== true &&
                                    <button onClick={() => handleGameRequest(friend.name)} className="game-button">
                                        Request
                                    </button>
                                }

                                {user?.gameRequests?.includes(friend.name) && (
                                    <>
                                        <button onClick={() => handleRemoveGameRequest(friend.name)} className="withdraw-game-request">
                                            Withdraw
                                        </button>
                                        <span>Requested...</span>
                                    </>
                                )}

                                {!user?.gameRequests?.includes(friend.name) &&
                                    friend.gameRequest === true &&
                                    <>
                                        <button onClick={() => handlePlay(friend.name)} className="game-button">
                                            Play
                                        </button>
                                        <button onClick={() => handleRemoveGameRequest(friend.name)} className="decline-game-request">
                                            Decline
                                        </button>
                                    </>
                                }

                                <button onClick={() => handleRemoveFriend(friend.name)} className="remove-friend">
                                    Unfriend
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
                    {user?.friendRequests?.map(request => (
                        <tr key={request}>
                            <td>{request}</td>
                            <td>
                                <button onClick={() => handleAcceptRequest(request)}>
                                    Accept
                                </button>
                                <button onClick={() => handleDeclineRequest(request)}>
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
                    <tr key={player.userName}>
                        <td>{player.userName}</td>
                        <td>
                            {!user?.friends?.map(f => f.name).includes(player.userName)
                            && !user?.pendingRequests?.includes(player.userName) && 
                            !user?.friendRequests?.includes(player.userName) &&
                                <button onClick={() => handleSendRequest(player.userName)}>
                                    Add Friend
                                </button>
                            }
                            {user?.friendRequests?.includes(player.userName) && 
                                <button onClick={() => handleAcceptRequest(player.userName)}>
                                    Accept
                                </button>}
                            {user?.pendingRequests?.includes(player.userName) && <span>Pending...</span>}
                            {user?.friends?.map(f => f.name).includes(player.userName) && 
                            !user?.friendRequests?.includes(player.userName) &&
                            !user?.pendingRequests?.includes(player.userName) &&
                            <span>Friend</span>}
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </main>
    );
}