import React, { useEffect, useState } from 'react'
import neighborhoodz from '../data/newStepsData.json'
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

const MyMap = () => {

  const neighborhoodHash = {}

  neighborhoodz.features.forEach( f => {
    neighborhoodHash[`${f.properties.hood}`] = {
      show: true,
      hood_no: f.properties.hood_no,
      highlighted: false
    }
  })

  const [neighborhoodzData, updateNeighborhoodzData] = useState(neighborhoodz)
  const [neighborhoodData, updateNeighborhoodData] = useState(neighborhoodHash);
  const [dummy, updateDummyState] = useState(0);

  const [showAllNeighborhoods, ToggleShowAllNeighborhoods] = useState(true)

  const showAllSteps = (e) => {
    e.preventDefault()

    ToggleShowAllNeighborhoods(true)
  }

  const hideAllSteps = (e) => {
    e.preventDefault()

    ToggleShowAllNeighborhoods(false)
  }

  const mouseOver = (e) => {
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

  const updateNeighborhoodShow = () => {
    debugger;
  }
 
  const renderSteps = () => {
    return Object.keys(neighborhoodData).map( (k, index) => {

      const neighborhood = neighborhoodzData.features.find( f => {
        return f.properties.hood === k
      })

      // changes fill opacity of each neighborhood if you hover over its associated checkbox
      const setFillOpacity = (neighborhood) => {
        return neighborhood.highlighted ? .4 : .05
      }

      const neighborhoodStyle = {
        color: "blue",
        fillOpacity: setFillOpacity(neighborhoodData[k]),
        weight: 3
      }
      
      return(
        <LayersControl.Overlay checked={neighborhoodData[k].show} name={neighborhood.properties.hood} key={neighborhood.properties.objectid} onClick={() => updateNeighborhoodShow()} >
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

  const toggleNeighborhoodCheckBox = (neighborhood) => {
    neighborhoodzData.features.forEach( (n, index) => {
      if (n.properties.hood === neighborhood.properties.hood) {
        const hood = neighborhoodData[n.properties.hood]

        const updatedHood = hood
        updatedHood.show = !updatedHood.show
        
        const newNeighborhoodData = Object.assign({}, neighborhoodData)

        newNeighborhoodData[`${n.properties.hood}`] = hood
        
        updateNeighborhoodData(newNeighborhoodData)
      }
    })
  }

  const highlightNeighborhood = (event) => {
    const neighborhoodKey = event.target.dataset.neighborhoodKey
    console.log(`entered ${neighborhoodKey}`)
    const updatedHoods = Object.assign({}, neighborhoodData)

    updatedHoods[neighborhoodKey].highlighted = !updatedHoods[neighborhoodKey].highlighted

    updateNeighborhoodData(updatedHoods)
  }

  const renderNeighborhoodList = () => {
    return Object.keys(neighborhoodData).map( (key, index) => {
      const checked = neighborhoodData[key].show

      const neighborhood = neighborhoodzData.features.find( f => {return f.properties.hood === key})
      return(
        <div data-neighborhood-key={key} onMouseOver={highlightNeighborhood} onMouseLeave={highlightNeighborhood}>
          <input data-index={index} type="checkbox" checked={checked} onChange={() => toggleNeighborhoodCheckBox(neighborhood)}></input>
          <label>{key}</label>
        </div>
      )
    })
  }

  return (
    <>
      <div className="flex-auto w-3/4">
        <MapContainer style={{height: "80vp", width: "100%"}} center={[40.446016, -79.959762]} zoom={12}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LayersControl 
            collapsed 
            eventHandlers={{
              mouseEvent: () => {
                debugger;
              },
            }}
          >
            {renderSteps()}

          </LayersControl>
        </MapContainer>
      </div>
      <div className="w-1/4 border border-black flex flex-col py-3 space-y-3">
        <div>
          <button className="px-4" onClick={showAllSteps}>Reset Filters</button>
          <button onClick={hideAllSteps}>Clear All Filters</button>
        </div>
        <div className="h-80 w-full bg-blue-100 overflow-y-scroll">
          <div >
            {renderNeighborhoodList()}
          </div>
        </div>
      </div>
    </>
  )
}

MyMap.whyDidYouRender = true;

export default MyMap;
