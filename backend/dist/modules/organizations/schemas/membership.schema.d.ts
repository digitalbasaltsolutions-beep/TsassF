import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';
import { Role } from '../../../shared/constants/roles.enum';
export declare class Membership extends BaseDocument {
    userId: Types.ObjectId;
    organizationId: Types.ObjectId;
    role: Role;
}
export declare const MembershipSchema: import("mongoose").Schema<Membership, import("mongoose").Model<Membership, any, any, any, (import("mongoose").Document<unknown, any, Membership, any, import("mongoose").DefaultSchemaOptions> & Membership & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Membership, any, import("mongoose").DefaultSchemaOptions> & Membership & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Membership>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Membership, import("mongoose").Document<unknown, {}, Membership, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Membership & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Membership, import("mongoose").Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organizationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Membership, import("mongoose").Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Membership, import("mongoose").Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Membership, import("mongoose").Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    role?: import("mongoose").SchemaDefinitionProperty<Role, Membership, import("mongoose").Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Membership>;
