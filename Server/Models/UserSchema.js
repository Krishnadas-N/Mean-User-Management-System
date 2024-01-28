const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Define the user schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
        unique: true 
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: 'https://th.bing.com/th/id/OIP.zRG7_6cFjh5TdxTbdW_SkgHaH_?rs=1&pid=ImgDetMain' // Set your default URL here
    },
    isAdmin:{
        type: Boolean,
        default: false, // Set to true for admin users
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});


userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        return next();
    } catch (error) {
        return next(error);
    }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Create a User model based on the user schema
const User = mongoose.model('User', userSchema);

// Export the User model to be used in other parts of your application
module.exports = User;
