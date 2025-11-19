import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from 'prisma/generated/client';
@Injectable()
export class InsuranceProvidersService {
  constructor(private prisma: PrismaService) {}

  findMany(params: { skip?: number; take?: number; search?: string }) {
    const { skip, take, search } = params;
    const where: Prisma.InsuranceProviderWhereInput | undefined = search
      ? {
          OR: [
            { payer_code: { contains: search, mode: 'insensitive' } },
            { payer_name: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined;

    return this.prisma.insuranceProvider.findMany({
      skip,
      take,
      where,
      orderBy: { id: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.insuranceProvider.findUnique({ where: { id } });
  }

  create(data: Prisma.InsuranceProviderCreateInput) {
    return this.prisma.insuranceProvider.create({ data });
  }

  update(id: number, data: Prisma.InsuranceProviderUpdateInput) {
    return this.prisma.insuranceProvider.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.insuranceProvider.delete({ where: { id } });
  }
}
