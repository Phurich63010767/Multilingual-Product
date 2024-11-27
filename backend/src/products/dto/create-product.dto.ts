import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TranslationDto {
  @IsString()
  language: string;

  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class CreateProductDto {
  @IsNumber()
  price: number;

  @IsString()
  category: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}
