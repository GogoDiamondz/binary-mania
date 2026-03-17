import React from 'react';
import { useNavigate } from "react-router-dom";

import './friends.css';

export function Friends(props) {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [friends, setFriends] = React.useState([]);
    const [onlinePlayers, setOnlinePlayers] = React.useState([]);
    const [gameRequests, setGameRequests] = React.useState([]);

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

    async function handlePlay(friendName) {
        await fetch('/api/game/request/remove', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: friendName })
        });

        await loadData();
        navigate("/game", { state: { friendName } });
    }

    async function handleSendRequest(playerName) {
        await fetch('/api/friends/request', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: playerName })
        });
        await loadData();
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
    }

    async function handleGameRequest(friendName) {
        await fetch('/api/game/request', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: friendName })
        });
        await loadData();
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
                                {!user?.gameRequests?.includes(friend.name) &&
                                    friend.gameRequest !== true &&
                                    <button onClick={() => handleGameRequest(friend.name)}>
                                        Request
                                    </button>
                                }
                                {user?.gameRequests?.includes(friend.name) && <span>Requested...</span>}
                                {!user?.gameRequests?.includes(friend.name) &&
                                    friend.gameRequest === true &&
                                    <button onClick={() => handlePlay(friend.name)}>
                                        Play
                                    </button>
                                }
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