'use strict'

const { createElement } = require('react')

function initGallery() {
  initGalleryModel()
  renderGallery()
  renderSavedMemes()
  renderKeywords()
  renderDatalist()
  switchScreens()
}

function renderGallery() {
  const imgs = getImgs()
  var strHTMLs = []
  imgs.forEach((img) => {
    strHTMLs.push(
      `<div class"img-container" ><img src="${img.url}" class="img" data-value="editor" data-imgid="${img.id}" onclick="onImgSelect(this); switchScreens(this)"/></div>`
    )
  })
  const elGallery = document.querySelector('.gallery-container')
  elGallery.innerHTML = strHTMLs.join('')
}

function onImgSelect(elImg) {
  const imgId = +elImg.dataset.imgid
  setImage(imgId)
  initMeme()
}

function switchScreens(el = { dataset: { value: 'gallery' } }) {
  document.querySelector('.meme-txt').value = ''
  const elGallery = document.querySelector('.gallery-container')
  const elEditor = document.querySelector('.meme-editor')
  const elSearchBox = document.querySelector('.search-container')
  const elSavedMemes = document.querySelector('.saved-memes-container')
  const elGalleryBtn = document.querySelector('.gallery-btn')
  const elMemesBtn = document.querySelector('.saved-memes-btn')
  const elSearchInput = elSearchBox.querySelector('.search-input')
  switch (el.dataset.value) {
    case 'gallery':
      elGallery.classList.remove('disable')
      elSearchBox.classList.remove('disable')
      elEditor.classList.add('disable')
      elSavedMemes.classList.remove('move-screen')
      elGalleryBtn.classList.add('nav-active')
      elMemesBtn.classList.remove('nav-active')
      break
    case 'editor':
      elGallery.classList.add('disable')
      elSearchBox.classList.add('disable')
      elEditor.classList.remove('disable')
      elSavedMemes.classList.remove('move-screen')
      elMemesBtn.classList.remove('nav-active')
      elGalleryBtn.classList.remove('nav-active')
      break
    case 'memes':
      elGallery.classList.add('disable')
      elSearchBox.classList.add('disable')
      elEditor.classList.add('disable')
      elSavedMemes.classList.add('move-screen')
      elGalleryBtn.classList.remove('nav-active')
      elMemesBtn.classList.add('nav-active')
      break
  }
  elSearchInput.value = ''
  clearFilter()
  renderGallery()
}

function toggleMenu() {
  document.body.classList.toggle('menu-open')
  document.querySelector('.main-screen').classList.toggle('active')
}

function onSetFilter(txt) {
  setFilter(txt)
  renderGallery()
}

function renderSavedMemes() {
  const memes = loadSavedMemes()
  if (!memes) return
  let strHTMLs
  strHTMLs = memes.map((meme, idx) => {
    let memeImg = new Image()
    memeImg.src = meme.imgData
    return `<figure>
      <img class="img saved-meme" src="${memeImg.src}" alt="" onclick="onDisplaySavedMeme(this)"/>
    </figure> `
  })
  const elSavedMemes = document.querySelector('.saved-memes')
  elSavedMemes.innerHTML = strHTMLs.join('')
}

function onImgInput(ev) {
  loadImageFromInput(ev, setUploadedImage)
}

function loadImageFromInput(ev, onImageReady) {
  var reader = new FileReader()
  //After we read the file
  reader.onload = function (event) {
    var img = new Image() // Create a new html img element
    img.src = event.target.result // Set the img src to the img file we read
    //Run the callBack func , To render the img on the canvas
    img.onload = onImageReady.bind(null, img)
  }
  reader.readAsDataURL(ev.target.files[0]) // Read the file we picked
}

function setUploadedImage(img) {
  const newImage = addImageToModel(img)
  setImage(newImage.id)
  initMeme()
  switchScreens({ dataset: { value: 'editor' } })
}

function renderKeywords() {
  const keywords = getKeywords()
  var strHTMLs
  strHTMLs = keywords.map(
    (key) =>
      `<p class="keyword" data-key="${key.txt}" onclick="onSetFilterByKey(this.dataset.key)" style="font-size: ${key.rate}px;">${key.txt}</p>`
  )
  const elKeywords = document.querySelector('.keywords')
  elKeywords.innerHTML = strHTMLs.join('')
}

function renderDatalist() {
  const keywords = getKeywords()
  var strHTMLs
  strHTMLs = keywords.map((key) => `<option value="${key.txt}">`)
  const elDatalist = document.querySelector('#key-datalist')
  elDatalist.innerHTML = strHTMLs.join('')
}

function onSetFilterByKey(key) {
  const elSearchInput = document.querySelector('.search-input')
  elSearchInput.value = key
  updateKeywordRate(key)
  renderKeywords()
  renderGallery()
}

function onDisplaySavedMeme(elImg) {
  const elModal = document.querySelector('.modal')
  elModal.appendChild(elImg)
  elModal.classList.add('active')
  renderSavedMemes()
}

function onToggleModal() {
  const elModal = document.querySelector('.modal')
  elModal.innerHTML = ''
  elModal.classList.toggle('active')
}
