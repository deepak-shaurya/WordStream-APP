import cookieParser from 'cookie-parser';
import express from 'express';
import { json, urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';


const app = express();
import connectDB from './db/index.js';

dotenv.config()
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true 
}))

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(json({limit: '30kb'}));
app.use(urlencoded({extended: true, limit: '30kb'}));
app.use( express.static('public'));
app.use(cookieParser());
app.use(express.json());

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server started at PORT ${process.env.PORT || 3000}`);
    });
})
.catch(()=>{
    console.log("DB connection Faild...");
    
})


// 
import userRoutes from './routes/user.routes.js';
import ArticleRoutes from './routes/article.route.js';
import notification from './routes/notification.route.js'

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/article', ArticleRoutes);
app.use('/api/v1/notification', notification);

export default app;