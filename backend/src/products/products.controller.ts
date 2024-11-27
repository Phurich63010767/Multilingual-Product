import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() productDto: any) {
    return this.productsService.create(productDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  search(
    @Query('q') query: string,
    @Query('lang') language: string,
  ) {
    return this.productsService.searchByName(query, language);
  }
}
