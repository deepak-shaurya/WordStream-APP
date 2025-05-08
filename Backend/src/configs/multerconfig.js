import express from 'express';
import { extname } from 'path';
import { randomBytes } from 'crypto';
import multer, { diskStorage } from 'multer';



const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/image/uplodes');
    },
    filename: (req, file, cb) => {
        randomBytes(12, (err, name)=>{
            const fn = name.toString("hex")+extname(file.originalname);
            cb(null, fn);
        })
        
    }
});

const upload = multer({ storage: storage });

export default upload;
