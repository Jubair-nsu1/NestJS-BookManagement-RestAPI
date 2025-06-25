import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './author.service';
import { getModelToken } from '@nestjs/mongoose';
import { Author } from './schemas/author.schema';
import { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthorsService', () => {
    let service: AuthorsService;
    let authorModel: Model<Author>;

    // Mock Mongoose Model
    const mockAuthorModel = {
        new: jest.fn(),
        constructor: jest.fn(),
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        save: jest.fn(),
    } as any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            AuthorsService,
            {
            provide: getModelToken(Author.name),
            useValue: mockAuthorModel,
            },
        ],
        }).compile();

        service = module.get<AuthorsService>(AuthorsService);
        authorModel = module.get<Model<Author>>(getModelToken(Author.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // CREATE TEST
    describe('create', () => {
        it('should create and return an author', async () => {
        const dto = { firstName: 'Alice', lastName: 'Johnson' };
        const saveMock = jest.fn().mockResolvedValue({ _id: '1', ...dto });

        (authorModel as any).constructor = jest.fn().mockImplementation(() => ({ save: saveMock }));

        const result = await service.create(dto as any);
        expect(saveMock).toHaveBeenCalled();
        expect(result).toEqual({ _id: '1', ...dto });
        });
    });

    // FINDBYID TEST
    describe('findOne', () => {
        it('should throw BadRequestException for invalid id', async () => {
        await expect(service.findOne('123')).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException if author not found', async () => {
        mockAuthorModel.findById = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
        await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
        });

        it('should return an author if found', async () => {
        const author = { _id: '507f1f77bcf86cd799439011', firstName: 'Alice' } as any;
        mockAuthorModel.findById = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(author) });
        await expect(service.findOne('507f1f77bcf86cd799439011')).resolves.toEqual(author);
        });
    });

    // UPDATE TEST
    describe('update', () => {
        it('should throw BadRequestException if id is invalid', async () => {
        await expect(service.update('123', { firstName: 'Updated' } as any)).rejects.toThrow(
            BadRequestException,
        );
        });

        it('should throw NotFoundException if author not found', async () => {
        mockAuthorModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

        await expect(
            service.update('507f1f77bcf86cd799439011', { firstName: 'Updated' } as any),
        ).rejects.toThrow(NotFoundException);
        });

        it('should return updated author', async () => {
        const updatedAuthor = { _id: '507f1f77bcf86cd799439011', firstName: 'Updated' };
        mockAuthorModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(updatedAuthor) });

        const result = await service.update('507f1f77bcf86cd799439011', { firstName: 'Updated' } as any);
        expect(result).toEqual(updatedAuthor);
        });
    });

    // REMOVE TEST
    describe('remove', () => {
        it('should throw BadRequestException if id is invalid', async () => {
        await expect(service.remove('123')).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException if no author found to delete', async () => {
        mockAuthorModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

        await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
        });

        it('should delete successfully if author exists', async () => {
        mockAuthorModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011' }) });

        await expect(service.remove('507f1f77bcf86cd799439011')).resolves.toBeUndefined();
        });
    });
});
