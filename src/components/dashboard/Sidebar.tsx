import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Users,
  Folder,
  Calendar,
  Settings,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline" | "busy";
}

interface SidebarProps {
  teamMembers?: TeamMember[];
  selectedProject?: string;
  onProjectSelect?: (project: string) => void;
  onMemberSelect?: (memberId: string) => void;
}

const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alice Cooper",
    role: "Project Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    status: "online",
  },
  {
    id: "2",
    name: "Bob Wilson",
    role: "Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    status: "busy",
  },
  {
    id: "3",
    name: "Carol Smith",
    role: "Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
    status: "offline",
  },
];

const defaultProjects = [
  "Website Redesign",
  "Mobile App Development",
  "Marketing Campaign",
];

const Sidebar = ({
  teamMembers = defaultTeamMembers,
  selectedProject = defaultProjects[0],
  onProjectSelect = () => {},
  onMemberSelect = () => {},
  onSearch = () => {},
}: SidebarProps) => {
  return (
    <Card className="h-full w-[280px] bg-background border-r p-4 flex flex-col gap-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <Folder className="mr-2 h-4 w-4" />
          Projects
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Team
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          Calendar
        </Button>
      </nav>

      {/* Projects List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Projects</h3>
        <ScrollArea className="h-[120px]">
          <div className="space-y-1">
            {defaultProjects.map((project) => (
              <Button
                key={project}
                variant={project === selectedProject ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onProjectSelect(project)}
              >
                {project}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Team Members List */}
      <div className="flex-1">
        <h3 className="text-sm font-medium mb-2">Team Members</h3>
        <ScrollArea className="h-[calc(100%-2rem)]">
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <Button
                key={member.id}
                variant="ghost"
                className="w-full flex items-center gap-2 justify-start p-2"
                onClick={() => onMemberSelect(member.id)}
              >
                <Avatar className="h-8 w-8">
                  <img src={member.avatar} alt={member.name} />
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{member.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {member.role}
                  </span>
                </div>
                <Badge
                  variant={
                    member.status === "online"
                      ? "success"
                      : member.status === "busy"
                        ? "destructive"
                        : "secondary"
                  }
                  className="ml-auto"
                >
                  {member.status}
                </Badge>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Settings Button */}
      <Button variant="ghost" className="w-full justify-start mt-auto">
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
    </Card>
  );
};

export default Sidebar;
