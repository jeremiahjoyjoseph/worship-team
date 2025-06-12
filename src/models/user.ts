import { BandRole, IUser, Location, Role } from "@/types/user";
import mongoose, { Model, Schema } from "mongoose";

// Schema
const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    middleName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    fullName: { type: String, trim: true },
    nickname: { type: String, lowercase: true, trim: true },
    username: { type: String, lowercase: true, trim: true, unique: true },
    email: {
      type: String,
      trim: true,
      required: [true, "Please enter your email"],
    },
    phone: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 10,
      required: [true, "Please provide a phone number"],
    },
    createdAt: { type: Date, default: Date.now },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.GUEST,
      required: [true, "Please enter your role"],
    },
    lastLogInDate: Date,
    wtRolePrimary: {
      type: String,
      enum: Object.values(BandRole),
      required: [
        function (this: IUser) {
          return [
            Role.WORSHIP_PASTOR,
            Role.WORSHIP_LEADER,
            Role.WORSHIP_TEAM_MEMBER,
          ].includes(this.role);
        },
        "Please enter primary role in worship team",
      ],
      trim: true,
    },
    wtRoleSecondary: {
      type: String,
      enum: [...Object.values(BandRole), ""],
      trim: true,
    },
    wtRoleSpare: {
      type: String,
      enum: [...Object.values(BandRole), ""],
      trim: true,
    },
    allBandRoles: { type: Boolean, default: false, select: false },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please choose a gender"],
      trim: true,
    },
    dob: { type: String, trim: true },
    md: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
      trim: true,
    },
    locationPrimary: {
      type: String,
      enum: Object.values(Location),
      required: [
        function (this: IUser) {
          return [
            Role.WORSHIP_PASTOR,
            Role.WORSHIP_LEADER,
            Role.WORSHIP_TEAM_MEMBER,
          ].includes(this.role);
        },
        "Please enter primary location",
      ],
      trim: true,
    },
    locationSecondary: {
      type: String,
      enum: [...Object.values(Location), ""],
      trim: true,
    },
    locationSpare: {
      type: String,
      enum: [...Object.values(Location), ""],
      trim: true,
    },
    allLocations: { type: Boolean, default: false, select: true },
    slug: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
