import React from 'react'
import { Button } from '@/components/ui/button'

interface UserPaginationProps {
  currentUsersLength: number
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onPageChange: (page: number) => void
}

const UserPagination = React.memo<UserPaginationProps>(function UserPagination({
  currentUsersLength,
  totalCount,
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange
}) {
  return (
    <div className="flex items-center justify-between mt-6 p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Showing {currentUsersLength} of {totalCount} users
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(currentPage - 1)}
          className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
        >
          Previous
        </Button>
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  )
})

UserPagination.displayName = 'UserPagination'

export default UserPagination