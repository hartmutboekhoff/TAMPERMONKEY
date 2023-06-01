(function(){
  function tryCatchIgnore(f,...args) {
    try {
      return f.apply(this,args);
    }
    catch(e) {
      //console.log('TCI',"error",e);
      //ignore
    }
  }
  class MutationHandler {
    static #instance;
    #reactions = [];
    #observer;
    
    constructor() {
      this.#observer = new MutationObserver(mutations=>{  
        this.#reactions.forEach(s=>{
          let elements = [...document.querySelectorAll(s.selector)];
          if( typeof s.filter == 'function' )
            elements = elements.filter((e,ix,arr)=>tryCatchIgnore.apply(s,[s.filter,e,ix,arr]));
            
          elements.forEach((e,ix,arr)=>{
            if( s.className != undefined ) 
              e.classList.add(...s.className.split(/\s/));
              
            if( typeof s.style == 'string' ) 
              e.style = e.style.cssText + ' ' + s.style;
            else if( typeof s.style == 'object' )
              Object.assign(e.style, s.style);
              
            if( typeof s.callback == 'function' )
              tryCatchIgnore.apply(s,[s.callback,e,ix,arr]);
          });
        });
      });
    }
    
    /**
     *  reaction defines how the observer reacts to DOM-changes and has the following properties
     *    selector (string): a css-selector
     *    filter (function, opt): a callback function to filter the list of 
     *                       matching element after the selector has been applied
     *                       the filter function takes the element as an argument
     *    callback (function,opt): a callback function that is executet for each element
     *                         the callback function takes the element as an argument
     *    className (string,opt): the name of a class, that will be applied to any found element
     *    style (string | object,opt): styles to be added to the element's style. 
     *                             If this is a string, it will be apended to the existing styles
     *    
     *
     *
     */
    addReaction(reaction) {
      this.#reactions.push(reaction);
      if( this.#reactions.length == 1 )
        this.#observer.observe(document.body,{childList:true, subtree:true})
    }
    
    static get instance() {
      if( this.#instance == undefined )
        this.#instance = new MutationHandler();
      return this.#instance;
    }
  }
  
  
  window.onMutation = function(reaction) {
    const reactions = Array.isArray(reaction)? reaction : [reaction];
      
    reactions.forEach(r=>MutationHandler.instance.addReaction(r));
  }
})();

// ------------------------------------------------------------------
console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'common/mutationHandler.js', 'Version '+COMMON_VERSION);
