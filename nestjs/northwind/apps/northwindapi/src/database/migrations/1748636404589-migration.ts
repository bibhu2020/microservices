import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1748636404589 implements MigrationInterface {
    name = 'Migration1748636404589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Customers" ADD "PhotoURL" character varying(60)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Customers" DROP COLUMN "PhotoURL"`);
    }

}
