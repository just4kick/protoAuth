const { Router } = require("express");
const master = require("../controller/masterAuthDep")
const mid = require("../middleware/master_mid")
const router=Router();


router.get("/home",master.home_get.home_get)

router.post("/login",
    mid.req_check.refress_token_check,
    mid.req_check.req_check,
        master.login.login)

router.post("/signup",
    mid.authApi,
    mid.req_check.req_check,
        master.signup.signup)



module.exports = router;