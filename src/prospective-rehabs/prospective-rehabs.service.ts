import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProspectiveRehabsService {
  constructor(private prisma: PrismaService) {}

  findMany(params: {
    skip?: number;
    take?: number;
    cursorId?: number;
    search?: string;
  }) {
    const { skip, take, cursorId, search } = params;
    const where: Prisma.ProspectiveRehabsWhereInput | undefined = search
      ? {
          OR: [
            { npi_number: { contains: search, mode: 'insensitive' } },
            { organization_name: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
            { state: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined;

    return this.prisma.prospectiveRehabs.findMany({
      skip,
      take,
      cursor: cursorId ? { id: cursorId } : undefined,
      where,
      orderBy: { id: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.prospectiveRehabs.findUnique({ where: { id } });
  }

  create(data: Prisma.ProspectiveRehabsCreateInput) {
    return this.prisma.prospectiveRehabs.upsert({
      where: { npi_number: data.npi_number },
      create: data,
      update: data,
    });
  }

  createMany(data: Prisma.ProspectiveRehabsCreateManyInput[]) {
    return this.prisma.prospectiveRehabs.createManyAndReturn({ data });
  }

  update(id: number, data: Prisma.ProspectiveRehabsUpdateInput) {
    return this.prisma.prospectiveRehabs.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.prospectiveRehabs.delete({ where: { id } });
  }
}
