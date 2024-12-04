import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';


export interface ConfirmDialogData {
  title: string;
  content: string;
  lists: string[];
}

@Component({
  selector: 'app-confirm-popup',
  standalone: true,
  imports: [
    CommonModule,
    NzInputModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzModalModule,
    NzFormModule,
  ],
  templateUrl: './confirm-popup.component.html',
  styleUrl: './confirm-popup.component.scss',
})
export class ConfirmPopupComponent {
  @Output() clickSubmit = new EventEmitter<void>();
  @Output() clickCancel = new EventEmitter<void>();
  constructor(
    private readonly _nzModalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: ConfirmDialogData
  ) {}
  onSubmit() {
    this.clickSubmit.emit();
  }
  onDestroyModal() {
    this.clickCancel.emit();
    this._nzModalRef.destroy();
  }
}
