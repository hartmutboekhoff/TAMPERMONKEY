(function(){
  window.addEventListener('load',()=>{
    
    // ================================================
    console.log('initializing read-out elements');

    window.registerForReadOut('div.js-detailview.ghx-issue', {
      //prefix: 'version 7',
      childElements: {
        'div.ghx-key': {
          extract: node=>node.innerText.replaceAll('-',' '),
        },
        'span.ghx-extra-field': {
          extract: node=>(node.title.match(/^[^&<:]*/)?.[0]??node.title)+': '+node.innerText,
        },
        'div.ghx-avatar img': {
          extract: node=>node.title,
        },
        'div.ghx-type': {
          text:'',
        }
      },
    });
    
    // ================================================


  });
});