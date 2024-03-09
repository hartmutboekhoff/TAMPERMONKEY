(function(){

  function getMovieList() {
    const list = document.querySelector('div.trefferliste div').children;
    let cinema = "unbekannt";
    return [...list].reduce((acc,e)=>{
      if( e.nodeName == "H2" )
        cinema = e.innerText;
      else
        [...e.querySelectorAll('li > strong:nth-child(1) > span:nth-child(1)')].forEach(movie=>{
          const name = movie.innerText.replace(/\((O|DF)\w+\)/, '').trim();
          acc[name] ??= new Set();
          acc[name].add(cinema);
        });
      return acc;
    }, {});
  }

  window.addEventListener('load',()=>{

    for( const [movie, cinemas] of Object.entries(getMovieList()) )
      window.ReadOut.queue(`${movie}, wird gezeigt in: ${[...cinemas].join(' ')}. `);
      
    
    
    // ================================================
    console.log('initializing shortcut-keys');
    //window.addKeyHandler('Space',ev=>alert('key pressed'));
  
  
    // ================================================
    console.log('initializing read-out elements');
    //window.registerForReadOut('selector');
    

    // ================================================
    console.log('initializing mutation-reactions');
    //window.onMutation('selector', reaction);
  
  
    // ================================================


  });
})();