try {
  require("../analyzers/solution-analyzer").run();
} catch (err) {
  console.error("");
  console.error("❌ Analysis Failed");
  console.error(err.message);
  process.exit(1);
}
