import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { IUser } from "@/types/user";
import { Row } from "@tanstack/react-table";

interface ViewDetailsDialogProps<TData extends IUser> {
  row: Row<TData>; // User data passed as a prop
}

export function ViewDetailsDialog<TData extends IUser>({
  row,
}: ViewDetailsDialogProps<TData>) {
  const user = row.original as IUser;
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>User Details</DialogTitle>
        <DialogDescription>
          {`Details of ${user.fullName || user.username}`}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-left">Full Name</Label>
          <span className="col-span-3">{user.fullName || "N/A"}</span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-left">Email</Label>
          <span className="col-span-3">{user.email}</span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-left">Role</Label>
          <span className="col-span-3">{user.role}</span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-left">Phone</Label>
          <span className="col-span-3">{user.phone || "N/A"}</span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-left">Primary Band Role</Label>
          <span className="col-span-3">{user.wtRolePrimary || "N/A"}</span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-left">Primary Location</Label>
          <span className="col-span-3">{user.locationPrimary || "N/A"}</span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-left">Status</Label>
          <span className="col-span-3">{user.status}</span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-left">Created At</Label>
          <span className="col-span-3">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <DialogFooter>
        <Button type="button">Close</Button>
      </DialogFooter>
    </DialogContent>
  );
}
