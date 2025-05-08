import { Schema, model } from 'mongoose';

const articleschema = new Schema({
    user: {
        type : Schema.Types.ObjectId,
        ref: "User"
    },
    Title:{
        type: String,
        require: true,
        index: true
    },
    content: {
        type:String,
        require: true
    },
    image: {
        type: String,
        default: ""
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    Comment: [
        {
            type: Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
},{
    timestamps:true,
});

const ArticleModel = model("Article", articleschema);
export default ArticleModel;