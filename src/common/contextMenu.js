/*
 *
 */
(function() { 
  class ContextMenu {
    #ul;
    
    constructor() {
      this.#ul = document.createElement('ul');
      this.#ul.id = 'context-menu';
      this.#ul.className = 'context-menu';

      this.#ul.addEventListener('mouseout',evout=>{
        if( this.isVisible
            && ( !evout.explicitOriginalTarget 
                 || evout.explicitOriginalTarget.parentNode != this.#ul ) )
          this.close();
      });
    }
    
    #addItems(evctx,items) {
      
      items.map(i=>{
        const li = document.createElement('li');
        li.innerText = i.label;
        li.id = i.id;
        li.tabIndex = 1;
        li.addEventListener('click',evclick=>{
          i.handler(evctx,evclick);
          this.close();
        });
        li.addEventListener('mouseover',()=>li.focus());
        return li;
      }).reduce((acc,i)=>{
        acc.appendChild(i);
        return acc;
      },this.#ul);    
    }
    
    get isVisible() {
      return !!this.#ul.parentNode;
    }
    open(ev, items, parentElement) {
      function getPosition(ev,parentElement) {
        if( ev != undefined )
          return {
            left: ev.x ?? ev.target.offsetLeft + ev.target.offsetWidth / 2,
            top: ev.y ?? ev.target.offsetTop  + ev.target.offsetHeight / 2,
          }
        else if( parentElement != undefined )
          return {
            left: parentElement.offsetLeft + parentElement.offsetWidth / 2,
            top: parentElement.offsetTop  + parentElement.offsetHeight / 2,
          }
        else
          return {
            left: window.innerWidth/2,
            top: window.innerHeight/2,
          }
      }      
      
      ev?.stopPropagation();
      ev?.preventDefault();

      this.#addItems(ev, items);

      const pos = getPosition(ev,parentElement);
      this.#ul.style.left = (pos.left-50)+'px';
      this.#ul.style.top = (pos.top-50)+'px';

      window.KeyHandlers.contextBegin('context-menu', false, true);
      document.body.appendChild(this.#ul);
    }
    close() {
      window.KeyHandlers.contextEnd();              
      document.body.removeChild(this.#ul);
      this.#ul.innerHTML = '';
    }
    focusNext() {
      if( !this.isVisible ) return;
      if( !document.activeElement || document.activeElement == this.#ul.lastChild || document.activeElement.parentNode != this.#ul )
        this.#ul.firstChild.focus();
      else
        document.activeElement.nextSibling.focus();
    }
    focusPrevious() {
      if( !this.isVisible ) return;
      if( !document.activeElement || document.activeElement == this.#ul.firstChild || document.activeElement.parentNode != this.#ul )
        this.#ul.lastChild.focus();
      else
        document.activeElement.previousSibling.focus();
    }
    click() {
      if( !this.isVisible ) return;
      if( document.activeElement && document.activeElement.parentNode == this.#ul )
        document.activeElement.click();
    }
    
  }

  window.ContextMenu = new ContextMenu();
  window.addEventListener('load', ()=>{
    window.KeyHandlers.contextAdd('context-menu', 'ArrowUp', NDNP(()=>window.ContextMenu.focusPrevious()));  
    window.KeyHandlers.contextAdd('context-menu', 'ArrowDown', NPND(()=>window.ContextMenu.focusNext()));  
    window.KeyHandlers.contextAdd('context-menu', 'Tab', NPND(()=>window.ContextMenu.focusNext()));  
    window.KeyHandlers.contextAdd('context-menu', 'Escape', NPND(()=>window.ContextMenu.close()));
    window.KeyHandlers.contextAdd('context-menu', 'Enter', NPND(()=>window.ContextMenu.click()));
    window.KeyHandlers.contextAdd('context-menu', 'NumpadEnter', NPND(()=>window.ContextMenu.click()));
    window.KeyHandlers.contextAdd('context-menu', 'Space', NPND(()=>window.ContextMenu.click()));


   
  });
})();

function createContextMenu(ev, items) {
  window.ContextMenu.open(ev, items);
}
