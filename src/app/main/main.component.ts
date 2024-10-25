import { Component, signal } from '@angular/core';
import { galleries, musicList } from '../../assets/shared/data';
import { CommonModule } from '@angular/common';
import { ImageViewComponent } from '../../assets/shared/ui/image-view.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, ImageViewComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  selectedImage: string | null = null;
  data = signal(galleries);
  clicked = false;
  openImage(imgSrc: string) {
    console.log(imgSrc)
    if (!this.clicked) {
      this.selectedImage = imgSrc;
      this.clicked = true;
    }
  }

  closeImage() {
    this.selectedImage = null;
    this.clicked = false;
  }
}
