(function(){
  const FormFields = {
            Personalnummer:             {selector:'#QuestionId_r8b53174de9ae4ab5b50dd7a2246e084e + div span input', property: 'value', value: '155688'},
            Nachname:                   {selector:'#QuestionId_r8b117e6a9f93478eacbc6aa5bf56d4e3 + div span input', property: 'value', value: 'Boekhoff'},
            Vorname:                    {selector:'#QuestionId_ra7d1c49e99b64c358e6e1659f3959fce + div span input', property: 'value', value: 'Hartmut'},
            Beginn:                     {selector:'#QuestionId_r5e8e2150b03b45dfbb597ac5e277905a + div div div input', property: 'value', value: (new Date()).toLocaleDateString('en-US')},
            Ende:                       {selector:'#QuestionId_r8f5df90ecd8941cbb61712cb95b365c7 + div div div input', property: 'value', value: ''},
            EMail_Vorgesetzter:         {selector:'#QuestionId_rf8a0a3ceaff6424fbaebdb26d44268ea + div span input', property: 'value', value: 'christian.ullrich@funkemedien.de'},
            CC:                         {selector:'#QuestionId_r2e9392147b1a4096a1d7210913e4393d + div span input', property: 'value', value: 'harald.bange@funkemedien.de'},
            EMail_Hartmut:              {selector:'#QuestionId_r0b198d4ae4074c07b1236dcbeacb2695 + div span input', property: 'value', value: 'hartmut.boekhoff@funkemedien.de'},
            //--CC:                         {selector:'#QuestionId_r83431c1085c64aa6a6394089d9ab8cc1 + div span input', property: 'value', value: 'harald.bange@funkemedien.de'},
            Bearbeiter_Thomas_Habicht:  {selector:'input[type="radio"][name="rbe75d27b7e594fdc955d633f3ef48f00"][value="Habicht, Thomas (thomas.habicht@funkemedien.de)"]', property: 'checked', value:true},
            Empfangsbestaetigung_Nein:  {selector:'input[type="radio"][name="r83431c1085c64aa6a6394089d9ab8cc1"][value="Nein"]',                                              property: 'checked', value:false, attributes: [{name:'aria-checked',value:'false'}]},
            Empfangsbestaetigung_Ja:    {selector:'input[type="radio"][name="r83431c1085c64aa6a6394089d9ab8cc1"][value="Ja"]',                                              property: 'checked', value:true, attributes: [{name:'aria-checked',value:'true'}]},
          }; 
  function fillForm() {
    console.log('filling form fields');
    for( const k in FormFields ) {
      const f = FormFields[k];
      const element = document.querySelector(f.selector);
      if( element != undefined ) {
        f.attributes?.forEach(a=>element.setAattribute(a.name,a.value));
        element[f.property] = f.value;
      }
      else
        console.log('form field not found', k);
    }
  }
  
  window.addEventListener('load',()=>{
    

    
    // ================================================
    console.log('initializing shortcut-keys');
    //window.addKeyHandler('Space',ev=>alert('key pressed'));
  
  
    // ================================================
    console.log('initializing read-out elements');
    //window.registerForReadOut('selector');
    

    // ================================================
    console.log('initializing mutation-reactions');
    //window.onMutation('selector', reaction);
    window.onMutation('body', {
      callback: fillForm,
      runOnLoad: true,
    });
  
  
    // ================================================


  });
})();