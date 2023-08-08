(function(){
  function showRenderDate() {
    const generated = getComments().find(c=>c.data.match(/Seite generiert am/) != undefined);
    if( generated != undefined ) {
      const m = generated.data.match(/ (Seite generiert am.*?) in (.*?) - (Server:.*?) - (Wireframe:.*?) - (BuildBranch:.*?) - (Service:.*?) - ArticleIDs: (.*?) /);
      if( m == undefined ) {
        console.log(generated.data);
        alert(generated.data);
      }
      else {
        const [,time,duration,server,wireframe,branch,service,articleIds] = m;
        console.log('Render-Info:',{
          time,
          duration: 'Dauer: '+duration,
          service,
          wireframe,
          branch,
          service,
          articleIds: articleIds?.split(','),
        });
        alert(time+' in '+duration+'\n'+server+'\n'+branch+'\n'+service+'\n'+wireframe+'\nArtikelanzahl: '+(articleIds?.length??0));        
      }
    }
    else
      alert('No render-info available.');
  }
  window.addKeyHandler('Shift+Minus',showRenderDate);
})();