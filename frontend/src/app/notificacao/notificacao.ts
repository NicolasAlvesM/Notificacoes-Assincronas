import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { v4 as uuidv4 } from 'uuid';

interface Notificacao {
  mensagemId: string;
  status: string;
  conteudoMensagem: string;
}

@Component({
  selector: 'app-notificacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notificacao.html',
  styleUrls: ['./notificacao.scss']
})
export class NotificacaoComponent implements OnInit {

  conteudoMensagem: string = '';
  notificacoes: Notificacao[] = [];

  constructor(private http: HttpClient, private socket: Socket) { }

  ngOnInit(): void {
    this.socket.on('statusUpdate', (data: { mensagemId: string, status: string }) => {
      const notificacaoIndex = this.notificacoes.findIndex(n => n.mensagemId === data.mensagemId);
      if (notificacaoIndex !== -1) {
        this.notificacoes[notificacaoIndex].status = data.status;
      }
    });
  }

  enviarNotificacao(): void {
    if (!this.conteudoMensagem.trim()) {
      return;
    }

    const mensagemId = uuidv4();
    
    this.notificacoes.push({
      mensagemId: mensagemId,
      status: 'AGUARDANDO PROCESSAMENTO',
      conteudoMensagem: this.conteudoMensagem
    });

    const payload = {
      mensagemId: mensagemId,
      conteudoMensagem: this.conteudoMensagem
    };

    this.http.post('http://localhost:3000/api/notificar', payload).subscribe({
      next: (response) => {
        this.socket.emit('subscribeToStatus', mensagemId);
      },
      error: (err) => {
        console.error('Erro ao enviar notificação:', err);
        const notificacaoIndex = this.notificacoes.findIndex(n => n.mensagemId === mensagemId);
        if (notificacaoIndex !== -1) {
          this.notificacoes[notificacaoIndex].status = 'ERRO AO ENVIAR';
        }
      }
    });

    this.conteudoMensagem = '';
  }
}