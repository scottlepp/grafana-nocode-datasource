import React from 'react';
import { get, set, cloneDeep } from 'lodash';
import { DataSourcePluginOptionsEditorProps, SelectableValue } from '@grafana/data';
import { DataSourceHttpSettings, InlineFormLabel, Input, Select, Switch, useTheme } from '@grafana/ui';

type NoCodeJsonOptions = {};

type propType = 'string' | 'number' | 'boolean'; // | 'secureString';
export type GrafanaDatasourceConfigProps = {
  DefaultHTTPSettings?: {
    EnableEditor: boolean;
    DefaultURL: string;
  };
  Properties?: Array<{
    key: string;
    type: propType;
    options?: Array<SelectableValue<string | number>>;
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
  const theme = useTheme();
  const { options, onOptionsChange, editorProps } = props;
  const propsWithoutGroup = editorProps.Properties?.filter((p) => !p.group);
  const getValueFromOptions = (key: string) => {
    return get(options, `jsonData.${key}`);
  };
  const onJSONOptionsChange = (key: string, value: any, type: propType) => {
    const newOptions = cloneDeep(options);
    set(newOptions, `jsonData.${key}`, type === 'number' ? +value : value);
    onOptionsChange(newOptions);
  };
  const switchContainerStyle: React.CSSProperties = {
    padding: `0 ${theme.spacing.sm}`,
    height: `${theme.spacing.formInputHeight}px`,
    display: 'flex',
    alignItems: 'center',
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
            <div className="gf-form">
              <InlineFormLabel tooltip={prop.tooltip}>{prop.label || prop.key}</InlineFormLabel>
              {['string', 'number'].includes(prop.type) && (
                <>
                  {prop.options && prop.options.length > 0 ? (
                    <Select
                      className="width-20"
                      onChange={(e) => onJSONOptionsChange(prop.key, e.value, prop.type)}
                      value={getValueFromOptions(prop.key)}
                      options={prop.options}
                    />
                  ) : (
                    <Input
                      css={{}}
                      className="width-20"
                      placeholder={prop.placeholder}
                      value={getValueFromOptions(prop.key) || '0'}
                      onChange={(e) => onJSONOptionsChange(prop.key, e.currentTarget.value, prop.type)}
                    />
                  )}
                </>
              )}
              {prop.type === 'boolean' && (
                <div style={switchContainerStyle}>
                  <Switch
                    css={{}}
                    value={getValueFromOptions(prop.key)}
                    onChange={(e) => onJSONOptionsChange(prop.key, e.currentTarget.checked, prop.type)}
                  />
                </div>
              )}
            </div>
          </>
        );
      })}
    </>
  );
};
