import React, { useEffect, useState } from 'react'
import neighborhoods from '../data/newStepsData.json'
import {
  MapContainer, 
  TileLayer, 
  GeoJSON,
  Popup,
  LayersControl,
  LayerGroup,
  Tooltip
} from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import { Typography, Divider } from '@material-ui/core'

export default function MyMap() {

  const [neighborhoodData, updateNeighborhoodData] = useState(neighborhoods);

  const [showAllNeighborhoods, ToggleShowAllNeighborhoods] = useState(true)

  useEffect( () => {
  })

  const showAllSteps = (e) => {
    e.preventDefault()

    ToggleShowAllNeighborhoods(true)
  }

  const hideAllSteps = (e) => {
    e.preventDefault()

    ToggleShowAllNeighborhoods(false)
  }

  const mouseOver = (e) => {
    debugger;
  }

  const neighborhoodStyle = {
    color: "blue",
    fillOpacity: .05,
    weight: 3,
  }

  const onEachNeighborhood = (neighborhood, layer) => {
    layer.on('mouseover', function() {
      layer.setStyle({
        fillOpacity: .4
      })
    })

    layer.on('mouseout', function() {
      layer.setStyle({
        fillOpacity: .05
      })
    })
  }
 
  const renderSteps = () => {
    return neighborhoodData.features.map( neighborhood => {

      return(
        <LayersControl.Overlay checked={showAllNeighborhoods} name={neighborhood.properties.hood} key={neighborhood.properties.objectid} >
          <LayerGroup>
            <GeoJSON data={neighborhood.geometry} style={neighborhoodStyle} onEachFeature={onEachNeighborhood} > 
              <Tooltip>
                {neighborhood.properties.hood}
              </Tooltip>
              {
                neighborhood.steps.map( step => {
                  const geoJSON = step.geometry;

                  return(
                    <>
                      <GeoJSON key={step.id} data={geoJSON} pathOptions={{ color: "green", weight: 4}}>
                        <Popup>
                          <Typography variant='subtitle2'>
                            {step.properties.name}
                          </Typography>
                          <Divider />
                          <Typography variant='body2' style={{ margin: 3 }}>
                            Steps: {step.properties.number_of_steps || "Unkown"} 
                          </Typography>
                        </Popup>
                      </GeoJSON>
                    </>
                  )
                })
              }
            </GeoJSON>
          </LayerGroup>
        </LayersControl.Overlay>
      ) 
    })
  }

  return (
    <div>
      <div>
        <h1 style={{textAlign: "center"}}>My Map</h1>
        <MapContainer style={{height: "80vp", width: "80%"}} center={[40.446016, -79.959762]} zoom={12}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LayersControl position="topright">
            {renderSteps()}

          </LayersControl>
        </MapContainer>
      </div>
      <div>
        <button onClick={showAllSteps}>Show All</button>
        <button onClick={hideAllSteps}>Hide All</button>
      </div>
    </div>
  )
}
