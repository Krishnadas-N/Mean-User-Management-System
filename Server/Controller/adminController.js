const { CreateError,CreateSuccess } = require('../Utils/ResponseHandling');
const User = require('../Models/UserSchema');

const adminUserslist=async(req,res,next)=>{
    try{
      
            const query = req.query.search || '';
    
            // Use a regular expression to perform a case-insensitive search on multiple fields
            const searchRegex = new RegExp(query, 'i');
    
            // Perform the search using the User model
            const users = await User.find({
                $or: [
                    { firstname: searchRegex },
                    { lastname: searchRegex },
                    { username: searchRegex },
                    { email: searchRegex },
                ],
            });

            if(!users || users.length<1){
                return next(CreateError(404,'Users not FOund'))
            }
            
            next(CreateSuccess(200,'Sucess',users))
            
    }catch(err){
        return next(new CreateError(500,"Internal Server Error",err));
    }
}

const editUsers = async(req,res,next)=>{
    const userId = req.params.id;
    const updatedUserInfo = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, updatedUserInfo, { new: true });

        if (!updatedUser) {
            return next(CreateError(404, 'User not found'));
        }

       next(CreateSuccess(200, 'User updated successfully', updatedUser));
    } catch (err) {
        return next(CreateError(500, 'Internal Server Error', err));
    }

}


const deleteUser=async(req,res,next)=>{
    try{
        const  userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return next(CreateError(404, 'User not found'));
        }
       return  next(CreateSuccess(200, 'User deleted successfully', deletedUser));
  
    }
    catch (err) {
        return next(CreateError(500, 'Internal Server Error', err));
    }

}



module.exports={
    adminUserslist,
    editUsers,
    deleteUser
}