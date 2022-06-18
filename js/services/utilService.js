'use strict'

function makeId(length = 6) {
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var txt = ''
    for (var i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
  }

  function genMemeSentence() {
    const memesSentences = [
      'I never eat falafel',
      'DOMS DOMS EVERYWHERE',
      'Stop Using i in for loops',
      'Armed in knowledge',
      'Js error "Unexpected String"',
      'One does not simply write js',
      'I`m a simple man i see vanilla JS, i click like!',
      'JS, HTML,CSS?? Even my momma can do that',
      'May the force be with you',
      'I know JS',
      'JS Where everything is made up and the rules dont matter',
      'Not sure if im good at programming or good at googling',
      'But if we could',
      'JS what is this?',
      'Write hello world , add to cv 7 years experienced',
    ]
    
    return memesSentences[Math.floor(Math.random() * memesSentences.length)]
  }
  
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
  }
  
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  