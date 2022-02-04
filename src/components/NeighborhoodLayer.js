import React, { useEffect, useState} from 'react';
import {
  GeoJSON,
  Popup,
  LayersControl,
  LayerGroup,
  Tooltip
} from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import { Typography, Divider } from '@material-ui/core'

export default React.memo(function NeighborhoodLayer(props) {

  // changes fill opacity of each neighborhood if you hover over its associated checkbox
  const setFillOpacity = (neighborhood) => {
    return neighborhood.highlighted ? .4 : .05
  }

  const setColor = (neighborhood) => {
    return neighborhood.highlighted ? "red" : "blue"
  }

  const neighborhoodStyle = {
    color: setColor(props.neighborhoodData[props.neighborhoodKey]),
    fillOpacity: setFillOpacity(props.neighborhoodData[props.neighborhoodKey]),
    weight: 1
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

  const stepColor = (step) => {
    const s = props.steps.find( x => x.id === step.id)
    return s.userStep ? "red" : "green"
  }

  return(
    <>
      <LayersControl.Overlay checked={props.neighborhoodData[props.neighborhoodKey].show || props.neighborhoodData[props.neighborhoodKey].preview} name={props.neighborhood.properties.hood} key={props.neighborhood.properties.objectid} >
        <LayerGroup>
          <GeoJSON data={props.neighborhood.geometry} style={neighborhoodStyle} onEachFeature={onEachNeighborhood} > 
            <Tooltip>
              {props.neighborhood.properties.hood}
            </Tooltip>
            {
              props.neighborhood.steps.map( step => {
                const geoJSON = step.geometry;

                const s = props.steps.find( x => x.id == step.id)

                if (s.show) {
                  return(
                    <>
                      <GeoJSON key={step.id} data={geoJSON} pathOptions={{ color: `${stepColor(step)}`, weight: 4}}>
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
                } else {
                  return 
                }
              })
            }
          </GeoJSON>
        </LayerGroup>
      </LayersControl.Overlay> 
    </>
    ) 
})
