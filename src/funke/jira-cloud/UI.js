(function(){
  window.addEventListener('load',()=>{
    
    
    // ================================================
    console.log('initializing shortcut-keys');
    //window.addKeyHandler('Space',ev=>alert('key pressed'));
  
  
    // ================================================
    console.log('initializing read-out elements');
    //window.registerForReadOut('selector');
    window.registerForReadOut('div[data-editor-container-id="issue-description-editor"]');
    window.registerForReadOut('div[data-testid="issue.activity.comments-list"] > div > span > div > div:nth-child(2)', {
      exclude: ['button'],
      childElements: {
        'h3': {
          extract: node=>node.querySelectorAll('span>div, span>span'),
        }
      }
    });
    window.registerForReadOut('div[data-testid="issue-view-layout-templates-default.ui.foundation-content.foundation-content-wrapper"] h1');
    window.registerForReadOut('div:has(>li>a[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"])');

    window.registerForReadOut('div[data-test-id="software-board.board-area"] section li', {
      readHidden: true,
      exclude: ['img', 'span[id$="-tooltip"]'],
      childElements: {
        'a': {
          extract: node=>node.getAttribute('href').slice(8)
        },
        'span[data-testid="issue-field-assignee.common.ui.read-view.popover.avatar--label"]': {
          extract: node=>node.innerText.match(/:(.*)$/)?.[1]??'',
        },
        'div[data-component-selector="platform-card.ui.card.card-content.content-section"] span': {
          extract: node=>node.innerText,
        }
      }
    });
    window.registerForReadOut('div[data-testid="issue.issue-view.views.common.child-issues-panel.issues-container"] ul>div',{
      exclude: ['img', 'div[data-testid="issue-line-card.ui.estimate.estimate-field"]']
    });
    window.registerForReadOut('li[data-testid="issue-navigator.ui.issue-results.detail-view.card-list.card.list-item"]', {
      exclude: ['img', 'div[role]']
    });




    // ================================================
    console.log('initializing mutation-reactions');
    //window.onMutation('selector', reaction);
  
  
    // ================================================


  });
})();