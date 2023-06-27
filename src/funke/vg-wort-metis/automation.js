window.addEventListener('load',()=>{
  const sf = document.getElementById('search-pixel_search_criteria_privatePixelUIDFieldPublisher');
  console.log(sf);
  if( sf.value=='' ) 
    sf.value='vgzm.1020093-';
  
/*
  window.onMutation = {
    selector: 'input#search-pixel_search_criteria_privatePixelUIDFieldPublisher',
    callback: e=>{if( e.value=='' ) e.value='vgzm.1020093-'}
  };
*/
});