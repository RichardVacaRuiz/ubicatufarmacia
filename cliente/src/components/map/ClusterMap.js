

import React, { useEffect, useState } from 'react';
import { useValue } from '../../context/ContextProvider';
import { getRooms } from '../../actions/room';
import ReactMapGL, { Marker ,NavigationControl,GeolocateControl, Popup} from 'react-map-gl';
import Supercluster from 'supercluster';
import { Avatar, Paper, Tooltip } from '@mui/material';
import './cluster.css';
import Geocoder from '../addRoom/addLocation/Geocoder';
import GeocoderInput from '../sidebar/GeocoderInput';
import PoputRoom from './PopupRoom';






const supercluster = new Supercluster({
    radius: 75,
    maxZoom: 20,
});

const ClusterMap = () => {

    const {state: {rooms}, dispatch, mapRef}=useValue();

    const [points,setPoints]=useState([]);

    const [clusters,setClusters]=useState([]);

    const [bounds, setBounds]= useState([-180, -85, 180, 85]);

    const [zoom, setZoom]= useState(0);

    const [popupInfo, setPopupInfo] = useState(null);


    useEffect(()=>{
        getRooms(dispatch);
    },[]);


    useEffect(()=>{ 
        const  points = rooms.map(room=>({
            type:'Feature',
            properties:{ cluster:false, 
            roomId:room._id,
            price:room.price,
            title:room.title,
            description:room.description,
            lng:room.lng,
            lat:room.lat,
            images:room.images,
            uPhoto:room.uPhoto,
            uName:room.uName
         },
         geometry:{type:"Point", coordinates:[ parseFloat (room.lng), parseFloat (room.lat)]}
        }))
            setPoints(points);
     },[rooms]);
     
     useEffect(() => {
        supercluster.load(points);
        setClusters(supercluster.getClusters(bounds, zoom));
      }, [points, zoom, bounds]);
    
      useEffect(() => {
        if (mapRef.current) {
          setBounds(mapRef.current.getMap().getBounds().toArray().flat());
        }
      }, [mapRef?.current]);



    return (
    <ReactMapGL
    initialViewState={{latitude:51.5072, longitude:0.1276}}
    mapboxAccessToken={process.env.REACT_APP_MAP_TOKEN}
   // mapStyle="mapbox://styles/mapbox/streets-v11"
    mapStyle="mapbox://styles/richarito2023/clgg1j9ml00ai01mrovea6fua"
    ref= {mapRef}
    onZoomEnd={(e)=>setZoom(Math.round(e.viewState.zoom))}
    
    >
      
      
        {clusters.map(cluster=>{
            const {cluster:isCluster,point_count}= cluster.properties
            const [longitude, latitude]=cluster.geometry.coordinates
            if (isCluster){
                return (
                <Marker
                key={`cluster-${cluster.id}`}
                longitude={longitude}
                latitude={latitude}
                >
                     <div
                className="cluster-marker"
                style={{
                  width: `${10 + (point_count / points.length) * 20}px`,
                  height: `${10 + (point_count / points.length) * 20}px`,
                }}
                onClick={() => {
                  const zoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );
                  mapRef.current.flyTo({
                    center: [longitude, latitude],
                    zoom,
                    speed: 1,
                  });
                }}
              >
                {point_count}
              </div>
                </Marker>
                

                );
            }
            return (
                <Marker
                  key={`room-${cluster.properties.roomId}`}
                  longitude={longitude}
                  latitude={latitude}
                >
                  <Tooltip title={cluster.properties.uName}>
                    <Avatar
                      src={cluster.properties.uPhoto}
                      component={Paper}
                      elevation={2}
                      onClick={()=>setPopupInfo(cluster.properties)}
                     
                    />
                   
                  </Tooltip>
                  
                </Marker>
                
              );
              

        })}
      <GeocoderInput/>
      {
        popupInfo &&(
              <Popup
              longitude={popupInfo.lng}
              latitude={popupInfo.lat}
              maxWidth='auto'
              closeOnClick={false}
              focusAfterOpen={false}
              onClose={() => setPopupInfo(null)}
              >
              <PoputRoom {...{popupInfo}} />


              </Popup>
        ) };



        <GeolocateControl
          position="top-left"
          trackUserLocation
          onGeolocate={(e) =>
            dispatch({
              type: 'UPDATE_LOCATION',
              payload: { lng: e.coords.longitude, lat: e.coords.latitude },
            })
          }
        />
        
      <NavigationControl position="bottom-right" />
      
      <Geocoder/>
    

    </ReactMapGL>
    );

};

export default ClusterMap;
