function getComments(rootNode) {
  function commentsRecursive(node) {
    if( node.nodeType == 8 )
      return [node];
    else if( node.childNodes?.length > 0 )
      return [...node.childNodes].map(n=>commentsRecursive(n));
    else
      return undefined;
  }
  rootNode ??= document;
  return commentsRecursive(rootNode).flat(Infinity).filter(n=>!!n);
}

// ------------------------------------------------------------------
console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'common/utility.js', 'Version '+COMMON_VERSION);
