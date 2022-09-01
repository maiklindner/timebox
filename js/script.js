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
  pdiff = 0,
  sortNames = [],
  cssdusk = document.getElementById('dusk'),
  cssdawn = document.getElementById('dawn'),
  p = false,
  x;

  cssdusk.disabled = (parDuskDawn == 0);
  cssdawn.disabled = (parDuskDawn == 1);

document.addEventListener('keyup', event => {
  console.log(event.code);
  switch (event.code) {
    case 'KeyR':
      reset();
      break;
    case 'KeyS':
      docNames.innerHTML = shuffleArray(parNames);
      break;
    case 'KeyT':
      inpMaxTime.select();
      break;
    case 'Enter':
    case 'NumpadEnter':
    case 'Escape':
      inpMaxTime.blur();
      break;
    case 'NumpadAdd':
    case 'BracketRight':
      inpMaxTime.value++;
      resizeMaxTime();
      break;
    case 'NumpadSubtract':
    case 'Slash':
      inpMaxTime.value > 0 ? inpMaxTime.value-- : 0;
      resizeMaxTime();
      break;
    case 'KeyN':
      editNames();
      break;
    case 'KeyD':
      toggleFromDuskTillDawn();
      break;
    case 'Space':
    case 'KeyF':
      toggleFade();
      break;
    case 'KeyP':
      togglePause();
      break;
    case 'KeyH':
      toggleHelp();
      break;
  }
})

document.getElementById('head').addEventListener('click', event => {
  toggleFromDuskTillDawn();
})
document.getElementById('names').addEventListener('click', event => {
  docNames.innerHTML = shuffleArray(parNames);
  clearSelection();
})
document.getElementById('names').addEventListener('dblclick', event => {
  editNames();
})
document.getElementById('timer').addEventListener('click', event => {
  t0 = new Date;
})
document.getElementById('buttonhelp').addEventListener('click', event => {
  toggleHelp();
})
document.getElementById('docu').addEventListener('click', event => {
  copyClip();
})
document.addEventListener('dblclick', event => {
  toggleFade();
  clearSelection();
})

inpMaxTime.addEventListener('keyup', event => {
  inpMaxTime.value = inpMaxTime.value.replace(/\D/g, '');
  inpMaxTime.value = inpMaxTime.value > 5999 ? 5999 : inpMaxTime.value;
  resizeMaxTime();
  t0 = new Date;
})

function editNames() {
  parNames = prompt('Example: Alpha,Beta,Gamma', parNames.join(',')).split(',');
  docNames.innerHTML = shuffleArray(parNames);
  resizeNames();
}

function resizeMaxTime() {
  parMaxTime = inpMaxTime.value;
  inpMaxTime.style.width = parMaxTime.length < 1 ? 1 : parMaxTime.length + "ch";
}

function resizeNames() {
  document.getElementById("names").style.fontSize = (11 / sortNames.length > 4 ? 4 : 11 / sortNames.length) + 'vw';
}

function toggleFade() {
  let
    varBlur = 4,
    content = document.getElementById("content").style;
  if (content.opacity == 1 || content.opacity == '') {
    content.filter = 'blur(' + varBlur + 'em)'
    content.opacity = 0
    clearInterval(x);
  } else {
    docNames.innerHTML = shuffleArray(parNames);
    reset();
    content.filter = 'blur(0em)';
    content.opacity = 1
  }
}

function toggleFromDuskTillDawn() {
  if (cssdawn.disabled == true) {
    cssdawn.disabled = false;
    cssdusk.disabled = true;
    parDuskDawn = 0
  } else {
    cssdawn.disabled = true;
    cssdusk.disabled = false;
    parDuskDawn = 1
  }
}

function togglePause () {
  let timer = document.getElementById('timer').style;
  if (p == false) {
    p = true;
    pdiff = new Date - t0;
    clearInterval(x);
    timer.filter = 'blur(.05em)';
  } else {
    p = false;
    t0 = new Date - pdiff;
    x = setTimeout(function () {
      count();
    }, 0);
    x = setInterval(function () {
      count();
    }, 1000);
    timer.filter = 'blur(0em)';
  }
}

function toggleHelp(){
  let d = document.getElementById('help').style;
  if (d.display == 'block' || d.display == '') {
    d.display = 'none';
  } else {
    d.display = 'block';
  }
}

function reset() {
  t0 = new Date;
  clearInterval(x);
  x = setTimeout(function () {
    count();
  }, 0);
  x = setInterval(function () {
    count();
  }, 1000);
}

function clearSelection() {
  if (window.getSelection)
    window.getSelection().removeAllRanges();
  else if (document.selection)
    document.selection.empty();
}

function count() {
  let t1 = new Date().getTime();
  let varDiff = (parMaxTime * 60 + 1) - (t1 - t0) / 1000,
    varHours = Math.abs(varDiff < 0 ? Math.ceil(varDiff / 3600) : Math.floor(varDiff / 3600))
  varMinutes = Math.abs(varDiff < 0 ? Math.ceil((varDiff % 3600) / 60) : Math.floor((varDiff % 3600) / 60))
  varSeconds = Math.abs(Math.floor(varDiff % 60))
  varText = (varHours > 0 ? varHours + ':' : '') + ((varMinutes < 10) ? '0' + varMinutes : varMinutes) + ":" + ((varSeconds < 10) ? '0' + varSeconds : varSeconds);
  docTimer.innerHTML = '<div class="' + ((varDiff < (parMaxTime * 10 + 1)) ? ' al1' : '') + ((varDiff < 0) ? ' al2' : '') + ((varHours > 0) ? ' hours' : '') + '">' + varText + '</div>';
  document.title = (varDiff < 0 ? '-' : '') + varText + ' | TIMEBOX';
}

function shuffleArray(array) {
  let
    i = 0,
    r = '';
  sortNames = [];
  array.forEach(element => {
    sortNames[i] = [Math.random(), element];
    i++;
  })
  sortNames.sort();
  sortNames.forEach(element => {
    r = r + '<li>' + element[1] + '</li>';
  })
  return r;
}

function copyClip() {
  let
    url = window.location.href.split('?')[0] + '?names=' + parNames.join(',') + '&time=' + parMaxTime + '&dusk=' + parDuskDawn;
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert('URL copied!\r\n\r\n' + url);
    })
    .catch(() => {
      alert('URL not copied, here it is anyway:\r\n\r\n' + url);
    })
}

docNames.innerHTML = shuffleArray(parNames);
inpMaxTime.value = parMaxTime;
docTimer.innerHTML = ((Math.floor(((parMaxTime * 60) % 3600) / 60) < 10) ? '0' + Math.floor(((parMaxTime * 60) % 3600) / 60) : Math.floor(((parMaxTime * 60) % 3600) / 60)) + ":" + ((Math.floor((parMaxTime * 60) % 60) < 10) ? '0' + Math.floor((parMaxTime * 60) % 60) : Math.floor((parMaxTime * 60) % 60));
resizeMaxTime();
resizeNames();

x = setInterval(function () {
  count()
}, 1000);