import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { MainApiService } from '../main/main.service';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-image-update',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzTableModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzDatePickerModule,
    NzIconModule,
  ],
  templateUrl: './image-update.component.html',
  styleUrl: './image-update.component.scss',
})
export class ImageUpdateComponent implements OnInit {
  imageForm!: FormGroup;
  selectedFiles: FileList | null = null;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly _nzModalRef: NzModalRef,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _mainSvc: MainApiService,
    @Inject(NZ_MODAL_DATA)
    public data: {
      id: number;
    }
  ) {
    this.imageForm = this.formBuilder.group({
      date: ['', [Validators.required]],
      desc: ['', Validators.required],
      images: [],
    });
  }

  ngOnInit(): void {
    this._mainSvc.getGroupImageDetail(this.data.id).subscribe({
      next: (resp) => {
        if(resp.status) {
          this.imageForm.patchValue(resp.data);
          this.imageForm.get('images')?.patchValue(resp.data.imageDetails);
        }
      },
      complete: () => {
        this._cdr.detectChanges();
      }
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = input.files;
    }
  }

  removeImage(index: number): void {
    const images = this.imageForm.get('images')?.value;
    images.splice(index, 1);
    this.imageForm.get('images')?.patchValue(images);
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('date', this.imageForm.get('date')?.value);
    formData.append('desc', this.imageForm.get('desc')?.value);
  
    const imagesValue = this.imageForm.get('images')?.value;
    const imageIds = imagesValue.map((image: { id: number }) => image.id);
    formData.append('images', imageIds.join(','));

    
  
    if (this.selectedFiles) {
      const filesArray = Array.from(this.selectedFiles);
      for (const file of filesArray) {
        formData.append('files', file, file.name);
      }
    }
  
    this._mainSvc.updateGroupImage(this.data.id, formData).subscribe({
      next: (resp: any) => {
        if (!resp.status) {
          return;
        }
        const reload = true;
        this._nzModalRef.close(reload);
      },
      complete: () => {},
    });
  }
  

  onDestroyModal() {
    this._nzModalRef.destroy();
  }
}
