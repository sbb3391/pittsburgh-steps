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
  
  const [neighborhoodzData, updateNeighborhoodzData] = useState(neighborhoodz)
  const [neighborhoodData, updateNeighborhoodData] = useState({});
  const [visitedCheckbox, updateVisitedCheckbox] = useState(true)
  const [notVisitedCheckbox, updateNotVisitedCheckbox] = useState(true)
  
  // runs only once when the page loads. Loads all neighborhood data to state
  useEffect( () => {
    const neighborhoodHash = {}
  
    neighborhoodz.features.forEach( f => {
      neighborhoodHash[`${f.properties.hood}`] = {
        show: true,
        hood_no: f.properties.hood_no,
        highlighted: false,
        preview: false
      }
      const steps = f.steps.map( f => {
          return {
          id: f.id,
          userStep: false,
          material: f.properties.material,
          name: f.properties.name,
          number_of_steps: f.properties.number_of_steps,
          condition: "",
          show: true
        }
      })

      neighborhoodHash[`${f.properties.hood}`].steps = steps
    })

    fetchUserSteps()
    .then( resp => resp.json())
    .then( json => {

      Object.keys(neighborhoodHash).forEach( key => {
        neighborhoodHash[key].steps.forEach( step => {
          const userStep = json.steps.find( s => step.id === s.id )

          if (userStep) {
            step.userStep = true
          }
        })
      })

      updateNeighborhoodData(neighborhoodHash);

    })
  }, [])

  // Runs once when the page loads. Fetches all user data for steps.
  const fetchUserSteps = () => {
    const userId = JSON.parse(window.localStorage.user).id
    return fetch(`http://localhost:3000/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${window.localStorage.stepsToken}`
      }
    })
  }
  
  const showAllSteps = (e) => {
    e.preventDefault()

    const newNeighborhoodData = Object.assign({}, neighborhoodData)

    Object.keys(newNeighborhoodData).forEach( key => {
      newNeighborhoodData[key].show = true

      newNeighborhoodData[key].steps.forEach( step => {
        step.show = true
      })
    })

    updateNeighborhoodData(newNeighborhoodData)
    updateVisitedCheckbox(true)
    updateNotVisitedCheckbox(true)
  }

  const hideAllSteps = (e) => {
    e.preventDefault()

    const newNeighborhoodData = Object.assign({}, neighborhoodData)

    Object.keys(newNeighborhoodData).forEach( key => {
      newNeighborhoodData[key].show = false
    })

    updateVisitedCheckbox(true)
    updateNotVisitedCheckbox(true)
    updateNeighborhoodData(newNeighborhoodData)
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

      const steps = neighborhoodData[k].steps

      return(
        <NeighborhoodLayer key={neighborhood.properties.hood_no} steps={steps} neighborhoodKey={k} neighborhood={neighborhood} neighborhoodData={neighborhoodData}/>
      ) 
    })
  }

  const toggleNeighborhoodCheckBox = (event, neighborhood) => {
    neighborhoodzData.features.forEach( (n, index) => {
      if (n.properties.hood === neighborhood.properties.hood) {
        const hood = neighborhoodData[n.properties.hood]

        const updatedHood = hood
        updatedHood.show = !updatedHood.show
        
        if (updatedHood.preview) {
          updatedHood.preview = false;
        } 
          
        const newNeighborhoodData = Object.assign({}, neighborhoodData)

        newNeighborhoodData[`${n.properties.hood}`] = hood
        
        updateNeighborhoodData(newNeighborhoodData)

        removeNeighborhoodHighlight(event)
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
            onChange={(event) => toggleNeighborhoodCheckBox(event, neighborhood)} 
            data-neighborhood-key={key} onMouseEnter={highlightNeighborhood} onMouseLeave={removeNeighborhoodHighlight}
          />
          <label
            data-neighborhood-key={key} onMouseEnter={highlightNeighborhood}
          >{key}</label>
        </div>
      )
    })
  }

  const toggleVisitedCheckbox = () => {
    const bool = visitedCheckbox

    const newNeighborhoodData = Object.assign({}, neighborhoodData)

    Object.keys(newNeighborhoodData).forEach( key => {
      newNeighborhoodData[key].steps.forEach( step => {
        if (step.userStep) {
          step.show = !bool
        }
      })
    })

    updateNeighborhoodData(newNeighborhoodData)
    updateVisitedCheckbox(!bool)

  }

  const toggleNotVisitedCheckbox = () => {
    const bool = notVisitedCheckbox

    const newNeighborhoodData = Object.assign({}, neighborhoodData)

    Object.keys(newNeighborhoodData).forEach( key => {
      newNeighborhoodData[key].steps.forEach( step => {
        if (!step.userStep) {
          step.show = !bool
        }
      })
    })

    updateNeighborhoodData(newNeighborhoodData)
    updateNotVisitedCheckbox(!bool)
  }

  if (Object.keys(neighborhoodData).length > 0) {
    return (
      <div className="w-full h-[88%] flex">
        <div className="flex-auto w-5/6">
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
        <div className="w-1/6 border border-black flex flex-col py-3 space-y-6">
          <div className="flex justify-around"> 
            <button className="px-4" onClick={showAllSteps}>Show All</button>
            <button onClick={hideAllSteps}>Hide All</button>
          </div>
          <div className="h-80 w-11/12 overflow-y-scroll mx-auto">
            <div >
              {renderNeighborhoodList()}
            </div>
          </div>
          <div className="h-30 w-full flex justify-around">
            <div>
              <input 
                type="checkbox" checked={visitedCheckbox}
                onChange={() => toggleVisitedCheckbox()} 
              />
              <label
              >Visited
              </label>
            </div>
            <div>
              <input 
                type="checkbox" checked={notVisitedCheckbox}
                onChange={() => toggleNotVisitedCheckbox()} 
              />
              <label
              >Not Visited
              </label>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return <div></div>
  }
}

// MyMap.whyDidYouRender = true;

export default MyMap;
