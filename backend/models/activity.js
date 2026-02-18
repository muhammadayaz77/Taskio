import { model, Schema } from "mongoose";
import { string } from "zod";



const activityLogSchema = new Schema({
  user : {
    type : Schema.Types.ObjectId,
    ref : 'User',
    required : true
  },
  action : {
    type : String,
    required : true,
    enum : [
      'created_task',
      'updated_task',
      'created_subtask',
      'updated_subtask',
      'completed_task',
      'created_project',
      'updated_project',
      'added_comment',
      'removed_member',
      'joined_workspace',
      'transferred_workspace_ownership',
      'added_attachment',
    ]
  },
  resource_Type : {
    type : String,
    required : true,
    enum : ['Task','Project','Comment','Workspace','User']
  },
  resourceId : {
    type : Schema.Types.ObjectId,
    required : true,
  },
  details : {
    type : Object
  },
},
{timestamps:true}
)

const activityLog = model('ActivityLog',activityLogSchema)

export default activityLog