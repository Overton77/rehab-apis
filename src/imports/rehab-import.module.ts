import { Module } from '@nestjs/common';
import { GraphqlClientModule } from 'src/graphql-client/graphql-client.module';
import { RehabImportController } from './rehab-import.controller';

@Module({
  imports: [GraphqlClientModule],
  controllers: [RehabImportController],
  providers: [RehabImportController],
  exports: [RehabImportController],
})
export class RehabImportModule {}
