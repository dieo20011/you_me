import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-view.component.html',
})
export class ImageViewComponent {
 @Input() imgSrc: string | null = null; 
  @Input() isVisible = false;

  close() {
    this.isVisible = false;
  }
}
