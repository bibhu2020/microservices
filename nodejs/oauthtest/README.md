# Overview
This is a test application to test the Oauth flow

# For SQL Server, managed identity and service principal must be given access like below.
```sql
USE SRE-TEST-SQL

-- Create AAD User
CREATE USER [msonecloudtools_PPE] FROM EXTERNAL PROVIDER;

-- Grant Roles
ALTER ROLE db_datareader ADD MEMBER [msonecloudtools_PPE];  -- Read-only access
ALTER ROLE db_datawriter ADD MEMBER [msonecloudtools_PPE];  -- Read/Write access


SELECT name, type_desc FROM sys.database_principals WHERE type IN ('S', 'U');

SELECT name, type_desc 
FROM sys.database_principals
WHERE type_desc = 'EXTERNAL_USER';
```

