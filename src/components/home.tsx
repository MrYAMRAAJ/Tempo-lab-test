import React, { useState, useMemo } from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import Sidebar from "./dashboard/Sidebar";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { BarChart, Clock, Users, CheckCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskDetailDialog from "./dashboard/TaskDetailDialog";

interface ProjectMetric {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  assignee: string;
  dueDate: string;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  avatar: string;
}

interface HomeProps {
  projectMetrics?: ProjectMetric[];
  tasks?: Task[];
  activities?: Activity[];
}

const defaultMetrics: ProjectMetric[] = [
  {
    title: "Total Projects",
    value: "12",
    change: 8,
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    title: "In Progress",
    value: "5",
    change: 2,
    icon: <Clock className="h-4 w-4" />,
  },
  {
    title: "Team Members",
    value: "24",
    change: 12,
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Completed Tasks",
    value: "128",
    change: 24,
    icon: <CheckCircle className="h-4 w-4" />,
  },
];

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Design System Implementation",
    status: "in-progress",
    assignee: "Alice Cooper",
    dueDate: "2024-02-28",
  },
  {
    id: "2",
    title: "User Research",
    status: "todo",
    assignee: "Bob Wilson",
    dueDate: "2024-03-05",
  },
  {
    id: "3",
    title: "Frontend Development",
    status: "done",
    assignee: "Carol Smith",
    dueDate: "2024-02-25",
  },
];

const defaultActivities: Activity[] = [
  {
    id: "1",
    user: "Alice Cooper",
    action: 'completed task "Design Review"',
    timestamp: "5 minutes ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  },
  {
    id: "2",
    user: "Bob Wilson",
    action: 'started working on "API Integration"',
    timestamp: "1 hour ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
  },
];

const Home = ({
  projectMetrics = defaultMetrics,
  initialTasks = defaultTasks,
  activities = defaultActivities,
}: HomeProps & { initialTasks?: Task[] }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    updatedTasks.splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [tasks, searchQuery]);

  const filteredActivities = useMemo(() => {
    return activities.filter(
      (activity) =>
        activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [activities, searchQuery]);

  const handleHeaderSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSidebarSearch = (query: string) => {
    setSidebarSearchQuery(query);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleTaskSave = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onSearch={handleHeaderSearch} />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar onSearch={handleSidebarSearch} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {projectMetrics.map((metric, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">{metric.title}</span>
                  {metric.icon}
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span
                    className={`text-sm ${metric.change >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {metric.change >= 0 ? "+" : ""}
                    {metric.change}%
                  </span>
                </div>
                <Progress value={65} className="mt-2" />
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-2">
              <Tabs defaultValue="todo" className="w-full">
                <div className="p-4 border-b">
                  <TabsList>
                    <TabsTrigger value="todo">To Do</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="done">Done</TabsTrigger>
                  </TabsList>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                  {["todo", "in-progress", "done"].map((status) => (
                    <TabsContent key={status} value={status} className="p-4">
                      <Droppable droppableId={status}>
                        {(provided) => (
                          <ScrollArea className="h-[400px]">
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-4"
                            >
                              {filteredTasks
                                .filter((task) => task.status === status)
                                .map((task, index) => (
                                  <Draggable
                                    key={task.id}
                                    draggableId={task.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <Card
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onClick={() => handleTaskClick(task)}
                                        className="p-4 cursor-pointer hover:bg-accent"
                                      >
                                        <h3 className="font-medium">
                                          {task.title}
                                        </h3>
                                        <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                                          <span>
                                            Assigned to: {task.assignee}
                                          </span>
                                          <span>Due: {task.dueDate}</span>
                                        </div>
                                      </Card>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </div>
                          </ScrollArea>
                        )}
                      </Droppable>
                    </TabsContent>
                  ))}
                </DragDropContext>
              </Tabs>
            </Card>

            <Card className="p-4">
              <h2 className="font-semibold mb-4">Recent Activity</h2>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {filteredActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-2"
                    >
                      <img
                        src={activity.avatar}
                        alt={activity.user}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.action}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </main>
      </div>
      <TaskDetailDialog
        task={selectedTask}
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default Home;
