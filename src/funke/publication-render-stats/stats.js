console.log('HBo Tampermonkey', 'stats.js', 'Version '+GM_info.script.version);

(function(){
  function toJson(s,dflt) {
    try {
      return JSON.parse(s);
    }
    catch(e) {
      return dflt;
    }
  }
  function table(data,columns,title) {
    return '<table>'
           + '<caption>'+title+'</caption>\n'
           + headerRow(columns) + '\n'
           + tr(data.sum, columns, 'summary') + '\n'
           + data.map(row=>tr(row, columns, '', data.max)).join('\n')
           + '</table>';
  }
  function tr(data,columns, className='', max={}) {
    className += data.visible? ' visible' : ' hidden';
    return '<tr class="'+className+'"'
           + (!data.id? '' : ' data-widget-id="'+data.id+'"')
           + '>'
           + columns.map(c=>td(data?.[c],{val:data?.[c]||0,max:max[c]})).join('\n')
           + '</tr>';
  }
  function td(value, vars) {
    let style = '';
    if( vars ) {
      style = ' style="';
     
      for( let v in vars )
        style += '--'+v+':'+vars[v]+';';
      style += '"';
    }
    return '<td'+style
           + ' data-value="' + value + '">'
           + (value??'-')
           + '</td>';
  }
  function headerRow(columns) {
    return '<tr class="head">'
           + columns.map(c=>'<th>'+c+'</th>').join('\n')
           + '</tr>';
  }

  class StatsCollector {
    constructor() {
      this.site = window.location.hostname;
      this.page = window.location.pathname.match(/\/[^\/]*(?:.html|\/)?$/);
      this.widgets = [];
      this.groups = [];
      this.#collect();
    }
    #collect() {
      [...document.querySelectorAll('script[data-pagespeed-no-defer]')]
         .map(s=>s.innerText.match(/^var json=(.*);fwdebug\(json,'debug(.*?)(\d+)'\);$/))
         .filter(m=>!!m)
         .map(m=>({type:m[2], index:m[3], data:toJson(m[1])}))
         .reduce((acc,d)=>(acc[d.type.toLowerCase()+'s'][d.index]=d.data,acc),this);
      

      const metrics = new Set(['summe']);
      this.statistics = this.widgets.filter(w=>!!w)
                                    .map(w=>{
                                        return w.statistics.reduce((acc,s)=>{
                                            acc.summe += acc[s.name] = s.time;
                                            metrics.add(s.name);
                                            return acc;
                                          },
                                          {id:w.id,type:w.name,summe:0,visible:w.visible}
                                        ); // reduce
                                    })
                                    .sort((a,b)=>b.summe-a.summe);

      const sum = [...metrics].reduce((acc,m)=>(acc[m]=0,acc),{});
      const max = Object.assign({},sum);
      sum.type = 'Summe';
      max.type = 'Maximum';
      
      this.statistics.sum = this.statistics.reduce((acc,w)=>{
          [...metrics].forEach(m=>acc[m] += w[m]??0);
          return acc;
        },
        sum
      );
      sum.visible = true;
      this.statistics.max = this.statistics.reduce((acc,w)=>{
          [...metrics].forEach(m=>acc[m]=acc[m]<w[m]? w[m] : acc[m]);
          return acc;
        },
        max
      );
    }
  }
  
/*  
  function parseDebugInfo(info) {
    function parseItem(item) {
      const parts = item.split(':');
      if( parts.length <= 1 ) return item;
      
      const k = parts[0];
      let v = parts.slice(1).join(':');
      const m = v.match(/^[\(\[](.*)[\)\]]$/);
      if( m && m[1] ) v = m[1].split(',');
      return {[k]:v};
    }
    const parsed = info.split(',').map(parseItem);
    return parsed.reduce((acc,i)=>typeof i == 'object'? Object.assign(acc,i):acc,parsed);
  }
*/
  function displayData(data, columns, title) {
    const statsDiv = document.createElement('div');
    statsDiv.id = 'stats-overlay';
    statsDiv.innerHTML = 
      '<input type="checkbox" id="show-hidden"/><label id="show-hidden-label" for="show-hidden">unsichtbare Widgets anzeigen</label>'
      + table(data,columns, title);
    document.body.appendChild(statsDiv);
    statsDiv.addEventListener('click',rowClick);
  }


  function rowClick(ev) {
    const row = ev.target.closest('TR');
    if( row != undefined )
      highlightRows(row.firstChild.innerText,row.classList.contains('highlight'));
  }
  function highlightRows(widgetId, off) {
    [...document.querySelectorAll('#stats-overlay tr')].forEach(r=>{
      if( off || r.firstChild.innerText != widgetId )
        r.classList.remove('highlight');
      else
        r.classList.add('highlight');

    })
  }
  let localCounter = 1;
  window.__HBo_InitializationCounter ??= 1;
  window.__HBo_LoadEventCounter ??= 1;
  if( localCounter > 1 || window.__HBo_LoadEventCounter > 1 || window.__HBo_InitializationCounter > 1 ) {
    console.trace('HBo wtf!', {init:window.__HBo_InitializationCounter, load:window.__HBo_LoadEventCounter, local: localCounter});
  }
  else {
    window.addEventListener('load',()=>{
      console.group('HBo load-event '+ window.__HBo_InitializationCounter + '/' + window.__HBo_LoadEventCounter + '/' + localCounter);
      if( document.getElementById('stats-overlay') ) 
        return console.trace('HBo dup!');
      else if( localCounter++ > 1 || window.__HBo_LoadEventCounter++ > 1 ) 
        return console.trace('HBo nope!');
      else
        console.trace('HBo ok');
      
      const debugData = new StatsCollector();
      window.DebugData = debugData;
      console.log('HBo',debugData);
      
      document.body.innerHTML = '';
      
      displayData(debugData.statistics, ['id','type', 'resolving','pre-render','rendering','post-render','summe'], debugData.site+'<br/>'+debugData.page);

      console.groupEnd();
    }); // onLoad()    
  }
  ++window.__HBo_InitializationCounter;

})();

console.log('HBo Tampermonkey', 'stats.js', 'Syntax Ok');