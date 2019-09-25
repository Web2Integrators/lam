// Do not try to import this file!
//
// Run this file ("node generate.js") to generate a script of parsers. Angular points to it in
// the scripts array in angular.json. Keep all related parsers in one script file if possible.
//
// This may seem clunky, but this appears to be the least painful way to use Jison in the browser
// as of 3/7/2019.
//
// Do not try to bring Jison into the Angular app. For security, the PDE Electron app blocks eval()
// which breaks the Browserified version of Jison due to its use of JS strings in the input JSON.
//

const Parser = require('jison').Parser;
const fs = require('fs');
const path = require('path');

/** The parser for the Endpoint Editor Basis Functions equation validator. */
const eeBfEquationParser = new Parser({
  // Adapted from the calculator example at http://zaa.ch/jison/docs.
  lex: {
    rules: [
      ['\\s+',                '/* skip whitespace */' ],
      ['\\d+(?:\\.\\d+)?\\b', 'return "NUMBER";'      ],
      ['\\*\\*',              'return "**";'          ],
      ['\\*',                 'return "*";'           ],
      ['\\/',                 'return "/";'           ],
      ['-',                   'return "-";'           ],
      ['\\+',                 'return "+";'           ],
      ['\\(',                 'return "(";'           ],
      ['\\)',                 'return ")";'           ],
      ['[dD][sS]lope\\(',     'return "DSLOPE(";'     ],
      ['[sS]lope\\(',         'return "SLOPE(";'      ],
      ['[iI][bB]\\d+',        'return "IB#";'         ], // Allow any index; validator checks range
      ['[bB][fF]\\d+',        'return "BF#";'         ], // Allow any index; validator checks range
      ['$',                   'return "END";'         ],
    ],
  },
  operators: [
    ['left', '+', '-' ],
    ['left', '*', '/' ],
    ['left', '**'     ],
    // ['left', 'UMINUS'], // The old C++ Endpoint Editor doesn't allow negation.
  ],
  bnf: {
    expressions: [
      ['expr END', 'return $1;'],
    ],
    expr: [
      ['expr + expr',     '$$ = $1 + "+" + $3;'       ],
      ['expr - expr',     '$$ = $1 + "-" + $3;'       ],
      ['expr * expr',     '$$ = $1 + "*" + $3;'       ],
      ['expr ** expr',    '$$ = $1 + "**" + $3;'      ],
      ['expr / expr',     '$$ = $1 + "/" + $3;'       ],
      // ['- NUMBER', '$$ = "-" + $2;', { prec: 'UMINUS' }], // The old EE doesn't allow negation.
      ['( expr )',        '$$ = "(" + $2 + ")";'      ],
      ['DSLOPE( expr )',  '$$ = "DSlope(" + $2 + ")";'],
      ['SLOPE( expr )',   '$$ = "Slope(" + $2 + ")";' ],
      ['IB#',             '$$ = yytext.toUpperCase();'],
      ['BF#',             '$$ = yytext.toUpperCase();'],
      ['NUMBER',          '$$ = yytext;'              ],
    ],
  },
});

let source = eeBfEquationParser.generate({ moduleName: 'eeBfEquationParser' });

fs.writeFileSync(path.join(__dirname, 'parsers.js'), source);

/** The parser for the Endpoint Editor Basis Functions equation validator. */
const waitCalculatedOETimeParser = new Parser({
  // Adapted from the calculator example at http://zaa.ch/jison/docs.
  lex: {
    rules: [
      ['\\s+',                '/* skip whitespace */'     ],
      ['\\d+(?:\\.\\d+)?\\b', 'return "NUMBER";'          ],
      ['\\*\\*',              'return "**";'              ],
      ['\\*',                 'return "*";'               ],
      ['\\/',                 'return "/";'               ],
      ['-',                   'return "-";'               ],
      ['\\+',                 'return "+";'               ],
      ['\\(',                 'return "(";'               ],
      ['\\)',                 'return ")";'               ],
      ['LastStageEPTime',     'return "LASTSTAGEEPTIME";' ],
      ['$',                   'return "END";'             ],
    ],
  },
  operators: [
    ['left', '+', '-' ],
    ['left', '*', '/' ],
    ['left', '**'     ],
    // ['left', 'UMINUS'], // The old C++ Endpoint Editor doesn't allow negation.
  ],
  bnf: {
    expressions: [
      ['expr END', 'return $1;'],
    ],
    expr: [
      ['expr + expr',     '$$ = $1 + "+" + $3;'       ],
      ['expr - expr',     '$$ = $1 + "-" + $3;'       ],
      ['expr * expr',     '$$ = $1 + "*" + $3;'       ],
      ['expr ** expr',    '$$ = $1 + "**" + $3;'      ],
      ['expr / expr',     '$$ = $1 + "/" + $3;'       ],
      // ['- NUMBER', '$$ = "-" + $2;', { prec: 'UMINUS' }], // The old EE doesn't allow negation.
      ['( expr )',        '$$ = "(" + $2 + ")";'      ],
      ['LASTSTAGEEPTIME', '$$ = yytext;'              ],
      ['NUMBER',          '$$ = yytext;'              ],
    ],
  },
});

source = waitCalculatedOETimeParser.generate({ moduleName: 'waitCalculatedOETimeParser' });

fs.writeFileSync(path.join(__dirname, 'parsers.js'), '\n\n', {flag: 'a'});
fs.writeFileSync(path.join(__dirname, 'parsers.js'), source, {flag: 'a'});
