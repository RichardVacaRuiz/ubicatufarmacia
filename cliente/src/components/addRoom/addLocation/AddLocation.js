import { Box } from '@mui/material';
import ReactMapGL, {GeolocateControl, Marker, NavigationControl,FullscreenControl, Source, Layer} from 'react-map-gl';
import { useValue } from '../../../context/ContextProvider';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import Geocoder from './Geocoder';



function AddLocation  () {

const [viewState , setViewState] = useState({
  longitude : -73, 
  latitude:42, 
  zoom:8
});

const mapRef =useRef();

    const [start, setStart]= useState([-73, 42]);
    const [end, setEnd]= useState([-73, 42]);  
    const [coords, setCoords]=useState([]);



 useEffect (()=>{
          getRoutes()
      }, [end, start]);

      const getRoutes = async () => {
        try {
          const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${process.env.REACT_APP_MAP_TOKEN}`);
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
      
          // Verificar si hay rutas disponibles en los datos recibidos
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates;
            console.log(coords);
            setCoords(coords);
          } else {
            console.log('No se encontraron rutas en la respuesta de la API.');
          }
        } catch (error) {
          console.error('Error al obtener rutas:', error);
          // Manejar el error adecuadamente, mostrar un mensaje al usuario, etc.
        }
      };
      
     const geojson = {
          "type": "FeatureCollection",
          "features": [{
          "type": "Feature",
          "geometry": {
            "type":" LineString",
            "coordinates": [...coords]}}]
          
          }; 

          const lineStyle ={
            id: 'roadLayer',
            type: 'line',
            layout:{
              'line-join': "round",
              'line-cap': "round"
            },
            paint: {
              'line-color':"blue",
              'line-width':4,
              'line-opacity':0.75
            }

          };

          const endPoint = {
            "type": "FeatureCollection",
            "features": [{
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [...end]
              }
            }
          ]
          } ;

          const layerEndpoint = {
            id:'end',
            type: 'circle',
            source:{
              type:"geojson",
              data:end
            },
            paint:{
              'circle-radius': 10,
              'circle-color': '#f30'
            }
          }




          const handleClick = (e) => {
            const newEnd = e.lngLat;
            const endPoint = Object.keys(newEnd).map((item,i)=>newEnd[item]);
            console.log(endPoint);
            setEnd(endPoint);
    
          }


  return (
    <Box
      sx={{
        height: 400,
        position: 'relative'
      }}
    >
      <ReactMapGL
      
       
        {...viewState}
        mapboxAccessToken='pk.eyJ1IjoicmljaGFyaXRvMjAyMyIsImEiOiJjbGdnaXlscm8wM3g0M2pwOGNsNjF2Y2ZuIn0.CeG7R_Yz3Hzl95f6n4z5XA'
        onMove={evt =>setViewState(evt.viewState)}
        mapStyle='mapbox://styles/richarito2023/clgg1j9ml00ai01mrovea6fua'
        onClick={handleClick}
      >
        <Source id="routeSource" type='geojson' data={geojson}>
        <Layer {...lineStyle} />
        </Source>
        <Source id="endSource" type='geojson' data={endPoint}>
        <Layer {...layerEndpoint} />
        </Source>
        <Marker
          latitude={start[1]}
          longitude={start[0]}
        
        />
 
        <GeolocateControl/>
        <NavigationControl position="bottom-right" />
        <Geocoder/>
        <FullscreenControl/>

      </ReactMapGL>
    </Box>
  );
};

export default AddLocation;
