'use strict'

var gCanvas
var gCtx
var gStartPos
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gImgId
var gStickers = [
  '💢',
  '🕶',
  '👓',
  '👕',
  '🤣',
  '💪',
  '👀',
  '👂',
  '👃',
  '👼',
  '🧔',
  '👳‍♂️',
  '🧠',
  '👁',
  '🐱‍🐉',
  '😈',
  '🥶',
  '😎',
  '😍',
  '😂',
]
var gStickerPage

function initMeme() {
  gCanvas = document.querySelector('canvas')
  gCtx = gCanvas.getContext('2d')
  resizeCanvas()
  renderStickers()
  renderMeme()
}

function renderMeme() {
  const meme = getMeme()
  const imgProps = getImg(meme.selectedImgId)
  const elCanvasContainer = document.querySelector('.canvas-container')

  var img = new Image()
  img.src = imgProps.url
  if (imgProps.id !== gImgId) {
    gCtx.canvas.height = (gCanvas.width * img.height) / img.width
    elCanvasContainer.style.height = gCanvas.height + 'px'
  }
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    renderLines()
    drawLineRect()
  }
  gImgId = imgProps.id
}

function renderLines() {
  const lines = getLines()
  lines.forEach((line) => {
    drawText(line)
  })
}

function drawText(line) {
  gCtx.save()
  gCtx.font = `${line.size}px ${line.family}`
  gCtx.fillStyle = line.color
  gCtx.fillText(`${line.txt}`, line.pos.x, line.pos.y)
  gCtx.strokeStyle = line.strokeColor
  gCtx.lineWidth = 2
  gCtx.strokeText(`${line.txt}`, line.pos.x, line.pos.y)
  line.width = gCtx.measureText(line.txt).width
  gCtx.restore()
}

function drawLineRect() {
  const line = getSelectedLine()
  if (!line.txt || !line.isMark) return
  var lineHeight = line.size * 1.286
  gCtx.strokeRect(line.pos.x, line.pos.y - line.size, line.width, lineHeight)
}

function onSetLineTxt(txt) {
  setLineTxt(txt)
  setLineWidth(gCtx.measureText(txt).width)
  renderMeme()
}

function onChangeFontSize(diff) {
  changeFontSize(+diff)
  renderMeme()
}

function onChangeTextColor(color) {
  changeTextColor(color)
  renderMeme()
}

function onChangeStrokeColor(color) {
  ChangeStrokeColor(color)
  renderMeme()
}

function onRandomizeMeme() {
  randomizeMeme()
  renderMeme()
  switchScreens({ dataset: { value: 'editor' } })
}

function onAddLine() {
  document.querySelector('.meme-txt').value = ''
  addLine()
  const line = getSelectedLine()
  const lineIdx = getSelectedLineIdx()
  if (lineIdx === 1) line.pos.y = gCanvas.height - 50
  else if (lineIdx >= 2) line.pos.y = (gCanvas.height - 50) / 2
  renderMeme()
}

function onAddSticker(sticker) {
  document.querySelector('.meme-txt').value = sticker
}

function onSwitchLine() {
  changeLineMarking(true)
  switchLine()
  renderMeme()
}

function onMoveLine(diff) {
  moveLineVertically(+diff)
  renderMeme()
}

function onDeleteLine() {
  deleteLine()
  renderMeme()
}

function onAlignLine(elBtn) {
  const direction = elBtn.dataset.direction
  alignLine(direction)
  renderMeme()
}

function onSaveMeme() {
  saveMeme()
  renderSavedMemes()
}

function onDown(ev) {
  const pos = getEvPos(ev)
  const line = getLineByPos(pos)
  if (!line) return
  setDragging(true)
  gStartPos = pos
  document.querySelector('.canvas-container').style.cursor = 'grabbing'
}

function onMove(ev) {
  if (getIsDragging()) {
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveLine(dx, dy)
    gStartPos = pos
    renderMeme()
  }
}

function onUp() {
  setDragging(false)
  document.querySelector('.canvas-container').style.cursor = 'grab'
}

function moveLine(dx, dy) {
  const line = getSelectedLine()
  line.pos.x += dx
  line.pos.y += dy
}

function getEvPos(ev) {
  var pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  }
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault()
    ev = ev.changedTouches[0]
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetParent.offsetTop - ev.target.offsetTop,
    }
  }
  return pos
}

function onDeselectLine() {
  changeLineMarking(false)
  renderMeme()
}

function onDownloadMeme(elLink) {
  var imgContent = gCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
}

function onChangeFontFamily(font) {
  changeFontFamily(font)
  renderMeme()
}

function resizeCanvas() {
  const elCanvasContainer = document.querySelector('.canvas-container')
  gCtx.canvas.width = elCanvasContainer.offsetWidth
  gCtx.canvas.height = elCanvasContainer.offsetHeight
}

function getCanvasWidth() {
  return gCanvas.width
}

function onCloseShareModal() {
  document.querySelector('.share-modal').classList.remove('move-center')
}

function getCanvas() {
  return gCanvas
}

function renderStickers() {
  var strHTMLs = ['']
  strHTMLs = gStickers.map(sticker => `<p class="sticker" onclick="onSetLineTxt(this.innerText)">${sticker}</p>`)
  strHTMLs.push('<button class="btn nxt" onclick="onChangeStickerPage(-1)">▶</button>')
  document.querySelector('.stickers').innerHTML = strHTMLs.join('')
}