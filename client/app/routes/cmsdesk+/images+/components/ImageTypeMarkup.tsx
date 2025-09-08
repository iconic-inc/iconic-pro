import { IMAGE } from '~/constants/image.constant';

export default function ImageTypeMarkup({ type }: { type: string }) {
  let color = {} as { bg: string; text: string };

  switch (type as Values<typeof IMAGE.TYPE>['value']) {
    case IMAGE.TYPE.OTHER.value:
      color = { bg: 'bg-gray-200', text: 'text-gray-800' };
      break;
    case IMAGE.TYPE.BANNER.value:
      color = { bg: 'bg-purple-100', text: 'text-purple-800' };
      break;
    case IMAGE.TYPE.MARKETING_COURSE.value:
      color = { bg: 'bg-blue-100', text: 'text-blue-800' };
      break;
    case IMAGE.TYPE.TELESALES_COURSE.value:
      color = { bg: 'bg-green-100', text: 'text-green-800' };
      break;
    case IMAGE.TYPE.CONSULTANT_COURSE.value:
      color = { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      break;
    case IMAGE.TYPE.MANAGEMENT_COURSE.value:
      color = { bg: 'bg-indigo-100', text: 'text-indigo-800' };
      break;
    case IMAGE.TYPE.DISCOUNT.value:
      color = { bg: 'bg-red-100', text: 'text-red-800' };
      break;
    case IMAGE.TYPE.FACILITY.value:
      color = { bg: 'bg-teal-100', text: 'text-teal-800' };
      break;
    case IMAGE.TYPE.MARKETING_LECTURER.value:
      color = { bg: 'bg-blue-200', text: 'text-blue-900' };
      break;
    case IMAGE.TYPE.TELESALES_LECTURER.value:
      color = { bg: 'bg-green-200', text: 'text-green-900' };
      break;
    case IMAGE.TYPE.CONSULTANT_LECTURER.value:
      color = { bg: 'bg-yellow-200', text: 'text-yellow-900' };
      break;
    case IMAGE.TYPE.MANAGEMENT_LECTURER.value:
      color = { bg: 'bg-indigo-200', text: 'text-indigo-900' };
      break;
    case IMAGE.TYPE.AMBASSADOR.value:
      color = { bg: 'bg-pink-100', text: 'text-pink-800' };
      break;
    case IMAGE.TYPE.PRIZE.value:
      color = { bg: 'bg-orange-100', text: 'text-orange-800' };
      break;
    case IMAGE.TYPE.MARKETING_STUDENT.value:
      color = { bg: 'bg-blue-50', text: 'text-blue-700' };
      break;
    case IMAGE.TYPE.TELESALES_STUDENT.value:
      color = { bg: 'bg-green-50', text: 'text-green-700' };
      break;
    case IMAGE.TYPE.CONSULTANT_STUDENT.value:
      color = { bg: 'bg-yellow-50', text: 'text-yellow-700' };
      break;
    case IMAGE.TYPE.MANAGEMENT_STUDENT.value:
      color = { bg: 'bg-indigo-50', text: 'text-indigo-700' };
      break;
    case IMAGE.TYPE.NEWSPAPER.value:
      color = { bg: 'bg-slate-100', text: 'text-slate-800' };
      break;
    case IMAGE.TYPE.PARTNER.value:
      color = { bg: 'bg-cyan-100', text: 'text-cyan-800' };
      break;
    case IMAGE.TYPE.VIDEO.value:
      color = { bg: 'bg-violet-100', text: 'text-violet-800' };
      break;
    default:
      color = { bg: 'bg-gray-200', text: 'text-black' };
  }

  return (
    <p
      className={`m-auto w-fit rounded px-2 py-1 text-xs font-bold ${color.bg} ${color.text}`}
    >
      {Object.values(IMAGE.TYPE).find((t) => t.value === type)?.optionLabel ||
        'Không xác định'}
    </p>
  );
}
