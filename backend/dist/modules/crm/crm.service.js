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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const contact_schema_1 = require("./schemas/contact.schema");
const deal_schema_1 = require("./schemas/deal.schema");
const activity_schema_1 = require("./schemas/activity.schema");
let CrmService = class CrmService {
    contactModel;
    dealModel;
    activityModel;
    constructor(contactModel, dealModel, activityModel) {
        this.contactModel = contactModel;
        this.dealModel = dealModel;
        this.activityModel = activityModel;
    }
    async createContact(data) {
        return this.contactModel.create(data);
    }
    async getContacts() {
        return this.contactModel.find().exec();
    }
    async createDeal(data) {
        return this.dealModel.create(data);
    }
    async getDeals() {
        return this.dealModel.find().populate('contactId').exec();
    }
    async updateDealStage(dealId, pipelineStage) {
        const deal = await this.dealModel.findByIdAndUpdate(dealId, { pipelineStage }, { new: true }).exec();
        if (!deal)
            throw new common_1.NotFoundException('Deal not found');
        return deal;
    }
    async logActivity(data) {
        return this.activityModel.create(data);
    }
    async getActivitiesForDeal(dealId) {
        return this.activityModel.find({ dealId: new mongoose_2.Types.ObjectId(dealId) }).exec();
    }
    async getActivitiesForContact(contactId) {
        return this.activityModel.find({ contactId: new mongoose_2.Types.ObjectId(contactId) }).exec();
    }
};
exports.CrmService = CrmService;
exports.CrmService = CrmService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contact_schema_1.Contact.name)),
    __param(1, (0, mongoose_1.InjectModel)(deal_schema_1.Deal.name)),
    __param(2, (0, mongoose_1.InjectModel)(activity_schema_1.Activity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CrmService);
//# sourceMappingURL=crm.service.js.map