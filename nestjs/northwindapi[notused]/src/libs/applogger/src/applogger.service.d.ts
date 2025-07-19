import { ConsoleLogger } from '@nestjs/common';
export declare class ApploggerService extends ConsoleLogger {
    private MAX_FILE_SIZE;
    private LOG_DIR;
    private LOG_FILE;
    logToFile(entry: any): Promise<void>;
    log(message: any, context?: string): void;
    error(message: any, stackOrContext?: string): void;
}
