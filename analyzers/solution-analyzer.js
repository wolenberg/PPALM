const fs =
require("fs");

const xml =
fs.readFileSync(
"./solutions/PPALMCore/Other/Solution.xml",
"utf8"
);

console.log("");
console.log("Solution");
console.log("---------------------");

const version =
xml.match(
 /<Version>(.*?)<\/Version>/
);

if(version){

 console.log(
   `Version: ${version[1]}`
 );

}
