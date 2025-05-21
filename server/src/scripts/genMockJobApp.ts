require('dotenv').config();
import { JobPostService } from '@services/jobPost.service';
import { mongodbInstance } from '../db/init.mongodb';
import { CandidateService } from '@services/candidate.service';
import { JobApplicationService } from '@services/jobApplication.service';

async function main() {
  await mongodbInstance.connect();

  const candidates = await CandidateService.listCandidates({
    limit: 9999,
    status: 'active',
  });
  const jobPosts = await JobPostService.listJobPosts({
    limit: 9999,
    status: 'active',
  });
  const canUserIds = candidates.data.map((candidate) => candidate.can_user.id);
  const jobPostIds = jobPosts.data.map((jobPost) => jobPost.id);

  for (const canId of canUserIds) {
    for (const jobId of jobPostIds) {
      await JobApplicationService.applyJob(canId, jobId);
    }
  }

  console.log('Mock job applications created successfully');

  await mongodbInstance.disconnect();
}

main();
