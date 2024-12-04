import { inject } from '@angular/core';
import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { environment } from '../../../environments/environments';
import { GlobalSpinnerStore } from '../../../assets/shared/ui/global-sniper/global-sniper.store';
import { ApiResponse } from '../api-respone.model';

export const SHOW_LOADING = new HttpContextToken<boolean>(() => true);
export const SHOW_API_MESSAGE = new HttpContextToken<boolean>(() => true);
export const SHOW_API_ERROR_MESSAGE = new HttpContextToken<boolean>(() => true);

export const apiCallInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const notification = inject(NzNotificationService);
  const globalSpinStore = inject(GlobalSpinnerStore);

  const showLoading = req.context.get(SHOW_LOADING);
  const showApiMessage = req.context.get(SHOW_API_MESSAGE);
  const showApiErrorMessage = req.context.get(SHOW_API_ERROR_MESSAGE);

  req = req.clone({
    url: !req.url.includes('http') ? environment.API_DOMAIN + req.url : req.url,
  });

  runIf(showLoading, () => globalSpinStore.start());

  return next(req).pipe(
    tap({
      next: response => {
        if (response.type === HttpEventType.Response) {
          const resp = response.body as ApiResponse<unknown>;
          if (resp && !resp.status && resp.errorMessage && showApiErrorMessage) {
            notification.error('', resp.errorMessage);
          } else if (response.body instanceof Blob) {
            const body = response.body as Blob;
            body.text().then(value => {
              if (value.includes('errorMessage')) {
                const result: ApiResponse<unknown> = JSON.parse(value);
                if (!result.status) {
                  notification.error('', result.errorMessage);
                }
              }
            });
          }
        }
      },
      finalize: () => runIf(showLoading, () => globalSpinStore.stop()),
    }),
    catchError((error: HttpErrorResponse, _: Observable<HttpEvent<unknown>>) => {
      notification.error('Error', error.error);
      return throwError(() => error.error);
    })
  );
};

function runIf(isShowMessage: boolean, func: () => void) {
  if (isShowMessage) {
    func();
  }
}

function checkApiType(httpResponse: HttpResponse<unknown>): 'default' | 'sandbox' {
  return Object.hasOwn(httpResponse.body as object, 'res') ? 'sandbox' : 'default';
}
