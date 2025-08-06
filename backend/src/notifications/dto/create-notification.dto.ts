import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  @IsNotEmpty({ message: 'A mensagemId não pode ser vazia.' })
  mensagemId: string;

  @IsString()
  @IsNotEmpty({ message: 'O conteudoMensagem não pode ser vazio.' })
  conteudoMensagem: string;
}
