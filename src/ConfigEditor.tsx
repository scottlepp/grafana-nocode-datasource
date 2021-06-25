import React from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { NoCodeConfigComponent, GrafanaDatasourceConfigProps } from './components/NoCodeConfig';
import { NoCodeJsonOptions } from './types';

const EditorProps: { ConfigEditor: GrafanaDatasourceConfigProps } = {
  ConfigEditor: {
    DefaultHTTPSettings: {
      EnableEditor: false,
      DefaultURL: 'http://nocode',
    },
    Properties: [
      {
        key: 'fooString',
        type: 'string',
        label: 'Foo',
        tooltip: 'Foo tooltip',
      },
      {
        key: 'barString',
        type: 'string',
        placeholder: 'Bar string value goes here',
      },
      {
        key: 'magicNumber',
        type: 'number',
        label: 'Magic Number',
        tooltip: 'Magic Number tooltip',
      },
      {
        key: 'isPremium',
        type: 'boolean',
        label: 'Enable premium?',
      },
      {
        key: 'concurrency',
        type: 'number',
        label: 'Concurrency',
        options: [
          { value: 1, label: 'Minimum' },
          { value: 2, label: 'Medium' },
          { value: 3, label: 'Maximum' },
        ],
      },
      {
        key: 'region',
        type: 'string',
        label: 'Region',
        tooltip: 'Region of the API',
        options: [
          {
            value: 'useast',
            label: 'US East',
          },
          {
            value: 'europe',
            label: 'Europe',
          },
        ],
      },
    ],
  },
};

export type ConfigEditorProps = DataSourcePluginOptionsEditorProps<NoCodeJsonOptions>;

export const ConfigEditor = (props: ConfigEditorProps) => {
  return <NoCodeConfigComponent {...props} editorProps={EditorProps.ConfigEditor} />;
};
