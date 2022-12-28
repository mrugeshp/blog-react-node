const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log('db connected')
    }
    catch (error) {
        console.log('error: ', error.message)
    }
}

module.exports = dbConnect;
