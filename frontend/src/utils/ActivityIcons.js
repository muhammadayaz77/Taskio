import {
  HiPlusCircle,
  HiPencil,
  HiCheckCircle,
  HiUserAdd,
  HiUserRemove,
  HiUserGroup,
  HiSwitchHorizontal,
  HiChatAlt2,
  HiPaperClip,
} from "react-icons/hi";

export const getActionIcon = (action) => {
  switch (action) {
    case "created_task":
      return <HiPlusCircle className="text-blue-500 w-5 h-5" />;
    case "updated_task":
      return <HiPencil className="text-yellow-500 w-5 h-5" />;
    case "created_subtask":
      return <HiPlusCircle className="text-green-500 w-5 h-5" />;
    case "updated_subtask":
      return <HiPencil className="text-orange-500 w-5 h-5" />;
    case "completed_task":
      return <HiCheckCircle className="text-green-600 w-5 h-5" />;
    case "created_project":
      return <HiPlusCircle className="text-purple-500 w-5 h-5" />;
    case "updated_project":
      return <HiPencil className="text-purple-400 w-5 h-5" />;
    case "added_comment":
      return <HiChatAlt2 className="text-blue-400 w-5 h-5" />;
    case "removed_member":
      return <HiUserRemove className="text-red-500 w-5 h-5" />;
    case "joined_workspace":
      return <HiUserAdd className="text-green-400 w-5 h-5" />;
    case "transferred_workspace_ownership":
      return <HiSwitchHorizontal className="text-indigo-500 w-5 h-5" />;
    case "added_attachment":
      return <HiPaperClip className="text-gray-500 w-5 h-5" />;
    default:
      return <HiPlusCircle className="text-gray-400 w-5 h-5" />;
  }
};