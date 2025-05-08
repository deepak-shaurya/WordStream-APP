import mongoose, {Schema, model} from 'mongoose';

const commentSchema = new Schema({
    Content:{
        type: String,
        required: true,
        Range: 300

    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    article:{
        type: Schema.Types.ObjectId,
        ref: "Article"
    }
},{
    timestamps: true
})

const Comment = model("Comment", commentSchema);

export default Comment;