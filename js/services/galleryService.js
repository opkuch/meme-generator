'use strict'

const GALLERY_KEY = 'galleryData'
const KEYWORDS_KEY = 'keywordsData'

var gImgs
const gKeywords = [
  {txt: 'LMAO', rate: 10},
  {txt: 'hilarious', rate: 15},
  {txt: 'global', rate: 10},
  {txt: 'weird', rate: 20},
  {txt: 'funny', rate: 10}
]

var gFilter
var gImageId

function initGalleryModel() {
  gImgs = loadFromStorage(GALLERY_KEY)
  if (!gImgs) _createImgs()
  gImageId = gImgs.length
}

function getImg(id) {
  return gImgs.find((img) => img.id === id)
}

function getImgs() {
  let imgs = gImgs
  if (gFilter) {
    imgs = gImgs.filter(image => image.keywords.some(key => key.includes(gFilter)))
  }
  return imgs
}

function addImageToModel(img) {
  const newImage = _createImg(++gImageId, img.src, ['my'])
  gImgs.push(newImage)
  saveToStorage(GALLERY_KEY, gImgs)
  renderGallery()
  return newImage
}

function getKeywords() {
  return gKeywords
}

function updateKeywordRate(key) {
  gFilter = key
  const clickedKey = gKeywords.find(keyword => keyword.txt === key)
  if (clickedKey.rate >= 30) return
  clickedKey.rate++
}

function _getKeyword() {
  const length = gKeywords.length

  return gKeywords[getRandomIntInclusive(0, length - 1)].txt
}

function _createImgs() {
  gImgs = []
  for (var i = 1; i < 26; i++) {
    gImgs.push(
      _createImg(i, `../../imgs/${i}.jpg`, [`${_getKeyword()}`])
    )
  }
  saveToStorage(GALLERY_KEY, gImgs)
}

function _createImg(id, url, keywords) {
  return {
    id,
    url,
    keywords,
  }
}

function clearFilter() {
  gFilter = ''
}

function setFilter(txt) {
  gFilter = txt
}