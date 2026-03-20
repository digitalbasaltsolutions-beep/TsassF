export declare class CreateNoteDto {
    content: string;
    linkedEntityType: 'Contact' | 'Deal';
    linkedEntityId: string;
    ownerId?: string;
}
