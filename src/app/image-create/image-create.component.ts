import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { MainApiService } from '../main/main.service';

@Component({
  selector: 'app-image-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NzFormModule, NzDatePickerModule, NzInputModule, NzUploadModule, NzModalModule, NzButtonModule],
  templateUrl: './image-create.component.html',
  styleUrl: './image-create.component.scss'
})
export class ImageCreateComponent implements OnInit {
  imageForm!: FormGroup;
  fileList: NzUploadFile[] = [];
  selectedFiles: FileList | null = null;

  constructor(private readonly _fb: FormBuilder, private readonly _nzModalRef: NzModalRef, private readonly _mainSvc: MainApiService) {}

  ngOnInit(): void {
    this.imageForm = this._fb.group({
      date: [null, [Validators.required]],
      desc: ['', [Validators.required]],
      images: [this.fileList]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = input.files;
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('date', this.imageForm.get('date')?.value);
    formData.append('desc', this.imageForm.get('desc')?.value);
    if (this.selectedFiles) {
      const filesArray = Array.from(this.selectedFiles);
      for (const file of filesArray) {
        formData.append('files', file, file.name);
      }
    }
    this._mainSvc.newRequest(formData).subscribe({
      next: (resp: any) => {
        if (!resp.status) {
          return;
        }
        const reload = true;
        this._nzModalRef.close(reload);
      },
      complete: () => {},
    })
  }

  onDestroyModal() {
    this._nzModalRef.destroy();
  }
}
