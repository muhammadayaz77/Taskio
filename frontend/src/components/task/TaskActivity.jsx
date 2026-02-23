import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";


function TaskActivity() {
  return (
    <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Task created</p>
          <p>Description updated</p>
          <p>Status changed to In Progress</p>
        </CardContent>
      </Card>
  )
}

export default TaskActivity