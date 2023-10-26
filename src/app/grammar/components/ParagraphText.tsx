import { convertEmptyText, getStyleOfEmptyText, isEmpty } from '@/app/utils/text';
import LineError from './LineError';

interface Props {
  data: ResponseText[];
  activeError: number;
  onShowErrorDetail: (id: number) => void;
}

const ParagraphText = ({ data, activeError, onShowErrorDetail }: Props) => {
  return (
    <>
      {data.map((line: ResponseText, idx: number) => {
        if (line.status === 'false')
          return (
            <LineError
              key={line.id}
              activeError={activeError}
              error={line}
              onShowErrorDetail={onShowErrorDetail}
            />
          );

        if (line.text === '\n') return <br />;

        return (
          <p
            key={line.id}
            className={`inline bg-transparent text-transparent ${
              isEmpty(line.text) && line.text.length === 1 ? 'w-1' : ''
            }`}
            // style={getStyleOfEmptyText(line.text)}
          >
            {isEmpty(line.text) ? convertEmptyText(line.text) : line.text}
          </p>
        );
      })}
    </>
  );
};

export default ParagraphText;
