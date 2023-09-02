export interface JsonBrowse {
  data: {
    pageIndex: number;
    items: any;
  };
}

export interface JsonRead {
  data: {
    item: any;
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
