
//outer function--->
const authorize = (role) => {
    //inner function====>
    return (req, res, next) => {
      const userrole = req.body.userrole;
      if (role.includes(userrole)) {
        next();
      }
       else {
        res.status(400).send({ "msg": "You are Not Authorized!!"});
      }
    };
  };
  
  module.exports = { authorize };
  