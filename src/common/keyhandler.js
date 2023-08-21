(function(){
  const KeyModifiers = ['','Ctrl', 'Alt', 'Shift', 'Ctrl+Alt', 'Ctrl+Shift', 'Alt+Shift', 'Ctrl+Alt+Shift'];
  
  function getModifierString(o) {
  	  return (o.ctrlKey? 'Ctrl+' : '') +
             (o.altKey? 'Alt+' : '') +
             (o.shiftKey? 'Shift+' : '');
  }

  class Key {
  	#keys = {};
  	
    constructor(k) {
      const keys = k.split('+');
      this.code = keys.slice(-1)[0];
      keys.slice(0,-1).forEach(m=>this[m.toLowerCase()+'Key']=true);
    }
    get key()   {return this.code;}
    get modifiers() {return getModifierString(this).slice(0,-1);}
    get fullCode() {return getModifierString(this)+this.code;}
  }

  class KeyHandler {
    #prefixkey;
    constructor(prefixkey) {
      this.#prefixkey = (prefixkey||'') == ''? '' : prefixkey + ', ';

      const u = ev=>{
        console.debug(this.#prefixkey + getModifierString(ev) + ev.code + ' is unhandled');
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

/*
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
*/
		#addL1Handler(map, k, handler, options) {
			let key = new Key(k);
			map.get(key.code)[key.modifiers] = handler;
			handler.options = Object.assign({}, this.#defaultOptions, options);
		}    
		#addL2Handler(map, k1, k2, handler, options) {
			let L1key = new Key(k1);
			let L2key = new Key(k2);
			let L1handler = map.get(L1key.code);
			let L2map = L1handler[L1key.modifiers];
			if( typeof L2map == 'function' ) {
				L1handler[L1key.modifiers] = L2map = 
						new KeyHandlerMap('Sequence '+L1key.fullCode+', ');
			}
			L2map.get(L2key.code)[L2key.modifiers] = handler;
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
  	  console.group('greasemonkey key-handler');
  	  const r = this.#dispatch(ev);
  	  console.groupEnd();
  	  return r;
  	}
   	#dispatch(ev) {
   	  function isExcludedFormField(target) {
   	    const types = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'OPTION', 'OPTGROUP'];
   	    return types.includes(target.tagName);
   	  }
   	  function execute(h) {
   	    try {
   	      h(ev);
   	      if( !!h.options?.preventDefault ) ev.preventDefault();
   	      if( !!h.options?.stopPropagation ) ev.stopPropagation();
   	      return true;
   	    }
   	    catch(e) {
   	      console.error(e);
   	    }
   	    return false;
   	  }
   	  const handle = (hmap, code, modifiers)=>{
  			const h = hmap.get(code)[modifiers];

  			if( typeof h != 'function' ) {
  				this.#l2map = h;
  				this.#l2timeout = window.setTimeout(clearTimer, 1500);
  				return 'waitFor2ndKey';
  			}
        else if( !!h.options?.excludeFormFields && isExcludedFormField(ev.target) ) {
          console.debug(modifiers+code+' was not handled inside form-field');
          return 'unhandled';
  			}
  			else {
  			  execute(h);
  			  return h.unhandled ?? 'handled';
  			}
   	  }
   	  const clearTimer = ()=>{
  			if( this.#l2timeout != undefined ) 
  			  window.clearTimeout(this.#l2timeout);
  			this.#l2map = this.#l2timeout = undefined;
   	    
   	  }
   	  
  	  const modifiers =  getModifierString(ev).slice(0,-1);

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

const NP = {stopPropagation:true};
const ND = {preventDefault:true};
const NDNP = {preventDefault:true,stopPropagation:true};
const NPND = NDNP;
const HFF = {excludeFormFields:false};

// ------------------------------------------------------------------
console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'common/keyhandler.js', 'Version '+COMMON_VERSION);
