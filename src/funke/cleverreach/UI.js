(function(){
  window.addEventListener('load',()=>{
    const Accounts = [
      {id:9481, name:'Thüringen'},
      {id:161911, name:'Berlin'},
      {id:222593, name:'Hamburg'},
      {id:226854, name:'NRW'},
      {id:238033, name:'Braunschweig'},
    ];
    
    
    function createAccountButtons() {
      function highlightButton() {
        buttons.forEach(btn=>btn.classList.remove('selected'));
        buttons.find(btn=>btn.id==clientInput.value)?.classList.add('selected');
      }
      const clientInput = document.querySelector('form[name="loginform"] input#client_id');
      if( !clientInput ) return;

      clientInput.addEventListener('input',highlightButton);
      
      const buttons = Accounts.map(({id,name})=>{
        const btn = document.createElement('span');
        btn.id=id;
        btn.className = 'account-button';
        btn.innerText = name;
        btn.addEventListener('click',()=>{
          clientInput.value = id;
          highlightButton();
        });
        return btn;
      });
      clientInput.after(...buttons);
    }
    
    
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



    createAccountButtons();

  });
})();