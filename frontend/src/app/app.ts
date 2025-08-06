import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacaoComponent } from './notificacao/notificacao';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NotificacaoComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('meu-app-notificacoes');
}