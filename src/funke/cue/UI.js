(function(){
  
  function openTextContextMenu() {
    const b1 = document.activeElement
                       ?.closest("cue-storyline")
                       ?.querySelector("cue-storyline-selection > cue-auto-scroll > cue-mouse-handler > div.storyElements > cue-lazy-story-element-editor-container:nth-child(5) > cue-lazy-load > cue-story-element-editor-container > cue-mouse-handler > cue-lazy-load > cue-insert-menu > div > button");
    if( b1 ) {
      b1.click();
      setTimeout(()=>{
        const b2 = b1.closest('cue-insert-menu').querySelector('div > div > div.left > button');
        if( b2 )
          b2.click();
        else
          console.log('B2 nciht gefunden');
      }, 100);
    }
    else {
      console.log('B1 nicht gefunden');
    }
  }
  function prettyfyOrganizationalUnits() {
    const pubs = {
      'berlin':           {sort: 10, indent: false , style: 'bm'},
      'hamburg':          {sort: 20, indent: false , style: 'ha'},
      'niedersachsen':    {sort: 30, indent: false , style: 'ni'},
      'ni bz':            {sort: 31, indent: true  , style: 'ni'},
      'ni hk':            {sort: 32, indent: true  , style: 'ni'},
      'nrw':              {sort: 40, indent: false , style: 'nrw'},
      'nrw waz':          {sort: 41, indent: true  , style: 'nrw'},
      'nrw nrz':          {sort: 42, indent: true  , style: 'nrw'},
      'nrw wp':           {sort: 43, indent: true  , style: 'nrw'},
      'nrw wr':           {sort: 44, indent: true  , style: 'nrw'},
      'nrw ikz':          {sort: 45, indent: true  , style: 'nrw'},
      'thüringen':        {sort: 50, indent: false , style: 'th'},
      'th ta':            {sort: 51, indent: true  , style: 'th'},
      'th otz':           {sort: 52, indent: true  , style: 'th'},
      'th tlz':           {sort: 53, indent: true  , style: 'th'},
      'system':           {sort:100, indent: false , style: 'sys'},
      'zentralredaktion': {sort:  0, indent: false , style: 'zr'},
    };
    const ul = document.querySelector('cue-form-select#organizational-units ul.options');
    if( ul == undefined || ul.sorted == true ) return;
    const lis = [...ul.querySelectorAll('li')]
                  .map(element=>({element,...pubs[element.innerText.toLowerCase()]}));
    lis.forEach(li=>{
      if( li.indent )
        li.element.classList.add('indent');
      li.element.classList.add(li.style);
      ul.removeChild(li.element);
    });
    lis.sort((a,b)=>a.sort-b.sort);
    ul.sorted = true;
    ul.append(...lis.map(li=>li.element));
    
    console.log(lis);
  }
  
  function highlightActiveDates(el) {
    const [d,t] = [...el.querySelectorAll('input')].map(i=>i.value);
    if( d.length && t.length ) {
      const date = parseDate(`${d} ${t}`);
      const now = new Date();
      const className = date > now? 'future' : date < now? 'past' : 'current';
      el.classList.remove('future','past','current');
      el.classList.add(className);
    }
  }
  
  
  window.addEventListener('load',()=>{
    
    // ================================================
    console.log('initializing shortcut-keys');
    //window.addKeyHandler('Space',ev=>alert('key pressed'));
    window.addKeyHandler('Shift+ContextMenu', openTextContextMenu, {stopPropagation:true,preventDefault:true,excludeFormFields:false});
    
  
  
    // ================================================
    console.log('initializing read-out elements');
    //window.registerForReadOut('selector');
    window.registerForReadOut('cue-list-item-versions', {
      extract: node=>([...node.querySelectorAll('[data-testid="author"]'),...node.querySelectorAll('[data-testid="date"],[data-testid="time"]')].map(n=>n.innerText).join(' '))
    });
  
    

    // ================================================
    console.log('initializing mutation-reactions');
    //window.onMutation('selector', reaction);
    window.onMutation('cue-form-select#organizational-units', {
      callback: prettyfyOrganizationalUnits
    });
    window.onMutation('cue-form-datetime#publish-date,cue-form-datetime#unpublish-date', {
      callback: highlightActiveDates,
    });
  
  
    // ================================================


  });
})();