import fs from "fs";

const neighborhoods = JSON.parse(fs.readFileSync("src/data/pittsburghNeighborhoods.json", 'utf-8'))


const populateNeighborhoods = () => {
  fetch('https://localhost:3000/populate_neighborhoods', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(neighborhoods)
  })
  .then( resp => resp.json())
  .then( json => {
    debugger;
  })

}

