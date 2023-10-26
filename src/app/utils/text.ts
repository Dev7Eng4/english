export const isEmpty = (text: string) => text.trim() === '';

const getWidthOfEmpty = (text: string) => {
  console.log('text', text.length);
  const numberOfSpace = text.split('');

  console.log('length', numberOfSpace);

  return numberOfSpace.length * 4;
};

export const getStyleOfEmptyText = (text: string) => {
  return isEmpty(text)
    ? {
        width: `${getWidthOfEmpty(text)}px`,
      }
    : {};
};

export const renderEmptyText = (text: string) => {
  let newText = '';

  for (let i = 0; i < text.length; i++) {
    newText += '.';
  }

  return newText;
};

export const convertEmptyText = (text: string) => {
  let result = '';

  for (let i = 0; i < text.length; i++) {
    result += i % 2 === 0 ? ' ' : '.';
  }

  console.log('result', result);

  return result;
};
