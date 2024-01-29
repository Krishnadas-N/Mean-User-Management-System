const jwt = require('jsonwebtoken'); // Add this line

const { CreateError,CreateSuccess } = require('../Utils/ResponseHandling');
const User = require('../Models/UserSchema');

module.exports.userpost = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            
            return next(CreateError(404, 'User not found'));
        }

        const passwordMatch = await user.comparePassword(password);

        if (passwordMatch) {
            const token = jwt.sign({ userId: user._id ,isAdmin: user.isAdmin}, process.env.TOKEN_SECRET, {
                expiresIn: '1h', // Set your desired expiration time
            });

            return next(CreateSuccess(200, 'User logged in successfully', { user, token ,isAdmin: user.isAdmin}));
        } else {
            return next(CreateError(401, 'Invalid password'));
        }
    } catch (err) {
        console.error(err);
        return next(CreateError(500, 'Internal Server Error', err));
    }
};


module.exports.userRegister = async (req, res, next) => {
    try {
        // Extract user data from the request body
        const { firstname, lastname, username, email, password } = req.body;

        // Check if the user already exists with the given username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
          return next(CreateError(400, 'User already exists', 'Username or email is already taken'));
        }

        // Create a new user instance
        const newUser = new User({
            firstname,
            lastname,
            username,
            email,
            password, 
        });

        // Save the new user to the database
        await newUser.save();

        // You can customize the success message as needed
        const successMessage = 'User registered successfully';
        // Send a success response
        return next(CreateSuccess(201, successMessage));
    } catch (err) {
        console.error('Registration error', err.message);
        console.log(err)

        // Pass the error to the next middleware
        return next(CreateError(500, 'Server Error', err));
    }
};


module.exports.profile= async(req,res,next)=>{
    try{
        const user = await User.findOne({_id:req.user});

        if(!user){
            throw new Error('User Not found')
        }

        const UserDetails={
            id:user._id,
            firstName:user.firstname,
            lastname:user.lastname,
            email:user.email,
            profileImage: user.profileImage
        }

        return next(CreateSuccess(200,"User successfully retreived",UserDetails))


    }catch(err){
        console.log(err);
        next(CreateError(500,"Internal Server Error",err))
    }
}

module.exports.logout=async(req,res,next)=>{
   
    res.json({ message: 'Logout successful' });
}

module.exports.userHome=async(req,res,next)=>{
    
}