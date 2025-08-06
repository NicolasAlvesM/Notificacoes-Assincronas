import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty({ message: 'O conteudoMensagem não pode ser vazio.' })
  conteudoMensagem: string;
}
