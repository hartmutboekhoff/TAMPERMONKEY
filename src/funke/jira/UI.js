(function(){
  window.addEventListener('load',()=>{
    
    function scrollHorizontal(ev) {
      document.getElementById('ghx-pool-column').scrollLeft += ev.deltaY;
      ev.stopPropagation();
      ev.preventDefault();
    }
    
    // ================================================
    console.log('initializing read-out elements');

		window.registerForReadOut('#description-val', {
				childElements: {
					'pre[class^="code-"]': { language:'en-US',rate:0.9},
				}
		});
		window.registerForReadOut('div#issue_actions_container>div[id^="comment-"]', {
			childElements: {
				'.actionContainer': {
					extract:node=>node.querySelectorAll('.action-head .user-hover.user-avatar,.action-head .date.user-tz,.action-body')
				},
				'.user-hover.user-avatar,.date.user-tz': {
					extract:node=>node.innerText,
				},
			}
		});
		window.registerForReadOut('div.js-detailview.ghx-issue', {
      exclude: 'div.ghx-flags',
      extract: node=>([node.querySelector('span[title="Gekennzeichnet"]'),...node.childNodes].filter(n=>!!n)),
      childElements: {
        'div.ghx-key': {
          extract: node=>node.innerText.replaceAll('-',' '),
        },
        'span.ghx-extra-field': {
          extract: node=>node.innerText=='Kein'? '' : (node.title.match(/^[^&<:]*/)?.[0]??node.title)+': '+node.innerText,
        },
        'div.ghx-avatar img,span.ghx-avatar-img': {
          extract: node=>node.title,
        },
        'div.ghx-type': {
          text:'',
        },
        'div.ghx-flags,span[title="Gekennzeichnet"]': {
          text: 'blockiert',
        }
      },
    });
		window.registerForReadOut('#issuetable .issuerow .summary');
		window.registerForReadOut('table#ghx-issues-in-epic-table td.ghx-summary', {
		  extract: node=>([node.parentElement.dataset.issuekey, node.innerText])
		});
		
    
    // ================================================
    console.log('initializing mutation-reactions');
    //window.onMutation('selector', reaction);
    window.onMutation('#ghx-column-headers', {
      listeners: {
        wheel: ev=>{
          if( !ev.ctrlKey ) 
            scrollHorizontal(ev);
        }
      }
    });
    window.onMutation('body', {
      listeners: {
        wheel: ev=>{
          if( ev.shiftKey && !ev.ctrlKey && !ev.altKey )
            scrollHorizontal(ev);
        }
      }
    });
  
  
    // ================================================



  });
})();