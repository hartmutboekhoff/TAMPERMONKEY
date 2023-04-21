(function() {

  function cleanupWhitespaces(s) {
    return s != undefined? s.replace(/\s+/g,' ').trim() : '';
  }
  function mergeUtteranceOptions(a, b, c) {
    return {
      pitch: a?.pitch ?? b?.pitch ?? c?.pitch,
      rate: a?.rate ?? b?.rate ?? c?.rate,
      volume: a?.volume ?? b?.volume ?? c?.volume,
      language: a?.language ?? b?.language ?? c?.language,
    };
  } 

  /*
  flattenArray(arr, start, limit) {
    if( start == 0 )
      return arr.flat(limit);
   
    const res = []; 
    for( let a of arr )
      res.push(Array.isArray(a)? flattenArray(a, start-1, limit) : a);
    return res;
  }  
  */

  class NormalizedExtract {
    #text; #nodes;
    
    constructor(extract) {
      if( extract == undefined ) return;
      
      if( typeof extract == 'string' )
        this.#text = extract;
      else if( typeof extract != 'object' ) 
        return;
      else if( Array.isArray(extract) ) 
        this.nodes = extract;
      else if( Array.isArray(extract.nodes) )
        this.nodes = extract.nodes;
      else if( typeof extract.text == 'string' )
        this.#text = extract.text;

      this.pitch = extract.pitch;
      this.rate = extract.rate;
      this.volume = extract.volume;
      this.language = extract.language;
    }
    get isEmpty() {
      return (this.#text == undefined || this.#text == '') 
             && (this.#nodes == undefined || this.#nodes.length == 0);
    }
    get isNested() {
      return this.#nodes != undefined;
    }
    get isText() {
      return this.#text != undefined;
    }
    get text() {
      return this.#text;
    }
    set text(t) {
      if( this.#nodes != undefined ) throw 'Cannot set text for nested node';
      this.#text = t;
    }
    get nodes() {
      return this.#nodes;
    }
    set nodes(n) {
      if( this.#text != undefined ) throw 'Cannot add nested items to text-node';
      this.#nodes = [...n].map(i=>i==undefined
                                 ? undefined
                                 : i.constructor.name == 'NormalizedExtract'
                                 ? i
                                 : new NormalizedExtract(i) 
                             ).filter(i=>i!=undefined && !i.isEmptyy);
    }
    
    addPrefix(text) {
      if( !this.isNested ) this.#convertToNested();
      this.nodes.unshift(new NormalizedExtract(text.toString()));
    }
    addSuffix(text) {
      if( !this.isNested ) this.#convertToNested();
      this.nodes.push(new NormalizedExtract(text.toString()));
    }
    #convertToNested() {
      //if( this.#nodes ) throw 'Invalid operation';
      this.#nodes = [new NormalizedExtract(this.#text)];
      this.#text = undefined;
    }
    replace(pattern,replacement) {
      if( pattern == undefined ) return;
      
      if( this.#text != undefined )
        this.#text = this.#text.replace(pattern,replacement??'');
      else if( this.#nodes != undefined )
        this.#nodes.forEach(n=>n.replace(pattern,replacement??''));
    }

    getUtterances(options) {
      options = mergeUtteranceOptions(this,options);

      if( this.#text != undefined )  {
        const u = new SpeechSynthesisUtterance(this.#text);
        u.pitch = options.pitch;
        u.rate = options.rate;
        u.volume = options.volume;
        u.lang = options.language;
        return [u];
      }
      else if( this.#nodes != undefined )
        return this.#nodes.map(n=>n.getUtterances(options)).flat();
    }
    applyCustomOptions(custom) {
      if( custom.pitch != undefined ) this.pitch = custom.pitch;
      if( custom.rate != undefined ) this.rate = custom.rate;
      if( custom.volume != undefined ) this.volume = custom.volume;
      if( custom.language != undefined ) this.language = custom.language;
      
      if( (custom.prefix??'') != '' ) this.addPrefix(custom.prefix);
      if( (custom.suffix??'') != '' ) this.addSuffix(custom.suffix);

    }
  }
  
  class UtteranceCollector {
    static #defaultOptions = {
      pitch: .8,
      rate: 1.35,
      volume: .8,
      language: 'de-DE',
    }
    #collected = new Set();
    #exclude;
    #customCollectors = [];
    #extractedData;
    
    constructor(node, options) {
      this.#initOptions(options);
      this.#extractedData = this.#collectNode(node);
      if( (this.prefix??'') != '' ) this.#extractedData.addPrefix(this.prefix);
      if( (this.suffix??'') != '' ) this.#extractedData.addSuffix(this.suffix);
    }
    get utterances() {
      return this.#extractedData.getUtterances(mergeUtteranceOptions(this.options,UtteranceCollector.#defaultOptions)).filter(u=>!!u);
    }
    
    convertDates() {
      this.#extractedData.replace(
        /(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2})(?::(\d{2}))? (AM|PM)/g,
        (...args)=>' '+args[2]+'.'+args[1]+'.'+args[3]+' '+(args[7]=='PM'?+args[4]+12:args[4])+':'+args[5]+' '
      );

      
    }

    #initOptions(options) {
      this.optoins = mergeUtteranceOptions(options, UtteranceCollector.#defaultOptions)

      if( options == undefined ) return;

      this.prefix = options.prefix;
      this.suffix = options.suffix;

      if( Array.isArray(options.exclude) )
        this.#exclude = options.exclude.join(',');
      else if( typeof options.exclude == 'string' )
        this.#exclude = options.exclude;
      
      if( options.childElements != undefined )
        for( let selector in options.childElements ) 
          this.#customCollectors.push(Object.assign({},options.childElements[selector], {selector}));
    }
    #getCustomCollector(node) {
      return typeof node.matches == 'function' 
                ? this.#customCollectors?.find(c=>node.matches(c.selector))
                : undefined;
    }
    #collectNode(node) {
      if( this.#collected.has(node) ) return undefined;
      this.#collected.add(node);
      
      if( this.#isExcluded(node) ) return undefined;
      
      const custom = this.#getCustomCollector(node);
      const extract = this.#extractNode(node, custom);
      
      if( extract == undefined ) return undefined;

      const norm = new NormalizedExtract(extract);
      if( custom ) {
        if( custom.replace )
          norm.replace(custom.replace.pattern, custom.replace.replacement);
        norm.applyCustomOptions(custom);
      }
      return norm;
    }
    #extractNode(node,custom) {
      if( typeof custom?.extract == 'function' )
        return custom.extract(node);
      
      if( custom?.text != undefined )
        return custom.text.toString();
      
      const f = this[node.nodeName];
      return typeof f == 'function'
                ? f.apply(this,[node]) 
                : this.default(node);
    }
    #collectChildNodes(node) {
      return [...node.childNodes].map(cn=>this.#collectNode(cn));
    }
    #isExcluded(node) {
      return this.#exclude == undefined? false : !!node.matches?.(this.#exclude);
    }

    default(node) {
      if( node.childNodes != undefined && node.childNodes.length > 0 )
        return this.#collectChildNodes(node);
      return cleanupWhitespaces(node.innerText ?? node.nodeValue);
    }
    ['#text'](node) {
      return cleanupWhitespaces(node.nodeValue);
    }
    ['#comment'](node) {
      return undefined;
      //return node.nodeValue;
    }
    EM(node) {
      const res = this.default(node) ?? {};
      res.pitch = 1.3;
      res.volume = 1;
      res.rate = 0.8;
      return res;
    }
    INPUT(node) {
      return node.value;
    }
    TEXTAREA(node) {
      return node.value;
    }
    SELECT(node) {
      return [...node.options].find(o=>o.value == node.value)?.innerText;
    }
    IMG(node) {
      let text = node.title;
      if( text != node.alt ) text += ', '+node.alt;
      text = cleanupWhitespaces(text);
      if( text == '' )
        text = node.src.match(/([^\\\/]*)\.[^\\\/\.]*$/)?.[1] ?? '';
      return 'Bild: '+text;
    }
    
    static get options() {
      return UtteranceCollector.#defaultOptions;
    }
    static set options(v) {
      UtteranceCollector.#defaultOptions.pitch = v.pitch ?? UtteranceCollector.#defaultOptions.pitch;
      UtteranceCollector.#defaultOptions.rate = v.rate ?? UtteranceCollector.#defaultOptions.rate;
      UtteranceCollector.#defaultOptions.volume = v.volume ?? UtteranceCollector.#defaultOptions.volume;
      UtteranceCollector.#defaultOptions.language = v.language ?? UtteranceCollector.#defaultOptions.language;
    }
  }  
  
  class ReadOutQueue {
    static #instance;
    #queue = [];
    #current;

    static get instance() {
      if( ReadOutQueue.#instance == undefined )
        ReadOutQueue.#instance = new ReadOutQueue();
      return ReadOutQueue.#instance;
    }
    
    #start() {
      if( !this.#current )
        this.#next();
    }
    #next() {
      do {
        this.#current = this.#queue.shift();
        if( !this.#current ) return;
      } while( !this.#current.length )

      this.#current[this.#current.length-1].onend = ()=>this.#next();
      this.#current.forEach(u=>window.speechSynthesis.speak(u));
    }
    #pushUtterances(us, k, e) {
      us.key = k;
      us.element = e
      this.#queue.push(us);
      this.#start();
    }
    #pushText(t, k, options) {
      const opt = Object.assign({},options);
      opt.lang = opt.language;
      k ??= t;
      const u = new SpeechSynthesisUtterance(t, opt);
      u.lang = 'de-DE';
      this.#pushUtterances([u], k);
      return k;
    }
    #pushElement(e, k, options) {
      if( this.#queue.find(u=>u.element==e) != undefined ) 
        retrun;
        
      const u = new UtteranceCollector(e,options);
      u.convertDates();
      k ??= e.id ?? e.className ?? e.nodeName;
      if( u.utterances.length == 0 )
        this.#pushText('Kein Text.',k, e);
      else
        this.#pushUtterances(u.utterances, k, e);
    }
    read(v,options) {
      if( this.#current && this.#current.element == v ) 
        return;

      this.cancel();
      this.push(v, options);
    }
    push(v,options) {
      return v instanceof HTMLElement
          ? this.#pushElement(v, undefined, options)
          : this.#pushText(v, undefined, options);
    }
    cancel() {
      this.#queue.length = 0;
      this.#current = undefined;
      window.speechSynthesis.cancel();
    }
    skip(to) {
      if( !!to ) {
        const ix = this.#queue.findIndex(u=>u.key==to||u.element==to);
        if( ix > 0 )
          this.#queue.splice(0,ix);
      }
      if( !!this.#current )
        window.speechSynthesis.cancel();
      this.#next();
    }
    get isReading() {
      return this.#current != undefined;
    }
  }
  
  class ReadOutUI {
    #cssPathHelper = [];
    #selectors = [];
    #keyHandlers = {
      Escape: function(ev) {
        if( this.isReading ) {
          this.cancel();
          ev.stopPropagation();
          ev.preventDefault();
        }
      },
      Tab: function(ev) {
        if( this.isReading ) {
          this.skip();
          ev.stopPropagation();
          ev.preventDefault();
        }
      },
    };

    constructor() {
      window.addEventListener('keydown',ev=>{
        const h = this.#keyHandlers[ev.key];
        if( typeof h == 'function' )
          h.apply(this,[ev]);
        //else
        //  console.log('Key unhandled: ', ev.code);
      });
      window.addEventListener('mousemove',ev=>{
        this.#onMousemove(ev)
      });
    }
    
    get isReading() {
      return ReadOutQueue.instance.isReading;
    }
    read(e,options) {
      ReadOutQueue.instance.read(e,options);
    }
    queue(e, options) {
      ReadOutQueue.instance.push(e,options);
    }
    cancel() {
      ReadOutQueue.instance.cancel();
    }
    skip(to) {
      ReadOutQueue.instance.skip(to);
    }
    registerReadOut(selector,options) {
      this.#selectors.push({selector,options});
    }
    #printCssPath(ev) {
      function getCssPath(e) {
        let p = '';
        do {
          p = e.nodeName + (e.id?'#'+e.id.replace(/\./g,'\\.'):'') + (e.className?'.'+e.className.replace(/\s+/g,'.'):'') + ' ' + p;
          e = e.parentNode;
        } while( e != undefined && e.nodeName != 'BODY' );
        return p;
      }
      this.#cssPathHelper.push(getCssPath(ev.target))
      console.log(this.#cssPathHelper);
    }
    #readOutElement(ev) {
      const target = document.elementFromPoint(ev.clientX,ev.clientY);
      const match = this.#findClosestMatch(target);
      if( match != undefined ) 
        this.read(match.ancestor,match.options);
      //else
      //  console.log('no math for ', target);
    }
    #onMousemove(ev) {
      if( ev.shiftKey && ev.ctrlKey )
        this.#readOutElement(ev);
      else if( ev.shiftKey && ev.altKey )
        this.#printCssPath(ev);
      
    }
    #findClosestMatch(element) {
      function getDistance(el,anc) {
        let dist = 0;
        while( !!el & el !== anc ) {
          el = el.parentNode;
          ++dist;
        }
        return dist;
      }

      if( !element ) return undefined;
      return this.#selectors.map(s=>({ancestor:element.closest(s.selector),options:s.options}))
                            .filter(ai=>!!ai.ancestor)
                            .map(ai=>(ai.distance=getDistance(element,ai.ancestor),ai))
                            .sort((a,b)=>a.distance-b.distance)[0];
    }       
  }

  window.ReadOut = document.ReadOut = new ReadOutUI();
  window.registerForReadOut = function(selector,options){window.ReadOut.registerReadOut(selector,options)};
})();