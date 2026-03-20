import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema.js';
export declare class Contact extends BaseDocument {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    tags: string[];
    ownerId: Types.ObjectId;
}
export declare const ContactSchema: import("mongoose").Schema<Contact, import("mongoose").Model<Contact, any, any, any, (import("mongoose").Document<unknown, any, Contact, any, import("mongoose").DefaultSchemaOptions> & Contact & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Contact, any, import("mongoose").DefaultSchemaOptions> & Contact & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Contact>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Contact, import("mongoose").Document<unknown, {}, Contact, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Contact & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Contact, import("mongoose").Document<unknown, {}, Contact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Contact & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Contact, import("mongoose").Document<unknown, {}, Contact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Contact & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Contact, import("mongoose").Document<unknown, {}, Contact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Contact & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Contact, import("mongoose").Document<unknown, {}, Contact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Contact & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Contact, import("mongoose").Document<unknown, {}, Contact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Contact & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ownerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Contact, import("mongoose").Document<unknown, {}, Contact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Contact & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    firstName?: import("mongoose").SchemaDefinitionProperty<string, Contact, import("mongoose").Document<unknown, {}, Contact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Contact & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastName?: import("mongoose").SchemaDefinitionProperty<string, Contact, import("mongoose").Document<unknown, {}, Contact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Contact & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Contact, import("mongoose").Document<unknown, {}, Contact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Contact & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    company?: import("mongoose").SchemaDefinitionProperty<string, Contact, import("mongoose").Document<unknown, {}, Contact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Contact & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[], Contact, import("mongoose").Document<unknown, {}, Contact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Contact & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Contact>;
