import React from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { Input } from '@grafana/ui';
import { NoCodeConfigComponent, GrafanaDatasourceConfigProps } from './components/NoCodeConfig';
import { NoCodeJsonOptions } from './types';

const properties: GrafanaDatasourceConfigProps = {
  general: {
    useCollapse: true,
  },
  defaultHTTPSettings: {
    enabled: false,
    defaultURL: 'http://nocode',
  },
  properties: [
    {
      key: 'fooString',
      type: 'string',
      label: 'Foo String',
      tooltip: 'Foo tooltip goes here',
      placeholder: 'Foo String',
    },
    {
      key: 'fooStringHelper',
      type: 'string',
      label: 'Foo String Helper',
      tooltip: 'will shown only if foo is one of one,three',
      placeholder: 'Foo helper',
      showIf: [{ key: 'fooString', operand: 'in', value: ['one', 'three'] }],
    },
    {
      key: 'barString',
      type: 'string',
      label: 'Bar String',
      tooltip: 'Bar tooltip goes here',
      placeholder: 'Bar string value goes here',
    },
    {
      key: 'barInput',
      type: 'component',
      label: 'Bar Input',
      tooltip: 'Bar tooltip',
      component: Input,
      class: 'width-20',
      secure: false,
    },
    {
      key: 'bazString',
      type: 'string',
      label: 'Bax',
      group: 'Group 1',
      placeholder: 'Baz string value goes here',
    },
    {
      key: 'apiKey',
      type: 'string',
      label: 'API Key',
      tooltip: 'Your secure API key',
      secure: true,
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
          value: 'us-east',
          label: 'US East',
        },
        {
          value: 'europe',
          label: 'Europe',
        },
        {
          value: 'row',
          label: 'Rest of the World',
        },
      ],
    },
    {
      key: 'europeDataCenter',
      type: 'string',
      label: 'Europe data center',
      tooltip: 'Europe data center',
      options: [
        {
          value: 'london',
          label: 'London',
        },
        {
          value: 'berlin',
          label: 'Berlin',
        },
      ],
      showIf: [
        {
          key: 'region',
          operand: '===',
          value: 'europe',
        },
      ],
    },
    {
      key: 'usDataCenter',
      type: 'string',
      label: 'US data center',
      tooltip: 'US data center',
      options: [
        {
          value: 'newYork',
          label: 'New York',
        },
        {
          value: 'sanJose',
          label: 'San Jose',
        },
      ],
      showIf: [
        {
          key: 'region',
          operand: '===',
          value: 'us-east',
        },
      ],
    },
    {
      key: 'magicNumber2',
      type: 'number',
      group: 'Group 2',
      label: 'Magic Number 2',
      tooltip: 'Magic Number tooltip will show only if fooString is not one of one, three',
      showIf: [{ key: 'fooString', operand: 'notin', value: ['one', 'three'] }],
    },
    {
      key: 'magicNumber3',
      type: 'number',
      group: 'Group 1',
      label: 'Magic Number',
      tooltip: 'Magic Number tooltip',
    },
    {
      key: 'url',
      type: 'string',
      group: 'Outsiders',
      label: 'URL',
      outsideJSON: true,
    },
    {
      key: 'tlsCACert',
      type: 'string',
      group: 'Outsiders',
      label: 'TLS CA Cert',
      multiLine: true,
      secure: true,
    },
    {
      key: 'basicAuth',
      type: 'boolean',
      group: 'Outsiders',
      label: 'Enable basic auth',
      outsideJSON: true,
    },
  ],
};

export type ConfigEditorProps = DataSourcePluginOptionsEditorProps<NoCodeJsonOptions>;

export const ConfigEditor = (props: ConfigEditorProps) => {
  return <NoCodeConfigComponent {...props} editorProps={properties} />;
};
