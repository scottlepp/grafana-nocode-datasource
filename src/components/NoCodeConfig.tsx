import React from 'react';
import { get, set, cloneDeep } from 'lodash';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { DataSourceHttpSettings, InlineFormLabel, Input } from '@grafana/ui';

type NoCodeJsonOptions = {};

export type GrafanaDatasourceConfigProps = {
  DefaultHTTPSettings?: {
    EnableEditor: boolean;
    DefaultURL: string;
  };
  Properties?: Array<{
    key: string;
    type: 'string' | 'number'; // | 'boolean' | 'secureString';
    // secure?: boolean; // not sure if we want to go with this option or specify 'secureString' as type.
    label?: string;
    tooltip?: string;
    placeholder?: string;
    group?: string;
  }>;
};

export type NoCodeConfigComponentProps = DataSourcePluginOptionsEditorProps<NoCodeJsonOptions> & {
  editorProps: GrafanaDatasourceConfigProps;
};

export const NoCodeConfigComponent = (props: NoCodeConfigComponentProps) => {
  const { options, onOptionsChange, editorProps } = props;
  const propsWithoutGroup = editorProps.Properties?.filter((p) => !p.group);
  const getValueFromOptions = (key: string) => {
    return get(options, `jsonData.${key}`);
  };
  const onJSONOptionsChange = (key: string, value: string | number, type: 'string' | 'number') => {
    const newOptions = cloneDeep(options);
    set(newOptions, `jsonData.${key}`, type === 'string' ? value : +value);
    onOptionsChange(newOptions);
  };
  return (
    <>
      {editorProps.DefaultHTTPSettings?.EnableEditor && (
        <DataSourceHttpSettings
          onChange={onOptionsChange}
          dataSourceConfig={options}
          defaultUrl={editorProps.DefaultHTTPSettings.DefaultURL}
        />
      )}
      {propsWithoutGroup && propsWithoutGroup?.length > 0 && <h4>Additional settings</h4>}
      {propsWithoutGroup?.map((prop) => {
        return (
          <>
            {prop.type === 'string' && (
              <div className="gf-form">
                <InlineFormLabel tooltip={prop.tooltip}>{prop.label || prop.key}</InlineFormLabel>
                <Input
                  css={{}}
                  className="width-20"
                  placeholder={prop.placeholder}
                  value={getValueFromOptions(prop.key)}
                  onChange={(e) => onJSONOptionsChange(prop.key, e.currentTarget.value, 'string')}
                />
              </div>
            )}
            {prop.type === 'number' && (
              <div className="gf-form">
                <InlineFormLabel tooltip={prop.tooltip}>{prop.label || prop.key}</InlineFormLabel>
                <Input
                  css={{}}
                  type="number"
                  className="width-20"
                  placeholder={prop.placeholder}
                  value={getValueFromOptions(prop.key)}
                  onChange={(e) => onJSONOptionsChange(prop.key, e.currentTarget.value, 'number')}
                />
              </div>
            )}
          </>
        );
      })}
    </>
  );
};
