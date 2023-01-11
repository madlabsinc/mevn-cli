// 1. Found leading or trailing decimal points in numeric literalsJS-0065
let num = .5;
num = 2.;
num = -.7;

// 2. Found unnecessary computed property keys in object literalsJS-0236
var a = { ['0']: 0 };
var a = { ['0+1,234']: 0 };
var a = { [0]: 0 };
var a = { ['x']: 0 };
var a = { ['x']() {} };

new Promise((resolve, reject) => {
  resolve(getItem())
})

// 3. Use shorthand promise methodsJS-C1004
new Promise(function (resolve, reject) {
  reject("oops")
})

// 4. Prefer the use of `===` and `!==` over `==` and `!=`JS-V009
a == b
c == true
bananas != 1
value == undefined
typeof c == 'undefined'
'hello' != 'world'
0 == 0
true == true
c == null

// 5. Avoid using multiline stringsJS-C1000
const x = "Line 1 \
         Line 2";
