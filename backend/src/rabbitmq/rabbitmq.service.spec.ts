import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqService } from './rabbitmq.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateRabbitmqDto } from './dto/create-rabbitmq.dto';
import { randomUUID } from 'crypto';

const subscribeMock = jest.fn();

process.env.FILA_ENTRADA = 'fila.notificacao.entrada.nicolas';
process.env.FILA_STATUS = 'fila.notificacao.status.nicolas';

const mockClientProxy = {
  emit: jest.fn(() => ({
    subscribe: subscribeMock,
  })),
};

describe('RabbitmqService', () => {
  let service: RabbitmqService;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitmqService,
        {
          provide: 'NOTIFICATION_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<RabbitmqService>(RabbitmqService);
    client = module.get<ClientProxy>('NOTIFICATION_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create e notification', () => {
    it('deve chamar client.emit com o padrão e payload corretos e retornar sucesso', () => {
      const createRabbitmqDto: CreateRabbitmqDto = {
        mensagemId: randomUUID(),
        conteudoMensagem: 'Esta é uma mensagem de teste.',
        status: 'PROCESSANDO',
      };
      const expectedPattern = process.env.FILA_ENTRADA;

      const result = service.create(createRabbitmqDto);

      expect(result).toBe('Mensagem publicada com sucesso');
      expect(client.emit).toHaveBeenCalledTimes(1);
      expect(client.emit).toHaveBeenCalledWith(
        expectedPattern,
        createRabbitmqDto,
      );
      expect(subscribeMock).toHaveBeenCalledTimes(1);
    });

    it('deve chamar client.emit com o padrão e payload corretos para notificação', () => {
      const createRabbitmqDto: CreateRabbitmqDto = {
        mensagemId: randomUUID(),
        conteudoMensagem: 'Esta é uma mensagem de teste.',
        status: 'PROCESSADO_SUCESSO',
      };

      const expectedPattern = process.env.FILA_STATUS;

      const result = service.notification(createRabbitmqDto);

      expect(result).toBe('Mensagem publicada com sucesso');
      expect(client.emit).toHaveBeenCalledTimes(1);
      expect(client.emit).toHaveBeenCalledWith(
        expectedPattern,
        createRabbitmqDto,
      );
      expect(subscribeMock).toHaveBeenCalledTimes(1);
    });

    it('deve logar e lançar um erro se a publicação falhar', () => {
      const errorMessage = 'Falha na publicação';
      mockClientProxy.emit.mockImplementation(() => {
        throw new Error(errorMessage);
      });
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const dto: CreateRabbitmqDto = {
        mensagemId: randomUUID(),
        conteudoMensagem: 'Mensagem que vai falhar.',
        status: 'PROCESSANDO',
      };

      expect(() => service.create(dto)).toThrow(errorMessage);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Erro ao publicar mensagem:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });

    it('deve lançar um erro se a publicação de notificação falhar', () => {
      const errorMessage = 'Notification publication FALHA_PROCESSAMENTO';
      mockClientProxy.emit.mockImplementation(() => {
        throw new Error(errorMessage);
      });
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const dto: CreateRabbitmqDto = {
        mensagemId: randomUUID(),
        conteudoMensagem: 'A messagem vai falhar.',
        status: 'FALHA_PROCESSAMENTO',
      };

      expect(() => service.notification(dto)).toThrow(errorMessage);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Erro ao publicar mensagem:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
