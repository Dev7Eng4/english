export const mockInput =
  "Underlines that are blue indicate that Grammarly has spotted an unnecessarily wordy sentence. You'll find suggestions that can possibly help you revise a wordy sentence in an effortless manner.";

export const mock = [
  {
    id: 1,
    input: 'Underlines that are blue',
    output: 'Blue underlines',
    reason: 4,
  },
  {
    id: 2,
    input:
      " indicate that Grammarly has spotted an unnecessarily wordy sentence. You'll find suggestions that can ",
  },
  {
    id: 3,
    input: 'possibly',
    output: '',
    reason: 2,
  },
  {
    id: 4,
    input: ' help you ',
  },
  {
    id: 5,
    input: 'revise a wordy sentence in an effortless manner',
    output: 'effortlessly revise a wordy sentence',
    reason: 1,
  },
];

export const mock3 = [
  {
    id: 1,
    output: 'Blue underlines',
    reason: 4,
  },
  {
    id: 7,
    input: 'Underlines that',
    parent: 1,
  },
  {
    id: 8,
    input: ' xin ',
    output: 'in',
    reason: 3,
    parent: 1,
  },
  {
    id: 9,
    input: 'are blue',
    parent: 1,
  },
  {
    id: 2,
    input:
      " indicate that Grammarly has spotted an unnecessarily wordy sentence. You'll find suggestions that can ",
  },
];

export const mock2 = [
  {
    id: 1,
    output: 'Blue underlines',
    reason: 4,
    subErrors: [
      {
        id: 7,
        input: 'Underlines that',
      },
      {
        id: 8,
        input: ' xin ',
        output: 'in',
        reason: 3,
      },
      {
        id: 9,
        input: 'are blue',
      },
    ],
  },
  {
    id: 2,
    input:
      " indicate that Grammarly has spotted an unnecessarily wordy sentence. You'll find suggestions that can ",
  },
  {
    id: 3,
    input: 'possibly',
    output: '',
    reason: 2,
  },
  {
    id: 4,
    input: ' help you ',
  },
  {
    id: 5,
    input: 'revise a wordy sentence in an effortless manner',
    output: 'effortlessly revise a wordy sentence',
    reason: 1,
  },
];

export const errorTypes = [
  {
    label: 'Change the wording',
    value: 1,
    color: '#893535',
  },
  {
    label: 'Remove redundancy',
    value: 2,
    color: '#68992f',
  },
  {
    label: 'Collect spelling',
    value: 3,
    color: '#2f7e99',
  },
  {
    label: 'Remove wordiness',
    value: 4,
    color: '#992f74',
  },
];
