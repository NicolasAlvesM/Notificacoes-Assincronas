import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqService } from './rabbitmq.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateRabbitmqDto } from './dto/create-rabbitmq.dto';
import { randomUUID } from 'crypto';

const subscribeMock = jest.fn();

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

  describe('create', () => {
    it('deve chamar client.emit com o padrão e payload corretos e retornar sucesso', () => {
      const createRabbitmqDto: CreateRabbitmqDto = {
        mensagemId: randomUUID(),
        conteudoMensagem: 'Esta é uma mensagem de teste.',
        status: 'PENDING',
      };
      const expectedPattern = 'fila.notificacao.entrada.nicolas';

      const result = service.create(createRabbitmqDto);

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
        status: 'PENDING',
      };

      expect(() => service.create(dto)).toThrow(errorMessage);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Erro ao publicar mensagem:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
