import mongoose from 'mongoose';

class MongooseService {
  isConnected = false;
  MONGODB_URI:string =
    process.env.MONGODB_URI ||
    'mongodb+srv://Nelson:ruqiulixia0220@chatsys.czvnacb.mongodb.net/?retryWrites=true&w=majority';
  private count = 0;
  private mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    serverSelectionTimeoutMS: 5000,
    // useFindAndModify: false,
  };

  constructor() {
    this.connectWithRetry();
  }

  getInstance() {
    return mongoose;
  }

  connectWithRetry() {
    // console.log("process.env.MONGODB_URI", process.env.MONGODB_URI);

    console.log('Connecting to MongoDB(Retry when failed)');
    mongoose
      .connect(this.MONGODB_URI, this.mongooseOptions)
      .then(() => {
        console.log('MongoDB is connected');
        this.isConnected = true;
      })
      .catch((err) => {
        const retrySeconds = 5;
        console.log(
          `MongoDB connection unsuccessful (will retry #${++this
            .count} after ${retrySeconds} seconds):`,
          err
        );
        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  }
}
export default new MongooseService();
