import React from 'react';
import { DataSourceApi, DataSourcePlugin, DataQuery, DataQueryRequest, DataQueryResponse } from '@grafana/data';
import { FeatureInfoBox } from '@grafana/ui';

type NoCodeQuery = DataQuery & {};
type NoCodeJsonOptions = {};

const QueryEditor = () => {
  return (
    <>
      <FeatureInfoBox title="Query Editor">Query editor goes here</FeatureInfoBox>
    </>
  );
};

const ConfigEditor = () => {
  return (
    <>
      <FeatureInfoBox title="Config Editor">Config editor goes here</FeatureInfoBox>
    </>
  );
};

class DataSource extends DataSourceApi<NoCodeQuery, NoCodeJsonOptions> {
  constructor(instanceSettings: any) {
    super(instanceSettings);
  }
  testDatasource() {
    return new Promise((resolve) => {
      resolve({
        status: 'success',
        message: 'Plugin working',
      });
    });
  }
  query(options: DataQueryRequest<NoCodeQuery>): Promise<DataQueryResponse> {
    return new Promise((resolve) => {
      resolve({ data: [] });
    });
  }
}

export const plugin = new DataSourcePlugin<DataSource, any, any>(DataSource)
  .setQueryEditor(QueryEditor)
  .setConfigEditor(ConfigEditor);
