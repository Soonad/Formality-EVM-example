(async () => {

// Imports
var fm = require("formality-lang");
var VM = require('ethereumjs-vm').default;
var vm = new VM();
var BN = require('bn.js');
var fs = require("fs");

// An example Formality program
var {defs} = await fm.parse(fs.readFileSync("./main.fm", "utf8"));

// Compiles term to EVM bytecode
var bytes = fm.evm.compile("main/main", defs);
var code = Buffer.from(bytes, "hex");

// Reduces term on EVM
var evmResult = await vm.runCode({code, gasLimit: new BN(0xFFFFFFFF)});

// Gets result from the Ethereum memory
var evmNorm = fm.evm.decompile(evmResult.runState.memory._store);

// Also reduces on Formality's optimal-mode, for comparison purposes
var optResult = fm.optimal.normal("main/main", defs);

// Prints Ethereum gas cost
console.log("evmNorm : " + fm.stringify(fm.evm.decompile(evmResult.runState.memory._store)));
console.log("evmCost : " + evmResult.gasUsed.toString() + " gas");
console.log("");

// Prints INet graph-rewrite cost
console.log("optNorm : " + fm.stringify(optResult.term));
console.log("optCost : " + optResult.stats.rwts + " graph-rewrites");
console.log("");

})();
