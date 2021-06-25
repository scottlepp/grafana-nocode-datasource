import { DataSourceInstanceSettings, DataSourceApi, DataQueryRequest, DataQueryResponse } from '@grafana/data';
import { NoCodeQuery, NoCodeJsonOptions } from './types';

export class DataSource extends DataSourceApi<NoCodeQuery, NoCodeJsonOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<NoCodeJsonOptions>) {
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
