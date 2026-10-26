import {Schema,model, type InferSchemaType} from "mongoose"

const classSchema = new Schema(
    {
        letter:{type:String,enum:["A","B","C","D","E","F"],required:true,unique:true,trim:true},
        grade:{type:Number,min:10,max:12},
        teachers:[{type:Schema.Types.ObjectId,ref:"User"}],
        isActive:{type:Boolean,default:true}
    }
)

export type ClassType = InferSchemaType<typeof classSchema>

export default model("Class",classSchema)