import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

function TaskAssignees({ taskId, assignees = [], members = [] }) {
  console.log("members : ",members)
  const isPending = false;

  const handleToggle = (memberId) => {
    const alreadyAssigned = assignees.includes(memberId);

    let updated;

    if (alreadyAssigned) {
      updated = assignees.filter((id) => id !== memberId);
    } else {
      updated = [...assignees, memberId];
    }

    console.log("Updated Assignees:", updated);
  };

  const handleSelectAll = () => {
    const allIds = members.map((m) => m._id);
    console.log("Select All:", allIds);
  };

  const handleUnselectAll = () => {
    console.log("Unselect All:", []);
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div>
        <p className="text-sm font-medium mb-2">
          Assignees ({assignees.length})
        </p>

        {/* Full Width Select */}
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Manage Members" />
          </SelectTrigger>

          <SelectContent className="w-full p-3 space-y-2">

            {/* Select All */}
            <div className="flex justify-between gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={handleSelectAll}
              >
                Select All
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={handleUnselectAll}
              >
                Unselect All
              </Button>
            </div>

            {/* Members List */}
            {members.map((member) => {
              const checked = assignees.includes(member.user._id);

              return (
                <div
                  key={member.user._id}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() =>
                      handleToggle(member.user._id)
                    }
                  />
                  <span className="text-sm">
                    {member.user.name}
                  </span>
                </div>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Assignees */}
      <div className="flex flex-wrap gap-2">
        {assignees.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No members assigned
          </p>
        )}

        {members
          .filter((member) =>
            assignees.includes(member._id)
          )
          .map((member) => (
            <Badge key={member._id} variant="secondary">
              {member.name}
            </Badge>
          ))}
      </div>
    </div>
  );
}

export default TaskAssignees;
