import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function AdminSettingsNav() {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors">
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>System Settings</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/admin/settings/venue" className="cursor-pointer">
            Venue Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/admin/settings/general" className="cursor-pointer">
            General Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/admin/settings/profile" className="cursor-pointer">
            Profile Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}