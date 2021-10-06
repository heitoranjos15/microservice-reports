import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTables1622580876422 implements MigrationInterface {
  name = 'createTables1622580876422';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "sample" (
                "id" SERIAL NOT NULL, 
                "email" character varying NOT NULL, 
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
                CONSTRAINT "PK_1e92238b098b5a4d13f6422cba7" PRIMARY KEY ("id")
                )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sample"`);
  }
}
