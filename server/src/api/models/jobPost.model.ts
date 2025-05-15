/* src/models/job-post.model.ts */
import { Schema, Types, model } from 'mongoose';
import { JOB_POST, SPA, SPA_OWNER } from '../constants';
import { IJobPost, IJobPostModel } from '../interfaces/jobPost.interface';
import { formatAttributeName } from '../utils';

const jobPostSchema = new Schema<IJobPost, IJobPostModel>(
  {
    jpo_title: { type: String, required: true, trim: true },
    jpo_description: { type: String, required: true },
    jpo_requirements: { type: String },
    jpo_salaryFrom: Number,
    jpo_salaryTo: Number,
    jpo_currency: { type: String, default: 'VND' },

    /* RELATIONS */
    jpo_spa: {
      type: Schema.Types.ObjectId,
      ref: SPA.DOCUMENT_NAME,
      required: true,
    },
    jpo_owner: {
      type: Schema.Types.ObjectId,
      ref: SPA_OWNER.DOCUMENT_NAME,
      required: true,
    },

    /* META */
    jpo_type: {
      type: String,
      enum: ['full-time', 'part-time', 'intern'],
      default: 'full-time',
    },
    jpo_status: {
      type: String,
      enum: ['draft', 'active', 'closed'],
      default: 'active',
      index: true,
    },
    jpo_deadline: Date,
    jpo_applicantCount: { type: Number, default: 0 },
  },
  { timestamps: true, collection: JOB_POST.COLLECTION_NAME }
);

jobPostSchema.statics.build = (attrs: IJobPost) =>
  JobPostModel.create(formatAttributeName(attrs, JOB_POST.PREFIX));

export const JobPostModel = model<IJobPost, IJobPostModel>(
  JOB_POST.DOCUMENT_NAME,
  jobPostSchema
);
