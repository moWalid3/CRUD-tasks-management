import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

export interface ILanguageOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, TranslateModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  selectedLang = signal<'en' | 'ar'>('en');
  currentLang = signal<'en' | 'ar'>('en');

  onLogout() {
    localStorage.removeItem('authId');
    this.authService.authId.set(undefined);
  }

  private readonly availableLanguages = ['en', 'ar'];
  private readonly translateService = inject(TranslateService);
  languageOptions: ILanguageOption[] = [];

  ngOnInit(): void {
    this.translateService.addLangs(this.availableLanguages);
    this.buildLanguageOptions();
  }

  private buildLanguageOptions() {
    const ENGLISH =  this.translateService.get('ENGLISH');
    const ARABIC = this.translateService.get('ARABIC');

    forkJoin([ENGLISH, ARABIC]).subscribe(_response => {
      this.languageOptions = [{
        value: this.availableLanguages[0],
        label: _response[0].toUpperCase(),
      }, {
        value: this.availableLanguages[1],
        label: _response[1].toUpperCase(),
      }];
    });
  }
  
  onSelect(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.translateService.use(selectedValue);
    this.currentLang.set(selectedValue as 'ar' | 'en');
  }
}
