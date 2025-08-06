import { Injectable } from '@nestjs/common';

export type Status =
  | 'PROCESSANDO'
  | 'PROCESSADO_SUCESSO'
  | 'FALHA_PROCESSAMENTO';

@Injectable()
export class StatusService {
  private readonly statuses = new Map<string, Status>();

  setStatus(mensagemId: string, status: Status) {
    this.statuses.set(mensagemId, status);
  }

  getStatus(mensagemId: string): Status {
    return this.statuses.get(mensagemId) || 'PROCESSANDO';
  }
}
