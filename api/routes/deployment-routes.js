const express =
require("express");

const router =
express.Router();

const {

  exportSolution,

  importSolution

}
=
require(
  "../services/deployment-service"
);

router.post(
  "/export",
  (req,res) => {

    try {

      const result =
      exportSolution(req.body);

      res.json({

        success:true,

        result

      });

    }
    catch(error){

      res.status(500)
      .json({

        success:false,

        error:error.message

      });

    }

});

router.post(
  "/import",
  (req,res) => {

    try {

      const result =
      importSolution(req.body);

      res.json({

        success:true,

        result

      });

    }
    catch(error){

      res.status(500)
      .json({

        success:false,

        error:error.message

      });

    }

});

module.exports =
router;
