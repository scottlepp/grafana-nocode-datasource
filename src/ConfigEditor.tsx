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
    ],
  },
};

export type ConfigEditorProps = DataSourcePluginOptionsEditorProps<NoCodeJsonOptions>;

export const ConfigEditor = (props: ConfigEditorProps) => {
  return <NoCodeConfigComponent {...props} editorProps={EditorProps.ConfigEditor} />;
};
