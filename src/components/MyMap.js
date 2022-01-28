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
import NeighborhoodLayer from './NeighborhoodLayer'

const MyMap = () => {

  const neighborhoodHash = {}

  neighborhoodz.features.forEach( f => {
    neighborhoodHash[`${f.properties.hood}`] = {
      show: true,
      hood_no: f.properties.hood_no,
      highlighted: false,
      preview: false
    }
  })

  const [neighborhoodzData, updateNeighborhoodzData] = useState(neighborhoodz)
  const [neighborhoodData, updateNeighborhoodData] = useState(neighborhoodHash);
  const [dummy, updateDummyState] = useState(0);

  const showAllSteps = (e) => {
    e.preventDefault()

    const newNeighborhoodData = Object.assign({}, neighborhoodData)

    Object.keys(newNeighborhoodData).forEach( key => {
      newNeighborhoodData[key].show = true
    })

    updateNeighborhoodData(newNeighborhoodData)
  }

  const hideAllSteps = (e) => {
    e.preventDefault()

    const newNeighborhoodData = Object.assign({}, neighborhoodData)

    Object.keys(newNeighborhoodData).forEach( key => {
      newNeighborhoodData[key].show = false
    })

    updateNeighborhoodData(newNeighborhoodData)
  }

  const mouseOver = (e) => {
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
        <NeighborhoodLayer key={neighborhood.properties.hood_no} neighborhoodKey={k} neighborhood={neighborhood} neighborhoodData={neighborhoodData}/>
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
    
    if (neighborhoodKey && !neighborhoodData[neighborhoodKey].highlighted) {
      const updatedHoods = Object.assign({}, neighborhoodData)
  
      updatedHoods[neighborhoodKey].highlighted = true; 
      updatedHoods[neighborhoodKey].preview = true;
  
      updateNeighborhoodData(updatedHoods)
    }
  }

  const removeNeighborhoodHighlight = (event) => {
    
    const neighborhoodKey = event.target.dataset.neighborhoodKey

    const updatedHoods = Object.assign({}, neighborhoodData)

    updatedHoods[neighborhoodKey].highlighted = false
    updatedHoods[neighborhoodKey].preview = false

    updateNeighborhoodData(updatedHoods)
  }

  const renderNeighborhoodList = () => {
    return Object.keys(neighborhoodData).map( (key, index) => {
      const checked = neighborhoodData[key].show

      const neighborhood = neighborhoodzData.features.find( f => {return f.properties.hood === key})
      return(
        <div data-neighborhood-key={key} onMouseEnter={highlightNeighborhood} onMouseLeave={removeNeighborhoodHighlight} >
          <input 
            data-index={index} type="checkbox" checked={checked} 
            onChange={() => toggleNeighborhoodCheckBox(neighborhood)} 
            data-neighborhood-key={key} onMouseEnter={highlightNeighborhood} onMouseLeave={removeNeighborhoodHighlight}
          />
          <label
            data-neighborhood-key={key} onMouseEnter={highlightNeighborhood}
          >{key}</label>
        </div>
      )
    })
  }

  return (
    <div className="w-full h-5/6 flex">
      <div className="flex-auto w-3/4">
        <MapContainer style={{height: "100%", width: "100%"}} center={[40.446016, -79.959762]} zoom={12}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LayersControl collapsed>
            {renderSteps()}

          </LayersControl>
        </MapContainer>
      </div>
      <div className="w-1/4 border border-black flex flex-col py-3 space-y-3">
        <div>
          <button className="px-4" onClick={showAllSteps}>Show All</button>
          <button onClick={hideAllSteps}>Hide All</button>
        </div>
        <div className="h-80 w-full overflow-y-scroll">
          <div >
            {renderNeighborhoodList()}
          </div>
        </div>
      </div>
    </div>
  )
}

// MyMap.whyDidYouRender = true;

export default MyMap;
