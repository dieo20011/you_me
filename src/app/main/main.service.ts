import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../core/api-respone.model';
import { ImageModel } from '../image-create/image.interface';

@Injectable({
  providedIn: 'root',
})
export class MainApiService {
  private readonly _base = 'https://localhost:7220';
  constructor(private readonly _http: HttpClient) {}

  public getImages() {
    return this._http.get<ApiResponse<ImageModel[]>>(`${this._base}/api/image`);
  }

  public newRequest(data: FormData) {
    return this._http.post<ApiResponse<never>>(this._base + '/api/image', data);
  }

  public updateGroupImage(id: number, data: FormData) {
    return this._http.put<ApiResponse<never>>(this._base + '/api/image/' + id, data);
  }

  public getGroupImageDetail(id: number) {
    return this._http.get<ApiResponse<ImageModel>>(`${this._base}/api/image/${id}`);
  }

  public deleteGroupImage(id: number) {
    return this._http.delete<ApiResponse<never>>(this._base + '/api/image/group/' + id);
  }

  public deleteImage(id: number) {
    return this._http.delete<ApiResponse<never>>(this._base + '/api/image/' + id);
  }
}
