(function(){
  const KeyModifiers = ['','Ctrl', 'Alt', 'Shift', 'Ctrl+Alt', 'Ctrl+Shift', 'Alt+Shift', 'Ctrl+Alt+Shift'];

  class Key {
    constructor(k) {
      const keys = k.split('+');
      this._key = keys.slice(-1)[0];
      keys.slice(0,-1).forEach(m=>this['_'+m.toLowerCase()]=true);
    }
    get ctrl()  {return this._ctrl?  'Ctrl+' :'';}
    get alt()   {return this._alt?   'Alt+'  :'';}
    get shift() {return this._shift? 'Shift+':'';}
    get key()   {return this._key;}
    get modifiers() {return (this.ctrl+this.alt+this.shift).slice(0,-1);}
    get fullCode() {return this.ctrl+this.alt+this.shift+this.key;}
  }

  class KeyHandler {
    #prefixkey;
    constructor(prefixkey) {
      this.#prefixkey = (prefixkey||'') == ''? '' : prefixkey + ', ';

      const u = e=>{
        //console.debug(this.#prefixkey + e.code + ' is unhandled');
      }
      u.unhandled = 'unhandled';
    	KeyModifiers.forEach(m=>this[m]=u);
    }
  }
  class KeyHandlerMap {
    #map = {};
    #prefixkey;
    constructor(prefixkey) {
      this.#prefixkey = prefixkey;
  	}
  	get(key) {
  		var h = this.#map[key];
  		if( h == undefined )
  			this.#map[key] = h = new KeyHandler(this.#prefixkey);
  		return h;
  	}
  }
  class KeyHandlers {
    #defaultOptions = {
      excludeFormFields: true,
    };

    #map = new KeyHandlerMap();
    #l2map = undefined;
    #l2timeout = undefined;
    #contexts = {};
    #contextStack = [];
    
    
    constructor() {
    }

  	#getKeyCode(code) {
  		let keys = code.split('+');
  		if( keys.length == 1 )
  			return {key: code, modifiers: '', fullCode: code};
  			
  		const modifiers = keys
  		        .slice(0,-1)
  		        .reduce((acc,m)=>{
  		            const k = m.charAt(0).toUpperCase() + m.slice(1).toLowerCase();
  		            acc[k] = k+'+';
  		            return acc;
  		          },{});
  		
  		return { key: keys[keys.length-1],
  						 modifiers: (modifiers.Ctrl+modifiers.Alt+modifiers.Shift).slice(0,-1),
  						 fullCode: code,
  					 };
  	}
		#addL1Handler(map, k, handler, options) {
			let code = new Key(k);
			map.get(code.key)[code.modifiers] = handler;
			handler.options = Object.assign({}, this.#defaultOptions, options);
		}    
		#addL2Handler(map, k1, k2, handler, options) {
			let L1code = new Key(k1);
			let L2code = new Key(k2);
			let L1handler = map.get(L1code.key);
			let L2map = L1handler[L1code.modifiers];
			if( typeof L2map == 'function' ) {
				L1handler[L1code.modifiers] = L2map = 
						new KeyHandlerMap('Sequence '+L1code.fullCode+', ');
			}
			L2map.get(L2code.key)[L2code.modifiers] = handler;
			handler.options = Object.assign({}, this.#defaultOptions, options);
		}
    
    /**
     *  add(key, handler, options)
     *  add(Key1, Key2, handler, options)
     *
     *  key (string): the Key-Code optionally preceded by modifier-keys e.g. 'Shift+Ctrl+KeyP'
     *  key1 (string): first key of a two-key combination
     *  key2 (string): second key of a two-key combination
     *  handler (function): the handler-function
     *  options (object):  optional settings to controll the handlers behaviour
     *      stopPropagation (boolean): if true, the evetn will not bubble upwards. Defaults to false.
     *      preventDefault (boolean):  if true, the default operation will not be performed. Defaults to false.
     *      excludeFormFields (boolean): if true (default), the handler will not be invoked, if event.target is a form field like <input>, <select>, etc.
     */
    add() {
  		if( typeof arguments[1] == 'function' ) 
  			this.#addL1Handler(this.#map, ...arguments);
  		else if( typeof arguments[2] == 'function' )
  			this.#addL2Handler(this.#map, ...arguments);
  		else
        console.error('add KeyHandler: no handler-function specified.');
  	} 
  	contextAdd(context, ...args)  {
  	  let map = this.#contexts[context];
  	  if( map == undefined )
  	    this.#contexts[context] = map = new KeyHandlerMap();
  	  
  		if( typeof args[1] == 'function' ) 
  			this.#addL1Handler(map, ...args);
  		else if( typeof args[2] == 'function' )
  			this.#addL2Handler(map, ...args);
  		else
        console.error('add KeyHandler: no handler-function specified.');
  	}   	  

  	contextBegin(name, once, exclusive) { if( this.#contexts[name] == undefined
  	) throw 'Invalid KeyHandler-Context "' + name + '".';

  	  if( this.#contextStack.length == 0 || this.#contextStack[0].name != name )
  	    this.#contextStack.unshift({name, once, exclusive});
  	    
  	  return this.#contextStack.length;
  	}
  	contextEnd(depth) {
  	  depth ||= 1;
  	  if( depth < 0 || depth >= this.#contextStack.length )
  	    depth = this.#contextStack.length;
 	  
 	    this.#contextStack.splice(0, depth);
  	  return this.#contextStack.length;
  	}
   	dispatch(ev) {
   	  function execute(h) {
   	    if( !h.options?.excludeFormFields 
   	        || !['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'OPTION', 'OPTGROUP'].includes(ev.target.tagName) ) {
     	    try {
     	      h(ev);
     	      if( !!h.options?.preventDefault ) ev.preventDefault();
     	      if( !!h.options?.stopPropagation ) ev.stopPropagation();
     	      return true;
     	    }
     	    catch(e) {
     	      console.error(e);
     	    }
     	  }
   	    return false;
   	  }
   	  const handle = (hmap, code, modifiers)=>{
  			const h = hmap.get(code)[modifiers];
  			if( typeof h == 'function' ) {
  			  execute(h);
  			  return h.unhandled ?? 'handled';
  			}
  			else {
  				this.#l2map = h;
  				this.#l2timeout = window.setTimeout(clearTimer, 1500);
  				return 'waitFor2ndKey';
  			}
   	  }
   	  const clearTimer = ()=>{
  			if( this.#l2timeout != undefined ) 
  			  window.clearTimeout(this.#l2timeout);
  			this.#l2map = this.#l2timeout = undefined;
   	    
   	  }
   	  
  	  const modifiers =  ((ev.ctrlKey? 'Ctrl+' : '') +
              		        (ev.altKey? 'Alt+' : '') +
              		        (ev.shiftKey? 'Shift+' : ''))
              		       .slice(0,-1);

  		if( this.#l2map != undefined ) {
  			const h = this.#l2map.get(ev.code)[modifiers];
  			clearTimer();
  			execute(h);
  			return;
  		}
  		
      let i = 0;
  		while( i < this.#contextStack.length ) {
  		  const ctx = this.#contextStack[i];
  		  switch( handle(this.#contexts[ctx.name], ev.code, modifiers) ) {

  		    case  'handled':
  		      if( ctx.once ) 
  		        this.contextEnd(i+1);
  		    case  'waitFor2ndKey':
  		      return;
  		      
  		    case 'unhandled':
  		      if( ctx.exclusive ) 
  		        return;
  		        
  		      if( ctx.once ) {
  		        this.contextEnd(i+1);
  		        i = 0;
  		      }
  		      else {
  		        ++i;
  		      }
  		    
  		  } // switch
  		} // while
  		
  		handle(this.#map, ev.code, modifiers);
  		
  		return false;
  	}  
  }

  const instance = new KeyHandlers();
  window.KeyHandlers = instance;
  window.addKeyHandler = (...args)=>instance.add(...args);
  
  window.addEventListener('load', ()=>{
    document.addEventListener('keydown', e=>instance.dispatch(e??event));
  });
})();

function NP(f) {
  return ev=>{
    const r = f(ev);
    ev.stopPropagation();
    return r;
  }
}
function ND(f) {
  return ev=>{
    const r = f(ev);
    ev.preventDefault();
    return r;
  }
}
function NPND(f) {
  return ev=>{
    const r = f(ev);
    ev.stopPropagation();
    ev.preventDefault();
    return r;
  }
}
const NDNP = NPND;