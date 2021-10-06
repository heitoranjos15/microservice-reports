import {MigrationInterface, QueryRunner} from "typeorm";

export class createDatabase1623246828000 implements MigrationInterface {
    name = 'createDatabase1623246828000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE DATABASE ${process.env.DATABASE_DB} 
        WITH OWNER = ${process.env.DATABASE_USER} 
        ENCODING = 'UTF8' 
        CONNECTION LIMIT = -1;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP DATABASE IF EXISTS ${process.env.DATABASE_DB};
            DROP TABLE IF EXISTS migrations;
        `);
    }
}
