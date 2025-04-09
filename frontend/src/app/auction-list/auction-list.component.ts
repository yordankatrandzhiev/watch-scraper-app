import { Component } from '@angular/core';
import { ScrapingServiceService } from 'src/scraping-service/scraping-service.service';

@Component({
  selector: 'app-auction-list',
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.scss'],
})
export class AuctionListComponent {
  constructor(private watchService: ScrapingServiceService) {}
  watches: any;
  isLoading: boolean = true;
  ngOnInit(): void {
    this.watchService.getWatches().subscribe({
      next: (res) => {
        this.watches = res;
        this.isLoading = false;
        console.log(res);
      },
      error: (err) => {
        console.error('Error fetching watches:', err);
        this.isLoading = false;
      },
    });
  }
}
