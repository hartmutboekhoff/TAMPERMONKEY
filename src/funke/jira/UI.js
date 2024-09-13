(function(){
  window.addEventListener('load',()=>{
    
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
        }
      },
    });
		window.registerForReadOut('#issuetable .issuerow .summary');
    
    // ================================================
    console.log('initializing mutation-reactions');
    //window.onMutation('selector', reaction);
    window.onMutation('#ghx-column-headers', {
      listeners: {
        wheel: ev=>{
          document.getElementById('ghx-pool-column').scrollLeft += ev.deltaY;
          console.log(ev)
          ev.stopPropagation();
          ev.preventDefault();
        }
      }
    });
  
  
    // ================================================



  });
})();