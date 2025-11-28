export type APIError = {
  response: {
    data: {
      message: string;
    };
  }
}

export type ValidationError = {
  errorFields: {
    name: (string | number)[];
    errors: string[];
  }[];
}