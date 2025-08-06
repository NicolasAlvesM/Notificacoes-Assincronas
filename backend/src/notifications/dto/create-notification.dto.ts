import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  @IsNotEmpty({ message: 'O id não pode ser vazio.' })
  mensagemId: string;

  @IsString()
  @IsNotEmpty({ message: 'O conteudoMensagem não pode ser vazio.' })
  conteudoMensagem: string;
}
