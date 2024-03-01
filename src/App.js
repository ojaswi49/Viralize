import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function TopPlayers() {
    const [players, setPlayers] = useState([]);
    const [currPlayers, setCurrPlayers] = useState([]);
    const [username, setUsername] = useState("");
    const [userDetails, setUserDetails] = useState({});
    const [pageNumber, setPageNumber] = useState(1);
    const playersPerPage = 5;

    const getDetails = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(`https://lichess.org/api/user/${username}`);
            let date = new Date(data.createdAt);
            let formattedDate = date.toLocaleString();
            const details = { username: data.username, timeStamp: formattedDate, count: data.count };
            setUserDetails(details);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchPlayers = async () => {
        try {
            const { data } = await axios.get("https://lichess.org/api/player");
            let tp_players = [];
            for (let key in data) {
                for (let i in data[key]) {
                    tp_players.push({ rating: data[key][i]['perfs'][key]['rating'], username: data[key][i].username });
                }
            }
            // Assuming the sorting needs to be by rating in descending order
            tp_players.sort((a, b) => b.rating - a.rating);
            tp_players.map((item,index) => {
              item["rank"] = index;
            })
            setCurrPlayers(tp_players);
            // No need to slice here as we'll do that based on pageNumber
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    useEffect(() => {
        // Calculate slice of players to display based on pageNumber
        const startIndex = (pageNumber - 1) * playersPerPage;
        const selectedPlayers = currPlayers.slice(startIndex, startIndex + playersPerPage);
        setPlayers(selectedPlayers);
    }, [currPlayers, pageNumber]); // React to changes in currPlayers or pageNumber

    return (
        <div className='container'>
            <div className='form'>
                <form onSubmit={getDetails}>
                    <span>Enter Username:
                        <input type='text' onChange={(e) => setUsername(e.target.value)} />
                    </span>
                    <button type='submit'>Submit</button>
                </form>
                {userDetails.username && (
                    <div className='userDetails'>
                        <h2>UserName: {userDetails.username}</h2>
                        <h2>Date Joined: {userDetails.timeStamp}</h2>
                        <h2>Wins: {userDetails.count.win}</h2>
                        <h2>Ties: {userDetails.count.draw}</h2>
                        <h2>Loss: {userDetails.count.loss}</h2>
                    </div>
                )}
            </div>
            <div className='Leaderboard'>
                <h1>Top 10 Players</h1>
                <ul>
                    {players.map((player, index) => (
                        <li key={index}>
                            <strong>{player.rank + 1} : {player.username}</strong> - Rating: {player.rating}
                        </li>
                    ))}
                </ul>
                <div className='pgNumber'>
                    <button onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}>Previous</button>
                    <button onClick={() => setPageNumber(prev => (prev * playersPerPage < currPlayers.length) ? prev + 1 : prev)}>Next</button>
                </div>
            </div>
        </div>
    );
}

export default TopPlayers;