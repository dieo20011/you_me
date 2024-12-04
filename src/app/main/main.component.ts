import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { galleries } from '../../assets/shared/data';
import { CommonModule } from '@angular/common';
import { MainApiService } from './main.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { ImageCreateComponent } from '../image-create/image-create.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ImageModel } from '../image-create/image.interface';
import { ConfirmPopupComponent } from '../../assets/shared/ui/confirm-popup/confirm-popup.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ImageUpdateComponent } from '../image-update/image-update.component';
import { MainLayoutComponent } from "../main-layout/main-layout.component";
import { AuthService } from '../core/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, NzModalModule, NzIconModule, MainLayoutComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  videoList: string[] = [
    '../../assets/video/video.mp4',
    '../../assets/video/video2.mp4',
    '../../assets/video/video3.mp4',
  ];
  selectedImage: string | null = null;
  data = signal(galleries);
  dataSource = signal<ImageModel[]>([]);
  selectedVideo = signal('');

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  clicked = false;
  audioPlayed: boolean = false;
  constructor(
    private readonly _mainSvc: MainApiService,
    private readonly _authSvc: AuthService,
    private readonly router: Router,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _nzModalSvc: NzModalService,
    private readonly _notificaiton: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this._mainSvc
      .getImages()
      .subscribe({
        next: (resp) => {
          if(resp.status) {
            (this.dataSource.set(resp.data))
          }
        },
        complete: () => {
          this._cdr.detectChanges();
        }
      });
  }

  addNewImage() {
    const modalRef = this._nzModalSvc.create({
      nzContent: ImageCreateComponent,
      nzWidth: 700,
    });
    modalRef.afterClose.subscribe((reload: boolean) => {
      if (reload) {
        this._notificaiton.success('Add memories success', '');
        this.getData();
      }
    });
  }

  updateGroupImage(id: number) {
    const modalRef = this._nzModalSvc.create({
      nzContent: ImageUpdateComponent,
      nzWidth: 700,
      nzData: {id: id},
    });
    modalRef.afterClose.subscribe((reload: boolean) => {
      if (reload) {
        this._notificaiton.success('Add memories success', '');
        this.getData();
      }
    });
  }

  playAudio() {
    if (!this.audioPlayed) {
      const randomIndex = Math.floor(Math.random() * this.videoList.length);
      this.selectedVideo.set(this.videoList[randomIndex]);

      this.audioPlayer.nativeElement.play().catch((error) => {
        console.error('Audio playback failed:', error);
      });

      this.audioPlayed = true;
    }
  }

  closeImage() {
    this.selectedImage = null;
    this.clicked = false;
  }

  deleteGroup(id: number) {
    const modalRef = this._nzModalSvc.create({
      nzContent: ConfirmPopupComponent,
      nzWidth: 320,
      nzData: { title: `Are you sure want to delete?` },
      nzFooter: null,
    });
    modalRef.componentInstance!.clickSubmit.subscribe(() => {
      this._mainSvc.deleteGroupImage(id).subscribe((resp) => {
        if(resp.status) {
        this.getData();
        this._notificaiton.success('Delete success', '');
        }
        modalRef.destroy();
      });
    })
  }

  deleteImg(id: number) {
    const modalRef = this._nzModalSvc.create({
      nzContent: ConfirmPopupComponent,
      nzWidth: 320,
      nzData: { title: `Are you sure want to delete?` },
      nzFooter: null,
    });
    modalRef.componentInstance!.clickSubmit.subscribe(() => {
      this._mainSvc.deleteImage(id).subscribe((resp) => {
        if(resp.status) {
          this.getData();
          this._notificaiton.success('Delete success', '');
          }
          modalRef.destroy();
      });
    });
  }

  logout() {
    this._authSvc.logout();
    this.router.navigateByUrl('/login');
    this._notificaiton.success('Logout success', '');
  }
}
