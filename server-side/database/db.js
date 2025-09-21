import mongoose from "mongoose";

const DBConnection = async () => {

    const MONGO_URI = process.env.MONGO_URL|| `mongodb://0.0.0.0:27017/Cafe-Order-Syatem`;
    try  {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true ,
            useUnifiedTopology: true, });
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting with the database ', error.message);
    }
}

export default DBConnection;





