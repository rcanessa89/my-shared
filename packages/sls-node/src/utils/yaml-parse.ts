import yaml from 'yaml';

export const yamlParse = (content: string) =>
  yaml.parse(content, {
    customTags: (tags) =>
      tags.concat([
        {
          tag: '!Ref',
          test: /^.*$/,
          resolve: (str: string) => str
        }
      ])
  });
