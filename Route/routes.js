const { Router } = require("express");
const master = require("../controller/masterAuthDep")
const mid = require("../middleware/master_mid")
const router=Router();


router.get("/home",
mid.authApi,
master.home_get.home_get)

router.patch("/updatesession",
    mid.authApi,
    master.newSession.newSession
)

router.put("/updateuser",
    mid.authApi,
    master.updateuser.updateUser
)

router.delete("/deleteuser",
    mid.authApi,
    master.deleteuser.deleteuser
)

router.get("/sessionverification",
    mid.authApi,
    master.sessionVerification.sessionVerification
)


router.post("/login",
    // mid.req_check.refress_token_check,
    mid.authApi,
    mid.req_check.req_check,
        master.login.login)

router.post("/signup",
    mid.authApi,
    mid.req_check.req_check,
        master.signup.signup)



module.exports = router;