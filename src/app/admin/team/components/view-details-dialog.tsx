import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { IUser } from "@/types/user";
import { Row } from "@tanstack/react-table";
import { TextP } from "../../../../../components/ui/typography";

interface ViewDetailsDialogProps<TData extends IUser> {
  row: Row<TData>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ViewDetailsDialog<TData extends IUser>({
  row,
  open,
  setOpen,
}: ViewDetailsDialogProps<TData>) {
  const user = row.original as IUser;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            {`Details of ${user.full_name || user.username}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Full Name</Label>
            <TextP className="col-span-3">{user.full_name || "N/A"}</TextP>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Email</Label>
            <TextP className="col-span-3">{user.email}</TextP>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Role</Label>
            <TextP className="col-span-3">{user.role}</TextP>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Phone</Label>
            <TextP className="col-span-3">{user.phone || "N/A"}</TextP>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Primary Band Role</Label>
            <TextP className="col-span-3">
              {user.wt_role_primary || "N/A"}
            </TextP>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Primary Location</Label>
            <TextP className="col-span-3">
              {user.location_primary || "N/A"}
            </TextP>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Status</Label>
            <TextP className="col-span-3">{user.status}</TextP>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Created At</Label>
            <TextP className="col-span-3">
              {new Date(user.created_at).toLocaleDateString()}
            </TextP>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
