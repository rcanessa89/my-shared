import { prompt } from 'enquirer';

export const select = async (choices: string[], message = 'Select:') => {
  const response: { data: string } = await prompt({
    type: 'select',
    name: 'data',
    message,
    choices
  });

  return response.data;
};
