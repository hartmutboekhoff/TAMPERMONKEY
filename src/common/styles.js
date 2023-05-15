console.log('starting', 'Version '+GM_info.script.version);


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

  const rx = /([^{}]+){([^}]+)}/g;
  const parsed = [...css.filter(c=>!!c).join(' ').matchAll(rx)]
    .map(m=>({name:cleanupWS(m[1]), style:cleanupWS(m[2])}))
    .map(m=>m.name.split(',').map(n=>({name:cleanupWS(n),style:m.style})))
    .flat()
    .reduce((acc,s)=>((acc[s.name] ??= {style:''}).style += s.style,acc),{});

  for( let k in parsed ) {
    let v = parsed[k];
    v.replaced = mix(v.style, parsed);
  }
  let result = '';
  for( let k in parsed )
    result += ' '+k+' { '+parsed[k].replaced+' }\n';
  
  return result;
}


function addStyle(css) {
  if( css != undefined && css != '' ) {
    const s = document.createElement('style');
    s.innerHTML = css;
    s.id = 'HBo style';
    document.head.appendChild(s);
  }
}
const cssResources = ['css-common','css'];
const css = cssResources.map(rn=>GM_getResourceText(rn))

css.forEach((d,ix)=>!!d?'':console.log('HBo CSS', 'Resource "'+cssResources[ix]+'" wurde nicht geladen.'));

addStyle(compileStylesheets(...css.filter(c=>!!c)));

