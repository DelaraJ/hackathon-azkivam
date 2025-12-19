import {Component, inject, OnInit, signal} from '@angular/core';
import {PostModel} from './models/instagram.model';
import {InstagramService} from './services/instagram.service';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-instagram',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './instagram.html',
  styleUrl: './instagram.scss',
})
export class Instagram implements OnInit {
  private instaApiService = inject(InstagramService)
  posts = signal<PostModel[]>([]);

  ngOnInit(): void {
    this.getData()
  }

  getData(): void {
    this.instaApiService.getData().subscribe({
      next: res => {
        this.posts.set(res.posts)
      },
      error: err => console.log(err)
    })
  }
}
