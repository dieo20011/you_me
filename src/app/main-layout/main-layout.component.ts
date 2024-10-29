import { Component, OnInit, ElementRef, ViewChild, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  countdown = signal('');
  audioPlayed: boolean = false;

  private readonly targetDate: Date = new Date('2024-05-01T22:30:00');

  ngOnInit() {
    this.updateCountdown();
    setInterval(() => this.updateCountdown(), 1000);
  }

  ngAfterViewInit() {
    this.playAudio();
  }

  playAudio() {
    if (!this.audioPlayed) {
      this.audioPlayer.nativeElement.play().catch(error => {
        console.error('Audio playback failed:', error);
      });
      this.audioPlayed = true;
    }
  }

  private updateCountdown() {
    const now = new Date();
    const difference = now.getTime() - this.targetDate.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    this.countdown.set(`${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
