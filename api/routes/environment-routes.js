const express =
require("express");

const router =
express.Router();

router.get(
    "/list",
    (req,res) => {

        res.json({
            environments:[
                "DEV",
                "TEST",
                "PROD"
            ]
        });

});

module.exports =
router;
