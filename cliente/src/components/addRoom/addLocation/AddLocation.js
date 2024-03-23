import { Box } from '@mui/material';
import ReactMapGL, {GeolocateControl, Marker, NavigationControl} from 'react-map-gl';
import { useValue } from '../../../context/ContextProvider';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';
import Geocoder from './Geocoder';



const AddLocation = () => {
const { state: {location: { lng, lat }},dispatch} = useValue();

const mapRef =useRef();


  useEffect(() => {
   
    if (!lng && !lat ) {
      fetch('https://ipapi.co/json')
        .then((response) => {
          return response.json()
        }).then(data => {
          mapRef.current.flyTo({
            center: [data.longitude, data.latitude]
          });
          dispatch({
            type: 'UPDATE_LOCATION',
            payload: { lng: data.longitude, lat: data.latitude },
          });
        });
    }
  }, []); 


  return (
    <Box
      sx={{
        height: 400,
        position: 'relative'
      }}
    >
      <ReactMapGL
        ref= {mapRef}
        mapboxAccessToken='pk.eyJ1IjoicmljaGFyaXRvMjAyMyIsImEiOiJjbGdnaXlscm8wM3g0M2pwOGNsNjF2Y2ZuIn0.CeG7R_Yz3Hzl95f6n4z5XA'
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 8
        }}
        mapStyle='mapbox://styles/richarito2023/clgg1j9ml00ai01mrovea6fua'
      >
        <Marker
          latitude={lat}
          longitude={lng}
          draggable
          onDragEnd={(e) =>
            dispatch({
              type: 'UPDATE_LOCATION',
              payload: { lng: e.lngLat.lng, lat: e.lngLat.lat },
            })
          }
        />
 
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
    </Box>
  );
};

export default AddLocation;
