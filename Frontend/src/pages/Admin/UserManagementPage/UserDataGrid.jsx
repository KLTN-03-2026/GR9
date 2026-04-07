import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  LockOpen, 
  Ban, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle 
} from "lucide-react";

const UserDataGrid = ({ users }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">User Name</TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Role</TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Status</TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Date Joined</TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors group">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className={`h-10 w-10 rounded-xl ring-2 ring-white shadow-sm ${user.status === 'Banned' ? 'grayscale opacity-60' : ''}`}>
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback className="rounded-xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className={`font-bold text-slate-900 ${user.status === 'Banned' ? 'line-through text-slate-400' : ''}`}>
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="px-6 py-4">
                <Badge variant="secondary" className={`rounded-full px-3 py-0.5 text-[11px] font-bold shadow-none ${
                  user.role === 'Traveler' ? 'bg-slate-100 text-slate-600' : 'bg-teal-50 text-teal-700'
                }`}>
                  {user.role}
                </Badge>
              </TableCell>

              <TableCell className="px-6 py-4">
                <div className={`flex items-center gap-2 ${
                  user.status === 'Active' ? 'text-teal-600' : user.status === 'Banned' ? 'text-red-500' : 'text-slate-400'
                }`}>
                  {user.status === 'Banned' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-teal-600' : 'bg-slate-300'}`} />
                  )}
                  <span className="text-sm font-semibold">{user.status}</span>
                </div>
              </TableCell>

              <TableCell className="px-6 py-4 text-sm font-medium text-slate-500">
                {user.date}
              </TableCell>

              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {user.status === 'Pending' ? (
                    <Button size="sm" className="h-8 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white font-bold text-[11px] rounded-full px-4 shadow-none border-none">
                      Activate
                    </Button>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg">
                        {user.status === 'Banned' ? <RotateCcw className="h-5 w-5" /> : <LockOpen className="h-5 w-5" />}
                      </Button>
                      {user.status !== 'Banned' && (
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                          <Ban className="h-5 w-5" />
                        </Button>
                      )}
                    </>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:bg-slate-100 rounded-lg">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl w-40">
                      <DropdownMenuItem className="text-sm font-medium">View Profile</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm font-medium">Edit Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm font-medium text-red-600">Delete User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="px-6 py-4 bg-slate-50/30 flex items-center justify-between border-t border-slate-100">
        <span className="text-sm text-slate-500 font-medium">
          Showing <span className="text-slate-900">1</span> to <span className="text-slate-900">10</span> of 1,248 users
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 disabled:opacity-50" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button className="h-8 w-8 rounded-lg bg-teal-900 text-white text-xs font-bold shadow-sm hover:bg-teal-800">
            1
          </Button>
          <Button variant="ghost" className="h-8 w-8 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200">
            2
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 hover:bg-slate-200">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDataGrid;