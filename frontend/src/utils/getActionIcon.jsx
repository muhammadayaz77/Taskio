import {
  PlusCircle,
  Edit2,
  CheckCircle,
  UserPlus,
  UserMinus,
  Users,
  Repeat,
  MessageCircle,
  Paperclip,
} from "lucide-react";

export const getActionIcon = (action) => {
  switch (action) {
    case "created_task":
      return <PlusCircle className="text-blue-500 w-5 h-5" />;
    case "updated_task":
      return <Edit2 className="text-yellow-500 w-5 h-5" />;
    case "created_subtask":
      return <PlusCircle className="text-green-500 w-5 h-5" />;
    case "updated_subtask":
      return <Edit2 className="text-orange-500 w-5 h-5" />;
    case "completed_task":
      return <CheckCircle className="text-green-600 w-5 h-5" />;
    case "created_project":
      return <PlusCircle className="text-purple-500 w-5 h-5" />;
    case "updated_project":
      return <Edit2 className="text-purple-400 w-5 h-5" />;
    case "added_comment":
      return <MessageCircle className="text-blue-400 w-5 h-5" />;
    case "removed_member":
      return <UserMinus className="text-red-500 w-5 h-5" />;
    case "joined_workspace":
      return <UserPlus className="text-green-400 w-5 h-5" />;
    case "transferred_workspace_ownership":
      return <Repeat className="text-indigo-500 w-5 h-5" />;
    case "added_attachment":
      return <Paperclip className="text-gray-500 w-5 h-5" />;
    default:
      return <PlusCircle className="text-gray-400 w-5 h-5" />;
  }
};