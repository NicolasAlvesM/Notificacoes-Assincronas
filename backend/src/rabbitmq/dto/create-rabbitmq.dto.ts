import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRabbitmqDto {
  @IsUUID()
  @IsNotEmpty({ message: 'O id não pode ser vazio.' })
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'O conteudoMensagem não pode ser vazio.' })
  conteudoMensagem: string;

  @IsString()
  status: string;
}
