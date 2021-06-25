import React from 'react';
import { get, set, cloneDeep, uniq } from 'lodash';
import { DataSourcePluginOptionsEditorProps, SelectableValue } from '@grafana/data';
import {
  DataSourceHttpSettings,
  InlineFormLabel,
  Input,
  TextArea,
  Button,
  Select,
  Switch,
  useTheme,
} from '@grafana/ui';

type NoCodeJsonOptions = {};

type propType = 'string' | 'number' | 'boolean' | 'secureString';
type EditorProperty = {
  key: string;
  type: propType;
  label?: string;
  tooltip?: string;
  placeholder?: string;
  outsideJSON?: boolean;
  options?: Array<SelectableValue<string | number>>;
  multiLine?: boolean;
  group?: string;
};
export type GrafanaDatasourceConfigProps = {
  defaultHTTPSettings?: {
    enableEditor: boolean;
    defaultURL: string;
  };
  properties?: EditorProperty[];
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
    { name: '', props: editorProps.properties?.filter((p) => !p.group) || [] },
  ];
  const PREFIX_JSON_DATA = 'jsonData';
  const PREFIX_SECURE_JSON_DATA = 'secureJsonData';
  const PREFIX_SECURE_JSON_FIELDS = 'secureJsonFields';
  uniq(editorProps.properties?.map((p) => p.group))
    .filter(Boolean)
    .forEach((g) => {
      groups.push({ name: g, props: editorProps.properties?.filter((p) => p.group === g) || [] });
    });
  const getValueFromOptions = (key: string, outsideJSON?: boolean) => {
    return get(options, `${outsideJSON ? '' : PREFIX_JSON_DATA + '.'}${key}`);
  };
  const onJSONOptionsChange = (key: string, value: any, type: propType, outsideJSON?: boolean) => {
    const newOptions = cloneDeep(options);
    set(newOptions, `${outsideJSON ? '' : PREFIX_JSON_DATA + '.'}${key}`, type === 'number' ? +value : value);
    onOptionsChange(newOptions);
  };
  const getSecureValueFromOptions = (key: string): string => {
    return get(options, `${PREFIX_SECURE_JSON_DATA}.${key}`) || '';
  };
  const isSecureFieldConfigured = (key: string) => {
    return get(options, `${PREFIX_SECURE_JSON_FIELDS}.${key}`) && !get(options, `${PREFIX_SECURE_JSON_DATA}.${key}`);
  };
  const resetSecureKey = (key: string) => {
    const newOptions = cloneDeep(options);
    set(newOptions, `${PREFIX_SECURE_JSON_FIELDS}.${key}`, false);
    set(newOptions, `${PREFIX_SECURE_JSON_DATA}.${key}`, '');
    onOptionsChange(newOptions);
  };
  const onSecureJSONOptionsChange = (key: string, value: string) => {
    const newOptions = cloneDeep(options);
    set(newOptions, `${PREFIX_SECURE_JSON_FIELDS}.${key}`, true);
    set(newOptions, `${PREFIX_SECURE_JSON_DATA}.${key}`, value);
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
      {editorProps.defaultHTTPSettings?.enableEditor && (
        <DataSourceHttpSettings
          onChange={onOptionsChange}
          dataSourceConfig={options}
          defaultUrl={editorProps.defaultHTTPSettings.defaultURL}
        />
      )}
      {groups.map((g) => {
        return (
          <GroupWrapper name={g.name} key={g.name}>
            {g.props.map((prop: EditorProperty) => {
              return (
                <div className="gf-form" key={JSON.stringify(prop)}>
                  <InlineFormLabel className="width-13" tooltip={prop.tooltip}>
                    {prop.label || prop.key}
                  </InlineFormLabel>
                  {['string', 'number'].includes(prop.type) && (
                    <>
                      {prop.options && prop.options.length > 0 ? (
                        <Select
                          className="width-20"
                          onChange={(e) => onJSONOptionsChange(prop.key, e.value, prop.type, prop.outsideJSON)}
                          value={getValueFromOptions(prop.key, prop.outsideJSON)}
                          options={prop.options}
                        />
                      ) : prop.multiLine ? (
                        <TextArea
                          css={{}}
                          className="width-20"
                          placeholder={prop.placeholder}
                          value={getValueFromOptions(prop.key, prop.outsideJSON) || (prop.type === 'number' ? '0' : '')}
                          onChange={(e) =>
                            onJSONOptionsChange(prop.key, e.currentTarget.value, prop.type, prop.outsideJSON)
                          }
                          rows={4}
                        />
                      ) : (
                        <Input
                          css={{}}
                          className="width-20"
                          type={prop.type === 'number' ? 'number' : 'text'}
                          placeholder={prop.placeholder}
                          value={getValueFromOptions(prop.key, prop.outsideJSON) || (prop.type === 'number' ? '0' : '')}
                          onChange={(e) =>
                            onJSONOptionsChange(prop.key, e.currentTarget.value, prop.type, prop.outsideJSON)
                          }
                        />
                      )}
                    </>
                  )}
                  {prop.type === 'boolean' && (
                    <div style={switchContainerStyle}>
                      <Switch
                        css={{}}
                        value={getValueFromOptions(prop.key, prop.outsideJSON)}
                        onChange={(e) =>
                          onJSONOptionsChange(prop.key, e.currentTarget.checked, prop.type, prop.outsideJSON)
                        }
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
                          {prop.multiLine ? (
                            <TextArea
                              css={{}}
                              className="min-width-20"
                              type="password"
                              placeholder={prop.placeholder}
                              value={getSecureValueFromOptions(prop.key) || ''}
                              onChange={(e) => onSecureJSONOptionsChange(prop.key, e.currentTarget.value)}
                              rows={4}
                            />
                          ) : (
                            <Input
                              css={{}}
                              className="width-20"
                              type="password"
                              placeholder={prop.placeholder}
                              value={getSecureValueFromOptions(prop.key) || ''}
                              onChange={(e) => onSecureJSONOptionsChange(prop.key, e.currentTarget.value)}
                            />
                          )}
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
