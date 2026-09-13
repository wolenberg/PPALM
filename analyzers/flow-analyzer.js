const fs =
require("fs");

const path =
require("path");

const workflowFolder =
"./solutions/PPALMCore/Workflows";

console.log("");
console.log("Flows");
console.log("---------------------");

if(
 !fs.existsSync(
   workflowFolder
 )
){

 console.log(
   "No Flows Found"
 );

 process.exit(0);

}

const files =
fs.readdirSync(
 workflowFolder
);

files
.filter(
 file =>
 file.endsWith(".json")
)
.forEach(file=>{

 console.log(
   `✅ ${file}`
 );

});
