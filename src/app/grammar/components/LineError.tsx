import { isEmpty, renderEmptyText } from '@/app/utils/text';

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
      className={`inline relative border-b-2 border-red-500 text-transparent ${
        activeError === error.id ? 'bg-red-200 z-20' : 'bg-transparent z-50'
      } ${isEmpty(error.text) && error.text.length === 1 ? 'w-1' : ''}`}
      onClick={handleShowDetail}
      data-mark-id={error.id}
    >
      {isEmpty(error.text) ? renderEmptyText(error.text) : error.text}
    </p>
  );
};

export default LineError;
