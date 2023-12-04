
const User = require('../models/User');






const getUsers =async(req,res)=>{

    try {

       const Users = await User.find({});
       
        return res.status(200).json(Users);
    } catch (error) {
        return res.status(500).json({message:error.message});

    }
};


module.exports = {getUsers};