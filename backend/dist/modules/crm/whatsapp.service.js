"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WhatsAppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const contact_schema_js_1 = require("./schemas/contact.schema.js");
let WhatsAppService = WhatsAppService_1 = class WhatsAppService {
    contactModel;
    logger = new common_1.Logger(WhatsAppService_1.name);
    constructor(contactModel) {
        this.contactModel = contactModel;
    }
    async sendMessage(contactId, message) {
        const contact = await this.contactModel.findById(contactId);
        if (!contact)
            throw new Error('Contact not found');
        this.logger.log(`[WHATSAPP MOCK] Sending message to ${contact.firstName} ${contact.lastName} (${contact.phone || 'No phone'}): "${message}"`);
        return { success: true, fakeMessageId: `wamid.HBgL${Math.floor(Math.random() * 100000)}` };
    }
};
exports.WhatsAppService = WhatsAppService;
exports.WhatsAppService = WhatsAppService = WhatsAppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contact_schema_js_1.Contact.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], WhatsAppService);
//# sourceMappingURL=whatsapp.service.js.map