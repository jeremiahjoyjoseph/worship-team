import { updateUser } from "@/app/api/user/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BAND_ROLES } from "@/constants/band-roles";
import { LOCATIONS } from "@/constants/location";
import { USER_ROLES } from "@/constants/role";
import { USER_STATUS } from "@/constants/status";
import { BandRole, IUser } from "@/types/user";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { useUserTableContext } from "../context/user-table-context";

interface EditDetailsDialogProps<TData extends IUser> {
  row: Row<TData>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditDetailsDialog<TData extends IUser>({
  row,
  open,
  setOpen,
}: EditDetailsDialogProps<TData>) {
  const user = row.original as IUser;
  const { updateRow } = useUserTableContext();

  const [formState, setFormState] = useState({
    locationPrimary: user.locationPrimary,
    status: user.status,
    fullName: user.fullName || "",
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    wtRolePrimary: user.wtRolePrimary || undefined,
  });

  const handleChange = (field: string, value: string | BandRole) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSave = () => {
    updateUser(user._id, formState)
      .then(({ data }) => {
        alert("User details updated successfully!");
        updateRow(data);
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        alert(
          "An error occurred while updating user details. Please try again."
        );
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
          <DialogDescription>
            {`Edit details of ${user.fullName || user.username}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Full Name</Label>
            <Input className="col-span-3" value={formState.fullName} disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Email</Label>
            <Input
              className="col-span-3"
              value={formState.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Role</Label>
            <Select
              value={formState.role}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Phone</Label>
            <Input
              className="col-span-3"
              value={formState.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Primary Band Role</Label>
            <Select
              value={formState.wtRolePrimary}
              onValueChange={(value: BandRole) =>
                handleChange("wtRolePrimary", value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select band role" />
              </SelectTrigger>
              <SelectContent>
                {BAND_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Primary Location</Label>
            <Select
              value={formState.locationPrimary}
              onValueChange={(value) => handleChange("locationPrimary", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Status</Label>
            <Select
              value={formState.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {USER_STATUS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Created At</Label>
            <Input
              className="col-span-3"
              defaultValue={new Date(user.createdAt).toLocaleDateString()}
              disabled
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              handleSave();
            }}
          >
            Save
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
