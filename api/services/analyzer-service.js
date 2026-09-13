const { execSync } =
require("child_process");

function analyzeSolution() {

    const output =
        execSync(
            "node scripts/analyze-solution.js"
        );

    return output.toString();

}

module.exports = {
    analyzeSolution
};
