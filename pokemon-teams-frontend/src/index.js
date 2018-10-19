const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', () => {

  fetch('http://localhost:3000/trainers')
    .then(response => response.json())
    .then(json => {
      renderTrainerCard(json)
      setReleaseListener()
      setAddListener()
    })
})

function setAddListener() {
  const main = document.querySelector('main')
  main.addEventListener('click', event => {
    if (event.target && event.target.getAttribute('data-trainer-id') !== null) {
      sendNewPkmnPostReq(event.target)
    }
  })
}

function sendNewPkmnPostReq(btnElement) {
  fetch(POKEMONS_URL, {
    'method': 'POST',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    'body': JSON.stringify({
      'trainer_id': btnElement.getAttribute('data-trainer-id')
    })
  })
  .then(response => response.json())
  .then(json => {
    console.log(json)
    //get a reference to the trainer's ul tag
    //get li html from the pokemonobj in the response
    //attach the new li to the trainer's list
    if (!json.error) {
    const list = btnElement.parentElement.querySelector('ul')
    const li = makeListItemFromPkmnObj(json)
    list.appendChild(li)
    }
  })
}

function setReleaseListener() {
  const main = document.querySelector('main')
  main.addEventListener('click', event => {
    if (event.target && event.target.className === 'release') {
      const pkmnId = event.target.getAttribute('data-pokemon-id')
      sendDeletePokemoneRequest(pkmnId)
      event.target.parentNode.remove()
    }
  })
}

function sendDeletePokemoneRequest(pkmnId) {
  fetch(POKEMONS_URL + `/${pkmnId}`, {
    'method': 'DELETE',
    'headers': {
    'Accept' : 'application/json',
    'Content-Type' : 'application/json',
    }
  })
  .then(response => response.json())
  .then(json => {
    console.log(json);
  })
}

function renderTrainerCard(json) {
  const main = document.querySelector('main')
  json.forEach(obj => {
    const cardHTML = createTrainerCardHTML(obj)
    main.appendChild(cardHTML)
  })
}

function createTrainerCardHTML(trainerObj) {
  const card = document.createElement('div')
  card.setAttribute('data-id', trainerObj.id)
  card.setAttribute('class', 'card')

  const nameTag = document.createElement('p')
  nameTag.innerText = trainerObj.name
  card.appendChild(nameTag)

  const addButton = document.createElement('button')
  addButton.setAttribute('data-trainer-id', trainerObj.id)
  addButton.innerText = 'Add Pokemon'
  card.appendChild(addButton)

  const pkmnList = document.createElement('ul')
  const listItems = createPokemonListItems(trainerObj)
  listItems.forEach(listItem => {
    pkmnList.appendChild(listItem)
  })
  card.appendChild(pkmnList)

  return card
}

function createPokemonListItems(trainerObj) {
  const listItems = []
  trainerObj.pokemons.forEach(pokemonObj => {
    const listItem = makeListItemFromPkmnObj(pokemonObj)

    listItems.push(listItem)
  })
  return listItems
}

function makeListItemFromPkmnObj(pokemonObj) {

  const listItem = document.createElement('li')
  listItem.innerText = `${pokemonObj.nickname} (${pokemonObj.species})`

  const releaseBtn = document.createElement('button')
  releaseBtn.className = 'release'
  releaseBtn.setAttribute('data-pokemon-id', pokemonObj.id)
  releaseBtn.innerText = "Release"
  listItem.appendChild(releaseBtn)

  return listItem
}




//post request
//response will include a brand new pokemon which we will attach to trainers
//delete request
//delete the specified pokemon from the database and remove it from the card
