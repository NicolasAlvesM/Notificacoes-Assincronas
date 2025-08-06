import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRabbitmqDto {
  @IsUUID()
  @IsNotEmpty({ message: 'A mensagemId não pode ser vazia.' })
  mensagemId: string;

  @IsString()
  @IsNotEmpty({ message: 'O conteudoMensagem não pode ser vazio.' })
  conteudoMensagem: string;

  @IsString()
  status: string;
}
