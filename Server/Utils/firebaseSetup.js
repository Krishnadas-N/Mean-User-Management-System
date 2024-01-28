const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
const User = require('../Models/UserSchema');
const { CreateError, CreateSuccess } = require('./ResponseHandling');
const config = require('../config/firebase');

initializeApp(config.firebaseConfig);

const storage = getStorage();

const fileUpload = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        console.log(req.file);

        const dateTime = giveCurrentDateTime();
        const storageRef = ref(storage, `files/${req.file.originalname + '       ' + dateTime}`);
        
        const metadata = {
            contentType: req.file.mimetype,
        };

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { profileImage: downloadURL } },
            { new: true }
        );

        if (!updatedUser) {
            return next(CreateError(404, 'User not found'));
        }

        console.log('File successfully uploaded.',downloadURL);
        return next(CreateSuccess(201, 'File uploaded to firebase storage', {
            name: req.file.originalname,
            type: req.file.mimetype,
            downloadURL: downloadURL,
        }));

    } catch (error) {
        return next(CreateError(500, error.message, error));
    }
};

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
};

module.exports = { fileUpload };
