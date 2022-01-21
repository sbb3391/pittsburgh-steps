import * as d3 from 'd3';
import fs from "fs";

const steps = JSON.parse(fs.readFileSync("src/data/steps.json", 'utf8'))
const neighborhoods = JSON.parse(fs.readFileSync("src/data/pittsburghNeighborhoods.json", 'utf-8'))

const createNewGeoJson = () => {
  let newGeoJson = neighborhoods

  newGeoJson.features.forEach( (neighborhood, index) => {
    const stepsInNeighborhood = steps.features.filter( step => {
      const pointsInNeighborhood = step.geometry.coordinates.filter( point => {
        return d3.geoContains(neighborhood, point)
      })

      return pointsInNeighborhood.length > 0
    })

    newGeoJson.features[index].steps = stepsInNeighborhood
  })

  return newGeoJson
}

const newGeoJsonData = JSON.stringify(createNewGeoJson(), null, 4)

fs.writeFileSync("src/data/newStepsData.json", newGeoJsonData)
