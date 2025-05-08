import { connect, Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = Schema({
    username: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim:true,
      index:true

    },
    fullname : {
      type: String, 
      require: true,
      trim:true,
      index:true

    },
    password: {
      type: String,
      require: [true, "Password is required"],
    },
    email : {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim:true,
    },
    bio: {
      type: String,
      length: 300,
      default: "Hey there! I am using WordStream App"
    },
    articles:[
      {
        type: Schema.Types.ObjectId,
        ref: "Article"
      }
    ],
    profilepic:{
      type: String,
      default: ""
    },
    coverImg:{
      type : String,
      default : ""
    },
    collections:[
      {
        type: Schema.Types.ObjectId,
        ref: "Collection"
      }
    ],
    followers:[
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    followings:[
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    refreshtoken: {
      type: String,
      require: false,
    },
  },{
    timestamps:true,
  })

  userSchema.pre("save", async function(Next){
    if(!this.isModified("password")) return Next();

    this.password = await bcrypt.hash(this.password , 10)
    Next();
  })

  userSchema.methods.ispasswordcorrect = async function (password){
    return await bcrypt.compare(password, this.password)
  }

  userSchema.methods.GerateAccessToken = async function(){
    return (
      jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email,
      }, 
      process.env.ACCESS_TOKEN_SECRET, 
      {expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
    )
  }

  userSchema.methods.GerateRefreshToken = async function(){
    return (
      jwt.sign({id: this._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY})
    )
  }
  
const UserModel = model("User", userSchema);
export default UserModel;