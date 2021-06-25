import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './Datasource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { NoCodeQuery, NoCodeJsonOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, NoCodeQuery, NoCodeJsonOptions>(DataSource)
  .setQueryEditor(QueryEditor)
  .setConfigEditor(ConfigEditor);
