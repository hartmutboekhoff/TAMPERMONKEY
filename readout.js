(function() {

  function filterRecursiveObject(obj,filter,recursiveProperty) {
    if( obj != undefined && Array.isArray(obj[recursiveProperty]) )
      obj[recursiveProperty] = obj[recursiveProperty].filter(o=>filterRecursiveObject(o,filter,recursiveProperty));
      
    return filter(obj);
  }

  class UtteranceCollector {
    static #defaultOptions = {
      pitch: .8,
      rate: 1.35,
      volume: .8,
      language: 'de-DE',
    }
    #collected = new Set();
    
    constructor(node, options) {
      this.options = Object.assign({}, UtteranceCollector.#defaultOptions, options);
      this.utterances = this.#collect(node);
    }
    #collect(n) {
      let extracted = this.#collectNode(n);
      if( !Array.isArray(extracted) ) extracted = [extracted];
      const normalized = extracted.map(ex=>this.#normalize(ex))
                                  .filter(n=>filterRecursiveObject(n,o=>o!=undefined&&((o.nodes!=undefined&&o.nodes.length>0)||(o.text!=undefined&&o.text!='')),'nodes'));
      const utterances = normalized.map(n=>this.#buildUtterances(n, this.options))
                                   .flat(Infinity);
      return utterances;
    }
    #collectNode(node) {
      if( this.#collected.has(node) ) return undefined;
      this.#collected.add(node);
      return this.#extractNode(node);
    }
    collectChildNodes(node) {
      return [...node.childNodes].map(cn=>this.#collectNode(cn));
    }

    #buildUtterances(tn,options) {
      if( tn.text != undefined ) {
        const u = new SpeechSynthesisUtterance(tn.text)
        u.pitch =   tn.pitch ??    options.pitch;
        u.volume =  tn.volume ??   options.volume;
        u.rate =    tn.rate ??     options.rate;
        u.lang = tn.language ?? options.language;
        return u
      }
      else {
        const opts2 = {
          pitch:    tn.pitch ??    options.pitch,
          volume:   tn.volume ??   options.volume,
          rate:     tn.rate ??     options.rate,
          language: tn.language ?? options.language,
        };
        return tn.nodes.map(n=>this.#buildUtterances(n,opts2));
      }
    }
    #normalize(extract) {
      if( extract == undefined ) return undefined;
      
    const norm = {};
      
      if( typeof extract == 'string' )
        norm.text = extract;
      else if( typeof extract != 'object' ) 
        return undefined;
      else if( Array.isArray(extract) ) 
        norm.nodes = extract;
      else if( Array.isArray(extract.nodes) )
        norm.nodes = extract.nodes;
      else if( typeof extract.text == 'string' )
        norm.text = extract.text;

      if( !!norm.nodes )
        norm.nodes = norm.nodes.map(n=>this.#normalize(n));

      if( extract.pitch != undefined ) norm.pitch = extract.pitch;
      if( extract.rate != undefined ) norm.rate = extract.rate;
      if( extract.volume != undefined ) norm.volume = extract.volume;
      if( extract.language != undefined ) norm.language = extract.language;

      return norm;
    }
    #extractNode(n) {
      const f = this[n.nodeName];
      return typeof f == 'function'? f.apply(this,[n]) : this.default(n);
    }

    default(node) {
      if( node.childNodes != undefined && node.childNodes.length > 0 )
        return this.collectChildNodes(node);
      return (node.innerText??node.nodeValue)?.replace(/\s+/g,' ').trim();
      //return node.childNodes.length > 0? this.collectChildNodes(node) : node.innerText;
    }
    ['#text'](node) {
      return node.nodeValue?.replace(/\s+/g,' ').trim();
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
      k ??= e.id ?? e.className ?? e.nodeName;
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
        this.cancel();
      },
      Tab: function(ev) {
        if( this.isReading ) {
          this.skip();
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
  window.registerForReadOut = function(selector){window.ReadOut.registerReadOut(selector)};
})();