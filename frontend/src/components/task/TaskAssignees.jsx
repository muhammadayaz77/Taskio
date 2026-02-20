import { useState, useEffect } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

function TaskAssignees({ taskId, assignees = [], members = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]); // final selected
  const [tempSelected, setTempSelected] = useState([]); // temporary state while dropdown is open

  // Sync final selected state with props
  useEffect(() => {
    setSelected(assignees);
  }, [assignees]);

  // Open dropdown → copy selected to temp
  const handleDropdownToggle = () => {
    setTempSelected(selected);
    setIsOpen((prev) => !prev);
  };

  // Toggle member in temporary state
  const handleToggle = (memberId) => {
    const exists = tempSelected.some((u) => u._id === memberId);

    if (exists) {
      setTempSelected((prev) =>
        prev.filter((u) => u._id !== memberId)
      );
    } else {
      const member = members.find((m) => m.user._id === memberId);
      if (!member) return;

      setTempSelected((prev) => [...prev, member.user]);
    }
  };

  // Select All
  const handleSelectAll = () => {
    setTempSelected(members.map((m) => m.user));
  };

  // Unselect All
  const handleUnselectAll = () => {
    setTempSelected([]);
  };

  // Cancel → restore tempSelected from current selected
  const handleCancel = () => {
    setTempSelected(selected);
    setIsOpen(false);
  };

  // Save → commit tempSelected to final selected
  const handleSave = () => {
    setSelected(tempSelected);
    setIsOpen(false);

    console.log("Saved Assignees:", tempSelected);

    // 🔥 Call API here
    // updateAssignees({ taskId, assignees: tempSelected.map(u => u._id) })
  };

  return (
    <div className="space-y-4 relative">

      {/* Header */}
      <p className="text-sm font-medium">
        Assignees ({selected.length})
      </p>

      {/* Selected Badges */}
      <div className="flex flex-wrap gap-2">
        {selected.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No members assigned
          </p>
        )}
        {selected.map((user) => (
          <Badge key={user._id} variant="secondary">
            {user.name}
          </Badge>
        ))}
      </div>

      {/* Dropdown Button */}
      <Button variant="outline" className="w-full" onClick={handleDropdownToggle}>
        Manage Members
      </Button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg p-4 space-y-3">

          {/* Select/Unselect All */}
          <div className="flex justify-between">
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleUnselectAll}>
              Unselect All
            </Button>
          </div>

          {/* Members List */}
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {members.map((member) => {
              const checked = tempSelected.some((u) => u._id === member.user._id);
              return (
                <div key={member.user._id} className="flex items-center gap-2">
                  <Checkbox checked={checked} onCheckedChange={() => handleToggle(member.user._id)} />
                  <span className="text-sm">{member.user.name}</span>
                </div>
              );
            })}
          </div>

          {/* Cancel / Save */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskAssignees;
