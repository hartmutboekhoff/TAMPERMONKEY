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
    #recursions=0; #maxRecursions=0;
    
    constructor(selector, reaction) {
      this.#selector = selector;
      this.#reaction = reaction;
      this.#maxRecursions = reaction.maxRecursions ?? this.#maxRecursions ?? 0;
      if( this.#maxRecursions < 0 ) this.#maxRecursions = 0;
      
      if( typeof reaction.className == 'string' )
        this.#classList = reaction.className.split(/\s/).filter(c=>c!='');
      else if( Array.isArray(reaction.className) )
        this.#classList = reaction.className;

      if( reaction.runOnLoad == true )
      	this.#runOnLoad();
    }
    
   	#runOnLoad() {
   		if( document.readyState == 'complete' )
   			this.run();
   		else
   			window.addEventListener('load',()=>this.run());
   	}
    run(mutations) {
    	if( this.#recursions > this.#maxRecursions ) return;
    	
    	++this.#recursions;
    	try {
	      const elements = this.filter([...document.querySelectorAll(this.#selector)]);
	      console.debug('Mutation handler found '+elements.length+' elements for selector:', this.#selector);
	      this.applyClassNames(elements);
	      this.applyStyles(elements);
	      this.applyListeners(elements);
	      this.invokeCallback(elements);
	    }
	    catch(e) {
	    	console.error(e);
	    }
	    finally {
	    	--this.#recursions;
	    }
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
    applyListeners(elements) {
      if( this.#reaction.listeners != undefined )
        elements.forEach(e=>{
          e.__GM_Listeners ??= {};
          for( const k in this.#reaction.listeners ) {
            if( e.__GM_Listeners[k] != true ) {
              e.__GM_Listeners[k] = true;
              const l = this.#reaction.listeners[k];
              if( typeof l == 'function' )
                e.addEventListener(k,ev=>void l(ev));
              else if( typeof l == 'string' )
                e.addEventListener(k,()=>void eval(l))
            }
          }
        });
    }
    invokeCallback(elements) {
      if( typeof this.#reaction.callback == 'function' )
        elements.forEach((e,ix,arr)=>{
        	try {
        		this.#reaction.callback(e,ix,arr);
        	}
        	catch(e) {
        		console.error(e);
        	}
        });
    }
  }
  
  
  class MutationHandler {
    static #instance;
    #reactions = [];
    #observer;
    
    constructor() {
      this.#observer = new MutationObserver(mutations=>{  
      	try {
        	this.#reactions.forEach(r=>r.run(mutations));
      	}
      	catch(e) {
      		console.error(e);
      	}
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
  window.onMutation ??= function(selector,reaction) {
    if( typeof selector == 'string' && typeof reaction == 'object' )
      MutationHandler.instance.addReaction(selector, reaction);
    else if( typeof selector == 'object' )
      for( const s in selector )
        MutationHandler.instance.addReaction(s, selector[s]);
  }
  
})();

// ------------------------------------------------------------------
console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'common/mutationHandler.js', 'Version '+COMMON_VERSION);
