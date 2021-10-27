import { useEffect, useState } from 'react';
import ReactMapGL,{Marker,Popup,FullscreenControl} from 'react-map-gl';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import './app.css';
import axios from "axios";
import {format} from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

const fullscreenControlStyle= {
  right: 10,
  top: 10
};



function App() {
  // const currentUser ="john";
  const myStorage = window.localStorage;
  const[currentUser,setCurrentUser] =useState(myStorage.getItem("user"));
  const[pins,setPins]=useState([]);
  const[currentPlaceId,setCurrentPlaceId]=useState(null);
  const[newPlace,setNewPlace]=useState(null);
  const[title,setTitle]=useState(null);
  const[desc,setDesc]=useState(null);
  const[rating,setRating]=useState(0);
  const[showRegister,setShowRegister]=useState(false);
  const[showLogin,setShowLogin]=useState(false);

  const [viewport, setViewport] = useState({
    width: "100vh",
    height: 400,
    latitude: 46,
    longitude: 17,
    zoom: 5
  });


  useEffect(()=>{
    const getPins = async ()=>{
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (error) {
        console.log(error);
        
      }
    };
    getPins()
  },[]);

  const handleMarkerClick =(id,lat,long)=>{
      setCurrentPlaceId(id);
      // jump the position
      setViewport({...viewport,latitude:lat,longitude:long}) 
  };

  const handleAddClick =(e)=>{
    const [long,lat]=e.lngLat;
    setNewPlace({
      lat,
      long,
    })
  };

  const handleLogout = ()=>{
    myStorage.removeItem("user");
    setCurrentUser(null);
  }


  const handleSubmit = async (e)=>{
    e.preventDefault();
    const newPin = {
      user:currentUser,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long,
    };

    try {
      const res= await axios.post("/pins",newPin);
      setPins([...pins,res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <ReactMapGL
      {...viewport}width="100vw" height="100vh" onViewportChange={setViewport}
      mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX}
      // onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/mqmq25/ckv6ys86x4xz614mf3ji85uod"
      onDblClick ={handleAddClick}
      transitionDuration="50"
      >
      <FullscreenControl style={fullscreenControlStyle} />


      {pins.map((p)=>(
        <>
      <Marker latitude={p.lat} longitude={p.long} offsetLeft={-viewport.zoom*5} offsetTop={-viewport.zoom*10}>
        <RoomIcon style={{fontSize:viewport.zoom*10,color:p.username===currentUser ? "tomato":"slateblue",cursor:"pointer"}} 
        onClick ={()=>{handleMarkerClick(p._id,p.lat,p.long)}} />
       
      </Marker>
      
      {p._id === currentPlaceId && (
      <Popup
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}          
          anchor="left" 
          onClose={()=>setCurrentPlaceId(null)} >
          
          <div className="card">
            <label>Place</label>
            <h4 className="Place">{p.title}</h4>
            <label>Review</label>
            <p className="desc">{p.desc}</p>
            <label>Rating</label>
            <div className="stars">
              {Array(p.rating).fill(<StarIcon />)}
              {/* <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon /> */}
            </div>
            <label>Information</label>
            <span className="username">Created by <b>{p.username}</b></span>
            <span className="time">{format(p.createdAt)}</span>

          </div>
        </Popup>
      )}
        </>
      ))}

      {/* another popup for new Place */}
      {newPlace && (
      <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}          
          anchor="left" 
          onClose={()=>setNewPlace(null)} >

          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input placeholder="Enter a title" onChange={(e)=>setTitle(e.target.value)}/>
              <label>Review</label>
              <textarea placeholder="Review something about this place" onChange={(e)=>setDesc(e.target.value)}/>
              <label>Rating</label>
              <select onChange={(e)=>setRating(e.target.value)} >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>

              </select>
              <button className="submitButton" type="submit">Add Pin</button>
            </form>
          </div>
        
      </Popup>
      )}

      {currentUser ? (<button className="button logout" onClick ={(handleLogout)}>Log out</button>):(  
      
      <div className="buttons">
        <button className="button login" onClick={()=>setShowLogin(true)}>Login</button>
        <button className="button register" onClick={()=>setShowRegister(true)}>Register</button>
      </div>)}

      {/* <button className="button logout">Log out</button>
      <div className="buttons">
        <button className="button login">Login</button>
        <button className="button register">Register</button>
      </div> */}
      {showRegister &&  <Register setShowRegister={setShowRegister}/>}
      {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage}
      setCurrentUser={setCurrentUser}
      />}




      </ReactMapGL>
    </div>
  );

  
}

export default App;
