import React from 'react';
import './friends.css';

export function Friends() {
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
                <tr>
                    <td>[friend's name]</td>
                    <td>[your wins]</td>
                    <td>[friend's wins]</td>
                    <td><button>Play</button></td>
                </tr>
                <tr>
                    <td>[friend's name]</td>
                    <td>[your wins]</td>
                    <td>[friend's wins]</td>
                    <td><button>Play</button></td>
                </tr>
                <tr>
                    <td>[friend's name]</td>
                    <td>[your wins]</td>
                    <td>[friend's wins]</td>
                    <td><button>Play</button></td>
                </tr>
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
            <tr>
                <td>[player name]</td>
                <td><button>Add Friend</button></td>
            </tr>
            <tr>
                <td>[player name]</td>
                <td><button>Add Friend</button></td>
            </tr>
            <tr>
                <td>[player name]</td>
                <td><button>Add Friend</button></td>
            </tr>
            <tr>
                <td>[player name]</td>
                <td><button>Add Friend</button></td>
            </tr>
            <tr>
                <td>[player name]</td>
                <td><button>Add Friend</button></td>
            </tr>
            <tr>
                <td>[player name]</td>
                <td><button>Add Friend</button></td>
            </tr>
        </tbody>
        </table>
    </main>
  );
}