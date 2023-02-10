import { z } from "zod";

export enum StatusCodes {
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
  MultipleChoices = 300,
  MovedPermanently = 301,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  Conflict = 409,
  Gone = 410,
  TooManyRequests = 429,
  ServerError = 500,
  NotImplemented = 501,
  ServiceUnavailable = 503
}

export class ExpressError extends Error {
  status: number;

  constructor(status: number, message?: string) {
      super(message);
      this.status = status;
  }
}

export class BadRequestError extends ExpressError {
  constructor(message?: string) {
      super(StatusCodes.BadRequest, message);
  }
}

export class UnauthorizedError extends ExpressError {
  constructor(message?: string) {
      super(StatusCodes.Unauthorized, message);
  }
}

export class ForbiddenError extends ExpressError {
  constructor(message?: string) {
      super(StatusCodes.Forbidden, message);
  }
}

export class NotFoundError extends ExpressError {
  constructor(message?: string) {
      super(StatusCodes.NotFound, message);
  }
}

export class MethodNotAllowedError extends ExpressError {
  constructor(message?: string) {
      super(StatusCodes.MethodNotAllowed, message);
  }
}

export class ConflictError extends ExpressError {
  constructor(message?: string) {
      super(StatusCodes.Conflict, message);
  }
}

export class GoneError extends ExpressError {
  constructor(message?: string) {
      super(StatusCodes.Gone, message);
  }
}

export class TooManyRequestsError extends ExpressError {
  constructor(message?: string) {
      super(StatusCodes.TooManyRequests, message);
  }
}

export class ServerError extends ExpressError {
  constructor(message?: string) {
      super(StatusCodes.ServerError, message);
  }
}

export class NotImplementedError extends ExpressError {
  constructor(message?: string) {
      super(StatusCodes.NotImplemented, message);
  }
}

export class ServiceUnavailableError extends ExpressError {
  constructor(message?: string) {
      super(StatusCodes.ServiceUnavailable, message);
  }
}

export interface ReturnType {
  status: StatusCodes,
  message?: string,
  cause?: string
}

export const otherErrors: { [key: string]: ReturnType } = {
  CastError: { status: StatusCodes.BadRequest, message: 'Invalid data' }
}

export default function parseExpressError(error: unknown): ReturnType {
  if (error instanceof ExpressError) {
      return {
          status: error.status,
          message: error.message
      }
  } else if (error instanceof z.ZodError) {
      return {
          status: StatusCodes.BadRequest,
          message: "Validation Error",
          cause: error.message
      }
  } else if (error instanceof Error) {
      if (error.name in otherErrors) {
          return otherErrors[error.name];
      } else {
          return {
              status: StatusCodes.ServerError,
              message: 'Server Error ' + error.message
          }
      }
  }
  return {
      status: StatusCodes.ServerError,
      message: 'Server Error'
  }
}
