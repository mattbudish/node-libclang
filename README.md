node-clang
==========
node.js module for `libclang` and parsing c-style source from javascript.

AST Traversal
-------------
```javascript
const Clang = require('clang');
const index = new Clang.Index();
const tu    = Clang.TranslationUnit.fromSource( index, 'mySrc.c' );

tu.cursor.visitChildren(function (parent) {
  switch (this.kind) {
  case Clang.kind.CXCursor_FunctionDecl:
    console.log( this.spelling );
    break;
  }

  return Clang.CXChildVisit_Continue;
});

index.dispose();
````
