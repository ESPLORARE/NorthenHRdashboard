declare module "sql.js" {
  export interface QueryExecResult {
    columns: string[];
    values: any[][];
  }

  export interface SqlJsDatabase {
    exec(sql: string): QueryExecResult[];
    close(): void;
  }

  export interface SqlJsStatic {
    Database: new (data?: Uint8Array) => SqlJsDatabase;
  }

  export interface InitSqlJsConfig {
    locateFile?: (file: string, prefix?: string) => string;
  }

  const initSqlJs: (config?: InitSqlJsConfig) => Promise<SqlJsStatic>;
  export default initSqlJs;
}
