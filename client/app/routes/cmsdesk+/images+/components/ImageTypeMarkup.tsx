import { IMAGE } from '~/constants/image.constant';

export default function ImageTypeMarkup({ type }: { type: string }) {
  let color = {} as { bg: string; text: string };

  switch (type as Values<typeof IMAGE.TYPE>['value']) {
    case 'other':
      color = { bg: 'bg-gray-200', text: 'text-gray-800' };
      break;
    case 'banner':
      color = { bg: 'bg-purple-100', text: 'text-purple-800' };
      break;
    case 'marketing-course':
      color = { bg: 'bg-blue-100', text: 'text-blue-800' };
      break;
    case 'telesales-course':
      color = { bg: 'bg-green-100', text: 'text-green-800' };
      break;
    case 'consultant-course':
      color = { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      break;
    case 'management-course':
      color = { bg: 'bg-indigo-100', text: 'text-indigo-800' };
      break;
    case 'discount':
      color = { bg: 'bg-red-100', text: 'text-red-800' };
      break;
    case 'facility':
      color = { bg: 'bg-teal-100', text: 'text-teal-800' };
      break;
    case 'marketing-lecturer':
      color = { bg: 'bg-blue-200', text: 'text-blue-900' };
      break;
    case 'telesales-lecturer':
      color = { bg: 'bg-green-200', text: 'text-green-900' };
      break;
    case 'consultant-lecturer':
      color = { bg: 'bg-yellow-200', text: 'text-yellow-900' };
      break;
    case 'management-lecturer':
      color = { bg: 'bg-indigo-200', text: 'text-indigo-900' };
      break;
    case 'ambassador':
      color = { bg: 'bg-pink-100', text: 'text-pink-800' };
      break;
    case 'prize':
      color = { bg: 'bg-orange-100', text: 'text-orange-800' };
      break;
    case 'marketing-student':
      color = { bg: 'bg-blue-50', text: 'text-blue-700' };
      break;
    case 'telesales-student':
      color = { bg: 'bg-green-50', text: 'text-green-700' };
      break;
    case 'consultant-student':
      color = { bg: 'bg-yellow-50', text: 'text-yellow-700' };
      break;
    case 'management-student':
      color = { bg: 'bg-indigo-50', text: 'text-indigo-700' };
      break;
    case 'newspaper':
      color = { bg: 'bg-slate-100', text: 'text-slate-800' };
      break;
    case 'partner':
      color = { bg: 'bg-cyan-100', text: 'text-cyan-800' };
      break;
    case 'video':
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
