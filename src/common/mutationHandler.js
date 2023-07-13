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
  
  
  class ReactionWrapper {
    #selector; #reaction; #classList;
    
    constructor(selector, reaction) {
      this.#selector = selector;
      this.#reaction = reaction;
      
      if( typeof reaction.className == 'string' )
        this.#classList = reaction.className.split(/\s/).filter(c=>c!='');
      else if( Array.isArray(reaction.className) )
        this.#classList = reaction.className;
    }
    
    run() {
      const elements = this.filter([...document.querySelectorAll(this.#selector)]);
      this.applyClassNames(elements);
      this.applyStyles(elements);
      this.invokeCallback(elements);
    }
    filter(elements) {
      return typeof this.#reaction.filter == 'function'
                ? elements.filter((e,ix,arr)=>{
                    try {
                      return this.#reaction.filter(e,ix,arr);
                    }
                    catch(e) {
                      return false;
                    }
                  })
                : elements;
    }
    applyClassNames(elements) {
      if( this.#classList != undefined )
        elements.forEach(e=>e.classList.add(...this.#classList));
    }
    applyStyles(elements) {
      elements.forEach(e=>{
        if( typeof this.#reaction.style == 'string' ) 
          e.style = e.style.cssText + ' ' + this.#reaction.style;
        else if( typeof this.#reaction.style == 'object' )
          Object.assign(e.style, this.#reaction.style);
      });
    }
    invokeCallback(elements) {
      if( typeof this.#reaction.callback == 'function' )
        elements.forEach((e,ix,arr)=>this.#reaction.callback(e,ix,arr));
    }
  }
  
  
  class MutationHandler {
    static #instance;
    #reactions = [];
    #observer;
    
    constructor() {
      this.#observer = new MutationObserver(mutations=>{  
        this.#reactions.forEach(r=>r.run());
      });
    }
    
    /**
     *  reaction defines how the observer reacts to DOM-changes and has the following properties
     *    filter (function, opt): a callback function to filter the list of 
     *                       matching element after the selector has been applied
     *                       the filter function takes the element as an argument
     *    callback (function,opt): a callback function that is executet for each element
     *                         the callback function takes the element as an argument
     *    className (string | Array,opt): the name of a class, that will be applied to any found element
     *    style (string | object,opt): styles to be added to the element's style. 
     *                             If this is a string, it will be apended to the existing styles
     *    
     *
     *
     */
    addReaction(selector, reaction) {
      this.#reactions.push(new ReactionWrapper(selector, reaction));
      if( this.#reactions.length == 1 )
        this.#observer.observe(document.body,{childList:true, subtree:true})
    }
    
    static get instance() {
      if( this.#instance == undefined )
        this.#instance = new MutationHandler();
      return this.#instance;
    }
  }
  
  /**
   *  Syntax:
   *    window.onMutation(selector,reaction);
   *    window.onMutation({
   *      ['selector']: reaction,
   *      ['selector-2']: reaction,
   *   });
   */
  window.onMutation = function(selector,reaction) {
    if( typeof selector == 'string' && typeof reaction == 'object' )
      MutationHandler.instance.addReaction(selector, reaction);
    else if( typeof selector == 'object' )
      for( const s in selector )
        MutationHandler.instance.addReaction(s, selector[s]);
  }
  
})();

// ------------------------------------------------------------------
console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'common/mutationHandler.js', 'Version '+COMMON_VERSION);
