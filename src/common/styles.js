class TryCatchSequence {
  #error; #step = 0;
  
  constructor(label) {
    this.label = label ?? 'try-catch';
  }
  
  get ok() { return this.#error == undefined; }
  get failed() { return this.#error != undefined; }
  get error() { return this.#error; }
  get step() { return this.#step; }
  
  trycatch(f, ...args) {
    if( this.#error == undefined ) {
      try {
        ++this.#step;
        const res = f(...args);
        console.log(this.label+': Step '+this.#step+' succeeded');
        return res;
      }
      catch(e) {
        this.#error = e;
        console.error(this.label+': Step '+this.#step+' failed', e);
      }
    }
  }
  
  
  throw() {
    if( this.#error != undefined ) {
      this.#error.__step = this.#step;
      throw this.#error;
    }
  }
}


function compileStylesheets(...css) {
  
  function cleanupWS(t) {
    return t.replace(/\s+/g,' ').trim();
  }
  function makeImportant(style) {
    return style.replace(/(\!important)?;/g, ' !important;');
  }
  function mix(style, mixins) {
    return style.replace(/@(.+?);/g, (d,m)=>{
      const k = cleanupWS(m);
      if( k.endsWith(' !important') ) {
        const mx = mixins[k.slice(0,-11)];
        return mx==undefined? '' : makeImportant(mx.replaced ?? mx.style);
      }
      else {
        const mx = mixins[k];
        return mx==undefined? '' : (mx.replaced ?? mx.style);
      }
    });
  }
  function getDirectives(css) {
    const rxComment = /\/\*(.*?)\*\//gs;
    const rxDirective = /^\s*@([\w_][\w\d_-]*)(?:\s*=\s*(.+?))?\s*$/gm;
    
    return [...css.matchAll(rxComment)]
             .map(m=>[...m[1].matchAll(rxDirective)])
             .flat()
             .filter(d=>!!d && d.length>0)
             .map(d=>({name:d[1],value:d[2]}))
             .reduce((acc,d)=>(acc[d.name]=d.value,acc),{});
  }

  const rx = /([^{}]+){([^}]+)}/g;
  const rxComment = /\/\*(.*?)\*\//gs;

  const fullCss = css.filter(c=>!!c).join(' ');
  const bareCss = fullCss.replace(rxComment,' ');
  
  const cssDirectives = getDirectives(fullCss);
  console.log('CSS directives', cssDirectives);

  const parsed = [...bareCss.matchAll(rx)]
    .map(m=>({name:cleanupWS(m[1]), style:cleanupWS(m[2])}))
    .map(m=>m.name.split(',').map(n=>({name:cleanupWS(n),style:m.style})))
    .flat(Infinity)
    .reduce((acc,s)=>((acc[s.name] ??= {style:''}).style += s.style,acc),{});

  for( let k in parsed ) {
    let v = parsed[k];
    v.replaced = mix(v.style, parsed);
  }
  let result = '';
  for( let k in parsed )
    result += ' '+k+' { '+parsed[k].replaced+' }\n';
  
  if( cssDirectives.printCompiledCss == 'true' ) console.log({'CompiledCss': result});
  return result;
}

function tryCatchTest(f) {
  try{
    f(...args);
  }
  catch(e) {
    return false;
  }
  return true;
}

function addStyle(css) {
  if( css != undefined && css != '' ) {
    const tc = new TryCatchSequence('add CSS');
    const s = document.createElement('style');
    
    tc.trycatch(()=>document.head.appendChild(s));
    tc.trycatch(()=>s.id = 'HBo greasemonkey style');
    tc.trycatch(()=>s.type = 'text/css');
console.log(s);    
    tc.trycatch(()=>s.appendChild(document.createTextNode(css)));
  }
}
const cssResources = ['css-common','css'];
const css = cssResources.map(rn=>GM_getResourceText(rn))

css.forEach((d,ix)=>!!d?'':console.log('HBo CSS', 'Resource "'+cssResources[ix]+'" wurde nicht geladen.'));

window.addEventListener('load',()=>addStyle(compileStylesheets(...css.filter(c=>!!c))));

// ------------------------------------------------------------------
console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'common/styles.js', 'Version '+COMMON_VERSION);
