/* src/models/job-application.model.ts */
import { Schema, Types, model } from 'mongoose';
import { JOB_APPLICATION, JOB_POST, CANDIDATE } from '../constants';
import { IJobApp, IJobAppModel } from '../interfaces/jobApplication.interface';
import { formatAttributeName } from '../utils';

const jobAppSchema = new Schema<IJobApp, IJobAppModel>(
  {
    jap_jobPost: {
      type: Types.ObjectId,
      ref: JOB_POST.DOCUMENT_NAME,
      required: true,
    },
    jap_candidate: {
      type: Types.ObjectId,
      ref: CANDIDATE.DOCUMENT_NAME,
      required: true,
    },
    jap_message: String, // lời nhắn kèm
    jap_status: {
      // vòng tuyển
      type: String,
      enum: ['applied', 'shortlisted', 'interview', 'hired', 'rejected'],
      default: 'applied',
      index: true,
    },
  },
  { timestamps: true, collection: JOB_APPLICATION.COLLECTION_NAME }
);

jobAppSchema.index({ jap_jobPost: 1, jap_candidate: 1 }, { unique: true }); // 1 CV chỉ apply 1 lần/post

jobAppSchema.statics.build = (attrs: IJobApp) =>
  JobApplicationModel.create(
    formatAttributeName(attrs, JOB_APPLICATION.PREFIX)
  );

export const JobApplicationModel = model<IJobApp, IJobAppModel>(
  JOB_APPLICATION.DOCUMENT_NAME,
  jobAppSchema
);
