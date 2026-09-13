const express =
require("express");

const router =
express.Router();

router.post(
    "/start",
    (req,res) => {

        const {
            source,
            target,
            solution
        } = req.body;

        res.json({

            success:true,

            source,

            target,

            solution

        });

});

module.exports =
router;
