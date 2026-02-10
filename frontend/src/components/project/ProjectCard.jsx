import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  Planning: "bg-blue-100 text-blue-700",
  "In Progress": "bg-green-100 text-green-700",
  "On Hold": "bg-yellow-100 text-yellow-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function ProjectCard({ project }) {
  return (
    <Card className="hover:shadow-md transition rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{project.title}</CardTitle>
          <Badge className={statusColors[project.status]}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description || "No description"}
        </p>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>

        {/* Dates */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Start: {new Date(project.startDate).toLocaleDateString()}
          </span>
          <span>
            Due: {new Date(project.dueDate).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
