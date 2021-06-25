import React from 'react';
import { get, set, cloneDeep, uniq } from 'lodash';
import { DataSourcePluginOptionsEditorProps, SelectableValue } from '@grafana/data';
import { DataSourceHttpSettings, InlineFormLabel, Input, Button, Select, Switch, useTheme } from '@grafana/ui';

type NoCodeJsonOptions = {};

type propType = 'string' | 'number' | 'boolean' | 'secureString';
type EditorProperty = {
  key: string;
  type: propType;
  options?: Array<SelectableValue<string | number>>;
  label?: string;
  tooltip?: string;
  placeholder?: string;
  group?: string;
};
export type GrafanaDatasourceConfigProps = {
  DefaultHTTPSettings?: {
    EnableEditor: boolean;
    DefaultURL: string;
  };
  Properties?: EditorProperty[];
};

const GroupWrapper: React.FC<{ name?: string }> = ({ name, children }) => {
  return (
    <>
      {name && <h4>{name}</h4>}
      {children}
    </>
  );
};

export type NoCodeConfigComponentProps = DataSourcePluginOptionsEditorProps<NoCodeJsonOptions> & {
  editorProps: GrafanaDatasourceConfigProps;
};

export const NoCodeConfigComponent = (props: NoCodeConfigComponentProps) => {
  const theme = useTheme();
  const { options, onOptionsChange, editorProps } = props;
  const groups: Array<{ name?: string; props: EditorProperty[] }> = [
    { name: '', props: editorProps.Properties?.filter((p) => !p.group) || [] },
  ];
  uniq(editorProps.Properties?.map((p) => p.group))
    .filter(Boolean)
    .forEach((g) => {
      groups.push({ name: g, props: editorProps.Properties?.filter((p) => p.group === g) || [] });
    });
  const getValueFromOptions = (key: string) => {
    return get(options, `jsonData.${key}`);
  };
  const onJSONOptionsChange = (key: string, value: any, type: propType) => {
    const newOptions = cloneDeep(options);
    set(newOptions, `jsonData.${key}`, type === 'number' ? +value : value);
    onOptionsChange(newOptions);
  };
  const getSecureValueFromOptions = (key: string): string => {
    return get(options, `secureJsonData.${key}`) || '';
  };
  const isSecureFieldConfigured = (key: string) => {
    return get(options, `secureJsonFields.${key}`) && !get(options, `secureJsonData.${key}`);
  };
  const resetSecureKey = (key: string) => {
    const newOptions = cloneDeep(options);
    set(newOptions, `secureJsonFields.${key}`, false);
    set(newOptions, `secureJsonData.${key}`, '');
    onOptionsChange(newOptions);
  };
  const onSecureJSONOptionsChange = (key: string, value: string) => {
    const newOptions = cloneDeep(options);
    set(newOptions, `secureJsonFields.${key}`, true);
    set(newOptions, `secureJsonData.${key}`, value);
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
      {groups.map((g) => {
        return (
          <GroupWrapper name={g.name} key={g.name}>
            {g.props.map((prop: any) => {
              return (
                <div className="gf-form" key={JSON.stringify(prop)}>
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
                          value={getValueFromOptions(prop.key) || (prop.type === 'number' ? '0' : '')}
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
                  {prop.type === 'secureString' && (
                    <>
                      {isSecureFieldConfigured(prop.key) ? (
                        <>
                          <input type="text" className="gf-form-input width-15" disabled={true} value="configured" />
                          <Button onClick={() => resetSecureKey(prop.key)} variant="secondary">
                            Reset
                          </Button>
                        </>
                      ) : (
                        <>
                          <Input
                            css={{}}
                            className="width-20"
                            type="password"
                            placeholder={prop.placeholder}
                            value={getSecureValueFromOptions(prop.key) || ''}
                            onChange={(e) => onSecureJSONOptionsChange(prop.key, e.currentTarget.value)}
                          />
                        </>
                      )}
                    </>
                  )}
                  <br />
                </div>
              );
            })}
            <br />
            <br />
          </GroupWrapper>
        );
      })}
    </>
  );
};
