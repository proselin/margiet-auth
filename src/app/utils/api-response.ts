import { ResponseModel } from '../common/models/response.model';

export class ApiResponse {
  public static Response(data: unknown) {
    return new ResponseModel(data);
  }
}
