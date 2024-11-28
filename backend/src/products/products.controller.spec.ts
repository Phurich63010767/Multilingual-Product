import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    searchByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call ProductsService.create with correct parameters', async () => {
      const productDto = {
        price: 100,
        category: 'Ice Cream',
        translations: [
          { language: 'en', name: 'Vanilla', description: 'Tasty vanilla' },
        ],
      };

      const createdProduct = { id: 1, ...productDto };
      mockProductsService.create.mockResolvedValue(createdProduct);

      const result = await controller.create(productDto);

      expect(service.create).toHaveBeenCalledWith(productDto);
      expect(result).toEqual(createdProduct);
    });
  });

  describe('findAll', () => {
    it('should call ProductsService.findAll and return the result', async () => {
      const products = [
        { id: 1, price: 100, category: 'Ice Cream', translations: [] },
      ];

      mockProductsService.findAll.mockResolvedValue(products);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('search', () => {
    it('should call ProductsService.searchByName with query and language', async () => {
      const query = 'Vanilla';
      const language = 'en';
      const products = [
        {
          id: 1,
          translations: [{ name: 'Vanilla', language: 'en' }],
        },
      ];

      mockProductsService.searchByName.mockResolvedValue(products);

      const result = await controller.search(query, language);

      expect(service.searchByName).toHaveBeenCalledWith(query, language);
      expect(result).toEqual(products);
    });

    it('should call ProductsService.searchByName with query only', async () => {
      const query = 'Vanilla';
      const products = [
        { id: 1, translations: [{ name: 'Vanilla', language: 'en' }] },
        { id: 2, translations: [{ name: 'วานิลลา', language: 'th' }] },
      ];

      mockProductsService.searchByName.mockResolvedValue(products);

      const result = await controller.search(query);

      expect(service.searchByName).toHaveBeenCalledWith(query, undefined);
      expect(result).toEqual(products);
    });
  });
});
