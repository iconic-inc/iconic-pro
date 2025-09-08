import { IJobApplication } from '~/interfaces/jobApplication.interface';

export default function JobAppCard({
  jobApp,
  onClick,
}: {
  jobApp: IJobApplication;
  onClick?: (jobApp: IJobApplication) => void;
}) {
  return <div></div>;
}
