export interface Request {
  id: number;
  name: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface CreateRequestPayload {
  name: string;
  title: string;
  description: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiError {
  errorCode: string;
  message: string;
  fieldErrors?: FieldError[];
}

export type AcknowledgmentState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };
