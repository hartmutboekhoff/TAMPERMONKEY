(function(){
  function showInfo() {
    const s = document.createElement('script');
    s.innerText = `
      const id = window.SPARK.trackingData.pageArticleID ?? window?.SPARK?.debugPageData?.article?.articleId;
      alert( id ?? "Artikel-ID unbekannt");
    `;
    document.head.appendChild(s);
  }
  
  window.addKeyHandler('Ctrl+F1',showInfo);
})();