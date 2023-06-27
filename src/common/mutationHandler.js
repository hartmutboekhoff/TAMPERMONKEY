(function(){
  function tryCatchIgnore(f,thisArg,args) {
    try {
      return f.apply(thisArg,args);
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
        this.#reactions.forEach(r=>{
          let elements = [...document.querySelectorAll(r.selector)];
          if( typeof r.filter == 'function' )
            elements = elements.filter((e,ix,arr)=>tryCatchIgnore(r.filter,r,[e,ix,arr]));
            
          elements.forEach((e,ix,arr)=>{
            if( r.className != undefined ) 
              e.classList.add(...r.className.split(/\s/));
              
            if( typeof r.style == 'string' ) 
              e.style = e.style.cssText + ' ' + r.style;
            else if( typeof r.style == 'object' )
              Object.assign(e.style, r.style);
              
            if( typeof r.callback == 'function' )
              tryCatchIgnore(r.callback,r,[e,ix,arr]);
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
