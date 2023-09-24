import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_API_URI}`;

export const fetchCheckData = async (inputVal: string, signal: AbortSignal) => {
  const res = await axios.post<ResponseText[]>(
    apiUrl,
    {
      data: inputVal,
    },
    {
      signal,
    }
  );

  return res.data;
};
