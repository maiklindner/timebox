const parValues = new URLSearchParams(window.location.search)
    const parNames = (parValues.get('names') || 'Donatello,Leonardo,Michelangelo,Raphael').split(',')
    var parMaxTime = parValues.get('time') || '3'

    var
      inpMaxTime = document.getElementById('inpMaxTime'),
      docNames = document.getElementById('names'),
      docTimer = document.getElementById("timer"),
      t0 = new Date,
      d = []

    document.addEventListener('keyup', event => {
      switch(event.code) {
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
        case 'Escape':
          inpMaxTime.blur()
          break
      }
    })

    document.getElementById('names').addEventListener('click', event => {
      docNames.innerHTML = shuffleArray(parNames)
    })
    document.getElementById('timer').addEventListener('click', event => {
      t0 = new Date
    })

    inpMaxTime.addEventListener('keyup', event => {
      inpMaxTime.value = inpMaxTime.value.replace(/\D/g, '')
      inpMaxTime.value = inpMaxTime.value>5999?5999:inpMaxTime.value
      parMaxTime = inpMaxTime.value
      resizeMaxTime()
      t0 = new Date
    })

    function resizeMaxTime() {
      inpMaxTime.style.width = parMaxTime.length<1?1:parMaxTime.length + "ch"
    }

    function resizeNames() {
        document.getElementById("names").style.fontSize = (12/d.length>4?4:12/d.length)+'vw'
    }

    function shuffleArray(array) {
      let
        i = 0,
        r = ''
      array.forEach(element => {
        d[i] = [Math.random(),element]
        i++
      });
      d.sort()
      d.forEach(element => {
        r = r + '<li>'+element[1]+'</li>'
      });
      return r
    }
    
    docNames.innerHTML = shuffleArray(parNames)
    inpMaxTime.value = parMaxTime // t0.toLocaleDateString("en-CA"); 
    docTimer.innerHTML = ((Math.floor(((parMaxTime*60) % 3600) / 60)<10)?'0'+Math.floor(((parMaxTime*60) % 3600) / 60):Math.floor(((parMaxTime*60) % 3600) / 60)) + ":" + ((Math.floor((parMaxTime*60) % 60)<10)?'0'+Math.floor((parMaxTime*60) % 60):Math.floor((parMaxTime*60) % 60))
    resizeMaxTime()
    resizeNames()

    var x = setInterval(function() {
      let t1 = new Date().getTime()
      let varDiff = (parMaxTime*60+1) - (t1 - t0)/1000,
        varHours = Math.abs(varDiff<0?Math.ceil(varDiff / 3600):Math.floor(varDiff / 3600))
        varMinutes = Math.abs(varDiff<0?Math.ceil((varDiff % 3600) / 60):Math.floor((varDiff % 3600) / 60))
        varSeconds = Math.abs(Math.floor(varDiff % 60))
        varText = (varHours>0?varHours+':':'')+((varMinutes<10)?'0'+varMinutes:varMinutes) + ":" + ((varSeconds<10)?'0'+varSeconds:varSeconds)
      docTimer.innerHTML = '<div class="'+((varDiff<(parMaxTime*10+1))?' al1':'')+((varDiff<0)?' al2':'')+((varHours>0)?' hours':'')+'">'+varText+'</div>'
      document.title = (varDiff<0?'-':'') + varText + ' | TIMEBOX'
    }, 1000)
