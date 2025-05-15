/* src/models/candidate-profile.model.ts */
import { Schema, Types, model } from 'mongoose';
import { CANDIDATE, USER } from '../constants';
import { ICandidate, ICandidateModel } from '../interfaces/candidate.constant';
import { formatAttributeName } from '../utils';

const candidateSchema = new Schema<ICandidate, ICandidateModel>(
  {
    can_user: {
      type: Types.ObjectId,
      ref: USER.DOCUMENT_NAME,
      required: true,
      unique: true,
    },
    can_summary: String,
    can_experience: { type: String }, // markdown / rich‑text
    can_skills: [String],
    can_cvFile: String, // URL file pdf
    can_status: { type: String, enum: ['active', 'hidden'], default: 'active' },
  },
  { timestamps: true, collection: CANDIDATE.COLLECTION_NAME }
);

candidateSchema.statics.build = (attrs: ICandidate) =>
  CandidateModel.create(formatAttributeName(attrs, CANDIDATE.PREFIX));

export const CandidateModel = model<ICandidate, ICandidateModel>(
  CANDIDATE.DOCUMENT_NAME,
  candidateSchema
);
