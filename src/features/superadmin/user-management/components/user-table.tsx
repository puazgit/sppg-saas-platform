import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react'
import { UserType } from '@prisma/client'

interface User {
  id: string
  name: string
  email: string
  userType: UserType
  isActive: boolean
  lastLogin: Date | null
  sppg: {
    id: string
    name: string
    province: {
      name: string
    } | null
  } | null
  userRoles: Array<{
    role: {
      id: string
      name: string
    }
  }>
}

interface UserTableProps {
  users: User[]
  selectedUserIds: string[]
  onToggleSelection: (userId: string) => void
  onSelectAll: () => void
  onClearSelection: () => void
}

const UserTable = React.memo<UserTableProps>(function UserTable({
  users,
  selectedUserIds,
  onToggleSelection,
  onSelectAll,
  onClearSelection
}) {
  const allSelected = users.length > 0 && selectedUserIds.length === users.length
  const someSelected = selectedUserIds.length > 0 && selectedUserIds.length < users.length

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow className="border-slate-200 dark:border-slate-700">
              <TableHead className="w-12 text-slate-900 dark:text-slate-100">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onSelectAll()
                    } else {
                      onClearSelection()
                    }
                  }}
                  className="border-slate-300 dark:border-slate-600"
                  {...(someSelected && { 'data-indeterminate': true })}
                />
              </TableHead>
              <TableHead className="text-slate-900 dark:text-slate-100">Name</TableHead>
              <TableHead className="text-slate-900 dark:text-slate-100">Email</TableHead>
              <TableHead className="text-slate-900 dark:text-slate-100">Type</TableHead>
              <TableHead className="text-slate-900 dark:text-slate-100">SPPG</TableHead>
              <TableHead className="text-slate-900 dark:text-slate-100">Status</TableHead>
              <TableHead className="text-slate-900 dark:text-slate-100">Last Login</TableHead>
              <TableHead className="w-12 text-slate-900 dark:text-slate-100">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id} 
                className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <TableCell className="text-slate-900 dark:text-slate-100">
                  <Checkbox
                    checked={selectedUserIds.includes(user.id)}
                    onCheckedChange={() => onToggleSelection(user.id)}
                    className="border-slate-300 dark:border-slate-600"
                  />
                </TableCell>
                <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                  {user.name}
                </TableCell>
                <TableCell className="text-slate-700 dark:text-slate-300">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.userType === 'SUPERADMIN' ? 'default' : 'secondary'}
                    className={
                      user.userType === 'SUPERADMIN' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                    }
                  >
                    {user.userType === 'SUPERADMIN' ? 'SuperAdmin' : 'SPPG User'}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-700 dark:text-slate-300">
                  {user.sppg ? (
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">{user.sppg.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {user.sppg.province?.name || 'Unknown Province'}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.isActive ? 'default' : 'destructive'}
                    className={
                      user.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-700 dark:text-slate-300">
                  {user.lastLogin ? (
                    <div>
                      <div>{new Date(user.lastLogin).toLocaleDateString('id-ID')}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(user.lastLogin).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400">Never</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <MoreHorizontal className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end"
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    >
                      <DropdownMenuItem className="hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
})

UserTable.displayName = 'UserTable'

export default UserTable