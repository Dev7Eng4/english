import { isEmpty, renderEmptyText } from '@/app/utils/text';
import { Popover } from '@headlessui/react';

interface Props {
  error: ResponseText;
  activeError: number;
  onShowErrorDetail: (id: number) => void;
}

const LineError = ({ error, activeError, onShowErrorDetail }: Props) => {
  const handleShowDetail = () => {
    onShowErrorDetail(error.id);
  };

  return (
    <p
      className={`inline relative border-b-2 border-red-500 text-transparent whitespace-break-spaces ${
        activeError === error.id ? 'bg-red-200 z-20' : 'bg-transparent z-50'
      } ${isEmpty(error.text) && error.text.length === 1 ? 'w-1' : ''}`}
      onClick={handleShowDetail}
      data-mark-id={error.id}
    >
      {isEmpty(error.text) ? renderEmptyText(error.text) : error.text}

      {/* <div className='absolute hidden top-full left-0 px-4 py-3 shadow-lg rounded-lg transition-all group-hover:inline-block lg:group-hover:hidden'>
        <p className='text-[11px]'>{error.kind_of_error.join(', ')}</p>
        <p className='text-[13px]'>
          <span className='text-red-600'>{error.text}</span>
          <span className='text-blue-600'>{error.revised_sentence}</span>
        </p>
        <div className='flex gap-1'>
          <button
            className='block bg-blue-600 text-white text-xs px-2 py-1.5 rounded-md mt-2 mb-1 transition-all'
            // onClick={handleFixError(error)}
          >
            Accept
          </button>
          <button
            className='block text-gray-500 text-xs px-2 py-1.5 rounded-md mt-2 mb-1 transition-all hover:bg-gray-200'
            // onClick={handleFixError(error)}
          >
            Dismiss
          </button>
        </div>
      </div> */}
    </p>
  );
};

export default LineError;
