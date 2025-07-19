import struct
import pyodbc
from common.token_manager_fic import TokenManager 

class Db:
    def __init__(self, server: str, database: str, driver='{ODBC Driver 18 for SQL Server}'):
        self.__conn_str = (
            f"Driver={driver};"
            f"Server=tcp:{server},1433;"
            f"Database={database};"
            f"Encrypt=Yes;TrustServerCertificate=Yes"
        )
        self.__conn = None
        self.__cursor = None
        # Create a TokenManager instance with the specific scope for Azure SQL Database
        self.__token_manager = TokenManager(scope="https://database.windows.net/.default")

    def open_connection(self):
        try:
            # Retrieve a valid token using TokenManager
            token = self.__token_manager.get_token()
            #print(f"Access Token for API Call: {token}")

            # SQL Server expects the OAuth token to be in a packed, binary format when using AAD authentication. 
            # The token needs to be encoded in UTF-16 and packed with the length of the token as a 4-byte integer.
            SQL_COPT_SS_ACCESS_TOKEN = 1256
            token_encoded = token.encode("utf-16-le")  # Encode token to UTF-16
            token_packed = struct.pack(f"<I{len(token_encoded)}s", len(token_encoded), token_encoded)

            # Establish connection to SQL Server using pyodbc
            self.__conn = pyodbc.connect(self.__conn_str, attrs_before={SQL_COPT_SS_ACCESS_TOKEN: token_packed})
            self.__cursor = self.__conn.cursor()

            # Verify the connection
            print('Verifying the connection...')
            self.__cursor.execute("SELECT getdate()")
            _ = self.__cursor.fetchone()
            print("Connection successful")
        except Exception as e:
            print("Unable to establish connection to SQL Server:", str(e))
            raise e

    def close_connection(self):
        """Close the SQL connection and cursor."""
        if self.__cursor:
            self.__cursor.close()
        if self.__conn:
            self.__conn.close()

    def execute_query(self, query):
        """Execute a SQL query."""
        if not query:
            print('Empty query passed.')
            return None

        try:
            self.__cursor.execute(query)
            rows = self.__cursor.fetchall()
            return rows
        except Exception as e:
            print(f"Error executing SQL query: {e}")
            return None
