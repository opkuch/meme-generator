'use strict'

const SAVED_MEMES_KEY = 'savedData'

var gMeme = {
  selectedImgId: 5,
  selectedLineIdx: 0,
  isDragging: false,
  imgData: '',
  lines: [
    {
      txt: 'Write something..',
      size: 40,
      color: 'white',
      strokeColor: 'black',
      pos: { x: 0, y: 50 },
      width: 250,
      family: 'IMPACT',
      isDrag: false,
      isMark: true,
    },
  ],
}

var gSavedMemes

function getLines() {
  return gMeme.lines
}

function getLineSize() {
  const line = getSelectedLine()
  return {
    width: line.width,
    height: line.size,
  }
}

function getSelectedLine() {
  return gMeme.lines[gMeme.selectedLineIdx]
}

function getSelectedLineIdx() {
  return gMeme.selectedLineIdx
}

function getMeme() {
  return gMeme
}

function setImage(imgId) {
  clearLines()
  gMeme.selectedImgId = imgId
}

function clearLines() {
  gMeme.selectedLineIdx = 0
  gMeme.lines = [
    {
      txt: 'Write something..',
      size: 40,
      color: 'white',
      strokeColor: 'black',
      pos: { x: 0, y: 50 },
      width: 250,
      family: 'IMPACT',
      isDrag: false,
      isMark: true,
    },
  ]
}

function setLineTxt(txt) {
  const line = getSelectedLine()
  line.txt = txt
}

function changeFontSize(diff) {
  const line = getSelectedLine()
  line.size += diff
}

function changeFontFamily(font) {
  const line = getSelectedLine()
  line.family = font
}

function changeTextColor(color) {
  const line = getSelectedLine()
  line.color = color
}

function addLine() {
  const lines = getLines()
  const line = {
    txt: "Write something..",
    size: 40,
    color: 'white',
    pos: { x: 0, y: 50 },
    width: 250,
    family: 'IMPACT',
    isDrag: false,
    isMark: true,
  }
  lines.push(line)
  gMeme.selectedLineIdx = lines.length - 1
}

function switchLine() {
  const line = getSelectedLine()
  line.isMark = true
  const lines = getLines()
  var lineIdx = gMeme.selectedLineIdx
  if (lineIdx === lines.length - 1) {
    gMeme.selectedLineIdx = 0
    return
  }
  gMeme.selectedLineIdx++
}

function setLineWidth(width) {
  const line = getSelectedLine()
  line.width = width
}

function moveLineVertically(diff) {
  const line = getSelectedLine()
  line.pos.y += diff
}

function deleteLine() {
  gMeme.lines.splice(gMeme.selectedLineIdx, 1)
  if (gMeme.selectedLineIdx) gMeme.selectedLineIdx--
}

function alignLine(direction) {
  const line = getSelectedLine()
  switch (direction) {
    case 'left':
      line.pos.x = 0
      break
    case 'right':
      line.pos.x = Math.abs(getCanvasWidth() - line.width)
      break
    case 'center':
      line.pos.x = Math.abs(getCanvasWidth() - line.width) / 2
  }
}

function setDragging(bool) {
  gMeme.isDragging = bool
}

function getIsDragging() {
  return gMeme.isDragging
}

function isLineClicked(clickedPos) {
  const line = getSelectedLine()
  const { pos } = line
  const distance = Math.sqrt(
    (pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2
  )
  return distance <= line.width
}

function ChangeStrokeColor(color) {
  const line = getSelectedLine()
  line.strokeColor = color
}

function changeLineMarking(bool) {
  const line = getSelectedLine()
  line.isMark = bool
}

function saveMeme() {
  gSavedMemes = loadFromStorage(SAVED_MEMES_KEY)
  if (!gSavedMemes) gSavedMemes = []
  gMeme.imgData = gCanvas.toDataURL('image/jpeg')
  gSavedMemes.push(gMeme)
  saveToStorage(SAVED_MEMES_KEY, gSavedMemes)
}

function getSavedMemes() {
  return loadFromStorage(SAVED_MEMES_KEY)
}

function getLineByPos(pos) {
  if (!gMeme.lines.length) return
  const clickedLine = gMeme.lines.find((line) => {
    const xStart = line.pos.x
    const xEnd = line.width + line.pos.x
    const yStart = line.pos.y - line.size
    const yEnd = line.pos.y
    // console.log('pos: ', pos)
    // console.log('xStart:', xStart, 'xEnd: ', xEnd, 'yStart: ', yStart, 'yEnd', yEnd)
    if (pos.x >= xStart && pos.x <= xEnd && pos.y >= yStart && pos.y <= yEnd)
      return line
  })
  if (clickedLine) updateClickedLine(clickedLine)
  return clickedLine
}

function updateClickedLine(clickedLine) {
  var lineIdx = gMeme.lines.findIndex(line => {
      return line === clickedLine
  })
  gMeme.selectedLineIdx = lineIdx
  gMeme.lines[lineIdx].isDrag = true
}

function loadSavedMemes() {
  return loadFromStorage(SAVED_MEMES_KEY)
}

function randomizeMeme() {
  const imgs = getImgs()
  gMeme = {
    selectedImgId: getRandomIntInclusive(1, imgs.length - 1),
    selectedLineIdx: 0,
    isDragging: false,
    imgData: '',
    lines: []
  }
  gMeme = randomizeLines(gMeme)
}

function randomizeLines(randomMeme) {
  const randomNum = getRandomIntInclusive(1,2)
  for (let i = 0; i < randomNum; i++) {
    randomMeme.lines.push(
      {
        txt: genMemeSentence(),
        size: getRandomIntInclusive(16, 35),
        color: getRandomColor(),
        strokeColor: getRandomColor(),
        pos: {x: 0, y: 50},
        family: 'IMPACT',
        isDrag: false,
        isMark: false
      }
    )
    if (i === 1) randomMeme.lines[1].pos.y = 200
  }
  return randomMeme
}