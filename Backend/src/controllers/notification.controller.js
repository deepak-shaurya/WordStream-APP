import Notification from "../models/notification.model.js";
import { asynchandler } from "../utils/asynchandler.js";

const getNotifications = asynchandler( async (req , res)=>{
    try {
        const userid = req.user._id;
        const notification = await Notification.find({to: userid}).populate({
            path: "from",
            select: "username profilepic"
        })
        
        await Notification.updateMany({to:userid},{read: true})

        res.status(200).json(notification);
    } catch (error){
        console.log("Error in getNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
})

const deleteNotifications = asynchandler( async (req , res)=>{
    try {
        const userid = req.user._id;
        const notification = await Notification.deleteMany({to:userid});
        return res.status(200).json({message: "all notifications are deleted", data: notification
        })
    } catch (error) {
        res.status(500).json({err: error.message})
    }
})

export {getNotifications, deleteNotifications}