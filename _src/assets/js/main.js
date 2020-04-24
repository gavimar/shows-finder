'use strict';
const inputSearch = document.querySelector('#show_search');
const submitButton = document.querySelector('#submit');
const ulElement = document.querySelector('#search-list');
const ulFavouriteElement = document.querySelector('#favourites-list');

inputSearch.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("submit").click();
  }
});

let showList = null;
let favourites = readLocalStorage();



function connectToApi() {
  ulElement.innerHTML = '';
  fetch(`http://api.tvmaze.com/search/shows?q=${inputSearch.value}`)
    .then(response => response.json())
    .then(data => {
      showList = data;
      renderShows(showList);
      console.log(showList);
    });
}

function renderShows(arr) {
  for (let item of arr) {
    const newCard = document.createElement('li');
    newCard.setAttribute('id', `${item.show.id}`);
    newCard.setAttribute('class', 'liElement');
    
    // for (let element of showList){
    
    //   if (favourites.some(item => item.id === element.id)){
    //     newCard.classList.add('selected');
    //   }
    // }
    
    let showName = document.createTextNode(item.show.name);
    let showTitle = document.createElement('h2');
    showTitle.appendChild(showName);
    newCard.appendChild(showTitle);
    ulElement.appendChild(newCard);
    let showImage = document.createElement('img');
    
    if (item.show.image !== null){
      showImage.src = item.show.image.medium;
      newCard.appendChild(showImage);
    } else{
      showImage.src = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV'
      newCard.appendChild(showImage);
    }
  }
  addClickListeners();
}

function addClickListeners(){
  const liElement = document.querySelectorAll('.liElement');
  for(let liShow of liElement){
    liShow.addEventListener('click',saveFavourites);
  }
}

function saveFavourites(event){
  const selected = event.currentTarget;
  // selected.setAttribute('class', 'selected');
  selected.classList.toggle('selected');
  const index = event.currentTarget.id;
  const object = getObject(index);
  
  if(!favourites.some(item => item.id === parseInt(index))){
    favourites.push(object.show);
    setLocalStorage(favourites);
    renderFavourites(favourites);
    console.log(favourites);
  } else{
    alert('ya esta en favoritos');
  }
}

function getObject(id) {
  return showList.find(show => show.show.id === parseInt(id));
}

function setLocalStorage(favourites){
  localStorage.setItem('favourites',JSON.stringify(favourites));
}

function readLocalStorage(){
  let favourites = JSON.parse(localStorage.getItem('favourites'));
  if(favourites !== null){
    return favourites;
  }
  return favourites = [];
}


function renderFavourites(favourites){
  ulFavouriteElement.innerHTML = '';
  for( let favourite of favourites) {
    if(favourite){
      const newFavourite = document.createElement('li');
      newFavourite.setAttribute('class', 'liFavourite');
      newFavourite.setAttribute('id', `${favourite.id}`);
      let favouriteName = document.createTextNode(favourite.name);
      let favTitle = document.createElement('p');
      favTitle.appendChild(favouriteName);
      // console.log(favourite.name);
      newFavourite.appendChild(favTitle);
      ulFavouriteElement.appendChild(newFavourite);
      
      let closeIcon = document.createElement('i');
      closeIcon.setAttribute('class', 'fa fa-window-close');
      closeIcon.setAttribute('aria-hidden', 'true');
      newFavourite.appendChild(closeIcon);
      
      let favImage = document.createElement('img');
      
      if (favourite.image.medium !== null){
        favImage.src = favourite.image.medium;
        newFavourite.appendChild(favImage);
      } else{
        favImage.src = 'https://via.placeholder.com/50x100/ffffff/666666/?text=TV'
        newFavourite.appendChild(favImage);
      }
    }
  }
  
  addFavouriteListeners();
}

function addFavouriteListeners(){
  const closeButtons = document.querySelectorAll('i');
  for(let i of closeButtons) {
    i.addEventListener('click', removeFav);
  }
}

function removeFav(event){
  const elemSelected = event.target.parentElement;
  const elemId = elemSelected.getAttribute('id');
  const found = favourites.find(element => element.id === (Number(elemId)));
  let favI= favourites.indexOf(found);
  favourites.splice(favI,1);

  setLocalStorage();
  renderFavourites(favourites);
}


submitButton.addEventListener('click', connectToApi);

renderFavourites(favourites);


