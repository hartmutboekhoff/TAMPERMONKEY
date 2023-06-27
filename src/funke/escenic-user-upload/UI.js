(function(){
  window.addEventListener('load',()=>{
    document.getElementById('file').setAttribute('accept','.xlsx,.xlsm');
    
    if(location.hostname == 'esc-pub-tools-uat.cloud.funkedigital.de' )
      document.body.classList.add('uat');
    
  });
})();