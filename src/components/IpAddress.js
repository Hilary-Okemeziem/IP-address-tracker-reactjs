import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {MdChevronRight} from 'react-icons/md'
import { MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet'

const IpAddress = () => {
    const [data, setData] = useState('')
    const [ipAddress, setIpAddress] = useState({})
    const [error, setError] = useState('')
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);

    const SetViewOnClick = ({coords}) => {
        const map = useMap();
        map.setView(coords, map.getZoom());
    }

    const loadUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress`

    useEffect(() => {
        axios.get(loadUrl).then((response) => {
            console.log(response.data);
            setData(response.data)
            setLat(response.data.location.lat)
            setLng(response.data.location.lng)
            
        })
        .catch((error) => {
            if(error.response){
                console.log(error.response.data.messages);
                setError(error.response.data.messages)
            }
        })
    }, [loadUrl])

    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress=${ipAddress}`

    const SearchIP = (event) => {
        event.preventDefault();
        axios.get(url).then((response) => {
            console.log(response.data);
            setData(response.data)
            setLat(response.data.location.lat)
            setLng(response.data.location.lng)
        })       
        .catch((error) => {
            if(error.response){
                console.log(error.response.data.messages);
                setError(error.response.data.messages)
            }
        })
    }
    
    
  return (
    <div>
        <div className='w-full relative'>
            <div className='bg-img h-[300px] w-full'>
                <div className='flex flex-col gap-4 lg:gap-8 px-2 pt-5'>
                    <h2 className='py-2 text-2xl lg:text-4xl text-white text-center'>IP Address Tracker</h2>
                    <div>
                        <form onSubmit={SearchIP}>   
                            <div className='flex items-center justify-center'>
                                <input 
                                type="text" 
                                placeholder='Search for any IP Address' 
                                className='p-3 w-[300px] lg:w-[600px] rounded-l-lg'
                                onChange={event => setIpAddress(event.target.value)}/>
                                <button className='p-3 rounded-r-lg bg-black text-gray-100'><MdChevronRight size={22}/></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <MapContainer 
                style={{zIndex: "0", width: '100%', height: '90vh'}} 
                center={[lat, lng]}
                zoom={13}
                scrollWheelZoom={false}
            >
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                <SetViewOnClick coords={[lat, lng]} />
                <Marker position={[lat, lng]}>
                    <Popup>
                        <p>Your IP Location</p>
                    </Popup>
                </Marker>
            </MapContainer>

            <div className='absolute z-50 w-full top-[10rem] lg:top-[12rem] md:top-[12rem] px-2'>
                {error ? (
                    <div className='text-3xl text-red-500 text-center max-w-[900px] mx-auto px-2'>{error}</div>
                    ) : (
                    <div className='max-w-[900px] m-auto items-center px-2 z-50'>
                        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-lg p-4 w-full shadow-md'>
                            <div className='border border-white md:border-r-gray-400'>
                                <h4 className='text-sm text-gray-400 py-2 uppercase text-center lg:text-start'>Ip Address</h4>
                                <h1 className='text-xl font-bold text-center lg:text-start'>{data.ip}</h1>
                            </div>
                            <div className='border border-white lg:border-r-gray-400'>
                                <h4 className='text-sm text-gray-400 py-2 uppercase text-center lg:text-start'>Location</h4>
                                <h1 className='text-xl font-bold text-center lg:text-start'>{data.location?.city}, {data.location?.region}, {data.location?.country}</h1>
                            </div>
                            <div className='border border-white md:border-r-gray-400'>
                                <h4 className='text-sm text-gray-400 py-2 uppercase text-center lg:text-start'>Timezone</h4>
                                <h1 className='text-xl font-bold text-center lg:text-start'>UTC/GMT {data.location?.timezone}</h1>
                            </div>
                            <div>
                                <h4 className='text-sm text-gray-400 py-2 uppercase text-center lg:text-start'>ISP</h4>
                                <h1 className='text-xl font-bold text-center lg:text-start'>{data?.isp}</h1>
                            </div>   
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default IpAddress