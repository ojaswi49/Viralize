import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
// import 'react';

function TopPlayers() {
    const [players, setPlayers] = useState([]);
    const [currPlayers,setCurrPlayers] = useState([]);
    const [username, setUsername] = useState("");
    const [userDetails,setUserDetails] = useState({});
    const [pageNumber,setPageNumber] = useState(1);

    const getDetails = async (e) => {
      e.preventDefault();
      try{
        const res = axios.get(`https://lichess.org/api/user/${username}`).then((data) => {
          // console.log(data.data);
          const dat = data.data;
          let date = new Date(dat.createdAt);
          let formattedDate = date.toLocaleString();
          const details = {username : dat.username, timeStamp: formattedDate,count: dat.count};
          console.log(details);
          setUserDetails(details);
        });
      }
      catch(err){
        console.log(err);
      }
    }

    const fetchPlayers = async () => {
      try{
        const res = axios.get("https://lichess.org/api/player").then((data) => {
          const raw = data.data;
          console.log(raw);
          let tp_players = [];
          for(let key in raw){
            // raw[key] -> array of 10 objects 
            for(let i in raw[key]){
              tp_players.push({rating: raw[key][i]['perfs'][key]['rating'],username: raw[key][i].username});
            }
          }
          tp_players.sort();
          console.log(tp_players);
          // setPlayers(topPlayers);
          const topPlayers = tp_players.slice(0, 10);
          console.log(topPlayers);
          setCurrPlayers(topPlayers);
          setPlayers(topPlayers.slice(0,5));
        })
      }
      catch(err){
        console.log(err);
      }
    }
    useEffect(() => {
        // Assuming you fetch the data from an API
        fetchPlayers();
    }, []);

    // return (
    //     <div>
    //       <div>
    //         <form onSubmit={getDetails}>
    //           <span>Enter Username:
    //             <input type='text' onChange={(e) => {setUsername(e.target.value)}}/>
    //           </span>
    //           <button type='submit'>Submit</button>
    //         </form>
    //         {userDetails.username && username && 
    //           <div className='userDetails'>
    //             <h2>UserName : {userDetails.username}</h2>
    //             <h2>Date Joined : {userDetails.timeStamp}</h2>
    //             <h2>Wins : {userDetails.count.win}</h2>
    //             <h2>Ties : {userDetails.count.draw}</h2>
    //             <h2>Loss : {userDetails.count.loss}</h2>
    //           </div>
    //         }
    //       </div>
    //       <div className='Leaderboard'>
    //         <h1>Top 10 Players</h1>
    //         <ul>
    //             {players.map((player,index) => (
    //                 <li key={index}>
    //                     <strong>{player.username}</strong> - Rating: {player.rating}
    //                 </li>
    //             ))}
    //         </ul>
    //         <span>
    //           <button onClick={() => setPlayers(currPlayers.slice(0,5))}>pg1</button>
    //           <button onClick={() => setPlayers(currPlayers.slice(5,10))}>pg2</button>
    //         </span>
    //       </div>
    //     </div>
    // );
    return (
      <div className='container'>
        <div className='form'>
          <form onSubmit={getDetails}>
            <span>Enter Username:
              <input type='text' onChange={(e) => {setUsername(e.target.value)}}/>
            </span>
            <button type='submit'>Submit</button>
          </form>
          {userDetails.username && username && 
            <div className='userDetails'>
              <h2>UserName : {userDetails.username}</h2>
              <h2>Date Joined : {userDetails.timeStamp}</h2>
              <h2>Wins : {userDetails.count.win}</h2>
              <h2>Ties : {userDetails.count.draw}</h2>
              <h2>Loss : {userDetails.count.loss}</h2>
            </div>
          }
        </div>
        <div className='Leaderboard'>
          <h1>Top 10 Players</h1>
          <ul>
              {players.map((player,index) => (
                  <li key={index}>
                      <strong>{player.username}</strong> - Rating: {player.rating}
                  </li>
              ))}
          </ul>
          <span>
            <button onClick={() => setPlayers(currPlayers.slice(0,5))}>pg1</button>
            <button onClick={() => setPlayers(currPlayers.slice(5,10))}>pg2</button>
          </span>
        </div>
      </div>
  );  
}

export default TopPlayers;
