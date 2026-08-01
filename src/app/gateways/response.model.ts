export interface JsonBrowse<T = unknown> {
  data: {
    pageIndex: number;
    items: T[];
  };
}

export interface JsonRead<T = unknown> {
  data: {
    item: T;
  };
}

export interface JsonAdd {
  data: {
    id: number;
  };
}

export interface JsonDelete {
  data: {
    rowCount: number;
  };
}

export interface JsonUpdate {
  data: {
    rowCount: number;
  };
}
