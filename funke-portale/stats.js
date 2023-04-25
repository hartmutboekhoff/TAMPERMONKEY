console.log('HBo Tampermonkey', 'stats.js', 'Version '+GM_info.script.version);

console.log('HBo')
(function(){
  function toJson(s,dflt) {
    try {
      return JSON.parse(s);
    }
    catch(e) {
      return dflt;
    }
  }
  function table(data,columns) {
    return '<table>'
           + columns.map(c=>'<th>'+c+'</th>').join('\n')
           + data.map(row=>tr(row,columns)).join('\n')
           + '</table>';
  }
  function tr(data,columns) {
    return '<tr>'
           + columns.map(c=>td(data[c])).join('\n')
           + '</tr>';
  }
  function td(value) {
    return '<td>'+(value??'-')+'</td>';
  }


  class StatsCollector {
    constructor() {
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
      

      this.statistics = this.widgets.map(w=>(w.statistics.reduce((acc,s)=>(acc.summe+=s.time,Object.assign(acc,{[s.name]:s.time})),{id:w.id,type:w.name,summe:0})))
                                    .sort((a,b)=>b.summe-a.summe);
    }
  }
  
  
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

  function displayStatistics(data, columns) {
    const statsDiv = document.createElement('div');
    statsDiv.id = 'stats-overlay';
    statsDiv.innerHTML = table(data,columns);
    document.body.appendChild(statsDiv);
  }

  window.addEventListener('load',()=>{
    const stats = new StatsCollector();
    window.DebugData = stats;
    displayStatistics(stats,['id','type','resolving','pre-render','rendering','post-render','summe']);
  }); // onLoad()
})();

console.log('HBo Tampermonkey', 'stats.js', 'Syntax Ok');