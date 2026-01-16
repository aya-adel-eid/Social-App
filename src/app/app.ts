import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbiteServices/flowbite.service';
import { initFlowbite } from 'flowbite';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { MatSlideToggleModule, MatSlideToggle } from '@angular/material/slide-toggle';
import { FooterComponent } from './core/components/footer/footer.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent, MatSlideToggle, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('social-media-app');

  private readonly flowbiteService = inject(FlowbiteService);
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
}
