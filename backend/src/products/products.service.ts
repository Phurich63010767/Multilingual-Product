import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(productDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(productDto);
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['translations'] });
  }

  async searchByName(query: string, language?: string) {
    const qb = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.translations', 'translation')
      .where('translation.name ILIKE :query', { query: `%${query}%` }); 
  
    if (language) {
      qb.andWhere('translation.language = :language', { language }); 
    }
  
    return qb.getMany();
  }  
}
