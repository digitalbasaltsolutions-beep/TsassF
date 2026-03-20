import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema.js';
export declare class Note extends BaseDocument {
    content: string;
    linkedEntityType: 'Contact' | 'Deal';
    linkedEntityId: Types.ObjectId;
    ownerId: Types.ObjectId;
}
export declare const NoteSchema: import("mongoose").Schema<Note, import("mongoose").Model<Note, any, any, any, (import("mongoose").Document<unknown, any, Note, any, import("mongoose").DefaultSchemaOptions> & Note & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Note, any, import("mongoose").DefaultSchemaOptions> & Note & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Note>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Note, import("mongoose").Document<unknown, {}, Note, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Note & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ownerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<string, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    linkedEntityType?: import("mongoose").SchemaDefinitionProperty<"Contact" | "Deal", Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    linkedEntityId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Note>;
