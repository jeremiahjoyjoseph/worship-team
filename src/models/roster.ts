import {
  IEventDate,
  ILocationRoster,
  IRoster,
  ISubmission,
  IWorshipTeam,
} from "@/types/roster";
import { BandRole, Location } from "@/types/user";
import mongoose, { Model, Schema } from "mongoose";

// Define schemas
const WorshipTeamSchema = new Schema<IWorshipTeam>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  bandRole: {
    type: String,
    enum: Object.values(BandRole),
    required: true,
  },
});

const DateRosterSchema = new Schema({
  date: { type: String, required: true }, // Sunday date
  worshipTeam: [WorshipTeamSchema],
});

const LocationRosterSchema = new Schema<ILocationRoster>({
  location: { type: String, enum: Object.values(Location), required: true },
  dateRosters: [DateRosterSchema], // Multiple dates with their respective teams
});

const EventDateSchema = new Schema<IEventDate>({
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
});

const SubmissionSchema = new Schema<ISubmission>({
  userId: { type: String, required: true },
  submittedDates: { type: [String], required: true },
});

const RosterSchema = new Schema<IRoster>(
  {
    name: { type: String },
    month: { type: String, required: true, unique: true },
    requiredDates: { type: [String], required: true },
    submissions: [SubmissionSchema],
    roster: [LocationRosterSchema],
    notes: { type: [String] },
    eventDates: [EventDateSchema],
  },
  { timestamps: true }
);

// Export the model
const Roster: Model<IRoster> =
  mongoose.models.Roster || mongoose.model<IRoster>("Roster", RosterSchema);
export default Roster;
