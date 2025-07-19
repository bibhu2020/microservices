import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1745487689382 implements MigrationInterface {
  name = 'Migration1745487689382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Shippers" ("ShipperID" SERIAL NOT NULL, "CompanyName" character varying(40) NOT NULL, "Phone" character varying(24), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_475819881aa030a55cbb4dfa077" PRIMARY KEY ("ShipperID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Customers" ("CustomerID" character(5) NOT NULL, "CompanyName" character varying(40) NOT NULL, "ContactName" character varying(30), "ContactTitle" character varying(30), "Address" character varying(60), "City" character varying(15), "Region" character varying(15), "PostalCode" character varying(10), "Country" character varying(15), "Phone" character varying(24), "Fax" character varying(24), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_20d9e62f5dfe25e72bc90e46257" PRIMARY KEY ("CustomerID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Employees" ("EmployeeID" SERIAL NOT NULL, "LastName" character varying(20) NOT NULL, "FirstName" character varying(10) NOT NULL, "Title" character varying(30), "TitleOfCourtesy" character varying(25), "BirthDate" TIMESTAMP, "HireDate" TIMESTAMP, "Address" character varying(60), "City" character varying(15), "Region" character varying(15), "PostalCode" character varying(10), "Country" character varying(15), "HomePhone" character varying(24), "Extension" character varying(4), "Notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ReportsTo" integer, CONSTRAINT "PK_31149b984f38111c8faf85124c7" PRIMARY KEY ("EmployeeID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Orders" ("OrderID" SERIAL NOT NULL, "OrderDate" TIMESTAMP, "RequiredDate" TIMESTAMP, "ShippedDate" TIMESTAMP, "Freight" numeric(18,2), "ShipName" character varying(60), "ShipAddress" character varying(60), "ShipCity" character varying(15), "ShipRegion" character varying(15), "ShipPostalCode" character varying(10), "ShipCountry" character varying(15), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "CustomerID" character(5), "EmployeeID" integer, "ShipVia" integer, CONSTRAINT "PK_55f8443f4d79e9a848cf42b69d9" PRIMARY KEY ("OrderID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Suppliers" ("SupplierID" SERIAL NOT NULL, "CompanyName" character varying(40) NOT NULL, "ContactName" character varying(30), "ContactTitle" character varying(30), "Address" character varying(60), "City" character varying(15), "Region" character varying(15), "PostalCode" character varying(10), "Country" character varying(15), "Phone" character varying(24), "Fax" character varying(24), "HomePage" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9af75be88249fe42e9a8fb47629" PRIMARY KEY ("SupplierID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Categories" ("CategoryID" SERIAL NOT NULL, "CategoryName" character varying(15) NOT NULL, "Description" text, "Picture" bytea, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8fb0727baad4afaed25ac7c9861" PRIMARY KEY ("CategoryID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Products" ("ProductID" SERIAL NOT NULL, "ProductName" character varying(40) NOT NULL, "QuantityPerUnit" character varying(20), "UnitPrice" numeric(18,2), "UnitsInStock" smallint, "UnitsOnOrder" smallint, "ReorderLevel" smallint, "Discontinued" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "SupplierID" integer, "CategoryID" integer, CONSTRAINT "PK_07f84037390838453c1426c7cb5" PRIMARY KEY ("ProductID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "OrderDetails" ("OrderDetailID" SERIAL NOT NULL, "UnitPrice" numeric(18,2) NOT NULL, "Quantity" smallint NOT NULL, "Discount" real NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "OrderID" integer, "ProductID" integer, CONSTRAINT "PK_62169a0638c62361a12768293f8" PRIMARY KEY ("OrderDetailID"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Employees" ADD CONSTRAINT "FK_0a2e430ee66d427d2fd728ce671" FOREIGN KEY ("ReportsTo") REFERENCES "Employees"("EmployeeID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Orders" ADD CONSTRAINT "FK_fcb27b11e453edc543d0a5436eb" FOREIGN KEY ("CustomerID") REFERENCES "Customers"("CustomerID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Orders" ADD CONSTRAINT "FK_4ef049bfb564e1dbab6b55d9503" FOREIGN KEY ("EmployeeID") REFERENCES "Employees"("EmployeeID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Orders" ADD CONSTRAINT "FK_bd8071f28699758415c62dfd7be" FOREIGN KEY ("ShipVia") REFERENCES "Shippers"("ShipperID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Products" ADD CONSTRAINT "FK_3631250b029818892d266a3a0a8" FOREIGN KEY ("SupplierID") REFERENCES "Suppliers"("SupplierID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Products" ADD CONSTRAINT "FK_9d404e9029f724e36f0ce2f0024" FOREIGN KEY ("CategoryID") REFERENCES "Categories"("CategoryID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderDetails" ADD CONSTRAINT "FK_36af61326d32a5b6853c79642f1" FOREIGN KEY ("OrderID") REFERENCES "Orders"("OrderID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderDetails" ADD CONSTRAINT "FK_2dd62647d008dcfcc7846aee102" FOREIGN KEY ("ProductID") REFERENCES "Products"("ProductID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "OrderDetails" DROP CONSTRAINT "FK_2dd62647d008dcfcc7846aee102"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderDetails" DROP CONSTRAINT "FK_36af61326d32a5b6853c79642f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Products" DROP CONSTRAINT "FK_9d404e9029f724e36f0ce2f0024"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Products" DROP CONSTRAINT "FK_3631250b029818892d266a3a0a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Orders" DROP CONSTRAINT "FK_bd8071f28699758415c62dfd7be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Orders" DROP CONSTRAINT "FK_4ef049bfb564e1dbab6b55d9503"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Orders" DROP CONSTRAINT "FK_fcb27b11e453edc543d0a5436eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Employees" DROP CONSTRAINT "FK_0a2e430ee66d427d2fd728ce671"`,
    );
    await queryRunner.query(`DROP TABLE "OrderDetails"`);
    await queryRunner.query(`DROP TABLE "Products"`);
    await queryRunner.query(`DROP TABLE "Categories"`);
    await queryRunner.query(`DROP TABLE "Suppliers"`);
    await queryRunner.query(`DROP TABLE "Orders"`);
    await queryRunner.query(`DROP TABLE "Employees"`);
    await queryRunner.query(`DROP TABLE "Customers"`);
    await queryRunner.query(`DROP TABLE "Shippers"`);
  }
}
