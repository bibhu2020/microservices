"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApploggerService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const fs_1 = require("fs");
const path = require("path");
let ApploggerService = class ApploggerService extends common_1.ConsoleLogger {
    constructor() {
        super(...arguments);
        this.MAX_FILE_SIZE = 1 * 1024 * 1024;
        this.LOG_DIR = path.join(process.cwd(), 'logs');
        this.LOG_FILE = path.join(this.LOG_DIR, 'application.log');
    }
    async logToFile(entry) {
        const formattedEntry = `${Intl.DateTimeFormat('en-US', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'America/Chicago',
        }).format(new Date())}\t${entry}\n`;
        try {
            if (!fs.existsSync(this.LOG_DIR)) {
                await fs_1.promises.mkdir(this.LOG_DIR, { recursive: true });
            }
            if (fs.existsSync(this.LOG_FILE)) {
                const { size } = await fs_1.promises.stat(this.LOG_FILE);
                if (size >= this.MAX_FILE_SIZE) {
                    const now = new Date();
                    const timestamp = now.toISOString().replace(/[:.]/g, '-');
                    const rotatedFile = path.join(this.LOG_DIR, `application-${timestamp}.log`);
                    await fs_1.promises.rename(this.LOG_FILE, rotatedFile);
                }
            }
            await fs_1.promises.appendFile(this.LOG_FILE, formattedEntry);
        }
        catch (e) {
            if (e instanceof Error)
                console.error(e.message);
        }
    }
    log(message, context) {
        const entry = `${context}\t${message}`;
        this.logToFile(entry);
        super.log(message, context);
    }
    error(message, stackOrContext) {
        const entry = `${stackOrContext}\t${message}`;
        this.logToFile(entry);
        super.error(message, stackOrContext);
    }
};
exports.ApploggerService = ApploggerService;
exports.ApploggerService = ApploggerService = __decorate([
    (0, common_1.Injectable)()
], ApploggerService);
