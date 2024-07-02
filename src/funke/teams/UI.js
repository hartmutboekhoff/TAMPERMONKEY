(function(){
  window.addEventListener('load',()=>{

    const chatReadoutOptions = {
      exclude: '.fui-ChatMessage__reactions,.fui-ChatMyMessage__reactions,.fui-ChatMessage__avatar,[data-track-module-name="intelligentTranslation"]',
      childElements: {
        '.fui-ChatMessage__body [data-track-module-name="messageQuotedReply"]': {
          prefix: 'zitierte Nachricht',
          suffix: 'Zitat Ende',
          rate: 2,
        },
        '.fui-ChatMessage__author': {
          extract:function(node){return this.format.niceName(node.innerText)},
          rate:3,
        },
        '.fui-ChatMyMessage__author': {
          text: 'Ich',
          rate: 1.5,
        },
        '.fui-ChatMessage__timestamp,.fui-ChatMyMessage__timestamp': {
          extract:function(node){return this.format.niceDateTime(new Date(node.getAttribute('datetime')))},
          rate:5,
        },
      }
    }; 
    const appointmentReadoutOptions = {
      extract: function(node) {
        return formatApointmentTime(node.innerText);
      }
    }
    
    function isElementInViewport(e) {
      const rect = e.getBoundingClientRect();
      return rect.top < window.innerHeight
             && rect.bottom > 0
             && rect.left < window.innerWidth
             && rect.right > 0;
    }
    function formatApointmentTime(text) {
      const MonthMap = {
        'Jan': 'Januar',
        'Feb': 'Februar',
        'Mar': 'März',
        'Mär': 'April',
        'Apr': 'April',
        'May': 'Mai',
        'Mai': 'Mai',
        'Jun': 'Juni',
        'Jul': 'Juli',
        'Aug': 'August',
        'Sep': 'September',
        'Oct': 'November',
        'Okt': 'November',
        'Nov': 'November',
        'Dec': 'Detember',
        'Dez': 'Dezember',
      };
      function toDate(m,d) {
        return d+'. '+MonthMap[m];
      }
      function toTime(h,m,ampm='') {
        return ('0'+(ampm=='PM' && +h!=12? +h+12 : ampm=='AM' && +h==12? '0' : h)).slice(-2)+':'+m;
      }
      const LangFormatters = [
        { 
          lang: 'en-EN',
          pattern: /(\w{3}) (\d+) (\d+):(\d+) (PM|AM) . (\d+):(\d+) (PM|AM)/i,
          transform:(m,d,sh,sm,sampm,eh,em,eampm)=>toDate(m,d)+', '+toTime(sh,sm,sampm)+' bis '+toTime(eh,em,eampm),
        },
        { 
          lang: 'en-EN multi-day',
          pattern: /(\w{3}) (\d+) (\d+):(\d+) (PM|AM) . (\w{3}) (\d+) (\d+):(\d+) (PM|AM)/i,
          transform:(sm,sd,sh,smi,sampm,em,ed,eh,emi,eampm)=>toDate(sm,sd)+', '+toTime(sh,smi,sampm)+' bis '+toDate(em,ed)+', '+toTime(eh,emi,eampm),
        },
        { 
          lang: 'en-EN multi-day',
          pattern: /(\w{3}) (\d+) . (\w{3}) (\d+)/i,
          transform:(sm,sd,em,ed)=>toDate(sm,sd)+' bis '+toDate(em,ed),
        },
        {
          lang: 'de-DE',
          pattern: /(\d+)\. (\w{3})\. (\d+):(\d+) . (\d+):(\d+)/i,
          transform:(d,m,sh,sm,eh,em)=>toDate(m,d)+', '+toTime(sh,sm)+' bis '+toTime(eh,em),
        },
        {
          lang: 'de-DE multi-day',
          pattern: /(\d+)\. (\w{3})\. (\d+):(\d+) . (\d+)\. (\w{3})\. (\d+):(\d+)/i,
          transform:(sd,sm,sh,smi,ed,em,eh,emi)=>toDate(sm,sd)+', '+toTime(sh,smi)+' bis '+toDate(em,ed)+', '+toTime(eh,emi),
        },
        {
          lang: 'de-DE multi-day',
          pattern: /(\d+)\. (\w{3})\. . (\d+)\. (\w{3})\./i,
          transform:(sd,sm,ed,em)=>toDate(sm,sd)+' bis '+toDate(em,ed),
        },
      ];
 
      for( const f of LangFormatters ) {
        const m = text.match(f.pattern);
        if( m != undefined )
          return f.transform(...[...m].slice(1));
      }
      return text;
    }
    function readOutAppointmentDetails(elements) {
        [2,1,6].map(ix=>elements[ix])
          .filter(e=>e!=undefined)
          .forEach(e=>window.ReadOut.queue(e,appointmentReadoutOptions));
    }
  
    // ================================================
    console.log('initializing shortcut-keys');
    //window.addKeyHandler('Space',ev=>alert('key pressed'));
    window.addKeyHandler('F2',ev=>{
      let elements = document.querySelectorAll('[data-tid="chat-pane-item"] > [data-tid="last-read-line"],[data-tid="chat-pane-item"] .fui-ChatMessage,[data-tid="chat-pane-item"] .fui-ChatMyMessage');
      if( elements.length > 0 ) {
        let unread = 0;
        elements = [...elements].filter(e=>e.dataset.tid=='last-read-line'?unread++:unread);
        if( elements.length > 0 )
          elements.forEach(e=>window.ReadOut.queue(e,chatReadoutOptions));
        else
          window.ReadOut.queue('keine neuen Nachrichten');
      }
      else {
        readOutAppointmentDetails(document.querySelectorAll('.ui-popup__content__content span.ui-text'));
      }
    });
    window.addKeyHandler('Shift+F2',ev=>{
      [...document.querySelectorAll('[data-tid="chat-pane-item"] > [data-tid="last-read-line"],[data-tid="chat-pane-item"] .fui-ChatMessage,[data-tid="chat-pane-item"] .fui-ChatMyMessage')]
        .filter(e=>isElementInViewport(e))
        .forEach(e=>window.ReadOut.queue(e,chatReadoutOptions));
    });
  
  
    // ================================================
    console.log('initializing read-out elements');
    //window.registerForReadOut('selector');
    window.registerForReadOut('.fui-ChatMessage,.fui-ChatMyMessage', chatReadoutOptions);
    window.registerForReadOut('.ui-popup__content__content span.ui-text');
    window.registerForReadOut('div.recipient-group-list-item', {
      immediate:true,
      rate: 5,
      extract:node=>node.querySelector('.cle-title'),
    });
    

    // ================================================
    console.log('initializing mutation-reactions');
    //window.onMutation('selector', reaction);
    window.onMutation('.ui-popup__content__content', {
      runOnLoad: false,
      callback: el=>{
        readOutAppointmentDetails(el.querySelectorAll('span.ui-text'));
      },
    });

    // ================================================


  });
})();