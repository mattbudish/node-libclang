// Copyright 2013 Timothy J Fontaine <tjfontaine@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE
'use strict';

const Clang   = require('./dynamic_clang');
const Lib     = Clang.libclang;

const Cursor        = require('./cursor').Cursor;
const Token         = require('./token').Token;

const ArrayType     = require('ref-array');
const CursorArray   = ArrayType( Lib.CXCursor );

class TokenList extends Object {
  constructor( tu, tokenArray ) {
    super();

    this._tu     = tu;
    this._tokens = tokenArray;
  }

  /***************************************************************************
   * Direct properties {
   */
  get length() {
    return this._tokens.length;
  }

  get annotate() {
    let cursors = new Buffer( this.length * Lib.CXToken.size );

    Lib.clang_annotateTokens( this._tu._instance,
                              this._tokens.buffer,
                              this.length,
                              cursors );

    cursors = new CursorArray( cursors );

    let result  = [];
    result._buffer = cursors.ref();

    for (let idex = 0, len = this.length; idex < len; idex++) {
        result.push( new Cursor( cursors[idex] ) );
    }

    return result;
  }

  /* Direct properties }
   ***************************************************************************/

  /**
   *  Retrieve the indexed token.
   *  @method get
   *  @param  index     The target index {Number};
   *
   *  @return The indexed token {Token};
   */
  get( index ) {
      let token;

      if (this._tokens[index] != null) {
          token = new Token( this._tu, this._tokens[index] );
      }

      return token;
  }

  /**
   *  Dispose of this token list.
   *  @method dispose
   *
   *  @return none
   */
  dispose( ) {
    Lib.clang_disposeTokens( this._tu._instance,
                             this._tokens.buffer,
                             this.length );

    delete this._tokens;
  }
}

// Hybrid export: Common.js with ES6 module structure
module.exports = {
  __esModule: true,
  default:    TokenList,
  TokenList:  TokenList,
}
