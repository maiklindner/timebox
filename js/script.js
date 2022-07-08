const
  parValues = new URLSearchParams(window.location.search)
var
  parNames = (parValues.get('names') || 'Rainer,Dennis,Jakub,Maik').split(','),
  parMaxTime = parValues.get('time') || '3',
  parDuskDawn = parValues.get('dusk') || '1',
  inpMaxTime = document.getElementById('inpMaxTime'),
  docNames = document.getElementById('names'),
  docTimer = document.getElementById('timer'),
  t0 = new Date,
  sortNames = [],
  cssdusk = document.getElementById('dusk'),
  cssdawn = document.getElementById('dawn')

  cssdusk.disabled = (parDuskDawn == 0)
  cssdawn.disabled = (parDuskDawn == 1)

document.addEventListener('keyup', event => {
  console.log(event.code)
  switch (event.code) {
    case 'Space':
      t0 = new Date
      break
    case 'KeyS':
      docNames.innerHTML = shuffleArray(parNames)
      break
    case 'KeyT':
      inpMaxTime.select()
      break
    case 'Enter':
    case 'NumpadEnter':
    case 'Escape':
      inpMaxTime.blur()
      break
    case 'NumpadAdd':
    case 'BracketRight':
      inpMaxTime.value++
      resizeMaxTime()
      break
    case 'NumpadSubtract':
    case 'Slash':
      inpMaxTime.value > 0 ? inpMaxTime.value-- : 0
      resizeMaxTime()
      break
    case 'KeyN':
      editNames()
      break
    case 'KeyD':
      fromDuskTillDawn()
      break
  }
})

document.getElementById('head').addEventListener('click', event => {
  editNames()
})
document.getElementById('names').addEventListener('click', event => {
  docNames.innerHTML = shuffleArray(parNames)
})
document.getElementById('timer').addEventListener('click', event => {
  t0 = new Date
})
document.getElementById('docu').addEventListener('click', event => {
  copyClip()
})
document.addEventListener('dblclick', event => {
  fromDuskTillDawn()
})

inpMaxTime.addEventListener('keyup', event => {
  inpMaxTime.value = inpMaxTime.value.replace(/\D/g, '')
  inpMaxTime.value = inpMaxTime.value > 5999 ? 5999 : inpMaxTime.value
  resizeMaxTime()
  t0 = new Date
})

function editNames() {
  parNames = prompt('Example: Alpha,Beta,Gamma', parNames.join(',')).split(',')
  docNames.innerHTML = shuffleArray(parNames)
  resizeNames()
}

function resizeMaxTime() {
  parMaxTime = inpMaxTime.value
  inpMaxTime.style.width = parMaxTime.length < 1 ? 1 : parMaxTime.length + "ch"
}

function resizeNames() {
  document.getElementById("names").style.fontSize = (11 / sortNames.length > 4 ? 4 : 11 / sortNames.length) + 'vw'
}

function copyClip() {
  let
    url = window.location.href.split('?')[0] + '?names=' + parNames.join(',') + '&time=' + parMaxTime + '&dusk=' + parDuskDawn
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert('URL copied!\r\n\r\n' + url);
    })
    .catch(() => {
      alert('URL not copied, here it is anyway:\r\n\r\n' + url);
    });
}

function fromDuskTillDawn() {
  if (cssdawn.disabled == true) {
    cssdawn.disabled = false
    cssdusk.disabled = true
    parDuskDawn = 0
  } else {
    cssdawn.disabled = true
    cssdusk.disabled = false
    parDuskDawn = 1
  }
 if (window.getSelection) 
  window.getSelection().removeAllRanges()
 else if (document.selection) 
  document.selection.empty()
}

function shuffleArray(array) {
  let
    i = 0,
    r = ''
  sortNames = []
  array.forEach(element => {
    sortNames[i] = [Math.random(), element]
    i++
  });
  sortNames.sort()
  sortNames.forEach(element => {
    r = r + '<li>' + element[1] + '</li>'
  });
  return r
}

docNames.innerHTML = shuffleArray(parNames)
inpMaxTime.value = parMaxTime
docTimer.innerHTML = ((Math.floor(((parMaxTime * 60) % 3600) / 60) < 10) ? '0' + Math.floor(((parMaxTime * 60) % 3600) / 60) : Math.floor(((parMaxTime * 60) % 3600) / 60)) + ":" + ((Math.floor((parMaxTime * 60) % 60) < 10) ? '0' + Math.floor((parMaxTime * 60) % 60) : Math.floor((parMaxTime * 60) % 60))
resizeMaxTime()
resizeNames()

var x = setInterval(function () {
  let t1 = new Date().getTime()
  let varDiff = (parMaxTime * 60 + 1) - (t1 - t0) / 1000,
    varHours = Math.abs(varDiff < 0 ? Math.ceil(varDiff / 3600) : Math.floor(varDiff / 3600))
  varMinutes = Math.abs(varDiff < 0 ? Math.ceil((varDiff % 3600) / 60) : Math.floor((varDiff % 3600) / 60))
  varSeconds = Math.abs(Math.floor(varDiff % 60))
  varText = (varHours > 0 ? varHours + ':' : '') + ((varMinutes < 10) ? '0' + varMinutes : varMinutes) + ":" + ((varSeconds < 10) ? '0' + varSeconds : varSeconds)
  docTimer.innerHTML = '<div class="' + ((varDiff < (parMaxTime * 10 + 1)) ? ' al1' : '') + ((varDiff < 0) ? ' al2' : '') + ((varHours > 0) ? ' hours' : '') + '">' + varText + '</div>'
  document.title = (varDiff < 0 ? '-' : '') + varText + ' | TIMEBOX'
}, 1000)