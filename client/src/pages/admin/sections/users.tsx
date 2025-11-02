"use client";

import { useState, useEffect } from "react";
import HttpClient from "@/lib/axiosInstance.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, MoreHorizontal, Search, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import { toast } from "@/components/ui/use-toast";


interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive" | "suspended";
  lastLogin?: string;
}

export default function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Add User Modal
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user" as const,
    password: "",
  });

  // Debounce search
  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     setCurrentPage(1);
  //     fetchUsers();
  //   }, 500);
  //   return () => clearTimeout(delay);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchQuery]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // }, [currentPage, pageSize]);

  const fetchUsers = async (current_page = currentPage, page_size = pageSize, search = searchQuery) => {
    setLoading(true);
    try {
      const response = await HttpClient.get(`/user/get-users`, {
        params: {
          page: current_page,
          pageSize: page_size,
          search: search,
        },
      });
      setUsers(response.data.data.data);
      setTotalItems(response.data.data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data } = await HttpClient.post(`/user`, {
        ...newUser,
        account_type: newUser.role,
      });
      toast({ title: "Success", description: "User added successfully." });
      setIsAddUserOpen(false);
      setNewUser({ name: "", email: "", role: "user", password: "" });
      fetchUsers(); // refresh
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to add user.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: User["status"]) => {
    const confirmed = window.confirm("Are you sure you want to update this user's status?");
    if (!confirmed) return;
    try {
      await HttpClient.patch(`/user/${userId}`, { status: newStatus });
      toast({ title: "Status Updated", description: "User status updated." });
      fetchUsers();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: User["role"]) => {
    const confirmed = window.confirm("Are you sure you want to update this user's role?");
    if (!confirmed) return;

    try {
      await HttpClient.patch(`/user/${userId}`, { account_type: newRole });
      toast({ title: "Role Updated", description: "User role updated." });
      fetchUsers();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, pageSize);
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000); // 1 second delay

    return () => clearTimeout(handler); // cleanup on each keystroke
  }, [searchQuery]);

  // 🔹 Call API when `debouncedQuery` changes
  useEffect(() => {
    fetchUsers(1, pageSize, debouncedQuery);
    setCurrentPage(1);
  }, [debouncedQuery]);

  // 🔹 On input change
  const handleSearchUser = (query: string) => {
    setSearchQuery(query);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions.</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Fill in all required fields.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <Select
                value={newUser.role}
                onValueChange={(v: "admin" | "user") => setNewUser({ ...newUser, role: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
               <div className="relative">
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="pr-10" // space for the icon
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Users</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleSearchUser(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading &&
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.account_type === "admin" ? "default" : "secondary"}>
                        {user.account_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active"
                            ? "success"
                            : user.status === "inactive"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.created_at ? new Date(user.created_at).toLocaleString() : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateUserRole(user.id, user.account_type === "admin" ? "user" : "admin")
                            }
                          >
                            Change Role to {user.account_type === "admin" ? "User" : "Admin"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateUserStatus(
                                user.id,
                                user.status === "active" ? "inactive" : "active"
                              )
                            }
                          >
                            {user.status === "active" ? "Deactivate" : "Activate"} User
                          </DropdownMenuItem>
                          {user.status !== "active" && (
                            <DropdownMenuItem
                              onClick={() => handleUpdateUserStatus(user.id, "inactive")}
                              className="text-destructive"
                            >
                              Suspend User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {!loading && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setCurrentPage(1);
                  fetchUsers(1, Number(v));
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handleSetCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => handleSetCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
