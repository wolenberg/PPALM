const { execSync } =
require("child_process");

function validateSolution() {

    const output =
        execSync(
            "npm run validate"
        );

    return output.toString();

}

module.exports = {
    validateSolution
};
