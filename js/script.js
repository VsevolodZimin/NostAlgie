'use strict'

const navigation = document.querySelector('.navigation')

const leftBtn = document.querySelector('.button--left');
const rightBtn = document.querySelector('.button--right');

const oneImg = document.querySelector('#one img');
const twoImg = document.querySelector('#two img');
const threeImg = document.querySelector('#three img');

const onePlayer = document.querySelector('#one #player--bar');
const twoPlayer = document.querySelector('#two #player--bar');
const threePlayer = document.querySelector('#three #player--bar');

const oneLyrics = document.querySelector('#one .lyrics--window');
const twoLyrics = document.querySelector('#two .lyrics--window');
const threeLyrics = document.querySelector('#three .lyrics--window');

const lyricsWindow = document.querySelector('.lyrics--window');
const playerBar = document.querySelector('.player--bar--container');

const Panel = function(image, lyrics, player){
    this.image = image;
    this.lyrics = lyrics;
    this.player = player;
}

let dataPromise = fetch('./data.json');

dataPromise
.then(response => response.json())
.then(d => {

    const panelIterator = {
        currentPanelIndex: 0,
        panels: [
            new Panel(oneImg, oneLyrics, onePlayer), 
            new Panel(twoImg, twoLyrics, twoPlayer), 
            new Panel(threeImg, threeLyrics, threePlayer)
        ], 

        getNumberOfPanels: function(){
            return this.panels.length;
        },

        next: function(){
            this.currentPanelIndex = (this.currentPanelIndex + 1) % this.getNumberOfPanels();
            return this.panels[this.currentPanelIndex];
        },
    
        current: function(){
            return this.panels[this.currentPanelIndex];
        },
    
        previous: function(){
            this.currentPanelIndex = ((this.currentPanelIndex + -1) + this.getNumberOfPanels()) % this.getNumberOfPanels();
            return this.panels[this.currentPanelIndex];
        }
    }

    
    const dataRepository = {
        currentDataIndex: 0,

        data: Object.entries(d),

        findById: function(id){
            for(let i = 0; i < this.data.length; i++) {
                if(id === this.data[i][1].id) {
                    this.currentDataIndex = i;
                    return this.data[i][1];
                }
            }
        },

        getNumberOfSongs: function(){
            return this.data.length;
        },
        next: function(){
            this.currentDataIndex = (this.currentDataIndex + 1) % this.getNumberOfSongs();
            return this.data[this.currentDataIndex][1];
        },

        current: function(){
            return this.data[this.currentDataIndex][1];
        },

        previous: function(){
            this.currentDataIndex = ((this.currentDataIndex - 1) + this.getNumberOfSongs()) % this.getNumberOfSongs();
            return this.data[this.currentDataIndex][1];
        }
    }

    dataRepository.data.forEach((obj) => {
        bindItem(obj[1]);
    });
    
    wireUpCarousel(dataRepository.current(), panelIterator.current());

    leftBtn.addEventListener('click', () => {  
        panelIterator.current().player.src = "";
        wireUpCarousel(dataRepository.previous(), panelIterator.previous());
    });

    rightBtn.addEventListener('click', () => { 
        panelIterator.current().player.src = "";
        wireUpCarousel(dataRepository.next(), panelIterator.next());
    });

    function bindItem(songObject){

        const item = document.createElement('article');
        item.classList.add('nav--item');
        item.dataset.id = songObject.id;
        item.innerHTML = 
        `<div class="nav--item--order">${songObject.id}</div>
         <img src="./img/flags/${songObject.language}.png" class="nav--item--flag" alt="">
         <div class="nav--item--title">${songObject.artist} - ${songObject.songName}</div>
        `
        item.addEventListener('click', () => {
            const selectedSong = dataRepository.findById(item.dataset.id);
            wireUpCarousel(selectedSong, panelIterator.current());
            updateSelection(item);
        });
        navigation.appendChild(item);
    }
});

function wireUpCarousel(data, panel){
    panel.image.src = data.image;
    panel.player.src = data.player;
    panel.lyrics.innerHTML = data.lyrics;
    const item = findItemById(data.id);
    deleteSelection();
    selectItem(item[0]);
    item[0].scrollIntoView({behavior: 'smooth', block: 'end'})
    document.body.style.backgroundImage = `url(${data.image})`;
}

function findItemById(id){
    const items = navigation.getElementsByClassName('nav--item');
    return [...items].filter(item => item.dataset.id === id);
}

function deleteSelection(){
    const oldItem = findSelectedItem();
    if(oldItem) {
        oldItem.classList.remove('selected--nav--item');
    }
}

function updateSelection(newItem){
    deleteSelection();
    selectItem(newItem);
}

function findSelectedItem(){
    return navigation.querySelector('.selected--nav--item');
}
function selectItem(item){
    item.classList.add('selected--nav--item');
}