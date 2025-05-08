import mongoose ,{Schema , Model, } from "mongoose";

const collectionSchema = new Schema({
    name: {
        type : String,
        require: true,
        unique: true,

    },
    articles:[
        {
            type: Schema.Types.ObjectId,
            ref: "Article"
        }
    ],
    admin:[
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    bookmarks:[
        {
            type: Schema.Types.ObjectId,
            ref: "Article"
        }
    ],
    cetegory:{
        type: String,
        require: true,
    },
    discription:{
        type: String,
        require: true,
    },
},{
    timestamps: true
});

const Collection = mongoose.model("Collection", collectionSchema);
export default Collection;