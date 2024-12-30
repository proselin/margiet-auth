import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

export class Exceptions {
  /**
   * Throw Duplicate Error
   *
   * Checks is an error is of the code 23505, PostgreSQL's duplicate value error,
   * and throws a conflict exception
   */
  public static async throwDuplicateError<T>(
    promise: Promise<T>,
    message?: string
  ) {
    try {
      return await promise;
    } catch (error) {
      Logger.error(error, Exceptions.name);
      if (error.code === '23505') {
        throw new ConflictException(message ?? 'Duplicated value in database');
      }

      throw new BadRequestException(error.message);
    }
  }

  /**
   * Throw Internal Error
   *
   * Function to abstract throwing internal server exception
   */
  public static async throwInternalError<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      Logger.error(error, Exceptions.name);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Throw Unauthorized
   *
   * Function to abstract throwing unauthorized exceptionm
   */
  public static async throwUnauthorizedError<T>(
    promise: Promise<T>
  ): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      Logger.error(error, Exceptions.name);
      throw new UnauthorizedException();
    }
  }
}
