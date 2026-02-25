import {
  PlusCircle,
  Edit2,
  CheckCircle,
  UserPlus,
  UserMinus,
  Repeat,
  MessageCircle,
  Paperclip,
} from "lucide-react";

const iconWrapper = (Icon, bgColor, iconColor) => (
  <div
    className={`flex items-center justify-center w-9 h-9 rounded-full ${bgColor} ${iconColor} shadow-sm`}
  >
    <Icon className="w-4 h-4" />
  </div>
);

export const getActionIcon = (action) => {
  switch (action) {
    case "created_task":
      return iconWrapper(PlusCircle, "bg-blue-100", "text-blue-600");

    case "updated_task":
      return iconWrapper(Edit2, "bg-amber-100", "text-amber-600");

    case "created_subtask":
      return iconWrapper(PlusCircle, "bg-emerald-100", "text-emerald-600");

    case "updated_subtask":
      return iconWrapper(Edit2, "bg-orange-100", "text-orange-600");

    case "completed_task":
      return iconWrapper(CheckCircle, "bg-green-100", "text-green-600");

    case "created_project":
      return iconWrapper(PlusCircle, "bg-purple-100", "text-purple-600");

    case "updated_project":
      return iconWrapper(Edit2, "bg-violet-100", "text-violet-600");

    case "added_comment":
      return iconWrapper(MessageCircle, "bg-sky-100", "text-sky-600");

    case "removed_member":
      return iconWrapper(UserMinus, "bg-red-100", "text-red-600");

    case "joined_workspace":
      return iconWrapper(UserPlus, "bg-teal-100", "text-teal-600");

    case "transferred_workspace_ownership":
      return iconWrapper(Repeat, "bg-indigo-100", "text-indigo-600");

    case "added_attachment":
      return iconWrapper(Paperclip, "bg-gray-100", "text-gray-600");

    default:
      return iconWrapper(PlusCircle, "bg-gray-100", "text-gray-500");
  }
};