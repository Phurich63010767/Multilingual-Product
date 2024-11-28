import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a product', async () => {
      const createProductDto: CreateProductDto = {
        price: 100,
        category: 'Ice Cream',
        translations: [
          { language: 'en', name: 'Vanilla', description: 'Tasty vanilla' },
        ],
      };

      const savedProduct: Product = { id: 1, ...createProductDto } as Product;

      mockProductRepository.create.mockReturnValue(savedProduct);
      mockProductRepository.save.mockResolvedValue(savedProduct);

      const result = await service.create(createProductDto);

      expect(repository.create).toHaveBeenCalledWith(createProductDto);
      expect(repository.save).toHaveBeenCalledWith(savedProduct);
      expect(result).toEqual(savedProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products with translations', async () => {
      const products = [
        { id: 1, price: 100, category: 'Ice Cream', translations: [] },
        { id: 2, price: 200, category: 'Cake', translations: [] },
      ];

      mockProductRepository.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({ relations: ['translations'] });
      expect(result).toEqual(products);
    });
  });

  describe('searchByName', () => {
    it('should return products matching the query and language', async () => {
      const products = [
        { id: 1, translations: [{ name: 'Vanilla', language: 'en' }] },
      ];

      const qbMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(products),
      };

      mockProductRepository.createQueryBuilder.mockReturnValue(qbMock);

      const result = await service.searchByName('Vanilla', 'en');

      expect(mockProductRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(qbMock.leftJoinAndSelect).toHaveBeenCalledWith('product.translations', 'translation');
      expect(qbMock.where).toHaveBeenCalledWith('translation.name ILIKE :query', { query: '%Vanilla%' });
      expect(qbMock.andWhere).toHaveBeenCalledWith('translation.language = :language', { language: 'en' });
      expect(qbMock.getMany).toHaveBeenCalled();
      expect(result).toEqual(products);
    });

    it('should return products matching the query without language filter', async () => {
      const products = [
        { id: 1, translations: [{ name: 'Vanilla', language: 'en' }] },
        { id: 2, translations: [{ name: 'วานิลลา', language: 'th' }] },
      ];

      const qbMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(products),
      };

      mockProductRepository.createQueryBuilder.mockReturnValue(qbMock);

      const result = await service.searchByName('Vanilla');

      expect(mockProductRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(qbMock.leftJoinAndSelect).toHaveBeenCalledWith('product.translations', 'translation');
      expect(qbMock.where).toHaveBeenCalledWith('translation.name ILIKE :query', { query: '%Vanilla%' });
      expect(qbMock.getMany).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });
});
