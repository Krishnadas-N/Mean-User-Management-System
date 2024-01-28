const CreateSuccess = (statusCode, successMessage, data) => {
    const successObj = {
        status: statusCode,
        message: successMessage,
        data: data
    };
    return successObj;
};


const CreateError = (statusCode, errorMessage, data) => {
    const errorObj = {
        status: statusCode,
        message: errorMessage,
        data: data
    };
    return errorObj;
};



module.exports={CreateSuccess,CreateError}